import { readFileSync } from "fs";
import type { TokenUsage } from "./impact-core.js";

interface RawUsage {
  input_tokens?: number;
  output_tokens?: number;
  cache_read_input_tokens?: number;
  cache_creation_input_tokens?: number;
}

interface TranscriptEntry {
  type?: string;
  message?: {
    usage?: RawUsage;
  };
}

export function parseTranscriptUsage(transcriptPath: string): TokenUsage {
  const usage: TokenUsage = {
    inputTokens: 0,
    outputTokens: 0,
    cacheReadTokens: 0,
    cacheCreationTokens: 0,
  };

  let raw: string;
  try {
    raw = readFileSync(transcriptPath, "utf8");
  } catch {
    return usage;
  }

  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;

    let entry: TranscriptEntry;
    try {
      entry = JSON.parse(line) as TranscriptEntry;
    } catch {
      continue;
    }

    const u = entry.message?.usage;
    if (entry.type !== "assistant" || !u) continue;

    usage.inputTokens += u.input_tokens ?? 0;
    usage.outputTokens += u.output_tokens ?? 0;
    usage.cacheReadTokens += u.cache_read_input_tokens ?? 0;
    usage.cacheCreationTokens += u.cache_creation_input_tokens ?? 0;
  }

  return usage;
}
