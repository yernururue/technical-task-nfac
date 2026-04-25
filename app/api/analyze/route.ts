// API route placeholder for PGN analysis requests.
import { NextResponse } from 'next/server'

interface AnalyzeRequest {
  pgn: string
}

interface AnalyzeResponse {
  message: string
  received: AnalyzeRequest
}

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as AnalyzeRequest

  const response: AnalyzeResponse = {
    message: 'Analyze endpoint placeholder',
    received: body,
  }

  return NextResponse.json(response)
}
