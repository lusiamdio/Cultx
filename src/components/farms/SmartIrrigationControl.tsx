import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Droplets,
  Power,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  CloudRain,
  ShieldCheck,
  Activity,
  Gauge,
  Sparkles,
  RefreshCw,
  Clock,
  Layers,
  Zap,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface IrrigationZone {
  id: string;
  name: string;
  field: string;
  crop: string;
  type: "Center Pivot" | "Precision Drip" | "Micro-Sprinkler" | "Subsurface Drip";
  isActive: boolean;
  flowRateLpm: number; // liters per min
  waterDeliveredM3: number;
  rootMoisturePct: number;
  subsoilMoisturePct: number;
  temperatureC: number;
  autoThresholdPct: number;
  isAutoEnabled: boolean;
  fertigationActive: boolean;
}

export const SmartIrrigationControl: React.FC = () => {
  const { currentFarm, soilSensorNodes, triggerIrrigationValve } = useApp();

  const [zones, setZones] = useState<IrrigationZone[]>([
    {
      id: "zone-01",
      name: "Pivot 01 (North Ridge)",
      field: "Field 01 - North Crest",
      crop: "Yellow Maize",
      type: "Center Pivot",
      isActive: true,
      flowRateLpm: 320,
      waterDeliveredM3: 18.4,
      rootMoisturePct: 38,
      subsoilMoisturePct: 45,
      temperatureC: 22.8,
      autoThresholdPct: 35,
      isAutoEnabled: true,
      fertigationActive: false,
    },
    {
      id: "zone-02",
      name: "Drip Line B (Terrace Array)",
      field: "Field 02 - Western Terrace",
      crop: "Soybeans",
      type: "Precision Drip",
      isActive: false,
      flowRateLpm: 140,
      waterDeliveredM3: 9.6,
      rootMoisturePct: 44,
      subsoilMoisturePct: 48,
      temperatureC: 21.5,
      autoThresholdPct: 32,
      isAutoEnabled: true,
      fertigationActive: true,
    },
    {
      id: "zone-03",
      name: "Basin Micro-Sprinklers",
      field: "Field 03 - River Basin",
      crop: "Winter Wheat",
      type: "Micro-Sprinkler",
      isActive: true,
      flowRateLpm: 210,
      waterDeliveredM3: 14.2,
      rootMoisturePct: 28, // In Deficit
      subsoilMoisturePct: 34,
      temperatureC: 25.1,
      autoThresholdPct: 30,
      isAutoEnabled: true,
      fertigationActive: false,
    },
    {
      id: "zone-04",
      name: "Subsurface Drip Array",
      field: "Field 04 - East Valley",
      crop: "Avocado & Citrus",
      type: "Subsurface Drip",
      isActive: false,
      flowRateLpm: 95,
      waterDeliveredM3: 6.8,
      rootMoisturePct: 41,
      subsoilMoisturePct: 46,
      temperatureC: 20.8,
      autoThresholdPct: 33,
      isAutoEnabled: true,
      fertigationActive: false,
    },
  ]);

  const [weatherDelayLock, setWeatherDelayLock] = useState(true);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const toggleZone = (zoneId: string) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          const nextState = !z.isActive;
          const nextMoisture = nextState
            ? Math.min(52, z.rootMoisturePct + 6)
            : z.rootMoisturePct;
          return {
            ...z,
            isActive: nextState,
            rootMoisturePct: nextMoisture,
            waterDeliveredM3: nextState ? z.waterDeliveredM3 + 1.2 : z.waterDeliveredM3,
          };
        }
        return z;
      })
    );

    // Also trigger in global app state if matched with node
    if (soilSensorNodes.length > 0) {
      triggerIrrigationValve(soilSensorNodes[0].id);
    }

    setSuccessToast(`Irrigation state updated for zone`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const toggleAutoTrigger = (zoneId: string) => {
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, isAutoEnabled: !z.isAutoEnabled } : z))
    );
  };

  const toggleFertigation = (zoneId: string) => {
    setZones((prev) =>
      prev.map((z) =>
        z.id === zoneId ? { ...z, fertigationActive: !z.fertigationActive } : z
      )
    );
  };

  const masterShutOff = () => {
    setZones((prev) => prev.map((z) => ({ ...z, isActive: false })));
    setSuccessToast("Emergency Master Shut-Off executed. All valves closed.");
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const masterOptimalRun = () => {
    setZones((prev) =>
      prev.map((z) => ({
        ...z,
        isActive: z.rootMoisturePct < z.autoThresholdPct,
        rootMoisturePct:
          z.rootMoisturePct < z.autoThresholdPct
            ? Math.min(48, z.rootMoisturePct + 8)
            : z.rootMoisturePct,
      }))
    );
    setSuccessToast("Optimal irrigation cycle applied based on real-time soil deficit.");
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const activeZoneCount = zones.filter((z) => z.isActive).length;
  const totalFlow = zones.reduce((acc, z) => acc + (z.isActive ? z.flowRateLpm : 0), 0);
  const totalDelivered = zones.reduce((acc, z) => acc + z.waterDeliveredM3, 0).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner & Telemetric Overview */}
      <div className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#07261B] text-[#22C55E] border border-[#14533C]">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>Autonomous Smart Irrigation Control</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#14532D] text-[#FDFBF7] font-bold">
                    IoT Mesh Synced
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time sub-surface telemetry feedback loop governing center pivots, drip arrays, and solenoid valves.
                </p>
              </div>
            </div>
          </div>

          {/* Master Control Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={masterOptimalRun}
              className="px-3.5 py-2 rounded-xl bg-[#14532D] hover:bg-[#0F3D22] text-[#FDFBF7] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm border border-[#196349] min-h-[38px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F5B942]" />
              <span>Smart Cycle Deficit Zones</span>
            </button>

            <button
              onClick={masterShutOff}
              className="px-3.5 py-2 rounded-xl bg-red-950/70 hover:bg-red-900 text-red-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-red-800 min-h-[38px]"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Master Emergency Shut-Off</span>
            </button>
          </div>
        </div>

        {/* Global Telemetry Metric Dials */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#1D2A32]">
          <div className="bg-[#0B1013] p-3 rounded-xl border border-[#1D2A32]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Active Valves</span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="font-mono text-lg font-bold text-white mt-1">
              {activeZoneCount} of {zones.length} Online
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">
              {activeZoneCount > 0 ? "Pumping Active" : "Standby"}
            </div>
          </div>

          <div className="bg-[#0B1013] p-3 rounded-xl border border-[#1D2A32]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Live Flow Rate</span>
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="font-mono text-lg font-bold text-cyan-300 mt-1">
              {totalFlow} <span className="text-xs text-slate-400">L/min</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Hydraulic Line Pressure: 3.4 Bar</div>
          </div>

          <div className="bg-[#0B1013] p-3 rounded-xl border border-[#1D2A32]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Water Delivered Today</span>
              <Droplets className="w-3.5 h-3.5 text-[#F5B942]" />
            </div>
            <div className="font-mono text-lg font-bold text-white mt-1">
              {totalDelivered} <span className="text-xs text-slate-400">m³</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">+41% Efficiency vs Flood</div>
          </div>

          <div className="bg-[#0B1013] p-3 rounded-xl border border-[#1D2A32]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Weather Delay Lock</span>
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="font-mono text-xs font-bold text-white mt-1.5 flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${weatherDelayLock ? "bg-emerald-400" : "bg-slate-500"}`}
              />
              <span>{weatherDelayLock ? "Auto-Rain Sync" : "Manual Override"}</span>
            </div>
            <button
              onClick={() => setWeatherDelayLock(!weatherDelayLock)}
              className="text-[10px] text-cyan-400 hover:underline mt-1 cursor-pointer block"
            >
              Toggle Weather Guard
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Toast */}
      {successToast && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-[#07261B] border border-[#14533C] text-emerald-300 text-xs font-semibold flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
          <span>{successToast}</span>
        </motion.div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ZONE CONTROLLER CARDS (GRID)
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {zones.map((zone) => {
          const isDeficit = zone.rootMoisturePct < zone.autoThresholdPct;
          const isOptimal = zone.rootMoisturePct >= zone.autoThresholdPct && zone.rootMoisturePct <= 50;

          return (
            <div
              key={zone.id}
              className={`rounded-2xl p-5 border transition-all ${
                zone.isActive
                  ? "bg-[#101E17] border-[#14533C] shadow-md shadow-emerald-950/20"
                  : "bg-[#10171B] border-[#1D2A32]"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        zone.isActive ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                      }`}
                    />
                    <h4 className="text-sm font-extrabold text-white">{zone.name}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#162228] text-slate-300">
                      {zone.type}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {zone.field} • <strong className="text-slate-200">{zone.crop}</strong>
                  </div>
                </div>

                {/* Primary Valve Toggle Switch */}
                <button
                  onClick={() => toggleZone(zone.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    zone.isActive
                      ? "bg-emerald-500 hover:bg-emerald-600 text-black"
                      : "bg-[#162228] hover:bg-[#1D2A32] text-slate-300 border border-[#1D2A32]"
                  }`}
                  id={`toggle-valve-${zone.id}`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{zone.isActive ? "PUMPING" : "IDLE"}</span>
                </button>
              </div>

              {/* Moisture Telemetry Bars */}
              <div className="space-y-3 bg-[#0B1013] rounded-xl p-3.5 border border-[#1D2A32]">
                {/* 30cm Root Zone (Critical metric) */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-cyan-400" />
                      <span>Root Zone Moisture (30cm depth):</span>
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        isDeficit
                          ? "text-red-400"
                          : isOptimal
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }`}
                    >
                      {zone.rootMoisturePct}%{" "}
                      {isDeficit ? "(Deficit Alert)" : "(Optimal)"}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#162228] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDeficit ? "bg-red-500" : isOptimal ? "bg-emerald-400" : "bg-cyan-400"
                      }`}
                      style={{ width: `${Math.min(100, zone.rootMoisturePct * 1.6)}%` }}
                    />
                  </div>
                </div>

                {/* 60cm Deep Subsoil Storage */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-purple-400" />
                      <span>Deep Subsoil Moisture (60cm depth):</span>
                    </span>
                    <span className="font-mono font-bold text-slate-200">
                      {zone.subsoilMoisturePct}% Optimal
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#162228] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${zone.subsoilMoisturePct * 1.5}%` }}
                    />
                  </div>
                </div>

                {/* Micro-Telemetry stats row */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#162228] text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Flow Rate:</span>
                    <span className="font-mono font-bold text-slate-200">
                      {zone.isActive ? `${zone.flowRateLpm} L/min` : "0 L/min"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Delivered Today:</span>
                    <span className="font-mono font-bold text-slate-200">
                      {zone.waterDeliveredM3} m³
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Soil Temp:</span>
                    <span className="font-mono font-bold text-slate-200">
                      {zone.temperatureC}°C
                    </span>
                  </div>
                </div>
              </div>

              {/* Automation & Fertigation Settings */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-[#1D2A32] text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAutoTrigger(zone.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                      zone.isAutoEnabled
                        ? "bg-[#14532D] text-[#FDFBF7] font-bold"
                        : "bg-[#162228] text-slate-400"
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-[#F5B942]" />
                    <span>Auto Trigger &lt; {zone.autoThresholdPct}%</span>
                  </button>

                  <button
                    onClick={() => toggleFertigation(zone.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                      zone.fertigationActive
                        ? "bg-[#2A180E] text-[#F5B942] border border-[#54311C]"
                        : "bg-[#162228] text-slate-400"
                    }`}
                  >
                    <Zap className="w-3 h-3 text-[#F5B942]" />
                    <span>Fertigation {zone.fertigationActive ? "ON" : "OFF"}</span>
                  </button>
                </div>

                <span className="text-[10px] text-slate-400 font-mono">
                  Telemetry Ping: 3s ago
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
