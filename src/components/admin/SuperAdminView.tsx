import React, { useState } from "react";
import {
  Server,
  Activity,
  Globe2,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Database,
  Radio,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export const SuperAdminView: React.FC = () => {
  const [selectedCluster, setSelectedCluster] = useState<string>("All Regions");

  const telemetryPipelines = [
    { name: "Sentinel-2 (ESA) Optical Ingest", status: "Operational", latency: "18 mins past overpass", throughput: "4.8 TB/day" },
    { name: "Landsat-9 Thermal Infrared", status: "Operational", latency: "32 mins past overpass", throughput: "1.2 TB/day" },
    { name: "Pan-African Ground IoT Probes", status: "Operational", latency: "140ms live WebSocket", throughput: "18,400 messages/sec" },
    { name: "SAFEX / National Commodity Feeds", status: "Operational", latency: "Real-time ticker", throughput: "14 sovereign bourses" },
  ];

  const privacyFrameworks = [
    { country: "South Africa", standard: "POPIA (Protection of Personal Information Act)", status: "Audited Compliant" },
    { country: "Kenya", standard: "Data Protection Act 2019 (ODPC)", status: "Audited Compliant" },
    { country: "Nigeria", standard: "NDPR (Nigeria Data Protection Regulation)", status: "Audited Compliant" },
    { country: "Ghana", standard: "Data Protection Act 2012 (Act 843)", status: "Audited Compliant" },
    { country: "Pan-African", standard: "Malabo Convention on Cyber Security & Data", status: "Framework Aligned" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#07261B] text-white rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src="/cultx_logo.png"
            alt="CULTx"
            className="w-12 h-12 rounded-xl object-contain shadow-xs shrink-0"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                CULTx Command & Control
              </h2>
              <span className="text-xs font-mono font-bold text-emerald-300 bg-[#0B3D2C] px-2.5 py-0.5 rounded">
                Level 4 Operations
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Real-time telemetry across 54 African country engines, predictive inference pipelines, and sovereign data privacy oracles.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#10171B] px-4 py-2.5 rounded-xl border border-[#1D2A32] text-right font-mono">
            <div className="text-[10px] uppercase text-slate-400">Global System Status</div>
            <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 justify-end mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              99.98% Uptime
            </div>
          </div>
        </div>
      </div>

      {/* Economic Value Created (Blueprint Section 22) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-sm">
          <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            Agricultural Commerce Facilitated
          </div>
          <div className="text-2xl font-mono font-black text-white mt-1">$482 Million USD</div>
          <div className="text-xs text-emerald-300 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> +28% YoY Cross-Border Volume
          </div>
        </div>

        <div className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-sm">
          <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            Smallholder Credit Unlocked
          </div>
          <div className="text-2xl font-mono font-black text-emerald-300 mt-1">$140 Million USD</div>
          <div className="text-xs text-slate-400 mt-1">Across 18 Partner Tier-1 Banks</div>
        </div>

        <div className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-sm">
          <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            Post-Harvest Loss Prevented
          </div>
          <div className="text-2xl font-mono font-black text-cyan-300 mt-1">320,000 MT Grain</div>
          <div className="text-xs text-slate-400 mt-1">Via Early Harvest & Silo Routing</div>
        </div>
      </div>

      {/* Agronomic Model & Pipeline Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Telemetry Ingest Pipelines */}
        <div className="lg:col-span-6 bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#19262F] mb-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-300" />
              <h3 className="font-bold text-sm text-white">Earth Observation & IoT Data Ingest</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-300 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
              Syncing
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {telemetryPipelines.map((p, idx) => (
              <div key={idx} className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-white">{p.name}</span>
                  <span className="text-emerald-300 font-mono text-[11px]">{p.status}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Latency: {p.latency}</span>
                  <span className="font-mono text-slate-300">{p.throughput}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agronomic Model Performance Metrics */}
        <div className="lg:col-span-6 bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#19262F] mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-300" />
                <h3 className="font-bold text-sm text-white">Agronomic Analytics Models</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-300 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                v2.5 Production
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                <span className="text-slate-400 text-[11px]">Diagnostic Precision</span>
                <div className="text-xl font-mono font-extrabold text-white mt-1">94.2%</div>
                <div className="text-[10px] text-slate-400">Computer Vision Pest ID</div>
              </div>
              <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                <span className="text-slate-400 text-[11px]">P95 Inference Latency</span>
                <div className="text-xl font-mono font-extrabold text-emerald-300 mt-1">142 ms</div>
                <div className="text-[10px] text-slate-400">Edge Cached</div>
              </div>
            </div>

            {/* Sovereign Data Compliance */}
            <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] text-xs">
              <div className="font-bold text-white mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Pan-African Data Sovereignty Audit Status</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                {privacyFrameworks.slice(0, 3).map((f, i) => (
                  <div key={i} className="flex justify-between items-center text-slate-300">
                    <span>{f.country} ({f.standard.split(" ")[0]})</span>
                    <span className="text-emerald-300 font-semibold">{f.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#19262F] flex flex-wrap items-center justify-between text-xs mt-4 gap-2">
            <span className="text-slate-400">Cloud Run Containers • Primary Node: af-south-1</span>
            <button onClick={() => window.print()} className="text-emerald-300 font-bold hover:underline cursor-pointer min-h-[36px] flex items-center">
              Download ISO 27001 Audit Certificate →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
