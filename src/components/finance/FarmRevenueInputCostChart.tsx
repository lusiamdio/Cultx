import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
} from "lucide-react";

interface QuarterData {
  quarter: string;
  period: string;
  revenueZar: number;
  inputCostsZar: number;
  netMarginZar: number;
  marginPct: number;
  revenueUsd: number;
  inputCostsUsd: number;
  netMarginUsd: number;
  inputBreakdown: {
    fertilizerZar: number;
    seedsZar: number;
    machineryFuelZar: number;
    laborProtectionZar: number;
    fertilizerUsd: number;
    seedsUsd: number;
    machineryFuelUsd: number;
    laborProtectionUsd: number;
  };
  keyDrivers: string;
}

const FISCAL_QUARTERS_DATA: QuarterData[] = [
  {
    quarter: "Q4 2025",
    period: "Oct - Dec 2025 (Planting & Seeding)",
    revenueZar: 1420000,
    inputCostsZar: 680000,
    netMarginZar: 740000,
    marginPct: 52.1,
    revenueUsd: 81500,
    inputCostsUsd: 39000,
    netMarginUsd: 42500,
    inputBreakdown: {
      fertilizerZar: 310000,
      seedsZar: 170000,
      machineryFuelZar: 120000,
      laborProtectionZar: 80000,
      fertilizerUsd: 17800,
      seedsUsd: 9750,
      machineryFuelUsd: 6900,
      laborProtectionUsd: 4550,
    },
    keyDrivers: "Basal NPK bulk purchase with AfDB 12% fertilizer subsidy; hybrid certified maize seed acquisition.",
  },
  {
    quarter: "Q1 2026",
    period: "Jan - Mar 2026 (Vegetative & Soil Fertigation)",
    revenueZar: 1890000,
    inputCostsZar: 790000,
    netMarginZar: 1100000,
    marginPct: 58.2,
    revenueUsd: 108500,
    inputCostsUsd: 45300,
    netMarginUsd: 63200,
    inputBreakdown: {
      fertilizerZar: 360000,
      seedsZar: 40000,
      machineryFuelZar: 230000,
      laborProtectionZar: 160000,
      fertilizerUsd: 20650,
      seedsUsd: 2300,
      machineryFuelUsd: 13200,
      laborProtectionUsd: 9150,
    },
    keyDrivers: "Precision top-dressing guided by soil sensors; pivot irrigation electricity & biological pest sprays.",
  },
  {
    quarter: "Q2 2026",
    period: "Apr - Jun 2026 (Peak Harvest & Silo Deliveries)",
    revenueZar: 2640000,
    inputCostsZar: 890000,
    netMarginZar: 1750000,
    marginPct: 66.3,
    revenueUsd: 151500,
    inputCostsUsd: 51100,
    netMarginUsd: 100400,
    inputBreakdown: {
      fertilizerZar: 90000,
      seedsZar: 0,
      machineryFuelZar: 480000,
      laborProtectionZar: 320000,
      fertilizerUsd: 5150,
      seedsUsd: 0,
      machineryFuelUsd: 27550,
      laborProtectionUsd: 18400,
    },
    keyDrivers: "Bumper harvest (7.42 MT/ha); grain off-take delivery to SAFEX licensed silos; combine contractor haulage.",
  },
];

