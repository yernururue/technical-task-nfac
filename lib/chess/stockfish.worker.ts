type WorkerInboundMessage =
  | { type: 'init'; id: number }
  | { type: 'getMove'; fen: string; depth: number; id: number }

type PendingRequest = {
  id: number
  resolve: (move: string) => void
  reject: (error: Error) => void
}

let engineWorker: Worker | null = null
let isReady = false
let pendingBestMove: PendingRequest | null = null
let initResolvers: Array<() => void> = []
let initRejectors: Array<(error: Error) => void> = []

function ensureEngineWorker(): Worker {
  if (engineWorker) {
    return engineWorker
  }

  engineWorker = new Worker('/stockfish/stockfish.js')
  engineWorker.onmessage = (event: MessageEvent<string>) => {
    const rawLine = typeof event.data === 'string' ? event.data : ''
    const line = rawLine.trim()

    if (!line) {
      return
    }

    if (line.includes('uciok')) {
      isReady = true
      initResolvers.forEach((resolve) => resolve())
      initResolvers = []
      initRejectors = []
      return
    }

    if (!pendingBestMove) {
      return
    }

    if (line.startsWith('bestmove')) {
      const tokens = line.split(/\s+/)
      const move = tokens[1]
      const request = pendingBestMove
      pendingBestMove = null
      if (!move || move === '(none)') {
        request.reject(new Error('Stockfish returned no legal move'))
        return
      }
      request.resolve(move)
    }
  }

  engineWorker.onerror = (event: ErrorEvent) => {
    const error = new Error(event.message || 'Stockfish worker crashed')
    initRejectors.forEach((reject) => reject(error))
    initResolvers = []
    initRejectors = []
    if (pendingBestMove) {
      pendingBestMove.reject(error)
      pendingBestMove = null
    }
    isReady = false
  }

  return engineWorker
}

async function initializeEngine(): Promise<void> {
  if (isReady) {
    return
  }

  const worker = ensureEngineWorker()

  await new Promise<void>((resolve, reject) => {
    initResolvers.push(resolve)
    initRejectors.push(reject)
    worker.postMessage('uci')
  })
}

async function calculateBestMove(fen: string, depth: number): Promise<string> {
  const worker = ensureEngineWorker()
  await initializeEngine()

  if (pendingBestMove) {
    throw new Error('Stockfish is currently processing another move')
  }

  return new Promise<string>((resolve, reject) => {
    pendingBestMove = { id: Date.now(), resolve, reject }
    worker.postMessage('ucinewgame')
    worker.postMessage(`position fen ${fen}`)
    worker.postMessage(`go depth ${depth}`)
  })
}

self.onmessage = async (event: MessageEvent<WorkerInboundMessage>) => {
  const { type, id } = event.data

  try {
    if (type === 'init') {
      await initializeEngine()
      self.postMessage({ type: 'ready', id })
      return
    }

    if (type === 'getMove') {
      if (!isReady) {
        await initializeEngine()
      }
      const move = await calculateBestMove(event.data.fen, event.data.depth)
      self.postMessage({ type: 'bestMove', move, id })
      return
    }

    self.postMessage({ type: 'error', id, error: 'Unsupported worker message type' })
  } catch (error) {
    self.postMessage({
      type: 'error',
      id,
      error: error instanceof Error ? error.message : 'Unknown Stockfish worker error',
    })
  }
}
