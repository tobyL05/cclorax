#!/usr/bin/env node

import { computeImpact, formatImpact } from "./impact-core.js";
import { parseTranscriptUsage } from "./transcript.js";

interface StatuslineInput {
  transcript_path?: string | null;
}

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk: string) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

async function main(): Promise<void> {
  const raw = await readStdin();
  const input: StatuslineInput = JSON.parse(raw) as StatuslineInput;
  const usage = input.transcript_path
    ? parseTranscriptUsage(input.transcript_path)
    : { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheCreationTokens: 0 };

  console.log(formatImpact(computeImpact(usage)));
}

main().catch(() => {
  console.log("⚡ --");
});
