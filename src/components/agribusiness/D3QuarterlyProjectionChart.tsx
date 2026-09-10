import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Info,
  ShieldAlert,
  ArrowUpRight,
  Filter,
} from "lucide-react";

export interface MonthlyProjectionPoint {
  monthKey: string;
  monthLabel: string;
  quarter: "Q4 2026" | "Q1 2027" | "Q2 2027";
  phase: string;
  fertilizerStock: number; // in Metric Tonnes
  fertilizerDemand: number; // in Metric Tonnes
  seedStock: number; // in Metric Tonnes
  seedDemand: number; // in Metric Tonnes
  mandatoryExportBuffer: number; // 15% safety threshold (175 MT)
}

export const QUARTERLY_DATA: MonthlyProjectionPoint[] = [
  {
    monthKey: "2026-10",
    monthLabel: "Oct 2026",
    quarter: "Q4 2026",
    phase: "Basal Planting Surge",
    fertilizerStock: 580,
    fertilizerDemand: 340,
    seedStock: 420,
    seedDemand: 310,
    mandatoryExportBuffer: 175,
  },
  {
    monthKey: "2026-11",
    monthLabel: "Nov 2026",
    quarter: "Q4 2026",
    phase: "Main Emergence & Thinning",
    fertilizerStock: 430,
    fertilizerDemand: 390,
    seedStock: 270,
    seedDemand: 260,
    mandatoryExportBuffer: 175,
  },
  {
    monthKey: "2026-12",
    monthLabel: "Dec 2026",
    quarter: "Q4 2026",
    phase: "Early Vegetative Growth",
    fertilizerStock: 320,
    fertilizerDemand: 290,
    seedStock: 210,
    seedDemand: 130,
    mandatoryExportBuffer: 175,
  },
  {
    monthKey: "2027-01",
    monthLabel: "Jan 2027",
    quarter: "Q1 2027",
    phase: "Peak Nitrogen Top-Dressing",
    fertilizerStock: 210,
    fertilizerDemand: 330, // Demand exceeds stock without arrival
    seedStock: 195,
    seedDemand: 80,
    mandatoryExportBuffer: 175,
  },
  {
    monthKey: "2027-02",
    monthLabel: "Feb 2027",
    quarter: "Q1 2027",
    phase: "Mid-Season Infill & Side-Dress",
    fertilizerStock: 140, // Drops below 175 MT buffer! (Critical 11.4% breach)
    fertilizerDemand: 270,
    seedStock: 240,
    seedDemand: 70,
    mandatoryExportBuffer: 175,
  },
  {
    monthKey: "2027-03",
    monthLabel: "Mar 2027",
    quarter: "Q1 2027",
    phase: "Grain Filling & Lobito Restock",
    fertilizerStock: 460, // Restock PO arrives (Lobito Rail)
    fertilizerDemand: 190,
    seedStock: 310,
    seedDemand: 60,
    mandatoryExportBuffer: 175,
  },
  {
    monthKey: "2027-04",
    monthLabel: "Apr 2027",
    quarter: "Q2 2027",
    phase: "Pre-Harvest Drying Window",
    fertilizerStock: 390,
    fertilizerDemand: 140,
    seedStock: 290,
    seedDemand: 55,
    mandatoryExportBuffer: 175,
  },
  {
    monthKey: "2027-05",
    monthLabel: "May 2027",
    quarter: "Q2 2027",
    phase: "Winter Wheat & Legume Prep",
    fertilizerStock: 350,
    fertilizerDemand: 160,
    seedStock: 280,
    seedDemand: 95,
    mandatoryExportBuffer: 175,
  },
  {
    monthKey: "2027-06",
    monthLabel: "Jun 2027",
    quarter: "Q2 2027",
    phase: "Post-Harvest Silo Intake",
    fertilizerStock: 310,
    fertilizerDemand: 110,
    seedStock: 250,
    seedDemand: 50,
    mandatoryExportBuffer: 175,
  },
];

interface D3QuarterlyProjectionChartProps {
  onTriggerAlert?: (month: string, stock: number, threshold: number) => void;
  highlightBreach?: boolean;
}

