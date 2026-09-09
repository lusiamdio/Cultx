import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  CloudRain,
  Users,
  Building2,
  ChevronRight,
  Globe2,
  Satellite,
  Compass,
  Cpu,
  Layers,
  BarChart3,
  MapPin,
  Truck,
  Coins,
  Radio,
  Activity,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AFRICAN_COUNTRIES } from "../../data/countries";
import { LiveMarketTicker } from "../common/LiveMarketTicker";

export const LandingPage: React.FC = () => {
  const { setCurrentView, setIsOnboardingOpen, setSelectedCountry } = useApp();
  const [activeMapLayer, setActiveMapLayer] = useState<"production" | "weather" | "prices" | "logistics">("production");
  const [selectedHub, setSelectedHub] = useState<string>("South Africa");

  const challengeStats = [
    {
      title: "FOOD SECURITY",
      metric: "33M+",
      subtitle: "Smallholder Farmers",
      description: "Produce over 70% of the continent's caloric supply yet face extreme structural fragmentation.",
      color: "from-emerald-500 to-emerald-700",
      icon: Users,
    },
    {
      title: "CLIMATE UNCERTAINTY",
      metric: "42%",
      subtitle: "Precipitation Variance",
      description: "Severe shifts in seasonal rainfall require precision hydrological forecasts and satellite NDVI tracking.",
      color: "from-blue-500 to-blue-700",
      icon: CloudRain,
    },
    {
      title: "EMPLOYMENT ENGINE",
      metric: "52%",
      subtitle: "African Workforce",
      description: "Agriculture constitutes the primary livelihood driver across rural and peri-urban demographics.",
      color: "from-amber-500 to-amber-700",
      icon: TrendingUp,
    },
    {
      title: "FRAGMENTED VALUE CHAINS",
      metric: "$45B",
      subtitle: "Annual Post-Harvest Loss",
      description: "Arbitrage middlemen and uncoordinated transport deplete farmgate revenues by up to 38%.",
      color: "from-purple-500 to-purple-700",
      icon: Building2,
    },
  ];

  const mapHubs = [
    { name: "South Africa", x: 260, y: 390, crop: "Maize & Citrus", price: "R5,420/t", weather: "Sunny (24°C)", freight: "14 Trucks Active", status: "SAFEX Grain Hub" },
    { name: "Kenya", x: 330, y: 240, crop: "Tea & Hass Avocado", price: "$312/t", weather: "Showers (21°C)", freight: "Reefer Port Transit", status: "East African Corridor" },
    { name: "Nigeria", x: 190, y: 210, crop: "Cassava & Sorghum", price: "₦480k/t", weather: "Humid (29°C)", freight: "Dawanau Silo Rail", status: "West African Grain Vault" },
    { name: "Côte d'Ivoire", x: 130, y: 225, crop: "Raw Cocoa Beans", price: "$7,800/t", weather: "Tropical (27°C)", freight: "San Pedro Terminal", status: "Global Cocoa Reserve" },
    { name: "Ethiopia", x: 340, y: 190, crop: "Specialty Arabica", price: "$4,650/t", weather: "Highland Cool (19°C)", freight: "ECX Logistics Hub", status: "Highland Agro Basin" },
    { name: "Ghana", x: 155, y: 220, crop: "Yellow Maize & Shea", price: "$341/t", weather: "Partly Cloudy (28°C)", freight: "GCX Silo Link", status: "Tema Port Gateway" },
    { name: "Zambia", x: 275, y: 310, crop: "White Maize (ZAMACE)", price: "$284/t", weather: "Moderate (23°C)", freight: "Beira Corridor Trucking", status: "Southern Grain Breadbasket" },
    { name: "Angola (Lobito)", x: 205, y: 295, crop: "Soybeans & Grain", price: "$310/t", weather: "Coastal Breeze (25°C)", freight: "Lobito Rail Express (LAR)", status: "Lobito Atlantic Gateway" },
    { name: "Egypt", x: 290, y: 70, crop: "Wheat & Dates", price: "E£12,400/t", weather: "Clear (31°C)", freight: "Alexandria Grain Silos", status: "Nile Irrigation Valley" },
  ];

  return (
    <div className="bg-[#0B1013] text-white min-h-screen">
      {/* Top Brand Navigation */}
      <header className="py-4 px-4 lg:px-8 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/cultx_logo.png"
            alt="CULTx"
            className="w-10 h-10 rounded-xl object-contain shadow-md"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-lg tracking-tight">CULTx</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#07261B] text-emerald-300 tracking-wider">
                PAN-AFRICA
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 leading-none">
              Agricultural Operating System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setCurrentView("dashboard")}
            className="px-4 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold transition-all shadow-sm cursor-pointer min-h-[40px]"
          >
            Launch OS
          </motion.button>
        </div>
      </header>

      {/* Global Real-Time Commodity & Telemetry Marquee */}
      <LiveMarketTicker />

      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-[#07261B] via-[#0B1013] to-[#0B1013]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content with Motion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#07261B] text-emerald-300 text-xs font-semibold shadow-xs">
                <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pan-African Agricultural Operating System • 54 Nations</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Africa's Agriculture. <br />
                <span className="text-emerald-300">Powered by Intelligence.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
                A unified digital infrastructure connecting African farmers, markets, finance,
                logistics, and institutions—from farmgate intelligence to Pan-African market commerce.
              </p>

              {/* Action Buttons with Micro-Interactions */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsOnboardingOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer min-h-[44px]"
                  id="hero-get-started-button"
                >
                  <span>Get Started (Onboard in 60s)</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentView("dashboard")}
                  className="px-6 py-3.5 rounded-xl bg-[#10171B] hover:bg-[#162228] text-white font-semibold text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer min-h-[44px]"
                  id="hero-explore-dashboard-button"
                >
                  <Satellite className="w-4 h-4 text-emerald-300" />
                  <span>Explore Farmer Dashboard</span>
                </motion.button>
              </div>

              {/* Highlights & Positioning */}
              <div className="grid grid-cols-3 gap-3 pt-6">
                <div className="bg-[#10171B]/60 p-3 rounded-xl">
                  <div className="font-extrabold text-white text-lg sm:text-xl font-mono">7 Pillars</div>
                  <div className="text-xs text-slate-400 font-medium">Farm to Export OS</div>
                </div>
                <div className="bg-[#10171B]/60 p-3 rounded-xl">
                  <div className="font-extrabold text-white text-lg sm:text-xl font-mono">54 Nations</div>
                  <div className="text-xs text-slate-400 font-medium">AfCFTA Corridors</div>
                </div>
                <div className="bg-[#10171B]/60 p-3 rounded-xl">
                  <div className="font-extrabold text-white text-lg sm:text-xl font-mono">&lt;8h Advice</div>
                  <div className="text-xs text-slate-400 font-medium">Real-Time Copilot</div>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Visualization: Interactive Pan-African SVG Map with Radar Sweep Motion Graphics */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <div className="bg-[#10171B] rounded-3xl p-5 shadow-2xl text-white relative overflow-hidden">
                {/* Map Layer Controls */}
                <div className="flex items-center justify-between gap-2 pb-4 mb-4 flex-wrap relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Live African Agri-Mesh Telemetry
                    </span>
                  </div>

                  <div className="flex gap-1 bg-[#162228] p-1 rounded-xl border border-[#1D2A32] text-[11px]">
                    <button
                      onClick={() => setActiveMapLayer("production")}
                      className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer transition-colors ${
                        activeMapLayer === "production" ? "bg-[#0B3D2C] text-white border border-[#196349]" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Crops
                    </button>
                    <button
                      onClick={() => setActiveMapLayer("weather")}
                      className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer transition-colors ${
                        activeMapLayer === "weather" ? "bg-[#0B3D2C] text-white border border-[#196349]" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Weather
                    </button>
                    <button
                      onClick={() => setActiveMapLayer("prices")}
                      className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer transition-colors ${
                        activeMapLayer === "prices" ? "bg-[#0B3D2C] text-white border border-[#196349]" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Prices
                    </button>
                    <button
                      onClick={() => setActiveMapLayer("logistics")}
                      className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer transition-colors ${
                        activeMapLayer === "logistics" ? "bg-[#0B3D2C] text-white border border-[#196349]" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Logistics
                    </button>
                  </div>
                </div>

                {/* SVG Vector Map of Africa with Interactive Geolocation Pins & Radar Sweeps */}
                <div className="relative w-full h-84 sm:h-96 bg-[#0B1013] rounded-2xl border border-[#1D2A32] overflow-hidden flex items-center justify-center">
                  {/* Telemetry Vertical Scan Line */}
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent animate-telemetry-scan pointer-events-none z-10" />

                  {/* Top-Left Satellite Status Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-[#10171B]/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-mono text-emerald-300 flex items-center gap-1.5 z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Sentinel-2 Pass: 28.4°E</span>
                  </div>

                  <svg
                    viewBox="0 0 500 500"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(11,61,44,0.4)]"
                  >
                    <defs>
                      <radialGradient id="radarSweepGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                        <stop offset="70%" stopColor="#10B981" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id="corridorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="50%" stopColor="#38BDF8" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                    </defs>

                    {/* Concentric Geospatial Radar Rings */}
                    <circle cx="250" cy="250" r="80" fill="none" stroke="#162A22" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="250" cy="250" r="150" fill="none" stroke="#162A22" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="250" cy="250" r="220" fill="none" stroke="#162A22" strokeWidth="1" strokeDasharray="5 5" opacity="0.6" />

                    {/* Rotating Radar Sweep Motion Graphic */}
                    <g className="animate-radar-sweep" style={{ transformOrigin: "250px 250px" }}>
                      <path
                        d="M 250 250 L 450 250 A 200 200 0 0 1 250 450 Z"
                        fill="url(#radarSweepGradient)"
                        opacity="0.25"
                      />
                      <line x1="250" y1="250" x2="450" y2="250" stroke="#10B981" strokeWidth="1.5" opacity="0.6" />
                    </g>
                    {/* Stylized African Continent Contour */}
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
                      fill="#162228"
                      stroke="#1D2A32"
                      strokeWidth="2"
                    />

                    {/* Trade Corridors connecting hubs with Animated Flow */}
                    <path
                      d="M 260 390 Q 280 340 330 240"
                      stroke="#10B981"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      fill="none"
                      className="opacity-85 animate-corridor-flow"
                    />
                    <path
                      d="M 330 240 Q 260 220 190 210"
                      stroke="#38BDF8"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      fill="none"
                      className="opacity-85 animate-corridor-flow"
                    />
                    <path
                      d="M 190 210 Q 160 215 130 225"
                      stroke="#F59E0B"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      fill="none"
                      className="opacity-85 animate-corridor-flow"
                    />
                    <path
                      d="M 290 70 Q 310 130 340 190"
                      stroke="#38BDF8"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      fill="none"
                      className="opacity-70 animate-corridor-flow"
                    />
                    {/* Lobito Atlantic Rail Corridor: Zambia/DRC to Port of Lobito, Angola */}
                    <path
                      d="M 275 310 Q 240 300 205 295"
                      stroke="#10B981"
                      strokeWidth="2.5"
                      strokeDasharray="6 3"
                      fill="none"
                      className="opacity-95 animate-corridor-flow"
                    />

                    {/* Nodes & Interactive Pulse Markers */}
                    {mapHubs.map((hub) => {
                      const isSelected = selectedHub === hub.name;
                      const markerColor =
                        activeMapLayer === "production"
                          ? "#10B981"
                          : activeMapLayer === "weather"
                          ? "#38BDF8"
                          : activeMapLayer === "prices"
                          ? "#F59E0B"
                          : "#A855F7";
                      return (
                        <g
                          key={hub.name}
                          className="cursor-pointer transition-transform hover:scale-125"
                          onClick={() => setSelectedHub(hub.name)}
                        >
                          {/* Animated Radar Pulse Ring when selected */}
                          {isSelected && (
                            <circle
                              cx={hub.x}
                              cy={hub.y}
                              r="22"
                              fill="none"
                              stroke={markerColor}
                              strokeWidth="1.5"
                              className="animate-ping"
                              opacity="0.6"
                            />
                          )}
                          <circle
                            cx={hub.x}
                            cy={hub.y}
                            r={isSelected ? "9" : "6"}
                            fill={markerColor}
                            className={isSelected ? "animate-pulse" : ""}
                          />
                          <circle
                            cx={hub.x}
                            cy={hub.y}
                            r={isSelected ? "18" : "12"}
                            fill="none"
                            stroke={markerColor}
                            strokeWidth="1"
                            opacity={isSelected ? "0.8" : "0.35"}
                          />
                          <text
                            x={hub.x + 10}
                            y={hub.y + 4}
                            fontSize="9"
                            fill="#E2E8F0"
                            fontWeight="600"
                            className="select-none"
                          >
                            {hub.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Dynamic Hub Intelligence Floating Card with Motion */}
                  {selectedHub && (
                    <motion.div
                      key={selectedHub}
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-3 left-3 right-3 bg-[#10171B]/95 backdrop-blur-md p-3 rounded-xl border border-[#1D2A32] shadow-lg text-xs flex items-center justify-between gap-3 z-20"
                    >
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                          <span>{selectedHub}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({mapHubs.find((h) => h.name === selectedHub)?.status})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300 mt-0.5 flex flex-wrap items-center gap-3">
                          <span>Crop: <strong className="text-white">{mapHubs.find((h) => h.name === selectedHub)?.crop}</strong></span>
                          <span>Price: <strong className="text-emerald-400">{mapHubs.find((h) => h.name === selectedHub)?.price}</strong></span>
                          <span>Weather: <strong className="text-slate-200">{mapHubs.find((h) => h.name === selectedHub)?.weather}</strong></span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const countryObj = AFRICAN_COUNTRIES.find((c) => c.name === selectedHub);
                          if (countryObj) setSelectedCountry(countryObj);
                          setCurrentView("dashboard");
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-[11px] shrink-0 cursor-pointer border border-[#196349] min-h-[36px]"
                      >
                        Enter Hub →
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE AGRICULTURAL CHALLENGE (4 MASSIVE STATS WITH MOTION) */}
      <section className="py-16 bg-[#0B1013] border-b border-[#1D2A32]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-[#07261B] px-2.5 py-1 rounded border border-[#14533C]">
              The Pan-African Challenge
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
              Transforming Structural Bottlenecks into Digital Value
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              African smallholders and commercial agro-enterprises lose billions annually to asymmetric information,
              fragmented transport, and absent credit histories.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {challengeStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="p-6 rounded-2xl bg-[#10171B] border border-[#1D2A32] hover:border-[#14533C] transition-all shadow-sm group cursor-default"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      {stat.title}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#162228] border border-[#1D2A32] flex items-center justify-center text-slate-300 group-hover:text-emerald-300 group-hover:scale-110 transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-4xl font-extrabold text-white font-mono tracking-tight group-hover:text-emerald-200 transition-colors">
                    {stat.metric}
                  </div>
                  <div className="text-xs font-bold text-emerald-300 mt-1">{stat.subtitle}</div>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">{stat.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: ONE AGRICULTURAL INTELLIGENCE LAYER WITH ANIMATED SIGNAL FLOWS */}
      <section className="py-16 bg-[#07261B]/60 text-white border-t border-[#14533C]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-[#07261B] px-2.5 py-1 rounded border border-[#14533C]">
              Operating System Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 text-white">
              One Unified Agricultural Intelligence Layer
            </h2>
            <p className="text-slate-300 text-sm mt-2">
              Instead of ten disconnected apps, CULTx synthesizes production telemetry, weather radar,
              alternative underwriting, and cross-border trade into a single operating system.
            </p>
          </div>

          {/* Clean Architectural Flow matching Blueprint Section 3 */}
          <div className="max-w-3xl mx-auto bg-[#10171B] p-8 rounded-3xl border border-[#1D2A32] shadow-2xl relative overflow-hidden">
            {/* Top: Engine with Pulse Ring */}
            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="px-6 py-3.5 rounded-2xl bg-[#0B3D2C] text-white font-extrabold text-sm shadow-lg flex items-center gap-2.5 border border-[#196349] relative"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <Cpu className="w-5 h-5 text-emerald-300" />
                <span>AGRICULTURAL INTELLIGENCE ENGINE</span>
              </motion.div>
            </div>

            {/* Vertical Connector with Pulse Motion */}
            <div className="relative w-0.5 h-8 bg-emerald-500/60 mx-auto my-1">
              <div className="absolute w-2 h-2 rounded-full bg-emerald-400 -left-[3px] animate-packet-pulse" />
            </div>

            {/* Middle Layer 1: Farm, Market, Climate */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <motion.div
                whileHover={{ y: -3 }}
                className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32] flex flex-col items-center hover:bg-[#1a2b33] transition-colors"
              >
                <Sprout className="w-5 h-5 text-emerald-400 mb-1" />
                <div className="font-bold text-xs text-white">FARM</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Sensors & Digital Twin</div>
              </motion.div>
              <motion.div
                whileHover={{ y: -3 }}
                className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32] flex flex-col items-center hover:bg-[#1a2b33] transition-colors"
              >
                <BarChart3 className="w-5 h-5 text-emerald-400 mb-1" />
                <div className="font-bold text-xs text-white">MARKET</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Spot Prices & Contracts</div>
              </motion.div>
              <motion.div
                whileHover={{ y: -3 }}
                className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32] flex flex-col items-center hover:bg-[#1a2b33] transition-colors"
              >
                <CloudRain className="w-5 h-5 text-emerald-400 mb-1" />
                <div className="font-bold text-xs text-white">CLIMATE</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Doppler Radar & Drought</div>
              </motion.div>
            </div>

            {/* Vertical Connectors with Pulses */}
            <div className="grid grid-cols-3 gap-3 my-1">
              <div className="relative w-0.5 h-6 bg-emerald-600/40 mx-auto">
                <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 -left-[2px] animate-packet-pulse" />
              </div>
              <div className="relative w-0.5 h-6 bg-emerald-600/40 mx-auto">
                <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 -left-[2px] animate-packet-pulse" />
              </div>
              <div className="relative w-0.5 h-6 bg-emerald-600/40 mx-auto">
                <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 -left-[2px] animate-packet-pulse" />
              </div>
            </div>

            {/* Lower Layer 2: Finance, Logistics, Trade */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <motion.div
                whileHover={{ y: -3 }}
                className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32] flex flex-col items-center hover:bg-[#1a2b33] transition-colors"
              >
                <Coins className="w-5 h-5 text-emerald-400 mb-1" />
                <div className="font-bold text-xs text-white">FINANCE</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Input & Crop Underwriting</div>
              </motion.div>
              <motion.div
                whileHover={{ y: -3 }}
                className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32] flex flex-col items-center hover:bg-[#1a2b33] transition-colors"
              >
                <Truck className="w-5 h-5 text-emerald-400 mb-1" />
                <div className="font-bold text-xs text-white">LOGISTICS</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Silos & Reefer Telemetry</div>
              </motion.div>
              <motion.div
                whileHover={{ y: -3 }}
                className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32] flex flex-col items-center hover:bg-[#1a2b33] transition-colors"
              >
                <Globe2 className="w-5 h-5 text-emerald-400 mb-1" />
                <div className="font-bold text-xs text-white">TRADE</div>
                <div className="text-[10px] text-slate-400 mt-0.5">AfCFTA & Compliance</div>
              </motion.div>
            </div>

            <div className="mt-8 pt-6 text-center">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsOnboardingOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs transition-all shadow-md cursor-pointer inline-flex items-center gap-2 min-h-[40px]"
              >
                <span>Launch Your Customized OS</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2.5">
          <img
            src="/cultx_logo.png"
            alt="CULTx"
            className="w-8 h-8 rounded-lg object-contain shadow-xs"
          />
          <div>
            <span className="font-extrabold text-sm text-white">CULTx</span>
            <span className="text-[11px] text-slate-400 block">Pan-African Agricultural Operating System</span>
          </div>
        </div>
        <div className="text-center sm:text-right">
          <p>© 2026 CULTx • Built for 54 African Nations</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Satellite NDVI • Spot Markets • Precision Climate • AfCFTA Logistics</p>
        </div>
      </footer>
    </div>
  );
};
