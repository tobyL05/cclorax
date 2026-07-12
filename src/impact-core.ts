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

const EQUIVALENTS: { label: string; wh: number }[] = [
  { label: "full Tesla Model 3 battery charge 🔋", wh: 57500 },
  { label: "Avg. North American household (per day) 🏠", wh: 28000 },
  { label: "hour of central AC running ❄️", wh: 3000 },
  { label: "warn washing machine cycles 🧺", wh: 2000 },
  { label: "dishwasher cycle 🍽️", wh: 1700 },
  { label: "hour of space heater use 🔥", wh: 1500 },
  { label: "hours of vacuuming 🧹", wh: 1200 },
  { label: "pressure cooker cycles 🍲", wh: 300 },
  { label: "hours of console gaming 🎮", wh: 200 },
  { label: "cold washing machine cycles 🧺", wh: 150 },
  { label: "e-bike battery charges 🏍️", wh: 400 },
  { label: "miles of EV driving 🚗", wh: 280 },
  { label: "cups of coffee brewed ☕️", wh: 130 },
  { label: "hours of LED TV use 📺", wh: 60 },
  { label: "electric kettle boils 🫖", wh: 100 },
  { label: "hours of ceiling fan use 🌀", wh: 40 },
  { label: "full laptop charge 💻", wh: 55 },
  { label: "minutes of hair dryer use 💇", wh: 25 },
  { label: "slices of toast 🍞", wh: 20 },
];

export function computeImpact(usage: TokenUsage): Impact {
  const energyWh =
    (usage.inputTokens * WH_PER_MTOK.input +
      usage.outputTokens * WH_PER_MTOK.output +
      usage.cacheReadTokens * WH_PER_MTOK.cacheRead +
      usage.cacheCreationTokens * WH_PER_MTOK.cacheWrite) /
    1_000_000;
  return { energyWh };
}

const INTEGER_MULTIPLE_TOLERANCE = 0.05;

export function describeImpact(impact: Impact): string {
  if (impact.energyWh === 0) {
    return "";
  }
  for (const e of EQUIVALENTS) {
    const count = impact.energyWh / e.wh;
    const rounded = Math.round(count);
    if (
      rounded >= 1 &&
      Math.abs(count - rounded) / rounded <= INTEGER_MULTIPLE_TOLERANCE
    ) {
      return `≈ ${rounded}x ${e.label}`;
    }
  }
  const match =
    EQUIVALENTS.find((e) => impact.energyWh >= e.wh) ??
    EQUIVALENTS[EQUIVALENTS.length - 1]!;
  const count = impact.energyWh / match.wh;
  const formattedCount = count >= 10 ? count.toFixed(0) : count.toFixed(1);
  return `(≈ ${formattedCount}x ${match.label})`;
}

export function formatImpact(impact: Impact): string {
  return `⚡ ≈ ${impact.energyWh.toFixed(2)}Wh`;
}
