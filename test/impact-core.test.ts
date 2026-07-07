import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { computeImpact, formatImpact } from "../src/impact-core.js";

const zeroUsage = { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheCreationTokens: 0 };

describe("computeImpact", () => {
  it("returns zero for no tokens", () => {
    assert.strictEqual(computeImpact(zeroUsage).energyWh, 0);
  });

  it("computes input tokens at 390 Wh/MTok", () => {
    const r = computeImpact({ ...zeroUsage, inputTokens: 1_000_000 });
    assert.ok(Math.abs(r.energyWh - 390) < 1e-9, `energyWh=${r.energyWh}`);
  });

  it("computes output tokens at 1950 Wh/MTok", () => {
    const r = computeImpact({ ...zeroUsage, outputTokens: 1_000_000 });
    assert.ok(Math.abs(r.energyWh - 1950) < 1e-9, `energyWh=${r.energyWh}`);
  });

  it("computes cache read tokens at 39 Wh/MTok", () => {
    const r = computeImpact({ ...zeroUsage, cacheReadTokens: 1_000_000 });
    assert.ok(Math.abs(r.energyWh - 39) < 1e-9, `energyWh=${r.energyWh}`);
  });

  it("computes cache creation tokens at 490 Wh/MTok", () => {
    const r = computeImpact({ ...zeroUsage, cacheCreationTokens: 1_000_000 });
    assert.ok(Math.abs(r.energyWh - 490) < 1e-9, `energyWh=${r.energyWh}`);
  });

  it("sums contributions across token types", () => {
    const r = computeImpact({
      inputTokens: 1000,
      outputTokens: 1000,
      cacheReadTokens: 1000,
      cacheCreationTokens: 1000,
    });
    const expected = ((390 + 1950 + 39 + 490) * 1000) / 1_000_000;
    assert.ok(Math.abs(r.energyWh - expected) < 1e-9, `energyWh=${r.energyWh}`);
  });
});

describe("formatImpact", () => {
  it("formats energy with a lightning emoji and Wh unit", () => {
    const s = formatImpact(computeImpact({ ...zeroUsage, inputTokens: 1000 }));
    assert.ok(s.startsWith("⚡"), `got: ${s}`);
    assert.ok(s.includes("Wh"), `got: ${s}`);
  });
});
