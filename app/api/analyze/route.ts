import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

interface AnalyzeRequest {
  pgn: string
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as AnalyzeRequest
    const { pgn } = body

    if (!pgn) {
      return NextResponse.json({ error: 'PGN is required' }, { status: 400 })
    }

    // Use gemini-2.5-flash for fast analysis as requested
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
    
    // Parse the JSON from Gemini to ensure it's valid
    const analysis = JSON.parse(responseText)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('[Analyze API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze game', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
