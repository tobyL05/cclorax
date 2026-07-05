// Sources for constants:
// - whPerToken: Goldman et al. 2023 (disclosed ~0.3 mWh), Li et al. 2023 (independent ~1.5 mWh)
// - mlPerWh: Anthropic 2024 disclosure ~1.1 mL/Wh; independent estimates up to 4 mL/Wh
// - gco2PerKwh: IEA 2023 global average grid intensity

export type PresetName = "default" | "disclosed" | "independent";
export type MetricName = "water" | "energy" | "co2";

interface Preset {
  whPerToken: number;
  mlPerWh: number;
  gco2PerKwh: number;
}

export const PRESETS: Record<PresetName, Preset> = {
  default:     { whPerToken: 0.0003,  mlPerWh: 1.1, gco2PerKwh: 400 },
  disclosed:   { whPerToken: 0.0003,  mlPerWh: 1.1, gco2PerKwh: 400 },
  independent: { whPerToken: 0.0015,  mlPerWh: 4.0, gco2PerKwh: 500 },
};

export const METRICS: MetricName[] = ["water", "energy", "co2"];

export interface Impact {
  energyWh: number;
  waterMl: number;
  co2G: number;
}

export function computeImpact(totalTokens: number, preset: PresetName = "default"): Impact {
  const p = PRESETS[preset];
  const energyWh = totalTokens * p.whPerToken;
  return {
    energyWh,
    waterMl: energyWh * p.mlPerWh,
    co2G: (energyWh / 1000) * p.gco2PerKwh,
  };
}

export function formatImpact(impact: Impact, metric: MetricName): string {
  switch (metric) {
    case "water":  return `💧 ${impact.waterMl.toFixed(2)}mL`;
    case "energy": return `⚡ ${impact.energyWh.toFixed(2)}Wh`;
    case "co2":    return `☁️ ${impact.co2G.toFixed(2)}g CO₂`;
  }
}

export interface ImpactRange {
  low: Impact;
  high: Impact;
}

export function computeRange(totalTokens: number): ImpactRange {
  return {
    low:  computeImpact(totalTokens, "disclosed"),
    high: computeImpact(totalTokens, "independent"),
  };
}

export function formatRange(range: ImpactRange): string {
  const lines = [
    `  Energy:  ${range.low.energyWh.toFixed(4)} – ${range.high.energyWh.toFixed(4)} Wh`,
    `  Water:   ${range.low.waterMl.toFixed(2)} – ${range.high.waterMl.toFixed(2)} mL`,
    `  CO₂:     ${range.low.co2G.toFixed(4)} – ${range.high.co2G.toFixed(4)} g`,
  ];
  return lines.join("\n");
}

// Relatable equivalents for /impact verbose output
export function relatable(range: ImpactRange): string[] {
  const avgWater = (range.low.waterMl + range.high.waterMl) / 2;
  const avgCo2 = (range.low.co2G + range.high.co2G) / 2;
  const out: string[] = [];
  // A standard glass of water is ~250 mL
  if (avgWater >= 1) out.push(`~${(avgWater / 250).toFixed(3)} glasses of water`);
  // Driving 1 km in a typical car ≈ 170 g CO₂
  if (avgCo2 >= 0.001) out.push(`~${(avgCo2 / 170000).toFixed(6)} km driven (car)`);
  return out;
}
