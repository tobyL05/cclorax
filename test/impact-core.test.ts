import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  computeImpact,
  computeRange,
  formatImpact,
  PRESETS,
} from "../src/impact-core.js";

describe("computeImpact", () => {
  it("returns zeros for zero tokens", () => {
    const r = computeImpact(0);
    assert.strictEqual(r.energyWh, 0);
    assert.strictEqual(r.waterMl, 0);
    assert.strictEqual(r.co2G, 0);
  });

  it("matches hand-calculated values for default preset", () => {
    // 1000 tokens × 0.0003 Wh/token = 0.3 Wh
    // 0.3 Wh × 1.1 mL/Wh = 0.33 mL
    // (0.3 / 1000) kWh × 400 g/kWh = 0.12 g
    const r = computeImpact(1000);
    assert.strictEqual(r.energyWh, 0.3);
    assert.ok(Math.abs(r.waterMl - 0.33) < 1e-10, `waterMl=${r.waterMl}`);
    assert.ok(Math.abs(r.co2G - 0.12) < 1e-10, `co2G=${r.co2G}`);
  });

  it("matches hand-calculated values for independent preset", () => {
    // 1000 × 0.0015 = 1.5 Wh; 1.5 × 4.0 = 6 mL; (1.5/1000) × 500 = 0.75 g
    const r = computeImpact(1000, "independent");
    assert.strictEqual(r.energyWh, 1.5);
    assert.strictEqual(r.waterMl, 6);
    assert.ok(Math.abs(r.co2G - 0.75) < 1e-10, `co2G=${r.co2G}`);
  });

  it("default and disclosed presets are identical", () => {
    const def = computeImpact(5000, "default");
    const dis = computeImpact(5000, "disclosed");
    assert.deepStrictEqual(def, dis);
  });

  it("scales linearly with token count", () => {
    const single = computeImpact(1);
    const thousand = computeImpact(1000);
    assert.ok(Math.abs(thousand.energyWh - single.energyWh * 1000) < 1e-12);
  });
});

describe("computeRange", () => {
  it("low ≤ high for all fields", () => {
    const range = computeRange(2000);
    assert.ok(range.low.energyWh <= range.high.energyWh);
    assert.ok(range.low.waterMl <= range.high.waterMl);
    assert.ok(range.low.co2G <= range.high.co2G);
  });

  it("low uses disclosed preset", () => {
    const range = computeRange(2000);
    const disclosed = computeImpact(2000, "disclosed");
    assert.deepStrictEqual(range.low, disclosed);
  });

  it("high uses independent preset", () => {
    const range = computeRange(2000);
    const independent = computeImpact(2000, "independent");
    assert.deepStrictEqual(range.high, independent);
  });
});

describe("formatImpact", () => {
  it("formats water metric with mL", () => {
    const impact = computeImpact(1000);
    const s = formatImpact(impact, "water");
    assert.ok(s.includes("mL"), `got: ${s}`);
    assert.ok(s.startsWith("💧"), `got: ${s}`);
  });

  it("formats energy metric with Wh", () => {
    const impact = computeImpact(1000);
    const s = formatImpact(impact, "energy");
    assert.ok(s.includes("Wh"), `got: ${s}`);
    assert.ok(s.startsWith("⚡"), `got: ${s}`);
  });

  it("formats co2 metric with g CO₂", () => {
    const impact = computeImpact(1000);
    const s = formatImpact(impact, "co2");
    assert.ok(s.includes("CO₂"), `got: ${s}`);
  });
});

describe("PRESETS", () => {
  it("independent whPerToken is higher than disclosed", () => {
    assert.ok(PRESETS.independent.whPerToken > PRESETS.disclosed.whPerToken);
  });

  it("all preset values are positive", () => {
    for (const [name, p] of Object.entries(PRESETS)) {
      assert.ok(p.whPerToken > 0, `${name}.whPerToken`);
      assert.ok(p.mlPerWh > 0, `${name}.mlPerWh`);
      assert.ok(p.gco2PerKwh > 0, `${name}.gco2PerKwh`);
    }
  });
});
