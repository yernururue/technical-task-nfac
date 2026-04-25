export type StockfishLevel = 1 | 2 | 3

interface WorkerMessage {
  type: 'ready' | 'bestMove' | 'error'
  id: number
  move?: string
  error?: string
}

export class StockfishEngine {
  private worker: Worker | null = null
  private isReady = false
  private messageId = 0
  private pendingRequests: Map<number, (payload: WorkerMessage) => void> = new Map()

  constructor() {
    if (typeof window !== 'undefined') {
      this.worker = new Worker(new URL('./stockfish.worker.ts', import.meta.url), { type: 'module' })
      this.setupWorkerListeners()
    }
  }

  private setupWorkerListeners(): void {
    if (!this.worker) {
      return
    }

    this.worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const payload = event.data
      if (payload.type === 'ready') {
        this.isReady = true
      }

      const resolver = this.pendingRequests.get(payload.id)
      if (!resolver) {
        return
      }

      this.pendingRequests.delete(payload.id)
      resolver(payload)
    }

    this.worker.onerror = (event: ErrorEvent) => {
      const message = event.message || 'Unknown Stockfish worker error'
      this.rejectAllPending(message)
      this.isReady = false
    }
  }

  private nextId(): number {
    this.messageId += 1
    return this.messageId
  }

  private depthForLevel(level: StockfishLevel): number {
    if (level === 1) return 5
    if (level === 2) return 10
    return 18
  }

  async init(): Promise<void> {
    if (!this.worker) {
      throw new Error('Stockfish worker is unavailable outside browser context')
    }

    if (this.isReady) {
      return
    }

    const id = this.nextId()
    const response = await new Promise<WorkerMessage>((resolve, reject) => {
      this.pendingRequests.set(id, resolve)
      this.worker?.postMessage({ type: 'init', id })

      window.setTimeout(() => {
        if (!this.pendingRequests.has(id)) {
          return
        }
        this.pendingRequests.delete(id)
        reject(new Error('Stockfish init timeout'))
      }, 5000)
    })

    if (response.type === 'error') {
      throw new Error(response.error ?? 'Failed to initialize Stockfish engine')
    }
  }

  async getBestMove(fen: string, level: StockfishLevel): Promise<string> {
    if (!this.worker || !this.isReady) {
      throw new Error('Stockfish engine is not initialized')
    }

    const id = this.nextId()
    const depth = this.depthForLevel(level)

    const response = await new Promise<WorkerMessage>((resolve, reject) => {
      this.pendingRequests.set(id, resolve)
      this.worker?.postMessage({ type: 'getMove', fen, depth, id })

      window.setTimeout(() => {
        if (!this.pendingRequests.has(id)) {
          return
        }
        this.pendingRequests.delete(id)
        reject(new Error('Stockfish did not return a move in time'))
      }, 20000)
    })

    if (response.type === 'error') {
      throw new Error(response.error ?? 'Stockfish failed to calculate a move')
    }

    if (!response.move) {
      throw new Error('Stockfish response did not include a best move')
    }

    return response.move
  }

  private rejectAllPending(message: string): void {
    for (const [id, resolve] of this.pendingRequests.entries()) {
      resolve({ type: 'error', id, error: message })
    }
    this.pendingRequests.clear()
  }

  terminate(): void {
    this.rejectAllPending('Stockfish engine terminated')
    this.worker?.terminate()
    this.worker = null
    this.isReady = false
  }
}
