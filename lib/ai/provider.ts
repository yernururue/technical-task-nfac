// AI provider placeholder with Gemini primary and OpenRouter fallback configuration.
export type AiProvider = 'gemini' | 'openrouter'

export interface AiProviderConfig {
  geminiApiKey: string
  openRouterApiKey: string
}

export function getProviderConfig(): AiProviderConfig {
  return {
    geminiApiKey: process.env.GEMINI_API_KEY ?? '',
    openRouterApiKey: process.env.OPENROUTER_API_KEY ?? '',
  }
}
