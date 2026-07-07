// Wh/MTok rates from https://simonpcouch.com/blog/2026-01-20-cc-impact/, which scales
// Epoch AI's measured GPT-4o energy-per-token by Anthropic's published per-token-type
// pricing ratios. Applied uniformly across models — the post found Claude models are
// likely in the same energy ballpark and declined to derive per-model rates.
const WH_PER_MTOK = {
  input: 390,
  output: 1950,
  cacheRead: 39,
  cacheWrite: 490,
};

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheCreationTokens: number;
}

export interface Impact {
  energyWh: number;
}

export function computeImpact(usage: TokenUsage): Impact {
  const energyWh =
    (usage.inputTokens * WH_PER_MTOK.input +
      usage.outputTokens * WH_PER_MTOK.output +
      usage.cacheReadTokens * WH_PER_MTOK.cacheRead +
      usage.cacheCreationTokens * WH_PER_MTOK.cacheWrite) /
    1_000_000;
  return { energyWh };
}

export function formatImpact(impact: Impact): string {
  return `⚡ ${impact.energyWh.toFixed(2)}Wh`;
}
