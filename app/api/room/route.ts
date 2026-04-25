// API route placeholder for multiplayer room creation.
import { randomUUID } from 'node:crypto'

import { NextResponse } from 'next/server'

interface CreateRoomResponse {
  roomId: string
}

export async function POST(): Promise<Response> {
  const payload: CreateRoomResponse = {
    roomId: randomUUID(),
  }

  return NextResponse.json(payload)
}