export const D3QuarterlyProjectionChart: React.FC<D3QuarterlyProjectionChartProps> = ({
  onTriggerAlert,
  highlightBreach = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [activeCommodityFilter, setActiveCommodityFilter] = useState<"all" | "fertilizer" | "seed">("all");
  const [hoveredPoint, setHoveredPoint] = useState<MonthlyProjectionPoint | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = 360;
    const margin = { top: 32, right: 36, bottom: 48, left: 56 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Definitions for gradients & drop shadows
    const defs = svg.append("defs");

    // Fertilizer stock gradient (Forest Green to transparent)
    const fertGradient = defs
      .append("linearGradient")
      .attr("id", "d3-fert-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    fertGradient.append("stop").attr("offset", "0%").attr("stop-color", "#22C55E").attr("stop-opacity", 0.35);
    fertGradient.append("stop").attr("offset", "100%").attr("stop-color", "#14532D").attr("stop-opacity", 0.0);

    // Seed stock gradient (Teal to transparent)
    const seedGradient = defs
      .append("linearGradient")
      .attr("id", "d3-seed-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    seedGradient.append("stop").attr("offset", "0%").attr("stop-color", "#10B981").attr("stop-opacity", 0.28);
    seedGradient.append("stop").attr("offset", "100%").attr("stop-color", "#0F3D22").attr("stop-opacity", 0.0);

    // Breach danger gradient
    const dangerGradient = defs
      .append("linearGradient")
      .attr("id", "d3-danger-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    dangerGradient.append("stop").attr("offset", "0%").attr("stop-color", "#DC2626").attr("stop-opacity", 0.2);
    dangerGradient.append("stop").attr("offset", "100%").attr("stop-color", "#78350F").attr("stop-opacity", 0.0);

    // Scales
    const xScale = d3
      .scalePoint<string>()
      .domain(QUARTERLY_DATA.map((d) => d.monthLabel))
      .range([0, innerWidth])
      .padding(0.4);

    const maxY = 650;
    const yScale = d3.scaleLinear().domain([0, maxY]).range([innerHeight, 0]).nice();

    // Horizontal Grid Lines
    const yAxisGrid = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickSize(-innerWidth)
      .tickFormat(() => "");

    g.append("g")
      .attr("class", "grid")
      .call(yAxisGrid)
      .selectAll("line")
      .attr("stroke", "#19262F")
      .attr("stroke-dasharray", "3,3")
      .attr("stroke-opacity", 0.7);

    // Quarter Separator Bands
    const quarterBoundaries = [
      { startIdx: 0, endIdx: 2, label: "Q4 2026 (Planting)", bg: "rgba(20, 83, 45, 0.05)" },
      { startIdx: 3, endIdx: 5, label: "Q1 2027 (Top-Dress & Risk)", bg: "rgba(245, 185, 66, 0.04)" },
      { startIdx: 6, endIdx: 8, label: "Q2 2027 (Harvest & Infill)", bg: "rgba(120, 53, 15, 0.04)" },
    ];

    quarterBoundaries.forEach((q) => {
      const startX = xScale(QUARTERLY_DATA[q.startIdx].monthLabel)! - innerWidth / 18;
      const endX = xScale(QUARTERLY_DATA[q.endIdx].monthLabel)! + innerWidth / 18;
      const bandWidth = Math.max(20, endX - startX);

      g.append("rect")
        .attr("x", Math.max(0, startX))
        .attr("y", 0)
        .attr("width", bandWidth)
        .attr("height", innerHeight)
        .attr("fill", q.bg)
        .attr("rx", 6);

      g.append("text")
        .attr("x", Math.max(10, startX + bandWidth / 2))
        .attr("y", 14)
        .attr("text-anchor", "middle")
        .attr("fill", "#64748B")
        .attr("font-size", "10px")
        .attr("font-family", "monospace")
        .attr("font-weight", "bold")
        .text(q.label);
    });

    // 15% Export Compliance Buffer Reference Line
    const bufferY = yScale(175);
    g.append("line")
      .attr("x1", 0)
      .attr("y1", bufferY)
      .attr("x2", innerWidth)
      .attr("y2", bufferY)
      .attr("stroke", "#F59E0B")
      .attr("stroke-width", 1.8)
      .attr("stroke-dasharray", "6,4")
      .attr("opacity", 0.9);

    g.append("rect")
      .attr("x", innerWidth - 170)
      .attr("y", bufferY - 18)
      .attr("width", 168)
      .attr("height", 16)
      .attr("fill", "#2A180E")
      .attr("rx", 3);

    g.append("text")
      .attr("x", innerWidth - 86)
      .attr("y", bufferY - 6)
      .attr("text-anchor", "middle")
      .attr("fill", "#F5B942")
      .attr("font-size", "9.5px")
      .attr("font-weight", "bold")
      .attr("font-family", "monospace")
      .text("15% Mandatory Export Buffer (175 MT)");

    // D3 Line & Area Generators
    const showFertilizer = activeCommodityFilter === "all" || activeCommodityFilter === "fertilizer";
    const showSeed = activeCommodityFilter === "all" || activeCommodityFilter === "seed";

    // 1. Fertilizer Available Stock Area & Line
    if (showFertilizer) {
      const fertArea = d3
        .area<MonthlyProjectionPoint>()
        .x((d) => xScale(d.monthLabel)!)
        .y0(innerHeight)
        .y1((d) => yScale(d.fertilizerStock))
        .curve(d3.curveMonotoneX);

      g.append("path")
        .datum(QUARTERLY_DATA)
        .attr("fill", "url(#d3-fert-gradient)")
        .attr("d", fertArea);

      const fertStockLine = d3
        .line<MonthlyProjectionPoint>()
        .x((d) => xScale(d.monthLabel)!)
        .y((d) => yScale(d.fertilizerStock))
        .curve(d3.curveMonotoneX);

      g.append("path")
        .datum(QUARTERLY_DATA)
        .attr("fill", "none")
        .attr("stroke", "#22C55E")
        .attr("stroke-width", 2.8)
        .attr("d", fertStockLine);

      // Fertilizer Projected Demand (Harvest Gold Dashed)
      const fertDemandLine = d3
        .line<MonthlyProjectionPoint>()
        .x((d) => xScale(d.monthLabel)!)
        .y((d) => yScale(d.fertilizerDemand))
        .curve(d3.curveMonotoneX);

      g.append("path")
        .datum(QUARTERLY_DATA)
        .attr("fill", "none")
        .attr("stroke", "#F5B942")
        .attr("stroke-width", 2.2)
        .attr("stroke-dasharray", "5,4")
        .attr("d", fertDemandLine);
    }

    // 2. Hybrid Seed Available Stock Area & Line
    if (showSeed) {
      const seedArea = d3
        .area<MonthlyProjectionPoint>()
        .x((d) => xScale(d.monthLabel)!)
        .y0(innerHeight)
        .y1((d) => yScale(d.seedStock))
        .curve(d3.curveMonotoneX);

      g.append("path")
        .datum(QUARTERLY_DATA)
        .attr("fill", "url(#d3-seed-gradient)")
        .attr("d", seedArea);

      const seedStockLine = d3
        .line<MonthlyProjectionPoint>()
        .x((d) => xScale(d.monthLabel)!)
        .y((d) => yScale(d.seedStock))
        .curve(d3.curveMonotoneX);

      g.append("path")
        .datum(QUARTERLY_DATA)
        .attr("fill", "none")
        .attr("stroke", "#10B981")
        .attr("stroke-width", 2.2)
        .attr("d", seedStockLine);

      // Seed Projected Demand (Earth Brown / Loam Dotted)
      const seedDemandLine = d3
        .line<MonthlyProjectionPoint>()
        .x((d) => xScale(d.monthLabel)!)
        .y((d) => yScale(d.seedDemand))
        .curve(d3.curveMonotoneX);

      g.append("path")
        .datum(QUARTERLY_DATA)
        .attr("fill", "none")
        .attr("stroke", "#D97706")
        .attr("stroke-width", 2.0)
        .attr("stroke-dasharray", "3,3")
        .attr("d", seedDemandLine);
    }

    // Critical Breach Indicator (Feb 2027 fertilizer stock dips to 140 MT < 175 MT)
    const breachPoint = QUARTERLY_DATA.find((d) => d.monthKey === "2027-02");
    if (breachPoint && showFertilizer && highlightBreach) {
      const bx = xScale(breachPoint.monthLabel)!;
      const by = yScale(breachPoint.fertilizerStock);

      // Pulsing breach marker
      const breachPulse = g
        .append("circle")
        .attr("cx", bx)
        .attr("cy", by)
        .attr("r", 12)
        .attr("fill", "#DC2626")
        .attr("opacity", 0.3)
        .attr("class", "animate-ping");

      g.append("circle")
        .attr("cx", bx)
        .attr("cy", by)
        .attr("r", 6)
        .attr("fill", "#DC2626")
        .attr("stroke", "#FDFBF7")
        .attr("stroke-width", 2);

      // Annotation Tag
      g.append("rect")
        .attr("x", bx - 62)
        .attr("y", by + 12)
        .attr("width", 124)
        .attr("height", 20)
        .attr("fill", "#3E1010")
        .attr("rx", 4);

      g.append("text")
        .attr("x", bx)
        .attr("y", by + 26)
        .attr("text-anchor", "middle")
        .attr("fill", "#FCA5A5")
        .attr("font-size", "9px")
        .attr("font-weight", "bold")
        .attr("font-family", "monospace")
        .text("140 MT (Buffer Breach!)");
    }

    // Interactive Circles for all points
    QUARTERLY_DATA.forEach((d) => {
      const cx = xScale(d.monthLabel)!;

      if (showFertilizer) {
        g.append("circle")
          .attr("cx", cx)
          .attr("cy", yScale(d.fertilizerStock))
          .attr("r", 4.5)
          .attr("fill", d.fertilizerStock < d.mandatoryExportBuffer ? "#DC2626" : "#22C55E")
          .attr("stroke", "#10171B")
          .attr("stroke-width", 2);

        g.append("circle")
          .attr("cx", cx)
          .attr("cy", yScale(d.fertilizerDemand))
          .attr("r", 3.5)
          .attr("fill", "#F5B942")
          .attr("stroke", "#10171B")
          .attr("stroke-width", 1.5);
      }

      if (showSeed) {
        g.append("circle")
          .attr("cx", cx)
          .attr("cy", yScale(d.seedStock))
          .attr("r", 4)
          .attr("fill", "#10B981")
          .attr("stroke", "#10171B")
          .attr("stroke-width", 1.5);

        g.append("circle")
          .attr("cx", cx)
          .attr("cy", yScale(d.seedDemand))
          .attr("r", 3)
          .attr("fill", "#D97706")
          .attr("stroke", "#10171B")
          .attr("stroke-width", 1);
      }
    });

    // X Axis
    const xAxis = d3.axisBottom(xScale);
    const xAxisGroup = g
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis);

    xAxisGroup.select(".domain").attr("stroke", "#1D2A32");
    xAxisGroup
      .selectAll("text")
      .attr("fill", "#94A3B8")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .attr("dy", "1em");
    xAxisGroup.selectAll(".tick line").attr("stroke", "#1D2A32");

    // Y Axis
    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat((d) => `${d} MT`);
    const yAxisGroup = g.append("g").call(yAxis);
    yAxisGroup.select(".domain").attr("stroke", "#1D2A32");
    yAxisGroup
      .selectAll("text")
      .attr("fill", "#64748B")
      .attr("font-size", "10px")
      .attr("font-family", "monospace");
    yAxisGroup.selectAll(".tick line").attr("stroke", "#1D2A32");

    // Mouse Tracking Overlay for Hover
    const focusLine = g
      .append("line")
      .attr("stroke", "#94A3B8")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "2,2")
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .style("opacity", 0);

    const overlay = g
      .append("rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("fill", "transparent")
      .style("cursor", "crosshair");

    overlay.on("mousemove", (event) => {
      const [mouseX] = d3.pointer(event);
      // Find nearest point
      let nearest = QUARTERLY_DATA[0];
      let minDistance = Infinity;

      QUARTERLY_DATA.forEach((d) => {
        const xPos = xScale(d.monthLabel)!;
        const dist = Math.abs(xPos - mouseX);
        if (dist < minDistance) {
          minDistance = dist;
          nearest = d;
        }
      });

      const nx = xScale(nearest.monthLabel)!;
      focusLine.attr("x1", nx).attr("x2", nx).style("opacity", 0.7);
      setHoveredPoint(nearest);
    });

    overlay.on("mouseleave", () => {
      focusLine.style("opacity", 0);
      setHoveredPoint(null);
    });
  }, [activeCommodityFilter, highlightBreach]);

  // Overall 3-Quarter Stats
  const breachMonth = QUARTERLY_DATA.find((d) => d.fertilizerStock < d.mandatoryExportBuffer);

  return (
    <div className="bg-[#10171B] rounded-2xl p-4 sm:p-6 border border-[#1D2A32] shadow-sm space-y-4">
      {/* Header with African Agricultural Tech Brand Palette */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#19262F]">
        <div className="space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-[#FDFBF7] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <span>Projected 3-Quarter Demand vs. Stock Telemetry</span>
            </h3>
            <span className="text-[10px] font-mono font-bold bg-[#14532D] text-[#FDFBF7] px-2 py-0.5 rounded border border-[#196349]">
              D3.js Predictive Engine
            </span>
            <span className="text-[10px] font-mono font-bold bg-[#3D2C0D] text-[#F5B942] px-2 py-0.5 rounded border border-[#785418]">
              Q4 2026 – Q2 2027
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Algorithmic forward balance modeling for Certified Hybrid Seeds and NPK/Urea Fertilizer reserves vs. AfCFTA 15% export buffer.
          </p>
        </div>

        {/* Commodity Filter Toggle Buttons */}
        <div className="flex items-center gap-1.5 bg-[#162228] p-1 rounded-xl border border-[#1D2A32]">
          <button
            onClick={() => setActiveCommodityFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeCommodityFilter === "all"
                ? "bg-[#14532D] text-[#FDFBF7] shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Inputs
          </button>
          <button
            onClick={() => setActiveCommodityFilter("fertilizer")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeCommodityFilter === "fertilizer"
                ? "bg-[#14532D] text-[#FDFBF7] shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Fertilizers Only
          </button>
          <button
            onClick={() => setActiveCommodityFilter("seed")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeCommodityFilter === "seed"
                ? "bg-[#14532D] text-[#FDFBF7] shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Seeds Only
          </button>
        </div>
      </div>

      {/* D3 Chart Canvas Container */}
      <div ref={containerRef} className="w-full relative min-h-[360px] overflow-hidden">
        <svg ref={svgRef} className="w-full h-[360px] overflow-visible" />

        {/* Live Hover Tooltip Card */}
        {hoveredPoint && (
          <div className="absolute top-2 right-2 bg-[#090D0F]/95 backdrop-blur-md p-3.5 rounded-xl border border-[#1D2A32] shadow-xl text-xs space-y-2 max-w-[240px] pointer-events-none z-20">
            <div className="flex items-center justify-between border-b border-[#19262F] pb-1.5">
              <span className="font-bold text-[#FDFBF7]">{hoveredPoint.monthLabel}</span>
              <span className="font-mono text-[10px] text-[#F5B942] font-bold">{hoveredPoint.quarter}</span>
            </div>
            <div className="text-[11px] text-slate-300 italic">{hoveredPoint.phase}</div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  Fertilizer Stock:
                </span>
                <span
                  className={`font-mono font-bold ${
                    hoveredPoint.fertilizerStock < hoveredPoint.mandatoryExportBuffer
                      ? "text-[#DC2626]"
                      : "text-[#FDFBF7]"
                  }`}
                >
                  {hoveredPoint.fertilizerStock} MT
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-[#F5B942]" />
                  Fertilizer Demand:
                </span>
                <span className="font-mono font-bold text-[#F5B942]">{hoveredPoint.fertilizerDemand} MT</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  Seed Stock:
                </span>
                <span className="font-mono font-bold text-[#FDFBF7]">{hoveredPoint.seedStock} MT</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                  Seed Demand:
                </span>
                <span className="font-mono font-bold text-[#D97706]">{hoveredPoint.seedDemand} MT</span>
              </div>
            </div>

            <div className="pt-1.5 border-t border-[#19262F]">
              {hoveredPoint.fertilizerStock < hoveredPoint.mandatoryExportBuffer ? (
                <div className="text-[10px] font-bold text-[#DC2626] flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Below 15% Export Buffer (-35 MT deficit)</span>
                </div>
              ) : (
                <div className="text-[10px] font-bold text-[#22C55E] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Export Buffer Satisfied (+{hoveredPoint.fertilizerStock - 175} MT reserve)</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend & Telemetry Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-[#19262F]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-[#22C55E] rounded-full" />
            <span className="text-slate-300 font-medium">Fertilizer Available Stock</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-[#F5B942] rounded-full border-t border-dashed border-[#F5B942]" />
            <span className="text-[#F5B942] font-medium">Fertilizer Projected Demand</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-[#10B981] rounded-full" />
            <span className="text-slate-300 font-medium">Seed Stock (Hybrid)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-[#D97706] rounded-full" />
            <span className="text-[#D97706] font-medium">Seed Demand</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-[#F59E0B] border-t border-dashed border-[#F59E0B]" />
            <span className="text-amber-400 font-mono text-[11px] font-bold">15% Export Floor (175 MT)</span>
          </div>
        </div>

        {breachMonth && (
          <div className="flex items-center gap-2 bg-[#2A180E] px-3 py-1.5 rounded-lg border border-[#54311C]">
            <ShieldAlert className="w-3.5 h-3.5 text-[#F5B942]" />
            <span className="text-[11px] text-[#FDFBF7] font-semibold">
              Vulnerability Window: <strong className="text-[#F5B942]">Feb 2027</strong> dips to 140 MT
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
