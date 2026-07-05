#!/usr/bin/env node

import { computeImpact, formatImpact, METRICS, type MetricName } from "./impact-core.js";

interface StatuslineInput {
  context_window?: {
    total_input_tokens?: number;
    total_output_tokens?: number;
  } | null;
}

// Rotates the displayed metric as context usage grows, in place of a
// persisted turn counter. total_input_tokens/total_output_tokens already
// reflect current context size (and shrink after /compact), so this stays
// fully stateless while tracking real, current impact rather than a
// lifetime total that ignores compaction.
const TOKENS_PER_METRIC = 2000;

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk: string) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

function pickMetric(totalTokens: number): MetricName {
  const index = Math.floor(totalTokens / TOKENS_PER_METRIC) % METRICS.length;
  return METRICS[index] as MetricName;
}

async function main(): Promise<void> {
  const raw = await readStdin();
  const input: StatuslineInput = JSON.parse(raw) as StatuslineInput;
  const cw = input.context_window ?? {};
  const totalTokens = (cw.total_input_tokens ?? 0) + (cw.total_output_tokens ?? 0);

  console.log(formatImpact(computeImpact(totalTokens), pickMetric(totalTokens)));
}

main().catch(() => {
  console.log("💧 --");
});
