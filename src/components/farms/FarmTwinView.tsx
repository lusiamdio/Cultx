import React, { useState } from "react";
import {
  Sprout,
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  BarChart3,
  Droplet,
  CloudSun,
  Leaf,
  Layers,
  Sparkles,
  Download,
  Share2,
  Lock,
  ArrowRight,
  TrendingUp,
  Plus,
  Compass,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { ParcelBoundaryDrawerModal } from "./ParcelBoundaryDrawerModal";

export const FarmTwinView: React.FC = () => {
  const { currentFarm, setCurrentFarm, farms, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<"overview" | "soil" | "carbon" | "telemetry">("overview");
  const [isBoundaryDrawerOpen, setIsBoundaryDrawerOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Farm Switcher & Top Header */}
      <div className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Digital Farm Twin & Autonomous Identity
            </h2>
            <span className="text-xs font-bold text-emerald-300 bg-[#07261B] px-2.5 py-0.5 rounded-full border border-[#14533C]">
              Verified Asset #TWIN-{currentFarm.id.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enables institutional lenders, commodity buyers, and parametric insurers to verify farm capacity with zero physical friction.
          </p>
        </div>

        {/* Farm selector */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Twin:
          </label>
          <select
            value={currentFarm.id}
            onChange={(e) => {
              const f = farms.find((farm) => farm.id === e.target.value);
              if (f) setCurrentFarm(f);
            }}
            className="px-3 py-1.5 rounded-xl border border-[#1D2A32] bg-[#162228] text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id} className="bg-[#162228] text-white">
                {f.name} ({f.country} • {f.totalHectares} ha)
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsBoundaryDrawerOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs border border-[#196349] min-h-[38px]"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-300" />
            <span>Draw New Parcel +</span>
          </button>

          <button
            onClick={() => setCurrentView("consent")}
            className="px-3.5 py-1.5 rounded-xl bg-[#162228] hover:bg-[#1D2A32] text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#1D2A32] min-h-[38px]"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Sharing Permissions</span>
          </button>
        </div>
      </div>

      {/* 10 Core Pillars of the Digital Twin (Blueprint Section 10) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* 1. Boundary Polygon */}
        <div className="p-3.5 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">1. Boundary Polygon</div>
          <div className="font-mono font-bold text-white text-sm mt-1">{currentFarm.totalHectares} Hectares</div>
          <div className="text-[11px] text-emerald-300 mt-0.5">4 Parcels Geofenced</div>
        </div>

        {/* 2. Soil Taxonomy */}
        <div className="p-3.5 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">2. Soil Taxonomy</div>
          <div className="font-mono font-bold text-white text-sm mt-1">Loamy Mollisol</div>
          <div className="text-[11px] text-emerald-300 mt-0.5">pH 6.4 • Organic 3.8%</div>
        </div>

        {/* 3. Crop History */}
        <div className="p-3.5 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">3. Crop Rotation</div>
          <div className="font-mono font-bold text-white text-sm mt-1">Maize ➔ Soy ➔ Maize</div>
          <div className="text-[11px] text-slate-400 mt-0.5">5 Year Satellite History</div>
        </div>

        {/* 4. Current Health */}
        <div className="p-3.5 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">4. Current Health</div>
          <div className="font-mono font-bold text-emerald-300 text-sm mt-1">{currentFarm.overallHealthScore}% Optimal</div>
          <div className="text-[11px] text-slate-400 mt-0.5">NDVI Mean 0.77</div>
        </div>

        {/* 5. Yield Forecast */}
        <div className="p-3.5 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">5. Yield Forecast</div>
          <div className="font-mono font-bold text-white text-sm mt-1">{currentFarm.expectedYieldTonnesPerHa} t/ha</div>
          <div className="text-[11px] text-emerald-300 mt-0.5">Est. 268 Tonnes Total</div>
        </div>

        {/* 6. Micro-Climate */}
        <div className="p-3.5 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">6. Micro-Climate</div>
          <div className="font-mono font-bold text-white text-sm mt-1">24°C • 54% RH</div>
          <div className="text-[11px] text-cyan-300 mt-0.5">Rain Radar: 32mm in 72h</div>
        </div>

        {/* 7. Equipment Telemetry */}
        <div className="p-3.5 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">7. Equipment IoT</div>
          <div className="font-mono font-bold text-white text-sm mt-1">{currentFarm.sensorsOnline} IoT Nodes</div>
          <div className="text-[11px] text-emerald-300 mt-0.5">Pivots & Tractor GPS Active</div>
        </div>

        {/* 8. Financial Profile */}
        <div className="p-3.5 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">8. Credit Profile</div>
          <div className="font-mono font-bold text-white text-sm mt-1">Tier 1 Prime</div>
          <div className="text-[11px] text-emerald-300 mt-0.5">Pre-Approved R250k</div>
        </div>

        {/* 9. Carbon Score */}
        <div className="p-3.5 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">9. Soil Carbon Offset</div>
          <div className="font-mono font-bold text-emerald-300 text-sm mt-1">1.8 tCO2e/ha</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">Eligible for Carbon Credits</div>
        </div>

        {/* 10. Trust Rating */}
        <div className="p-3.5 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">10. Trust Rating</div>
          <div className="font-mono font-bold text-amber-400 text-sm mt-1">★★★★★ 5.0</div>
          <div className="text-[11px] text-slate-400 mt-0.5">100% Contract Delivery</div>
        </div>
      </div>

      {/* Interactive Boundary & Vector Map Representation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#07261B] rounded-2xl p-5 text-white border border-[#14533C] shadow-lg">
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#14533C] mb-4 gap-3">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>High-Resolution Geospatial Boundary Twin</span>
                <span className="text-[10px] font-mono text-emerald-300 bg-[#0B3D2C] px-2 py-0.5 rounded border border-[#196349]">
                  Sentinel-2 L2A Multispectral
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Continuous orbital imagery with 10-meter spatial resolution and NDVI foliar heatmaps.
              </p>
            </div>
            <button
              onClick={() => setCurrentView("precision")}
              className="px-3.5 py-1.5 rounded-lg bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold transition-colors cursor-pointer border border-[#196349] min-h-[36px]"
            >
              Analyze Spectral Bands →
            </button>
          </div>

          {/* SVG Visual Polygon Representation of the Farm with 4 Fields */}
          <div className="relative w-full h-80 bg-[#0B1013] rounded-xl border border-[#1D2A32] overflow-hidden flex items-center justify-center p-4">
            <svg viewBox="0 0 100 100" className="w-full h-full max-w-lg">
              {/* Field 01: North Crest */}
              <polygon
                points="15,20 48,15 52,45 20,50"
                fill="#0B3D2C"
                fillOpacity="0.75"
                stroke="#10B981"
                strokeWidth="1"
                className="cursor-pointer hover:fill-opacity-95 transition-all"
              />
              <text x="25" y="32" fontSize="3.5" fill="#FFFFFF" fontWeight="bold">
                Field 01 (NDVI 0.86)
              </text>

              {/* Field 02: Western Terrace */}
              <polygon
                points="55,18 88,22 84,52 54,48"
                fill="#D97706"
                fillOpacity="0.4"
                stroke="#F59E0B"
                strokeWidth="1"
                className="cursor-pointer hover:fill-opacity-80 transition-all"
              />
              <text x="60" y="35" fontSize="3.5" fill="#FFFFFF" fontWeight="bold">
                Field 02 (NDVI 0.64)
              </text>

              {/* Field 03: River Basin (Critical) */}
              <polygon
                points="18,54 52,50 50,85 16,82"
                fill="#DC2626"
                fillOpacity="0.4"
                stroke="#EF4444"
                strokeWidth="1.2"
                className="cursor-pointer hover:fill-opacity-80 transition-all animate-pulse"
              />
              <text x="24" y="68" fontSize="3.5" fill="#FFFFFF" fontWeight="bold">
                Field 03 (Moisture 28%)
              </text>

              {/* Field 04: East Valley */}
              <polygon
                points="55,52 86,55 82,88 52,84"
                fill="#0B3D2C"
                fillOpacity="0.6"
                stroke="#34D399"
                strokeWidth="1"
                className="cursor-pointer hover:fill-opacity-90 transition-all"
              />
              <text x="60" y="70" fontSize="3.5" fill="#FFFFFF" fontWeight="bold">
                Field 04 (NDVI 0.74)
              </text>
            </svg>

            {/* Farm Legend Badge */}
            <div className="absolute bottom-3 left-3 bg-[#10171B]/90 backdrop-blur-md p-2.5 rounded-lg border border-[#1D2A32] text-[10px] space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                <span className="text-slate-200">Optimal Canopy (NDVI &gt; 0.75)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                <span className="text-slate-200">Moderate Biomass (NDVI 0.60 - 0.74)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-red-500" />
                <span className="text-slate-200">Hydration Deficit (Moisture &lt; 30%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Institutional Verification Passport */}
        <div className="lg:col-span-4 bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#19262F]">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Institutional Passport
              </span>
              <span className="px-2 py-0.5 rounded bg-[#07261B] border border-[#14533C] text-emerald-300 text-[10px] font-bold">
                Tamper-Proof
              </span>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32]">
                <div className="font-semibold text-slate-300">Bankable Collateral Value</div>
                <div className="text-lg font-mono font-bold text-white mt-0.5">
                  R1,452,560 (~$79,000 USD)
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Calculated from 268 tonnes projected harvest at R5,420/MT.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32]">
                <div className="font-semibold text-slate-300">Underwriting Pre-Clearance</div>
                <div className="text-xs text-emerald-300 font-medium mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Eligible for AfDB Subsidized Green Input Credit
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32]">
                <div className="font-semibold text-slate-300">AfCFTA Export Readiness</div>
                <div className="text-xs text-slate-400 mt-1">
                  Phytosanitary trace code: <strong className="font-mono text-white">ZA-SPS-2026-89</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-[#19262F] mt-4">
            <button
              onClick={() => setCurrentView("finance")}
              className="w-full py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs transition-colors cursor-pointer border border-[#196349] min-h-[44px]"
            >
              Share with Institutional Financier →
            </button>
            <button
              onClick={() => setCurrentView("marketplace")}
              className="w-full py-2 rounded-xl border border-[#1D2A32] bg-[#162228] hover:bg-[#1D2A32] text-slate-300 font-semibold text-xs transition-colors cursor-pointer min-h-[44px]"
            >
              Issue Forward Contract to Buyers
            </button>
          </div>
        </div>
      </div>

      <ParcelBoundaryDrawerModal
        isOpen={isBoundaryDrawerOpen}
        onClose={() => setIsBoundaryDrawerOpen(false)}
      />
    </div>
  );
};
