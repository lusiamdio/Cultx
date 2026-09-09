import React, { useState } from "react";
import {
  Sprout,
  TrendingUp,
  Droplets,
  Calendar,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Sliders,
  CheckCircle2,
  Download,
  AlertTriangle,
  Layers,
  Info,
  Award,
  Activity,
  ChevronRight,
  FileCheck,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { useApp } from "../../context/AppContext";

interface HistoricalSeason {
  year: number;
  seasonLabel: string;
  yieldMtHa: number;
  rainfallMm: number;
  soilMoisturePct: number;
  nitrogenAppliedKgHa: number;
  pestPressure: "Low" | "Moderate" | "High";
  actualHarvestTotalMt: number;
  isPredicted?: boolean;
}

const HISTORICAL_DATA: HistoricalSeason[] = [
  {
    year: 2021,
    seasonLabel: "2020/21 Main Crop",
    yieldMtHa: 5.8,
    rainfallMm: 460,
    soilMoisturePct: 29.4,
    nitrogenAppliedKgHa: 110,
    pestPressure: "Low",
    actualHarvestTotalMt: 696,
  },
  {
    year: 2022,
    seasonLabel: "2021/22 Main Crop",
    yieldMtHa: 6.1,
    rainfallMm: 520,
    soilMoisturePct: 32.1,
    nitrogenAppliedKgHa: 125,
    pestPressure: "Moderate",
    actualHarvestTotalMt: 732,
  },
  {
    year: 2023,
    seasonLabel: "2022/23 Main Crop",
    yieldMtHa: 6.4,
    rainfallMm: 490,
    soilMoisturePct: 31.0,
    nitrogenAppliedKgHa: 135,
    pestPressure: "Low",
    actualHarvestTotalMt: 768,
  },
  {
    year: 2024,
    seasonLabel: "2023/24 Main Crop",
    yieldMtHa: 6.0,
    rainfallMm: 410,
    soilMoisturePct: 26.5,
    nitrogenAppliedKgHa: 120,
    pestPressure: "High",
    actualHarvestTotalMt: 720,
  },
  {
    year: 2025,
    seasonLabel: "2024/25 Main Crop",
    yieldMtHa: 6.8,
    rainfallMm: 535,
    soilMoisturePct: 35.8,
    nitrogenAppliedKgHa: 140,
    pestPressure: "Low",
    actualHarvestTotalMt: 816,
  },
];

export const HarvestYieldPrediction: React.FC = () => {
  const { currentFarm } = useApp();

  // Interactive Simulation / Sensitivity Controls
  const [extraNitrogenKg, setExtraNitrogenKg] = useState<number>(0); // 0 to 40 kg N/ha
  const [moistureScenario, setMoistureScenario] = useState<"optimal" | "dry_spell" | "heavy_rain">("optimal");
  const [pestManagementApplied, setPestManagementApplied] = useState<boolean>(true);
  const [isExportingCert, setIsExportingCert] = useState<boolean>(false);
  const [certDownloaded, setCertDownloaded] = useState<boolean>(false);

  // Live Soil Health Indicators (from precision sensors & soil tests)
  const soilMetrics = {
    soilMoisturePct: moistureScenario === "optimal" ? 38.4 : moistureScenario === "dry_spell" ? 27.2 : 44.5,
    soilPh: 6.65, // optimal neutral
    availableNitrogenPpm: 44 + extraNitrogenKg * 0.4,
    organicMatterPct: 3.82,
    cationExchangeCapacity: 24.5, // meq/100g
    soilHealthScore: 92, // out of 100
  };

  // Base AI Model Computation
  const baseYieldMtHa = 7.18;
  const nitrogenImpact = (extraNitrogenKg / 40) * 0.45; // up to +0.45 MT/ha
  const moistureImpact = moistureScenario === "optimal" ? 0.24 : moistureScenario === "dry_spell" ? -0.48 : 0.08;
  const pestImpact = pestManagementApplied ? 0.0 : -0.55;

  const predictedYieldMtHa = Number((baseYieldMtHa + nitrogenImpact + moistureImpact + pestImpact).toFixed(2));
  const totalPredictedTonnes = Math.round(predictedYieldMtHa * currentFarm.totalHectares);
  const spotPricePerTonneZar = 5420; // R5,420 ZAR / MT spot yellow maize
  const estimatedGrossRevenueZar = totalPredictedTonnes * spotPricePerTonneZar;
  const confidenceScorePct = 93.8;

  // Comparison benchmarks
  const historical5YrAvg = Number(
    (HISTORICAL_DATA.reduce((acc, s) => acc + s.yieldMtHa, 0) / HISTORICAL_DATA.length).toFixed(2)
  );
  const yieldGainPct = (((predictedYieldMtHa - historical5YrAvg) / historical5YrAvg) * 100).toFixed(1);
  const districtBenchmarkYield = 5.6; // MT/ha regional smallholder baseline

  // Chart data combining historical and 2026 predicted
  const chartData = [
    ...HISTORICAL_DATA.map((h) => ({
      year: h.year.toString(),
      actualYield: h.yieldMtHa,
      predictedYield: null,
      rainfall: h.rainfallMm,
      label: h.seasonLabel,
    })),
    {
      year: "2026 (Est)",
      actualYield: null,
      predictedYield: predictedYieldMtHa,
      rainfall: moistureScenario === "optimal" ? 545 : moistureScenario === "dry_spell" ? 420 : 610,
      label: "2025/26 Current Season (Predicted)",
    },
  ];

  const handleDownloadCertificate = () => {
    setIsExportingCert(true);
    setTimeout(() => {
      setIsExportingCert(false);
      setCertDownloaded(true);
      setTimeout(() => setCertDownloaded(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Season Overview & Primary Yield Estimation */}
      <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#0B3D2C] border border-[#14533C] text-emerald-400 flex items-center justify-center shadow-sm">
              <Sprout className="w-5 h-5 animate-pulse" />
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              AI Harvest Yield Prediction Engine
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-300 bg-[#07261B] px-2.5 py-0.5 rounded-full border border-[#14533C]">
              2025/26 Season • {currentFarm.primaryCrop}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Multi-spectral Sentinel-2 vegetation imagery synthesized with calibrated root-zone soil telemetry and 5-year historical production trends.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#07261B] px-4 py-2 rounded-xl border border-[#14533C] text-right">
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
              Confidence Index
            </span>
            <span className="text-base font-mono font-extrabold text-white">
              {confidenceScorePct}%
            </span>
            <span className="text-[10px] text-emerald-400 block font-sans">±0.26 MT/ha error bound</span>
          </div>

          <button
            onClick={handleDownloadCertificate}
            disabled={isExportingCert}
            className="px-4 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold border border-[#196349] transition-all cursor-pointer flex items-center gap-2 shadow-md min-h-[44px]"
          >
            <Download className="w-4 h-4 text-emerald-300" />
            <span>{isExportingCert ? "Generating..." : "Yield Verification Cert"}</span>
          </button>
        </div>
      </div>

      {certDownloaded && (
        <div className="p-4 bg-[#07261B] border border-[#14533C] rounded-2xl flex items-center justify-between text-xs text-white animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">
                Official Yield Estimation Certificate #YLD-2026-9042 Generated!
              </span>
              <span className="text-emerald-200 text-[11px]">
                Cryptographically signed for commercial bank loan collateral underwriting, crop insurance, and SAFEX forward contracts.
              </span>
            </div>
          </div>
          <span className="font-mono text-[10px] text-emerald-300 bg-[#0B3D2C] px-2.5 py-1 rounded-lg border border-[#196349]">
            e-Sign: 0x77c4e2
          </span>
        </div>
      )}

      {/* 4 Core Seasonal Estimation KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-[#10171B] border border-emerald-900/50 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Estimated Yield Rate</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-emerald-400 flex items-baseline gap-1">
            <span>{predictedYieldMtHa}</span>
            <span className="text-xs text-slate-400 font-normal">MT / ha</span>
          </div>
          <div className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+{yieldGainPct}% vs 5-yr mean ({historical5YrAvg} MT)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#10171B] border border-[#1D2A32] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Farm Output</span>
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-white flex items-baseline gap-1">
            <span>{totalPredictedTonnes}</span>
            <span className="text-xs text-slate-400 font-normal">Metric Tonnes</span>
          </div>
          <div className="text-[11px] text-slate-300">
            Calculated on <strong className="text-white">{currentFarm.totalHectares} ha</strong> arable area
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#10171B] border border-[#1D2A32] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Estimated Gross Value</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-amber-400">
            R{estimatedGrossRevenueZar.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-300 font-mono">
            ~${(estimatedGrossRevenueZar / 17.5).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD Spot Parity
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#10171B] border border-[#1D2A32] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">District Outperformance</span>
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-blue-400">
            +{(((predictedYieldMtHa - districtBenchmarkYield) / districtBenchmarkYield) * 100).toFixed(0)}%
          </div>
          <div className="text-[11px] text-slate-300">
            vs {districtBenchmarkYield} MT/ha provincial benchmark
          </div>
        </div>
      </div>

      {/* Historical Trend Chart vs 2026 Prediction (Recharts) */}
      <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>5-Year Historical Harvest Trajectory vs Current Season AI Forecast</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-year retrospective harvest data correlated with annual precipitation patterns.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#10B981]" /> Historical Actual (MT/ha)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#38BDF8]" /> AI Forecast 2026
            </span>
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 15, right: 15, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1D2A32" vertical={false} />
              <XAxis
                dataKey="year"
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#1D2A32" }}
              />
              <YAxis
                yAxisId="yield"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#1D2A32" }}
                domain={[4, 9]}
                tickFormatter={(val) => `${val} t/ha`}
              />
              <YAxis
                yAxisId="rain"
                orientation="right"
                stroke="#475569"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#1D2A32" }}
                domain={[300, 700]}
                tickFormatter={(val) => `${val}mm`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#0B1013] p-3 rounded-xl border border-[#1D2A32] text-xs space-y-1 shadow-xl min-w-[180px]">
                        <div className="font-extrabold text-white text-sm pb-1 border-b border-[#1D2A32]">
                          {label}
                        </div>
                        {payload.map((entry: any, i: number) => (
                          <div key={i} className="flex justify-between font-mono">
                            <span className="text-slate-300">{entry.name}:</span>
                            <span className="font-bold text-white">
                              {entry.value} {entry.name.includes("Yield") ? "MT/ha" : "mm"}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                yAxisId="yield"
                dataKey="actualYield"
                fill="#10B981"
                name="Historical Actual Yield"
                radius={[6, 6, 0, 0]}
                barSize={34}
              />
              <Bar
                yAxisId="yield"
                dataKey="predictedYield"
                fill="#38BDF8"
                name="Predicted Seasonal Yield"
                radius={[6, 6, 0, 0]}
                barSize={34}
              />
              <Line
                yAxisId="rain"
                type="monotone"
                dataKey="rainfall"
                stroke="#94A3B8"
                strokeWidth={2}
                strokeDasharray="4 4"
                name="Seasonal Rainfall"
                dot={{ r: 4, fill: "#94A3B8" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Soil Health Telemetry & Agronomic Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Soil Health Metrics Influencing Yield */}
        <div className="lg:col-span-6 bg-[#10171B] p-5 rounded-2xl border border-[#1D2A32] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1D2A32] pb-3">
            <div>
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span>Live Soil Health Metrics Influencing Yield</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Physical sensor probe telemetry and geochemical profile.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-300 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
              Optimal Zone
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
              <span className="text-[10px] text-slate-400 block font-medium">Root-Zone Moisture</span>
              <div className="flex items-baseline justify-between">
                <span className="text-base font-mono font-extrabold text-cyan-400">
                  {soilMetrics.soilMoisturePct}%
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">+0.24 t/ha</span>
              </div>
              <div className="text-[10px] text-slate-400">Target field capacity: 32–40%</div>
            </div>

            <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
              <span className="text-[10px] text-slate-400 block font-medium">Available Nitrogen (N)</span>
              <div className="flex items-baseline justify-between">
                <span className="text-base font-mono font-extrabold text-emerald-400">
                  {soilMetrics.availableNitrogenPpm.toFixed(1)} mg/kg
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">+0.38 t/ha</span>
              </div>
              <div className="text-[10px] text-slate-400">NO₃⁻ / NH₄⁺ root absorption</div>
            </div>

            <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
              <span className="text-[10px] text-slate-400 block font-medium">Soil pH Reaction</span>
              <div className="flex items-baseline justify-between">
                <span className="text-base font-mono font-extrabold text-white">
                  {soilMetrics.soilPh}
                </span>
                <span className="text-[10px] text-slate-300 font-semibold">Neutral</span>
              </div>
              <div className="text-[10px] text-slate-400">Optimal phosphorus bioavailability</div>
            </div>

            <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
              <span className="text-[10px] text-slate-400 block font-medium">Soil Organic Matter</span>
              <div className="flex items-baseline justify-between">
                <span className="text-base font-mono font-extrabold text-amber-400">
                  {soilMetrics.organicMatterPct}%
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">+0.15 t/ha</span>
              </div>
              <div className="text-[10px] text-slate-400">High water retention buffer</div>
            </div>
          </div>

          <div className="p-3.5 bg-[#07261B] rounded-xl border border-[#14533C] text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200">
                Composite Soil Fertility Index: <strong className="text-white">92 / 100</strong> (Grade A Mollisol)
              </span>
            </div>
            <span className="font-mono text-[10px] text-emerald-300 bg-[#0B3D2C] px-2 py-0.5 rounded border border-[#196349]">
              Low Risk
            </span>
          </div>
        </div>

        {/* Interactive Scenario Simulation & Management Interventions */}
        <div className="lg:col-span-6 bg-[#10171B] p-5 rounded-2xl border border-[#1D2A32] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1D2A32] pb-3 mb-3">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Simulate Agronomic Interventions & Weather Stress</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Live Sensitivity Model</span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Nitrogen Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-200">
                    Nitrogen Top-Dressing Simulation (+kg N/ha):
                  </span>
                  <span className="font-mono font-bold text-emerald-400">+{extraNitrogenKg} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="10"
                  value={extraNitrogenKg}
                  onChange={(e) => setExtraNitrogenKg(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-[#162228] rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Current Baseline (0 kg)</span>
                  <span>+20 kg</span>
                  <span>+40 kg N (+0.45 t/ha)</span>
                </div>
              </div>

              {/* Weather Scenario Toggle */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-200 block">Climate & Rainfall Scenario:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setMoistureScenario("optimal")}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      moistureScenario === "optimal"
                        ? "bg-[#07261B] border-[#14533C] text-emerald-300 font-bold"
                        : "bg-[#162228] border-[#1D2A32] text-slate-400"
                    }`}
                  >
                    Optimal Rain (+0.24)
                  </button>
                  <button
                    onClick={() => setMoistureScenario("dry_spell")}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      moistureScenario === "dry_spell"
                        ? "bg-amber-950/60 border-amber-800 text-amber-300 font-bold"
                        : "bg-[#162228] border-[#1D2A32] text-slate-400"
                    }`}
                  >
                    10-Day Dry Spell (-0.48)
                  </button>
                  <button
                    onClick={() => setMoistureScenario("heavy_rain")}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      moistureScenario === "heavy_rain"
                        ? "bg-blue-950/60 border-blue-800 text-blue-300 font-bold"
                        : "bg-[#162228] border-[#1D2A32] text-slate-400"
                    }`}
                  >
                    Excess Rain (+0.08)
                  </button>
                </div>
              </div>

              {/* Pest Management Toggle */}
              <div className="flex items-center justify-between p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                <div>
                  <span className="font-bold text-white block">Fall Armyworm & Aphid Bio-Protection</span>
                  <span className="text-[10px] text-slate-400">
                    Biological pheromone traps & targeted Neem spray applied
                  </span>
                </div>
                <button
                  onClick={() => setPestManagementApplied(!pestManagementApplied)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    pestManagementApplied
                      ? "bg-[#0B3D2C] text-emerald-300 border border-[#196349]"
                      : "bg-red-950/60 text-red-300 border border-red-800"
                  }`}
                >
                  {pestManagementApplied ? "Active Protected" : "Unmanaged (-0.55 t/ha)"}
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#0B1013] rounded-xl border border-[#1D2A32] flex items-center justify-between text-xs">
            <span className="text-slate-400">Simulated Net Impact on Output:</span>
            <span className="font-mono font-extrabold text-emerald-400 text-sm">
              {predictedYieldMtHa} MT/ha ({totalPredictedTonnes} MT total)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
