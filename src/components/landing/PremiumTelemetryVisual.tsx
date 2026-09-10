import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Satellite,
  Radio,
  Activity,
  Layers,
  MapPin,
  TrendingUp,
  Droplets,
  Wind,
  ShieldCheck,
  Maximize2,
  RefreshCw,
  Cpu,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AFRICAN_COUNTRIES } from "../../data/countries";

interface TelemetryHub {
  id: string;
  name: string;
  country: string;
  region: string;
  coords: { x: number; y: number; lat: string; lon: string };
  primaryCommodity: string;
  ndviScore: number;
  ndviStatus: "Optimal" | "Good" | "Moderate" | "Stressed";
  soilMoisture: number; // percentage
  canopyTemp: number; // Celsius
  spotPrice: string;
  offtakeVolume: string;
  logisticsStatus: string;
  sensorNodesOnline: number;
}

const TELEMETRY_HUBS: TelemetryHub[] = [
  {
    id: "za-freestate",
    name: "Free State Grain Basin",
    country: "South Africa",
    region: "Southern Africa",
    coords: { x: 260, y: 390, lat: "28.421° S", lon: "26.895° E" },
    primaryCommodity: "Yellow & White Maize",
    ndviScore: 0.78,
    ndviStatus: "Optimal",
    soilMoisture: 38.4,
    canopyTemp: 22.1,
    spotPrice: "R5,420 / MT",
    offtakeVolume: "420,000 MT Season",
    logisticsStatus: "Durban Port Rail Corridor Active",
    sensorNodesOnline: 480,
  },
  {
    id: "ke-riftvalley",
    name: "Nakuru & Rift Valley",
    country: "Kenya",
    region: "East Africa",
    coords: { x: 330, y: 240, lat: "0.303° S", lon: "36.080° E" },
    primaryCommodity: "Tea & Hass Avocado",
    ndviScore: 0.82,
    ndviStatus: "Optimal",
    soilMoisture: 44.1,
    canopyTemp: 20.4,
    spotPrice: "$312 / MT",
    offtakeVolume: "185,000 MT Season",
    logisticsStatus: "Mombasa Cold-Chain Express",
    sensorNodesOnline: 390,
  },
  {
    id: "ng-kano",
    name: "Kano Agro-Industrial Belt",
    country: "Nigeria",
    region: "West Africa",
    coords: { x: 190, y: 210, lat: "12.002° N", lon: "8.591° E" },
    primaryCommodity: "Sorghum, Sesame & Maize",
    ndviScore: 0.69,
    ndviStatus: "Good",
    soilMoisture: 31.2,
    canopyTemp: 29.8,
    spotPrice: "₦480,000 / MT",
    offtakeVolume: "650,000 MT Season",
    logisticsStatus: "Dawanau Silo Rail Line",
    sensorNodesOnline: 520,
  },
  {
    id: "ci-sanpedro",
    name: "San Pedro Cocoa Belt",
    country: "Côte d'Ivoire",
    region: "West Africa",
    coords: { x: 130, y: 225, lat: "4.750° N", lon: "6.640° W" },
    primaryCommodity: "Certified Raw Cocoa",
    ndviScore: 0.84,
    ndviStatus: "Optimal",
    soilMoisture: 47.8,
    canopyTemp: 26.2,
    spotPrice: "$7,820 / MT",
    offtakeVolume: "310,000 MT Season",
    logisticsStatus: "Deepwater Terminal Berth 4",
    sensorNodesOnline: 410,
  },
  {
    id: "et-oromia",
    name: "Oromia Highland Basin",
    country: "Ethiopia",
    region: "Horn of Africa",
    coords: { x: 340, y: 190, lat: "8.540° N", lon: "39.270° E" },
    primaryCommodity: "Washed Arabica Coffee",
    ndviScore: 0.79,
    ndviStatus: "Optimal",
    soilMoisture: 41.5,
    canopyTemp: 19.3,
    spotPrice: "$4,650 / MT",
    offtakeVolume: "120,000 MT Season",
    logisticsStatus: "Addis-Djibouti Electric Freight",
    sensorNodesOnline: 360,
  },
  {
    id: "zm-copperbelt",
    name: "Zambezi Central Plains",
    country: "Zambia",
    region: "Southern Africa",
    coords: { x: 275, y: 310, lat: "14.420° S", lon: "28.450° E" },
    primaryCommodity: "Commercial Grain & Soy",
    ndviScore: 0.73,
    ndviStatus: "Good",
    soilMoisture: 36.8,
    canopyTemp: 24.6,
    spotPrice: "$284 / MT",
    offtakeVolume: "240,000 MT Season",
    logisticsStatus: "Beira & Walvis Bay Corridor",
    sensorNodesOnline: 290,
  },
  {
    id: "ao-lobito",
    name: "Lobito Rail Agro Corridor",
    country: "Angola",
    region: "Central-West Africa",
    coords: { x: 205, y: 295, lat: "12.350° S", lon: "13.540° E" },
    primaryCommodity: "Soybean & Mineral-Agro Feed",
    ndviScore: 0.71,
    ndviStatus: "Good",
    soilMoisture: 34.2,
    canopyTemp: 25.1,
    spotPrice: "$310 / MT",
    offtakeVolume: "190,000 MT Season",
    logisticsStatus: "LAR Atlantic Rail Active (52 Trains)",
    sensorNodesOnline: 310,
  },
  {
    id: "eg-niledelta",
    name: "Nile Delta Precision Pivot Basin",
    country: "Egypt",
    region: "North Africa",
    coords: { x: 290, y: 70, lat: "30.585° N", lon: "31.500° E" },
    primaryCommodity: "Durum Wheat & Citrus",
    ndviScore: 0.76,
    ndviStatus: "Optimal",
    soilMoisture: 42.0,
    canopyTemp: 27.5,
    spotPrice: "E£12,400 / MT",
    offtakeVolume: "580,000 MT Season",
    logisticsStatus: "Alexandria Grain Terminals",
    sensorNodesOnline: 640,
  },
];

