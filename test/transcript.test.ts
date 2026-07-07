import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { parseTranscriptUsage } from "../src/transcript.js";

const GOOD = `{"type":"user","message":{"role":"user","content":"hello"}}
{"type":"assistant","message":{"role":"assistant","content":"hi","usage":{"input_tokens":10,"output_tokens":5,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}}}
{"type":"user","message":{"role":"user","content":"world"}}
{"type":"assistant","message":{"role":"assistant","content":"!","usage":{"input_tokens":20,"output_tokens":8,"cache_read_input_tokens":100,"cache_creation_input_tokens":50}}}
`;

const MALFORMED = `{"type":"assistant","message":{"role":"assistant","content":"ok","usage":{"input_tokens":5,"output_tokens":3}}}
{not valid json
{"type":"assistant","message":{"role":"assistant"}}
{"type":"user","message":{"role":"user","content":"no usage here"}}
{"type":"assistant","message":{"role":"assistant","content":"done","usage":{"input_tokens":7,"output_tokens":2}}}
`;

let dir: string;

before(() => {
  dir = mkdtempSync(join(tmpdir(), "cclorax-test-"));
  writeFileSync(join(dir, "good.jsonl"), GOOD);
  writeFileSync(join(dir, "malformed.jsonl"), MALFORMED);
  writeFileSync(join(dir, "empty.jsonl"), "");
});

after(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("parseTranscriptUsage", () => {
  it("sums usage across all assistant turns", () => {
    const usage = parseTranscriptUsage(join(dir, "good.jsonl"));
    assert.strictEqual(usage.inputTokens, 30);
    assert.strictEqual(usage.outputTokens, 13);
    assert.strictEqual(usage.cacheReadTokens, 100);
    assert.strictEqual(usage.cacheCreationTokens, 50);
  });

  it("skips malformed lines, non-assistant entries, and entries without usage", () => {
    const usage = parseTranscriptUsage(join(dir, "malformed.jsonl"));
    assert.strictEqual(usage.inputTokens, 12);
    assert.strictEqual(usage.outputTokens, 5);
    assert.strictEqual(usage.cacheReadTokens, 0);
    assert.strictEqual(usage.cacheCreationTokens, 0);
  });

  it("returns zeros for an empty file", () => {
    const usage = parseTranscriptUsage(join(dir, "empty.jsonl"));
    assert.deepStrictEqual(usage, {
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 0,
      cacheCreationTokens: 0,
    });
  });

  it("returns zeros for a missing file", () => {
    const usage = parseTranscriptUsage(join(dir, "does-not-exist.jsonl"));
    assert.deepStrictEqual(usage, {
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 0,
      cacheCreationTokens: 0,
    });
  });
});
