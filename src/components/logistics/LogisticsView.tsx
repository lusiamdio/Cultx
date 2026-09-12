import React, { useState } from "react";
import {
  Truck,
  Building,
  Thermometer,
  ShieldAlert,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  BarChart3,
  Train,
  Anchor,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Zap,
  Gauge,
  Layers,
  ChevronRight,
  ExternalLink,
  Download,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { LogisticsRoute, Warehouse } from "../../types";
import { RealTimeTransportTracker } from "./RealTimeTransportTracker";

export const LogisticsView: React.FC = () => {
  const { logisticsRoutes, warehouses } = useApp();
  const [selectedRoute, setSelectedRoute] = useState<LogisticsRoute>(
    logisticsRoutes.find((r) => r.id === "route-04") || logisticsRoutes[0]
  );
  const [activeFilter, setActiveFilter] = useState<
    "all" | "lobito" | "trucks" | "warehouses" | "coldchain"
  >("all");

  // Interactive Lobito Corridor Freight Simulator State
  const [simCommodity, setSimCommodity] = useState("Non-GMO Soybeans (HS 1201.90)");
  const [simVolumeTonnes, setSimVolumeTonnes] = useState("540");
  const [simLeg, setSimLeg] = useState<"export" | "import">("export");
  const [isWaybillDownloaded, setIsWaybillDownloaded] = useState(false);

  // Calculations for Lobito simulation
  const volTonnes = Number(simVolumeTonnes) || 540;
  const lobitoTransitHours = simLeg === "export" ? 38 : 32;
  const traditionalSeaTransitDays = 34; // via Durban or Dar es Salaam maritime detour
  const lobitoFreightPerTonne = simLeg === "export" ? 64 : 58;
  const traditionalFreightPerTonne = 118;
  const totalFreightSavingsUsd = (traditionalFreightPerTonne - lobitoFreightPerTonne) * volTonnes;
  const carbonReductionPct = 68; // rail consolidation vs multi-truck convoy

  const filteredRoutes = logisticsRoutes.filter((r) => {
    if (activeFilter === "lobito") return r.corridorName?.includes("Lobito");
    if (activeFilter === "trucks") return r.transitMode === "Road Freight";
    if (activeFilter === "coldchain") return r.temperatureControlled;
    return true;
  });

  const filteredWarehouses = warehouses.filter((wh) => {
    if (activeFilter === "lobito") return wh.country.includes("Angola") || wh.country.includes("Congo");
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#10171B] rounded-2xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4 border border-[#1D2A32]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Logistics & Trade Corridor Intelligence
            </h2>
            <span className="text-xs font-bold text-emerald-300 bg-[#07261B] px-2.5 py-0.5 rounded-full border border-[#14533C]">
              Multimodal Corridor Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multimodal rail & road optimization, Lobito Atlantic corridor tracking, and cold chain IoT monitoring.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap bg-[#162228] p-1.5 rounded-xl text-xs font-bold gap-1 border border-[#1D2A32]">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeFilter === "all"
                ? "bg-[#0B3D2C] text-white shadow-xs font-bold border border-[#196349]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Corridors ({logisticsRoutes.length})
          </button>

          <button
            onClick={() => {
              setActiveFilter("lobito");
              const lobito = logisticsRoutes.find((r) => r.id === "route-04");
              if (lobito) setSelectedRoute(lobito);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === "lobito"
                ? "bg-cyan-900/80 text-cyan-200 shadow-xs font-bold border border-cyan-700"
                : "text-cyan-400/80 hover:text-cyan-200"
            }`}
          >
            <Train className="w-3.5 h-3.5 text-cyan-400" />
            <span>Lobito Atlantic Corridor</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveFilter("trucks")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeFilter === "trucks"
                ? "bg-[#0B3D2C] text-white shadow-xs font-bold border border-[#196349]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Road Fleets
          </button>

          <button
            onClick={() => setActiveFilter("warehouses")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeFilter === "warehouses"
                ? "bg-[#0B3D2C] text-white shadow-xs font-bold border border-[#196349]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Silos & Warehouses ({warehouses.length})
          </button>

          <button
            onClick={() => setActiveFilter("coldchain")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeFilter === "coldchain"
                ? "bg-[#0B3D2C] text-white shadow-xs font-bold border border-[#196349]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Cold Chain IoT
          </button>
        </div>
      </div>

      {/* Map + Route Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual African Freight Corridor Simulation Map */}
        <div className="lg:col-span-8 bg-[#10171B] rounded-2xl p-5 text-white shadow-xl flex flex-col justify-between border border-[#1D2A32]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1D2A32]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Pan-African Agricultural Freight Corridors & Atlantic Gateways
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                Lobito Rail: 1,344 km CFB Active
              </span>
              <span className="text-slate-400 hidden sm:inline">
                {logisticsRoutes.length} Active Convoys
              </span>
            </div>
          </div>

          {/* SVG Map of Trade Corridors */}
          <div className="relative w-full h-88 bg-[#0B1013] rounded-xl flex items-center justify-center p-4 overflow-hidden border border-[#162228]">
            <svg viewBox="0 0 500 350" className="w-full h-full max-w-xl select-none">
              <defs>
                <linearGradient id="lobitoTrackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="50%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
              </defs>

              {/* Regional Africa Outline */}
              <path
                d="M 50 150 Q 150 80 300 70 Q 420 120 440 240 Q 360 320 220 310 Q 100 280 50 150 Z"
                fill="#162228"
                stroke="#2A3B47"
                strokeWidth="2"
              />

              {/* Conventional Highway Corridors */}
              {/* Corridor 1: Free State to Durban */}
              <line x1="220" y1="260" x2="340" y2="280" stroke="#10B981" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.7" />
              {/* Corridor 2: Nakuru to Mombasa */}
              <line x1="330" y1="120" x2="410" y2="160" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.7" />
              {/* Corridor 3: Kano to Lagos Apapa */}
              <line x1="160" y1="110" x2="130" y2="220" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.7" />

              {/* LOBITO TRANS-AFRICAN CORRIDOR: Benguela Railway (CFB) */}
              {/* Dual Rail Bed Underlay */}
              <path
                d="M 105 240 L 165 242 L 215 235 L 255 232 L 290 238"
                stroke="#092B33"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              {/* Glowing High-Speed Rail Track */}
              <path
                d="M 105 240 L 165 242 L 215 235 L 255 232 L 290 238"
                stroke="url(#lobitoTrackGradient)"
                strokeWidth="3.5"
                strokeDasharray="6 3"
                fill="none"
                className="animate-pulse"
              />

              {/* Waypoints & Warehouses */}
              {/* Durban Port */}
              <circle cx="340" cy="280" r="6" fill="#3B82F6" />
              <text x="350" y="285" fontSize="9" fill="#94A3B8" fontWeight="bold">Durban Port</text>

              {/* Free State Silo */}
              <circle cx="220" cy="260" r="5" fill="#10B981" />
              <text x="140" y="262" fontSize="8" fill="#94A3B8">Free State Silo</text>

              {/* Mombasa Port */}
              <circle cx="410" cy="160" r="6" fill="#3B82F6" />
              <text x="420" y="165" fontSize="9" fill="#94A3B8" fontWeight="bold">Mombasa Port</text>

              {/* Kano Grain Silos */}
              <circle cx="160" cy="110" r="5" fill="#F59E0B" />
              <text x="85" y="112" fontSize="8.5" fill="#94A3B8">Dawanau Silo</text>

              {/* === LOBITO CORRIDOR WAYPOINTS === */}
              {/* Port of Lobito (Atlantic Terminal Gate) */}
              <g
                className="cursor-pointer group"
                onClick={() => {
                  const r = logisticsRoutes.find((x) => x.id === "route-04") || logisticsRoutes[0];
                  setSelectedRoute(r);
                }}
              >
                <circle cx="105" cy="240" r="10" fill="#0E7490" stroke="#22D3EE" strokeWidth="2.5" />
                <circle cx="105" cy="240" r="16" fill="none" stroke="#22D3EE" strokeWidth="1" className="animate-ping" opacity="0.5" />
                <circle cx="105" cy="240" r="4" fill="#FFFFFF" />
                <text x="15" y="235" fontSize="9.5" fill="#67E8F9" fontWeight="bold">Port of Lobito</text>
                <text x="15" y="246" fontSize="7.5" fill="#A5F3FC">(Atlantic Deep-Water)</text>
              </g>

              {/* Luau One-Stop Border Post (Angola / DRC) */}
              <g
                className="cursor-pointer"
                onClick={() => {
                  const r = logisticsRoutes.find((x) => x.id === "route-05") || logisticsRoutes[0];
                  setSelectedRoute(r);
                }}
              >
                <circle cx="215" cy="235" r="5" fill="#F59E0B" stroke="#FEF3C7" strokeWidth="1" />
                <text x="190" y="222" fontSize="8" fill="#FCD34D" fontWeight="bold">Luau OSBP</text>
              </g>

              {/* Kolwezi / Katanga Mining & Agro Hub */}
              <circle cx="255" cy="232" r="4" fill="#10B981" />
              <text x="240" y="222" fontSize="7.5" fill="#86EFAC">Kolwezi</text>

              {/* Ndola / Copperbelt Grain Terminal */}
              <g
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label="Select Ndola Agri-Silo route"
                onClick={() => {
                  const r = logisticsRoutes.find((x) => x.id === "route-04") || logisticsRoutes[0];
                  setSelectedRoute(r);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    const r = logisticsRoutes.find((x) => x.id === "route-04") || logisticsRoutes[0];
                    setSelectedRoute(r);
                  }
                }}
              >
                <circle cx="290" cy="238" r="6" fill="#10B981" stroke="#A7F3D0" strokeWidth="1.5" />
                <text x="298" y="242" fontSize="9" fill="#A7F3D0" fontWeight="bold">Ndola Agri-Silo</text>
              </g>

              {/* ACTIVE CONVOYS */}
              {/* Conventional Trucks */}
              <g className="cursor-pointer" onClick={() => setSelectedRoute(logisticsRoutes[0])}>
                <circle cx="280" cy="270" r="5" fill="#10B981" className="animate-ping" />
                <circle cx="280" cy="270" r="5" fill="#10B981" />
                <text x="270" y="295" fontSize="8" fill="#A7F3D0">TRK-ZA-8910</text>
              </g>

              <g className="cursor-pointer" onClick={() => setSelectedRoute(logisticsRoutes[1])}>
                <circle cx="370" cy="140" r="5" fill="#38BDF8" className="animate-ping" />
                <circle cx="370" cy="140" r="5" fill="#38BDF8" />
                <text x="355" y="130" fontSize="8" fill="#BAE6FD">TRK-KE-4412 (Reefer)</text>
              </g>

              {/* LOBITO ACTIVE TRAINS */}
              {/* Train 1: LAR 540 MT Grain Train */}
              <g
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label="Select TRK-AO-5520 grain train"
                onClick={() => {
                  const r = logisticsRoutes.find((x) => x.id === "route-04") || logisticsRoutes[0];
                  setSelectedRoute(r);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    const r = logisticsRoutes.find((x) => x.id === "route-04") || logisticsRoutes[0];
                    setSelectedRoute(r);
                  }
                }}
              >
                <circle cx="175" cy="241" r="7" fill="#06B6D4" className="animate-ping" />
                <rect x="170" y="236" width="10" height="10" rx="2" fill="#0891B2" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="145" y="262" fontSize="8.5" fill="#22D3EE" fontWeight="bold">
                  TRK-AO-5520 (LAR 540 MT)
                </text>
              </g>

              {/* Train 2: DAP Fertilizer Train */}
              <g
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label="Select TRK-AO-5531 fertilizer train"
                onClick={() => {
                  const r = logisticsRoutes.find((x) => x.id === "route-05") || logisticsRoutes[0];
                  setSelectedRoute(r);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    const r = logisticsRoutes.find((x) => x.id === "route-05") || logisticsRoutes[0];
                    setSelectedRoute(r);
                  }
                }}
              >
                <circle cx="130" cy="241" r="5" fill="#10B981" className="animate-ping" />
                <rect x="126" y="237" width="8" height="8" rx="2" fill="#059669" stroke="#A7F3D0" strokeWidth="1" />
                <text x="110" y="222" fontSize="8" fill="#34D399" fontWeight="bold">
                  TRK-AO-5531 (DAP 320 MT)
                </text>
              </g>
            </svg>

            {/* Selected Route Info Inset */}
            <div className="absolute bottom-3 left-3 right-3 bg-[#0B1013]/95 backdrop-blur-md p-3.5 rounded-xl border border-[#1D2A32] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div className="space-y-0.5">
                <div className="font-bold text-white flex items-center gap-2 flex-wrap">
                  {selectedRoute.transitMode?.includes("Rail") ? (
                    <Train className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <span className="font-mono text-cyan-300">{selectedRoute.trackingNumber}</span>
                  <span className="text-[11px] text-slate-300 font-normal">
                    • {selectedRoute.carrier}
                  </span>
                  {selectedRoute.corridorName && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {selectedRoute.corridorName}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-300">
                  <span className="font-semibold text-white">{selectedRoute.origin}</span> ➔{" "}
                  <span className="font-semibold text-white">{selectedRoute.destination}</span>
                  <span className="text-slate-400 ml-1.5 font-mono">
                    ({selectedRoute.cargo} • {selectedRoute.volumeTonnes} MT)
                  </span>
                </div>
                {selectedRoute.railwayLine && (
                  <div className="text-[10px] text-cyan-400/90 font-mono">
                    Infrastructure: {selectedRoute.railwayLine}
                  </div>
                )}
              </div>

              <div className="text-left sm:text-right shrink-0 font-mono flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[#1D2A32]">
                <div className="font-bold text-emerald-400 text-sm">
                  ETA: {selectedRoute.etaHours} hours
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span>Status:</span>
                  <span className="text-white font-semibold">{selectedRoute.status}</span>
                  {selectedRoute.customsClearanceSpeedHours && (
                    <span className="text-emerald-400 ml-1">
                      (OSBP ~{selectedRoute.customsClearanceSpeedHours}h)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1D2A32] flex flex-wrap items-center justify-between text-xs text-slate-400 mt-2 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-slate-300 font-medium">
                Lobito Atlantic Railway (LAR) Concession Active
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-cyan-300 font-bold">Direct Atlantic Pier: 14m Draft</span>
              <span className="text-emerald-400 font-bold">AfCFTA Paperless Protocol</span>
            </div>
          </div>
        </div>

        {/* Cold Chain IoT Monitoring Card */}
        <div className="lg:col-span-4 bg-[#10171B] rounded-2xl p-5 shadow-xs flex flex-col justify-between border border-[#1D2A32]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1D2A32]">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Perishable Cold Chain Telemetry</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-300 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                Reefer Telematics
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Continuous IoT sensor loggers tracking temperature, ethylene, and tamper seals along export corridors.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32]">
                <div className="flex justify-between items-center text-slate-400 mb-1">
                  <span>Reefer Cargo:</span>
                  <span className="font-bold text-white">Hass Avocado (Export Grade)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Core Temp:</span>
                  <span className="font-mono font-bold text-emerald-400 text-base">4.2°C (Optimal)</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Set-point: 4.0°C - 5.5°C</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32]">
                <div className="flex justify-between items-center text-slate-400 mb-1">
                  <span>Relative Humidity:</span>
                  <span className="font-mono font-bold text-white">92% RH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Door Open Sensor:</span>
                  <span className="font-bold text-emerald-400">Sealed (Tamper-evident)</span>
                </div>
              </div>

              {/* Lobito Reefer Rail Feature */}
              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-900/60 text-cyan-200">
                <div className="flex items-center gap-2 font-bold text-white mb-1">
                  <Train className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Lobito Intermodal Reefer Rail</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-normal">
                  Generator-car powered refrigerated wagons for Congolese & Zambian horticultural exports direct to Atlantic ocean carriers.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button onClick={() => window.print()} className="w-full py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-2 border border-[#196349] min-h-[42px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Download Cold Chain Certificate</span>
            </button>
          </div>
        </div>
      </div>

      {/* DEDICATED LOBITO CORRIDOR STRATEGIC INTELLIGENCE & FREIGHT SIMULATOR */}
      <div className="bg-[#10171B] rounded-2xl p-5 shadow-xs border border-cyan-900/50 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-5 border-b border-[#1D2A32] gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-800">
                <Train className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  Lobito Trans-African Atlantic Rail Corridor
                </h3>
                <span className="text-xs text-cyan-400 font-medium">
                  Angola (Port of Lobito) ⇄ DR Congo (Kolwezi) ⇄ Zambia (Ndola / Copperbelt)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-950 px-3 py-1 rounded-lg border border-cyan-800">
              G7 PGI • AfDB • AFC Financed Infrastructure
            </span>
          </div>
        </div>

        {/* Strategic Highlights 4-Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 relative z-10">
          <div className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32]">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-bold uppercase">Transit Velocity</span>
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-2xl font-mono font-extrabold text-cyan-400">
              36–48 hrs
            </div>
            <div className="text-[11px] text-slate-300 mt-1">
              Direct Atlantic Ocean access; saves <span className="text-emerald-400 font-bold">25+ days</span> vs East Coast detour.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32]">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-bold uppercase">Benguela Railway</span>
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-mono font-extrabold text-emerald-400">
              1,344 km
            </div>
            <div className="text-[11px] text-slate-300 mt-1">
              Fully rehabilitated heavy-haul railway track connecting interior to deep-sea berths.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32]">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-bold uppercase">Arable Land Unlocked</span>
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-mono font-extrabold text-amber-400">
              4.2M Ha
            </div>
            <div className="text-[11px] text-slate-300 mt-1">
              Connecting central Angolan highlands & Zambian grain breadbasket to global markets.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32]">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-bold uppercase">Carbon Abatement</span>
              <Zap className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-2xl font-mono font-extrabold text-blue-400">
              -68% CO₂
            </div>
            <div className="text-[11px] text-slate-300 mt-1">
              Consolidated rail freight replaces hundreds of diesel trucks on long-haul routes.
            </div>
          </div>
        </div>

        {/* Ultra-Realistic Real-Time Transport Logistics Tracker (Lobito Corridor) */}
        <div className="mb-6">
          <RealTimeTransportTracker />
        </div>

        {/* Interactive Lobito Rail Cargo Dispatch Simulator */}
        <div className="bg-[#141E24] p-5 rounded-xl border border-cyan-900/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Lobito Corridor Multimodal Dispatch & Savings Simulator</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculate economic advantage, transit days saved, and PAPSS local currency clearing for your consignment.
              </p>
            </div>

            <div className="flex bg-[#0B1013] p-1 rounded-lg text-xs font-bold">
              <button
                onClick={() => setSimLeg("export")}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  simLeg === "export"
                    ? "bg-cyan-900 text-cyan-200 shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Export (Interior ➔ Lobito Port)
              </button>
              <button
                onClick={() => setSimLeg("import")}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  simLeg === "import"
                    ? "bg-cyan-900 text-cyan-200 shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Import (Lobito Port ➔ Interior)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Commodity & HS Classification
              </label>
              <select
                value={simCommodity}
                onChange={(e) => setSimCommodity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#162228] border border-[#1D2A32] text-white font-medium focus:border-cyan-500 focus:outline-none"
              >
                <option value="Non-GMO Soybeans (HS 1201.90)">Non-GMO Soybeans (HS 1201.90)</option>
                <option value="Yellow Maize Grain (HS 1005.90)">Yellow Maize Grain (HS 1005.90)</option>
                <option value="Cassava High-Grade Flour (HS 1108.14)">Cassava Flour (HS 1108.14)</option>
                <option value="DAP / NPK Fertilizer (HS 3105.30)">DAP Fertilizer (HS 3105.30)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Consignment Volume (Metric Tonnes)
              </label>
              <select
                value={simVolumeTonnes}
                onChange={(e) => setSimVolumeTonnes(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#162228] border border-[#1D2A32] text-white font-mono font-bold focus:border-cyan-500 focus:outline-none"
              >
                <option value="120">120 MT (4-Wagon Group)</option>
                <option value="320">320 MT (Dedicated Train Block)</option>
                <option value="540">540 MT (Standard LAR Unit Train)</option>
                <option value="1080">1,080 MT (Dual Heavy-Haul Convoy)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Route Origin & Destination Pair
              </label>
              <div className="px-3 py-2.5 rounded-xl bg-[#162228] border border-[#1D2A32] text-white font-medium">
                {simLeg === "export"
                  ? "Ndola / Kolwezi Hub ➔ Port of Lobito Pier 3"
                  : "Port of Lobito Quay ➔ Luau OSBP & Katanga"}
              </div>
            </div>
          </div>

          {/* Real-time Economic Comparison Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-[#10171B] border border-cyan-900/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Lobito Rail Transit</span>
              <div className="text-xl font-mono font-extrabold text-cyan-400 mt-1">
                {lobitoTransitHours} Hours
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">
                Saves ~{traditionalSeaTransitDays} days vs East Coast sea detour
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#10171B] border border-[#1D2A32]">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Freight Cost per MT</span>
              <div className="text-xl font-mono font-extrabold text-white mt-1">
                ${lobitoFreightPerTonne} <span className="text-xs text-slate-400 font-normal">/ MT</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">
                vs ${traditionalFreightPerTonne}/MT road/sea freight
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#10171B] border border-emerald-900/50">
              <span className="text-[10px] font-bold text-emerald-400 uppercase block">Total Freight Savings</span>
              <div className="text-xl font-mono font-extrabold text-emerald-400 mt-1">
                ${totalFreightSavingsUsd.toLocaleString()} USD
              </div>
              <span className="text-[10px] text-emerald-300 font-semibold">
                Direct bottom-line logistics margin
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#10171B] border border-[#1D2A32]">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">AfCFTA Duty Status</span>
              <div className="text-xl font-mono font-extrabold text-emerald-400 mt-1">
                0% Tariff ($0)
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">
                Preferential Rules of Origin pre-cleared
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Digital Customs Seal & Electronic Phytosanitary Pass verified for Luau OSBP</span>
            </div>

            <button
              onClick={() => {
                setIsWaybillDownloaded(true);
                setTimeout(() => setIsWaybillDownloaded(false), 4000);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-900 hover:bg-cyan-800 text-cyan-100 text-xs font-bold border border-cyan-700 transition-all cursor-pointer flex items-center gap-2 shadow-xs min-h-[40px]"
            >
              <Download className="w-3.5 h-3.5 text-cyan-300" />
              <span>
                {isWaybillDownloaded
                  ? "✓ Lobito Multimodal Waybill Generated"
                  : "Generate Lobito Consignment Waybill"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Warehouse & Grain Silo Capacity Forecasting */}
      <div className="bg-[#10171B] rounded-2xl p-5 shadow-xs border border-[#1D2A32]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1D2A32]">
          <div>
            <h3 className="font-bold text-sm text-white">
              Warehouse & Grain Silo Capacity Forecasting
            </h3>
            <p className="text-xs text-slate-400">
              Predictive models forecast when certified silos will reach capacity based on regional harvest satellite estimates.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-300 bg-[#07261B] px-2.5 py-1 rounded-lg border border-[#14533C]">
            Electronic Warehouse Receipts (e-WRS) Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWarehouses.map((wh) => {
            const pctUtilized = Math.round((wh.utilizedTonnes / wh.totalCapacityTonnes) * 100);
            const isLobitoHub = wh.country.includes("Angola") || wh.country.includes("Congo");

            return (
              <div
                key={wh.id}
                className={`p-4 rounded-xl space-y-3 text-xs border transition-all ${
                  isLobitoHub
                    ? "bg-[#14232B] border-cyan-900/60"
                    : "bg-[#162228] border-[#1D2A32]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      {isLobitoHub && <Anchor className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      <span>{wh.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {wh.city}, {wh.country}
                    </div>
                  </div>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded ${
                      isLobitoHub
                        ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                        : "bg-[#07261B] text-emerald-300"
                    }`}
                  >
                    {pctUtilized}% Full
                  </span>
                </div>

                <div className="w-full bg-[#0B1013] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      pctUtilized > 80
                        ? "bg-red-500"
                        : isLobitoHub
                        ? "bg-cyan-400"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${pctUtilized}%` }}
                  />
                </div>

                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-400">Utilized: {wh.utilizedTonnes.toLocaleString()} MT</span>
                  <span className="text-slate-200 font-bold">Total: {wh.totalCapacityTonnes.toLocaleString()} MT</span>
                </div>

                {/* Stored Commodities Breakdown */}
                <div className="flex flex-wrap gap-1 text-[10px] text-slate-300">
                  {wh.commoditiesStored.map((c) => (
                    <span
                      key={c.commodity}
                      className="px-2 py-0.5 rounded bg-[#0B1013] border border-[#1D2A32]"
                    >
                      {c.commodity}: {c.tonnes.toLocaleString()} MT
                    </span>
                  ))}
                </div>

                <div
                  className={`p-2 rounded-lg flex items-center justify-between text-[11px] ${
                    isLobitoHub
                      ? "bg-cyan-950/60 text-cyan-300 border border-cyan-900/40"
                      : "bg-[#07261B] text-emerald-300"
                  }`}
                >
                  <span>Predicted Capacity Threshold:</span>
                  <span className="font-bold">In {wh.predictedDaysToCapacity} Days</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