export const PremiumTelemetryVisual: React.FC = () => {
  const { setCurrentView, setSelectedCountry } = useApp();
  const [activeLayer, setActiveLayer] = useState<"ndvi" | "moisture" | "prices" | "logistics">("ndvi");
  const [selectedHubId, setSelectedHubId] = useState<string>("za-freestate");
  const [livePulse, setLivePulse] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePulse((prev) => (prev + 1) % 60);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const selectedHub = TELEMETRY_HUBS.find((h) => h.id === selectedHubId) || TELEMETRY_HUBS[0];

  const getLayerColor = () => {
    switch (activeLayer) {
      case "ndvi":
        return "#10B981"; // Emerald
      case "moisture":
        return "#38BDF8"; // Sky blue
      case "prices":
        return "#F5B942"; // Gold amber
      case "logistics":
        return "#A855F7"; // Purple
    }
  };

  const layerColor = getLayerColor();

  return (
    <div className="bg-[#0A0F12] rounded-3xl border border-[#1D2A32] shadow-2xl overflow-hidden relative">
      {/* Top Telemetry Mission Header */}
      <div className="p-4 sm:p-5 border-b border-[#18232A] bg-[#0E151A] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
              CATE-v4 Continental Telemetric Mesh
            </span>
            <span className="hidden sm:inline text-[10px] font-mono text-slate-400 bg-[#162228] px-2 py-0.5 rounded border border-[#1D2A32]">
              ORBIT: SENTINEL-2B L2A • FREQ: 665/842nm
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-slate-300">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>4,820 Nodes Active</span>
            </span>
            <span>•</span>
            <span>Latency: 14ms</span>
            <span>•</span>
            <span className="text-slate-400 hidden lg:inline">Ground Resolution: 10m/pixel</span>
          </div>
        </div>

        {/* Telemetry Layer Selection Pills */}
        <div className="flex items-center gap-1 bg-[#141C22] p-1 rounded-xl border border-[#1D2A32] text-xs self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveLayer("ndvi")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
              activeLayer === "ndvi"
                ? "bg-[#0B3D2C] text-white border border-[#196349] shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            NDVI Vegetation
          </button>
          <button
            onClick={() => setActiveLayer("moisture")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
              activeLayer === "moisture"
                ? "bg-[#0A334B] text-sky-200 border border-[#0F537B] shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Soil Moisture
          </button>
          <button
            onClick={() => setActiveLayer("prices")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
              activeLayer === "prices"
                ? "bg-[#3D2C0A] text-amber-200 border border-[#6B4E12] shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Spot Spreads
          </button>
          <button
            onClick={() => setActiveLayer("logistics")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
              activeLayer === "logistics"
                ? "bg-[#2D164B] text-purple-200 border border-[#522588] shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            AfCFTA Transit
          </button>
        </div>
      </div>

      {/* Primary Geospatial & Signal Display Screen */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-[#070B0E] overflow-hidden flex items-center justify-center">
        {/* Subtle Cartesian Telemetry Grid Background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#1D2A32 1px, transparent 1px), linear-gradient(to right, #142028 1px, transparent 1px), linear-gradient(to bottom, #142028 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Real-Time Telemetry Scan Line */}
        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent animate-telemetry-scan pointer-events-none z-10" />

        {/* Orbit Reticle & Crosshair HUD Elements */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 text-[10px] font-mono text-slate-400 bg-[#0E151A]/85 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-[#1D2A32]">
          <div className="text-emerald-400 font-bold flex items-center gap-1">
            <Satellite className="w-3 h-3" />
            <span>GEO-RADAR TARGETING</span>
          </div>
          <div>SWEEP FREQ: 2.45 GHz</div>
          <div>INSPECTION: 54-STATE MESH</div>
        </div>

        <div className="absolute top-3 right-3 z-10 text-[10px] font-mono text-slate-400 bg-[#0E151A]/85 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-[#1D2A32] text-right">
          <div className="text-white font-bold">{selectedHub.coords.lat}</div>
          <div className="text-slate-400">{selectedHub.coords.lon}</div>
        </div>

        {/* Interactive Geospatial Continental SVG Map */}
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(16,185,129,0.15)] relative z-0"
        >
          <defs>
            <radialGradient id="radarSweepGradPro" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={layerColor} stopOpacity="0.35" />
              <stop offset="65%" stopColor={layerColor} stopOpacity="0.08" />
              <stop offset="100%" stopColor={layerColor} stopOpacity="0" />
            </radialGradient>
            <filter id="telemetryGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Radar Distance Range Circles */}
          <circle cx="250" cy="250" r="70" fill="none" stroke="#14242A" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="250" cy="250" r="140" fill="none" stroke="#14242A" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="250" cy="250" r="210" fill="none" stroke="#14242A" strokeWidth="1" strokeDasharray="5 5" opacity="0.6" />
          <line x1="40" y1="250" x2="460" y2="250" stroke="#14242A" strokeWidth="0.75" strokeDasharray="4 4" />
          <line x1="250" y1="40" x2="250" y2="460" stroke="#14242A" strokeWidth="0.75" strokeDasharray="4 4" />

          {/* Rotating Radar Sweep Cone */}
          <g className="animate-radar-sweep" style={{ transformOrigin: "250px 250px" }}>
            <path
              d="M 250 250 L 450 250 A 200 200 0 0 1 250 450 Z"
              fill="url(#radarSweepGradPro)"
              opacity="0.3"
            />
            <line x1="250" y1="250" x2="450" y2="250" stroke={layerColor} strokeWidth="1.5" opacity="0.8" />
          </g>

          {/* Precise African Continental Silhouette */}
          <path
            d="M 230 40 
               Q 290 35 340 70 
               Q 380 110 390 160 
               Q 370 210 350 250 
               Q 330 300 290 360 
               Q 270 420 250 440 
               Q 240 430 220 380 
               Q 190 330 180 270 
               Q 130 250 100 220 
               Q 80 180 120 140 
               Q 150 110 180 80 
               Z"
            fill="#0F181E"
            stroke="#1B2B34"
            strokeWidth="2"
          />

          {/* Active Agricultural Corridors & Rail Lines with animated signal dashes */}
          {/* Lobito Atlantic Rail Corridor (LAR) */}
          <path
            d="M 275 310 Q 240 300 205 295"
            stroke="#10B981"
            strokeWidth="3"
            strokeDasharray="6 3"
            fill="none"
            className="animate-corridor-flow"
          />
          {/* Southern Africa Grain Axis: Free State -> Zambia */}
          <path
            d="M 260 390 Q 275 350 275 310"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeDasharray="6 4"
            fill="none"
            className="animate-corridor-flow"
          />
          {/* East Africa Northern Corridor: Kenya -> Ethiopia */}
          <path
            d="M 330 240 Q 335 215 340 190"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeDasharray="6 4"
            fill="none"
            className="animate-corridor-flow"
          />
          {/* West Africa Grain & Cocoa Axis: San Pedro -> Kano */}
          <path
            d="M 130 225 Q 160 215 190 210"
            stroke="#A855F7"
            strokeWidth="2"
            strokeDasharray="6 4"
            fill="none"
            className="animate-corridor-flow"
          />
          {/* Nile Delta to Horn Corridor */}
          <path
            d="M 290 70 Q 320 130 340 190"
            stroke="#38BDF8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="none"
            className="opacity-70 animate-corridor-flow"
          />

          {/* Interactive Agricultural Mesh Nodes */}
          {TELEMETRY_HUBS.map((hub) => {
            const isSelected = selectedHubId === hub.id;
            return (
              <g
                key={hub.id}
                className="cursor-pointer transition-all group"
                onClick={() => setSelectedHubId(hub.id)}
              >
                {/* Active Ping Beacon Ring when selected */}
                {isSelected && (
                  <>
                    <circle
                      cx={hub.coords.x}
                      cy={hub.coords.y}
                      r="24"
                      fill="none"
                      stroke={layerColor}
                      strokeWidth="1.5"
                      className="animate-ping opacity-60"
                    />
                    <circle
                      cx={hub.coords.x}
                      cy={hub.coords.y}
                      r="18"
                      fill="none"
                      stroke={layerColor}
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  </>
                )}

                {/* Outer Reticle Ring */}
                <circle
                  cx={hub.coords.x}
                  cy={hub.coords.y}
                  r={isSelected ? "11" : "7"}
                  fill="#0B1317"
                  stroke={layerColor}
                  strokeWidth={isSelected ? "2.5" : "1.5"}
                />

                {/* Solid Core Dot */}
                <circle
                  cx={hub.coords.x}
                  cy={hub.coords.y}
                  r={isSelected ? "5" : "3.5"}
                  fill={layerColor}
                  className={isSelected ? "animate-pulse" : ""}
                />

                {/* Node Text Label with backdrop rect for pristine readability */}
                <text
                  x={hub.coords.x + 12}
                  y={hub.coords.y + 4}
                  fontSize="9.5"
                  fontFamily="monospace"
                  fill={isSelected ? "#FFFFFF" : "#94A3B8"}
                  fontWeight={isSelected ? "bold" : "normal"}
                  className="select-none pointer-events-none"
                >
                  {hub.country.split(" ")[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* In-Situ Waveform Oscilloscope Graphic (Bottom Left overlay) */}
        <div className="absolute bottom-3 left-3 hidden md:flex items-center gap-2.5 bg-[#0A1014]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-[#1D2A32] text-[10px] font-mono z-10">
          <div className="text-slate-400">
            <div>SPECTRAL SIGNATURE</div>
            <div className="text-emerald-400 font-bold">NIR/RED RATIO: 4.82</div>
          </div>
          <svg width="70" height="24" className="overflow-visible stroke-emerald-400 fill-none stroke-[1.5]">
            <path
              d={`M 0 16 Q 15 ${8 + Math.sin(livePulse) * 4} 30 14 T 60 ${10 - Math.sin(livePulse) * 5} T 70 12`}
            />
          </svg>
        </div>
      </div>

      {/* Selected Hub Telemetric Telemetry Readout Deck */}
      <div className="p-4 sm:p-5 bg-[#0E151A] border-t border-[#18232A]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{selectedHub.name}</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#07261B] text-emerald-300 border border-[#14532D]">
                {selectedHub.region}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {selectedHub.coords.lat}, {selectedHub.coords.lon}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Primary: <strong className="text-white">{selectedHub.primaryCommodity}</strong> • Logistical Corridor: <span className="text-slate-200">{selectedHub.logisticsStatus}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
            <button
              onClick={() => {
                const c = AFRICAN_COUNTRIES.find((country) => country.name === selectedHub.country);
                if (c) setSelectedCountry(c);
                setCurrentView("dashboard");
              }}
              className="px-4 py-2 rounded-xl bg-[#14532D] hover:bg-[#0F3D22] text-[#FDFBF7] text-xs font-bold transition-all shadow-sm cursor-pointer border border-[#196349] flex items-center gap-1.5 min-h-[40px]"
              id="telemetry-open-hub-button"
            >
              <span>Inspect {selectedHub.country} Live Data</span>
              <span className="text-emerald-300">→</span>
            </button>
          </div>
        </div>

        {/* Metric Telemetry Gauges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#18232A] text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-[#080D10] border border-[#19262F]">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">NDVI Index (Sentinel-2)</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-emerald-400">{selectedHub.ndviScore}</span>
              <span className="text-[10px] text-emerald-300 font-sans">({selectedHub.ndviStatus})</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#080D10] border border-[#19262F]">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Soil Moisture (10-60cm)</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-sky-400">{selectedHub.soilMoisture}%</span>
              <span className="text-[10px] text-slate-400 font-sans">In-Situ Mesh</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#080D10] border border-[#19262F]">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pan-African Spot Price</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-amber-300">{selectedHub.spotPrice}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#080D10] border border-[#19262F]">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Connected IoT Nodes</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-white">{selectedHub.sensorNodesOnline}</span>
              <span className="text-[10px] text-emerald-400 font-sans">100% Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