export const FarmRevenueInputCostChart: React.FC = () => {
  const [currency, setCurrency] = useState<"ZAR" | "USD">("ZAR");
  const [chartMode, setChartMode] = useState<"comparison" | "breakdown">("comparison");
  const [selectedQuarter, setSelectedQuarter] = useState<QuarterData>(FISCAL_QUARTERS_DATA[2]);

  const currencySymbol = currency === "ZAR" ? "R" : "$";

  // Formatted data for Recharts
  const chartData = FISCAL_QUARTERS_DATA.map((q) => {
    const isZar = currency === "ZAR";
    return {
      quarter: q.quarter,
      period: q.period,
      revenue: isZar ? q.revenueZar : q.revenueUsd,
      inputCosts: isZar ? q.inputCostsZar : q.inputCostsUsd,
      netMargin: isZar ? q.netMarginZar : q.netMarginUsd,
      marginPct: q.marginPct,
      fertilizer: isZar ? q.inputBreakdown.fertilizerZar : q.inputBreakdown.fertilizerUsd,
      seeds: isZar ? q.inputBreakdown.seedsZar : q.inputBreakdown.seedsUsd,
      machinery: isZar ? q.inputBreakdown.machineryFuelZar : q.inputBreakdown.machineryFuelUsd,
      labor: isZar ? q.inputBreakdown.laborProtectionZar : q.inputBreakdown.laborProtectionUsd,
    };
  });

  const totalRevenue = FISCAL_QUARTERS_DATA.reduce(
    (acc, q) => acc + (currency === "ZAR" ? q.revenueZar : q.revenueUsd),
    0
  );
  const totalInputCosts = FISCAL_QUARTERS_DATA.reduce(
    (acc, q) => acc + (currency === "ZAR" ? q.inputCostsZar : q.inputCostsUsd),
    0
  );
  const totalNetMargin = totalRevenue - totalInputCosts;
  const overallMarginPct = Math.round((totalNetMargin / totalRevenue) * 100);
  const efficiencyRatio = (totalRevenue / totalInputCosts).toFixed(2);

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = chartData.find((d) => d.quarter === label);
      return (
        <div className="bg-[#0B1013]/95 backdrop-blur-md p-3.5 rounded-xl border border-[#1D2A32] shadow-2xl text-xs space-y-2 min-w-[220px]">
          <div className="border-b border-[#1D2A32] pb-1.5">
            <div className="font-extrabold text-white text-sm">{label}</div>
            <div className="text-[10px] text-slate-400">{dataPoint?.period}</div>
          </div>
          <div className="space-y-1.5 font-mono">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex justify-between items-center gap-4">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color || entry.fill }}
                  />
                  <span>{entry.name}:</span>
                </span>
                <span className="font-bold text-white">
                  {currencySymbol}
                  {Number(entry.value).toLocaleString()}
                </span>
              </div>
            ))}
            {dataPoint && (
              <div className="pt-1.5 border-t border-[#1D2A32] flex justify-between text-[11px]">
                <span className="text-emerald-400 font-sans">Operating Margin:</span>
                <span className="font-bold text-emerald-400">{dataPoint.marginPct}%</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-md space-y-5">
      {/* Header with Title and Mode/Currency Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1D2A32]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Farm Revenue vs Input Cost Optimization</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-emerald-300 bg-[#07261B] px-2.5 py-0.5 rounded-full border border-[#14533C]">
              3 Fiscal Quarters Analyzed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracking economic return on fertilizer, certified seed, and machinery against spot grain revenues.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Chart View Toggle */}
          <div className="flex bg-[#162228] p-1 rounded-xl text-xs font-bold border border-[#1D2A32]">
            <button
              onClick={() => setChartMode("comparison")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                chartMode === "comparison"
                  ? "bg-[#0B3D2C] text-white shadow-xs border border-[#196349]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Revenue vs Costs</span>
            </button>
            <button
              onClick={() => setChartMode("breakdown")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                chartMode === "breakdown"
                  ? "bg-[#0B3D2C] text-white shadow-xs border border-[#196349]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <PieChart className="w-3.5 h-3.5 text-emerald-400" />
              <span>Input Anatomy</span>
            </button>
          </div>

          {/* Currency Toggle */}
          <div className="flex bg-[#162228] p-1 rounded-xl text-xs font-mono font-bold border border-[#1D2A32]">
            <button
              onClick={() => setCurrency("ZAR")}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                currency === "ZAR"
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              ZAR (R)
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                currency === "USD"
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>
      </div>

      {/* 4 Financial Health Metrics Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            3-Quarter Gross Revenue
          </span>
          <div className="text-xl font-mono font-extrabold text-emerald-400">
            {currencySymbol}
            {totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-300 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-bold">+85.9%</span>
            <span>growth Q4 to Q2</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Cumulative Input Costs
          </span>
          <div className="text-xl font-mono font-extrabold text-amber-400">
            {currencySymbol}
            {totalInputCosts.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-300">
            Controlled at <strong className="text-white">39.7%</strong> of gross output
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#07261B] border border-[#14533C] space-y-1">
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
            Net Operating Margin
          </span>
          <div className="text-xl font-mono font-extrabold text-white">
            {currencySymbol}
            {totalNetMargin.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-300 font-semibold">
            {overallMarginPct}% Operating Profitability
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Input Capital Multiplier
          </span>
          <div className="text-xl font-mono font-extrabold text-cyan-400">
            {efficiencyRatio}x ROI
          </div>
          <div className="text-[11px] text-slate-300">
            {currencySymbol}1 invested yields {currencySymbol}{efficiencyRatio} revenue
          </div>
        </div>
      </div>

      {/* Main Recharts Container */}
      <div className="p-4 bg-[#0B1013] rounded-xl border border-[#1D2A32]">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">
              {chartMode === "comparison"
                ? "Revenue vs. Input Cost Trajectory with Operating Margin Curve"
                : "Stacked Anatomy of Input Expenditure by Fiscal Quarter"}
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Unit: {currency} ({currencySymbol})
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === "comparison" ? (
              <ComposedChart
                data={chartData}
                margin={{ top: 15, right: 15, bottom: 5, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1D2A32" vertical={false} />
                <XAxis
                  dataKey="quarter"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: "#1D2A32" }}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#1D2A32" }}
                  tickFormatter={(val) =>
                    `${currencySymbol}${val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${(val / 1000).toFixed(0)}k`}`
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 12, fontSize: 11 }}
                  formatter={(value) => <span className="text-slate-300">{value}</span>}
                />
                <Bar
                  dataKey="revenue"
                  fill="#10B981"
                  name="Gross Farm Revenue"
                  radius={[6, 6, 0, 0]}
                  barSize={36}
                />
                <Bar
                  dataKey="inputCosts"
                  fill="#F59E0B"
                  name="Total Input Costs"
                  radius={[6, 6, 0, 0]}
                  barSize={36}
                />
                <Line
                  type="monotone"
                  dataKey="netMargin"
                  stroke="#38BDF8"
                  strokeWidth={3}
                  name="Net Operating Margin"
                  dot={{ r: 5, fill: "#38BDF8", stroke: "#0B1013", strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
              </ComposedChart>
            ) : (
              <BarChart
                data={chartData}
                margin={{ top: 15, right: 15, bottom: 5, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1D2A32" vertical={false} />
                <XAxis
                  dataKey="quarter"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: "#1D2A32" }}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#1D2A32" }}
                  tickFormatter={(val) =>
                    `${currencySymbol}${val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${(val / 1000).toFixed(0)}k`}`
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 12, fontSize: 11 }}
                  formatter={(value) => <span className="text-slate-300">{value}</span>}
                />
                <Bar
                  dataKey="fertilizer"
                  stackId="a"
                  fill="#10B981"
                  name="Fertilizer (NPK & Urea)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="seeds"
                  stackId="a"
                  fill="#38BDF8"
                  name="Certified Seeds"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="machinery"
                  stackId="a"
                  fill="#F59E0B"
                  name="Machinery & Diesel Fuel"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="labor"
                  stackId="a"
                  fill="#A855F7"
                  name="Crop Protection & Labor"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive Quarter Ledger & Agronomic Key Drivers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {FISCAL_QUARTERS_DATA.map((q) => {
          const isSelected = selectedQuarter.quarter === q.quarter;
          const isZar = currency === "ZAR";
          const rev = isZar ? q.revenueZar : q.revenueUsd;
          const cost = isZar ? q.inputCostsZar : q.inputCostsUsd;
          const margin = isZar ? q.netMarginZar : q.netMarginUsd;

          return (
            <div
              key={q.quarter}
              onClick={() => setSelectedQuarter(q)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#07261B] border-[#14533C] ring-1 ring-[#196349] shadow-sm"
                  : "bg-[#162228] border-[#1D2A32] hover:border-[#14533C]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-sm text-white">{q.quarter}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10171B] text-emerald-300 border border-[#1D2A32]">
                  {q.marginPct}% Margin
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mb-3 line-clamp-1">{q.period}</div>

              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Revenue:</span>
                  <span className="text-emerald-400 font-bold">
                    {currencySymbol}
                    {rev.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Input Costs:</span>
                  <span className="text-amber-400 font-semibold">
                    {currencySymbol}
                    {cost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#1D2A32]">
                  <span className="text-slate-300 font-bold">Net Profit:</span>
                  <span className="text-white font-extrabold">
                    {currencySymbol}
                    {margin.toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 mt-2.5 pt-2 border-t border-[#1D2A32] leading-snug">
                {q.keyDrivers}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
