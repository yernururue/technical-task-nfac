import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase env vars (URL or SERVICE_ROLE_KEY)')
  }

  return createClient<Database>(url, key)
}

interface AnalyzeRequest {
  pgn: string
  gameId?: string
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as AnalyzeRequest
    const { pgn, gameId } = body

    if (!pgn) {
      return NextResponse.json({ error: 'PGN is required' }, { status: 400 })
    }

    const supabase = getServiceClient()

    // 1. Check if analysis already exists for this game
    if (gameId) {
      console.log(`[Analyze API] Checking cache for gameId: ${gameId}`)
      const { data: existingAnalysis } = await supabase
        .from('analyses')
        .select('*')
        .eq('game_id', gameId)
        .maybeSingle()

      if (existingAnalysis) {
        const row = existingAnalysis as any // Cast to satisfy build types
        console.log(`[Analyze API] Cache hit for gameId: ${gameId}`)
        return NextResponse.json({
          summary: row.summary,
          mistakes: row.moves, // Mapping moves column back to mistakes
          cached: true
        })
      }
    }

    // 2. No cache found, call Gemini API
    console.log(`[Analyze API] Cache miss. Calling Gemini API...`)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    })

    const prompt = `Ты — профессиональный шахматный тренер. Проанализируй следующую партию в формате PGN и дай краткий обзор и список ключевых ошибок. 
Ответ должен быть строго в формате JSON на русском языке.

Формат ответа:
{
  "summary": "общий вывод по игре",
  "mistakes": [
    { "move": "номер_хода. ход_фигурой", "comment": "описание ошибки и почему это плохо", "better_move": "лучший вариант хода" }
  ]
}

Партия (PGN):
${pgn}`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    const analysis = JSON.parse(responseText)

    // 3. Save the analysis to the database if gameId is provided
    if (gameId) {
      console.log(`[Analyze API] Saving new analysis to database for gameId: ${gameId}`)
      const { error: saveError } = await supabase
        .from('analyses')
        .insert({
          game_id: gameId,
          summary: analysis.summary,
          moves: analysis.mistakes as any, // Storing mistakes in the moves column
          model_used: 'gemini-2.5-flash'
        } as any)
      
      if (saveError) {
        console.error('[Analyze API] Error saving analysis:', saveError)
      }
    }

    return NextResponse.json({ ...analysis, cached: false })
  } catch (error) {
    console.error('[Analyze API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze game', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
