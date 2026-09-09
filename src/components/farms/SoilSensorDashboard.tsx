import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Droplets,
  Activity,
  Layers,
  Thermometer,
  Zap,
  Radio,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  FlaskConical,
  Sun,
  BatteryCharging,
  Sparkles,
  Info,
  ShieldAlert,
  ArrowDownRight,
  Check,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SoilSensorNode } from "../../types";

interface SoilSensorDashboardProps {
  onOpenVraModal?: () => void;
}

export const SoilSensorDashboard: React.FC<SoilSensorDashboardProps> = ({ onOpenVraModal }) => {
  const {
    soilSensorNodes,
    updateSoilNodeMoisture,
    triggerIrrigationValve,
    soilAlerts,
    dismissSoilAlert,
  } = useApp();

  const [selectedNodeId, setSelectedNodeId] = useState<string>("all");
  const [activeMetricTab, setActiveMetricTab] = useState<"moisture" | "nutrients" | "temperature">("moisture");
  const [hoveredHourIndex, setHoveredHourIndex] = useState<number | null>(null);
  const [irrigationNotice, setIrrigationNotice] = useState<string | null>(null);

  // Selected node (or default to first node if specific one chosen)
  const activeNode: SoilSensorNode =
    soilSensorNodes.find((n) => n.id === selectedNodeId) || soilSensorNodes[0];

  const handleToggleValve = (nodeId: string) => {
    triggerIrrigationValve(nodeId);
    const node = soilSensorNodes.find((n) => n.id === nodeId);
    const isNowActive = !node?.activeIrrigationValve;
    setIrrigationNotice(
      isNowActive
        ? `Initiated precision 15mm irrigation pulse on ${node?.fieldName || "Field"}. Volumetric moisture increasing.`
        : `Deactivated irrigation valve on ${node?.fieldName || "Field"}. Resting hydraulic buffer.`
    );
    setTimeout(() => setIrrigationNotice(null), 4000);
  };

  // Mock 24-hour diurnal sensor readings (00:00 to 23:00)
  const diurnalReadings = [
    { hour: "00:00", moisture: 39, nitrogen: 215, temp: 18.2 },
    { hour: "02:00", moisture: 39, nitrogen: 215, temp: 17.5 },
    { hour: "04:00", moisture: 38, nitrogen: 214, temp: 16.8 },
    { hour: "06:00", moisture: 38, nitrogen: 213, temp: 17.1 },
    { hour: "08:00", moisture: 36, nitrogen: 211, temp: 21.0 },
    { hour: "10:00", moisture: 34, nitrogen: 209, temp: 24.8 },
    { hour: "12:00", moisture: 31, nitrogen: 206, temp: 27.5 },
    { hour: "14:00", moisture: 29, nitrogen: 202, temp: 28.6 },
    { hour: "16:00", moisture: 28, nitrogen: 201, temp: 27.2 },
    { hour: "18:00", moisture: 30, nitrogen: 203, temp: 23.4 },
    { hour: "20:00", moisture: 33, nitrogen: 207, temp: 20.6 },
    { hour: "22:00", moisture: 36, nitrogen: 210, temp: 19.1 },
  ];

  // Calculate SVG curve path for diurnal chart
  const getChartPath = (metric: "moisture" | "nitrogen" | "temp") => {
    const width = 600;
    const height = 140;
    const padX = 25;
    const padY = 20;

    let min = 0;
    let max = 100;
    if (metric === "moisture") {
      min = 20;
      max = 50;
    } else if (metric === "nitrogen") {
      min = 180;
      max = 240;
    } else {
      min = 15;
      max = 32;
    }

    const points = diurnalReadings.map((d, i) => {
      const val = metric === "moisture" ? d.moisture : metric === "nitrogen" ? d.nitrogen : d.temp;
      const x = padX + (i / (diurnalReadings.length - 1)) * (width - padX * 2);
      const y = height - padY - ((val - min) / (max - min)) * (height - padY * 2);
      return { x, y, val, hour: d.hour };
    });

    const d = points.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      return `${acc} L ${p.x} ${p.y}`;
    }, "");

    const area = `${d} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${
      height - padY
    } Z`;

    return { d, area, points };
  };

  const chartData = getChartPath(
    activeMetricTab === "moisture" ? "moisture" : activeMetricTab === "nutrients" ? "nitrogen" : "temp"
  );

  return (
    <div className="space-y-6">
      {/* Toast Notice for valve activation */}
      <AnimatePresence>
        {irrigationNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-[#0B3D2C] border border-emerald-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold"
          >
            <Droplets className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{irrigationNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sensor Mesh Header */}
      <div className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#19262F]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#07261B] border border-[#14533C] text-emerald-400 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>Real-Time Soil Moisture & Nutrient Telemetry</span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#07261B] text-emerald-300 border border-[#14533C]">
                    LoRaWAN Mesh Online
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sub-surface continuous dielectric impedance and N-P-K ion chromatography sensors across root-zone profiles.
                </p>
              </div>
            </div>
          </div>

          {/* Mesh Telemetry Stats */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-[#162228] border border-[#1D2A32] flex items-center gap-2 text-xs">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Poles Online:</span>
              <span className="font-mono font-bold text-white">4 / 4 Nodes</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#162228] border border-[#1D2A32] flex items-center gap-2 text-xs">
              <BatteryCharging className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Solar Power:</span>
              <span className="font-mono font-bold text-amber-300">96% Normal</span>
            </div>
          </div>
        </div>

        {/* Node Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <button
            onClick={() => setSelectedNodeId("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedNodeId === "all"
                ? "bg-[#0B3D2C] text-white border border-[#196349] shadow-xs"
                : "bg-[#162228] text-slate-400 hover:text-white border border-[#1D2A32]"
            }`}
          >
            All Fields Mesh ({soilSensorNodes.length} Nodes)
          </button>

          {soilSensorNodes.map((node) => {
            const hasDeficit = node.depths.some((d) => d.status === "Deficit");
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedNodeId === node.id
                    ? "bg-[#0B3D2C] text-white border border-[#196349] shadow-xs"
                    : "bg-[#162228] text-slate-400 hover:text-white border border-[#1D2A32]"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    hasDeficit ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
                  }`}
                />
                <span>{node.fieldName}</span>
                {hasDeficit && (
                  <span className="text-[10px] text-amber-300 font-normal">(!)</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Soil Alerts Banner if any alerts exist */}
      {soilAlerts.length > 0 && (
        <div className="space-y-2">
          {soilAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                alert.severity === "critical"
                  ? "bg-red-950/40 border-red-800/80 text-red-200"
                  : "bg-amber-950/40 border-amber-800/80 text-amber-200"
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    alert.severity === "critical"
                      ? "bg-red-900/60 text-red-300"
                      : "bg-amber-900/60 text-amber-300"
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs tracking-wider uppercase">
                      {alert.fieldName} • {alert.type.replace("_", " ").toUpperCase()} ALERT
                    </span>
                    <span className="text-[10px] font-mono opacity-75">{alert.timestamp}</span>
                  </div>
                  <h5 className="text-xs font-bold text-white mt-0.5">{alert.title}</h5>
                  <p className="text-xs text-slate-200 mt-0.5">{alert.description}</p>
                  <p className="text-[11px] font-medium text-emerald-300 mt-1">
                    Action: {alert.suggestedAction}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {alert.type === "moisture_deficit" && (
                  <button
                    onClick={() => {
                      const matchingNode = soilSensorNodes.find((n) => n.id === alert.nodeId);
                      if (matchingNode) handleToggleValve(matchingNode.id);
                      dismissSoilAlert(alert.id);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold border border-[#196349] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Droplets className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Trigger Irrigation Pulse</span>
                  </button>
                )}

                {alert.type === "nitrogen_leach" && onOpenVraModal && (
                  <button
                    onClick={onOpenVraModal}
                    className="px-3 py-1.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold border border-purple-700 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                    <span>Generate VRA Top-Dress</span>
                  </button>
                )}

                <button
                  onClick={() => dismissSoilAlert(alert.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Dismiss alert"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Grid: Multi-Depth Soil Profile Column + Macronutrient Chemistry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Multi-Depth Volumetric Water Content Profile (7 cols) */}
        <div className="lg:col-span-7 bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#19262F]">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span className="font-extrabold text-sm text-white">
                  Root-Zone Multi-Depth Volumetric Moisture (%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">
                  Node: {activeNode.nodeCode}
                </span>
                <button
                  onClick={() => handleToggleValve(activeNode.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    activeNode.activeIrrigationValve
                      ? "bg-blue-600 border-blue-400 text-white animate-pulse"
                      : "bg-[#162228] border-[#1D2A32] text-blue-300 hover:text-white"
                  }`}
                >
                  <Droplets className="w-3.5 h-3.5" />
                  <span>
                    {activeNode.activeIrrigationValve ? "Irrigation Active" : "Pulse Irrigation"}
                  </span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-2 mb-4">
              Real-time capacitive sensor telemetry measuring water percolation across four critical soil horizons.
            </p>

            {/* Depth Slices Cards */}
            <div className="space-y-3">
              {activeNode.depths.map((depth, idx) => {
                const isOptimal = depth.status === "Optimal";
                const isDeficit = depth.status === "Deficit";
                const isWaterlogged = depth.status === "Waterlogged";

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {/* Depth visual icon */}
                      <div className="w-12 h-10 rounded-lg bg-[#0B1013] border border-[#19262F] flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Depth</span>
                        <span className="text-xs font-mono font-bold text-white">
                          {depth.depthCm}cm
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">
                            {depth.depthCm === 10
                              ? "Surface / Evaporation Layer"
                              : depth.depthCm === 30
                              ? "Active Root Zone (Primary Feed)"
                              : depth.depthCm === 60
                              ? "Deep Root Reservoir"
                              : "Subsoil Drainage / Aquifer"}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isOptimal
                                ? "bg-emerald-950/70 text-emerald-300 border border-emerald-800"
                                : isDeficit
                                ? "bg-amber-950/70 text-amber-300 border border-amber-800"
                                : "bg-blue-950/70 text-blue-300 border border-blue-800"
                            }`}
                          >
                            {depth.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Thermometer className="w-3 h-3 text-slate-500" />
                            <span>{depth.temperatureC}°C</span>
                          </span>
                          <span>•</span>
                          <span>Target: 32% - 48%</span>
                        </div>
                      </div>
                    </div>

                    {/* Gauge and Interactive Slider */}
                    <div className="flex items-center gap-3 sm:w-52">
                      <div className="flex-1">
                        <div className="flex justify-between text-[11px] font-mono mb-1">
                          <span className="text-slate-400">VWC</span>
                          <span
                            className={`font-bold ${
                              isDeficit
                                ? "text-amber-400"
                                : isOptimal
                                ? "text-emerald-400"
                                : "text-blue-400"
                            }`}
                          >
                            {depth.moisturePct.toFixed(1)}%
                          </span>
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-[#0B1013] overflow-hidden relative">
                          <div
                            className={`h-full transition-all duration-500 ${
                              isDeficit
                                ? "bg-amber-400"
                                : isOptimal
                                ? "bg-emerald-400"
                                : "bg-blue-400"
                            }`}
                            style={{ width: `${Math.min(100, (depth.moisturePct / 60) * 100)}%` }}
                          />
                          {/* Ideal zone indicator line */}
                          <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-white/40" />
                        </div>
                      </div>

                      {/* Micro-adjuster buttons for simulation */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() =>
                            updateSoilNodeMoisture(
                              activeNode.id,
                              idx,
                              Math.min(60, depth.moisturePct + 3)
                            )
                          }
                          className="px-1.5 py-0.5 text-[10px] font-mono bg-[#0B1013] hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                          title="Simulate Rain/Irrigation"
                        >
                          +
                        </button>
                        <button
                          onClick={() =>
                            updateSoilNodeMoisture(
                              activeNode.id,
                              idx,
                              Math.max(15, depth.moisturePct - 3)
                            )
                          }
                          className="px-1.5 py-0.5 text-[10px] font-mono bg-[#0B1013] hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                          title="Simulate Transpiration Drawdown"
                        >
                          -
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#19262F] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Last LoRa telemetry ping: {activeNode.lastPingSeconds}s ago</span>
            </span>
            <span className="font-mono text-slate-300">
              Field Capacity: 45% | Permanent Wilting Point: 18%
            </span>
          </div>
        </div>

        {/* Right Column: Macronutrient & Soil Chemistry Diagnostics (5 cols) */}
        <div className="lg:col-span-5 bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#19262F]">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-purple-400" />
                <span className="font-extrabold text-sm text-white">
                  Macronutrient (N-P-K) & Soil Health
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                Ion Probe Telemetry
              </span>
            </div>

            {/* N-P-K Telemetry Gauges */}
            {(() => {
              const targetN = activeNode.nutrients.nitrogenTargetPpm ?? 180;
              const targetP = activeNode.nutrients.phosphorusTargetPpm ?? 45;
              const targetK = activeNode.nutrients.potassiumTargetPpm ?? 280;
              return (
                <div className="space-y-3 mt-4">
                  {/* Nitrogen */}
                  <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32]">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <span className="font-extrabold text-white">Nitrogen (Available NO3⁻ + NH4⁺)</span>
                      </div>
                      <span className="font-mono font-extrabold text-emerald-400">
                        {activeNode.nutrients.nitrogenPpm} ppm
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                      <span>Target: {targetN} ppm</span>
                      <span
                        className={`font-semibold ${
                          activeNode.nutrients.nitrogenPpm < targetN
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {activeNode.nutrients.nitrogenPpm < targetN
                          ? `Deficit of ${targetN - activeNode.nutrients.nitrogenPpm} ppm`
                          : "Optimal Vegetative Vigour"}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#0B1013] overflow-hidden relative">
                      <div
                        className="h-full bg-emerald-400 transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            (activeNode.nutrients.nitrogenPpm / (targetN * 1.3)) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Phosphorus */}
                  <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32]">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                        <span className="font-extrabold text-white">Phosphorus (Bray-1 P)</span>
                      </div>
                      <span className="font-mono font-extrabold text-blue-400">
                        {activeNode.nutrients.phosphorusPpm} ppm
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                      <span>Target: {targetP} ppm</span>
                      <span className="font-semibold text-emerald-400">Root Biomass Vigour</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#0B1013] overflow-hidden relative">
                      <div
                        className="h-full bg-blue-400 transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            (activeNode.nutrients.phosphorusPpm / (targetP * 1.3)) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Potassium */}
                  <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32]">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                        <span className="font-extrabold text-white">Potassium (Exchangeable K)</span>
                      </div>
                      <span className="font-mono font-extrabold text-purple-400">
                        {activeNode.nutrients.potassiumPpm} ppm
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                      <span>Target: {targetK} ppm</span>
                      <span className="font-semibold text-emerald-400">Cell Turgor & Drought Resistance</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#0B1013] overflow-hidden relative">
                      <div
                        className="h-full bg-purple-400 transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            (activeNode.nutrients.potassiumPpm / (targetK * 1.3)) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Secondary Soil Properties Grid (pH, EC, SOM, Microbes) */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="p-2.5 rounded-xl bg-[#162228] border border-[#1D2A32] text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Soil pH</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-base font-mono font-extrabold text-white">
                    {activeNode.nutrients.ph}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Optimal Neutral</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#162228] border border-[#1D2A32] text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Salinity (EC)</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-base font-mono font-extrabold text-white">
                    {activeNode.nutrients.ecMilliSiemens}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">mS/cm (Safe)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#162228] border border-[#1D2A32] text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Organic Matter (SOM)</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-base font-mono font-extrabold text-emerald-400">
                    {activeNode.nutrients.organicMatterPct}%
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Carbon Sink</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#162228] border border-[#1D2A32] text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Biota Activity</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-base font-mono font-extrabold text-white">
                    {activeNode.nutrients.microbialActivityScore}/100
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">High Respiration</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action to trigger VRA prescription */}
          {onOpenVraModal && (
            <div className="pt-4 border-t border-[#19262F] mt-4">
              <button
                onClick={onOpenVraModal}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-950/60 hover:bg-purple-900 text-purple-200 text-xs font-bold border border-purple-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span>Calculate Prescription for {activeNode.fieldName}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 24-Hour Diurnal Dynamics Trend Chart */}
      <div className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#19262F]">
          <div>
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <span>24-Hour Diurnal Telemetry Curve</span>
              <span className="text-[11px] font-mono text-slate-400 font-normal">
                Transpiration draw-down and ambient root dynamics
              </span>
            </h4>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1 bg-[#162228] p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveMetricTab("moisture")}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeMetricTab === "moisture"
                  ? "bg-[#0B3D2C] text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Moisture (VWC %)
            </button>
            <button
              onClick={() => setActiveMetricTab("nutrients")}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeMetricTab === "nutrients"
                  ? "bg-[#0B3D2C] text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Nitrogen (ppm)
            </button>
            <button
              onClick={() => setActiveMetricTab("temperature")}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeMetricTab === "temperature"
                  ? "bg-[#0B3D2C] text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Soil Temp (°C)
            </button>
          </div>
        </div>

        {/* SVG Chart Container */}
        <div className="relative pt-4 pb-2">
          <div className="w-full h-44 overflow-hidden">
            <svg viewBox="0 0 600 140" className="w-full h-full">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={
                      activeMetricTab === "moisture"
                        ? "#38BDF8"
                        : activeMetricTab === "nutrients"
                        ? "#A855F7"
                        : "#F59E0B"
                    }
                    stopOpacity="0.35"
                  />
                  <stop
                    offset="100%"
                    stopColor={
                      activeMetricTab === "moisture"
                        ? "#38BDF8"
                        : activeMetricTab === "nutrients"
                        ? "#A855F7"
                        : "#F59E0B"
                    }
                    stopOpacity="0.0"
                  />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="25" y1="20" x2="575" y2="20" stroke="#1D2A32" strokeDasharray="3 3" />
              <line x1="25" y1="60" x2="575" y2="60" stroke="#1D2A32" strokeDasharray="3 3" />
              <line x1="25" y1="100" x2="575" y2="100" stroke="#1D2A32" strokeDasharray="3 3" />

              {/* Shaded Area */}
              <path d={chartData.area} fill="url(#chartGradient)" />

              {/* Curve Line */}
              <path
                d={chartData.d}
                fill="none"
                stroke={
                  activeMetricTab === "moisture"
                    ? "#38BDF8"
                    : activeMetricTab === "nutrients"
                    ? "#C084FC"
                    : "#FBBF24"
                }
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {chartData.points.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredHourIndex === i ? 5 : 3.5}
                    fill={hoveredHourIndex === i ? "#FFFFFF" : "#10171B"}
                    stroke={
                      activeMetricTab === "moisture"
                        ? "#38BDF8"
                        : activeMetricTab === "nutrients"
                        ? "#C084FC"
                        : "#FBBF24"
                    }
                    strokeWidth="2"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredHourIndex(i)}
                    onMouseLeave={() => setHoveredHourIndex(null)}
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between text-[10px] font-mono text-slate-400 px-6 pt-1">
            {diurnalReadings.map((r, i) => (
              <span
                key={i}
                className={hoveredHourIndex === i ? "text-white font-bold" : ""}
              >
                {r.hour}
              </span>
            ))}
          </div>

          {/* Hover details badge */}
          {hoveredHourIndex !== null && (
            <div className="mt-2 text-center text-xs font-mono text-emerald-300">
              Hour: {diurnalReadings[hoveredHourIndex].hour} | Value:{" "}
              {activeMetricTab === "moisture"
                ? `${diurnalReadings[hoveredHourIndex].moisture}% VWC`
                : activeMetricTab === "nutrients"
                ? `${diurnalReadings[hoveredHourIndex].nitrogen} ppm Available N`
                : `${diurnalReadings[hoveredHourIndex].temp}°C Soil Temperature`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
