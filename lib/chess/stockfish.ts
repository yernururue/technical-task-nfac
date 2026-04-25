// Stockfish Web Worker wrapper placeholder for engine communication.
interface StockfishRequest {
  command: string
}

export class StockfishEngine {
  private worker: Worker | null = null

  initialize(workerPath: string): void {
    this.worker = new Worker(workerPath)
  }

  send(request: StockfishRequest): void {
    this.worker?.postMessage(request.command)
  }

  terminate(): void {
    this.worker?.terminate()
    this.worker = null
  }
}
