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
import { WebsiteFooter } from "../common/WebsiteFooter";
import { PremiumTelemetryVisual } from "./PremiumTelemetryVisual";
import { TrustedBySection } from "./TrustedBySection";
import droneHarvestBgImage from "../../assets/images/drone_farm_harvest_1789082466079.jpg";

export const LandingPage: React.FC = () => {
  const { setCurrentView, setIsOnboardingOpen } = useApp();

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
            className="px-4 py-2 rounded-xl bg-[#14532D] hover:bg-[#0F3D22] text-[#FDFBF7] text-xs font-bold transition-all shadow-sm cursor-pointer min-h-[40px]"
          >
            Launch OS
          </motion.button>
        </div>
      </header>

      {/* Global Real-Time Commodity & Telemetry Marquee */}
      <LiveMarketTicker />

      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 bg-[#050C09]">
        {/* Farm and Drone Harvest Background Image - Prominently Visible */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <img
            src={droneHarvestBgImage || "/images/drone-farm-harvest.jpg"}
            alt="African Farmers Harvesting Crops with Autonomous Agricultural Drones"
            className="w-full h-full object-cover object-center sm:object-[center_30%] opacity-85 sm:opacity-90 brightness-95 contrast-105 transition-opacity duration-700"
            referrerPolicy="no-referrer"
          />
          {/* Subtle directional scrim: darker on the left where text sits, transparent in the center and right to showcase the farm, harvesting farmers, and drones */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050E0B]/90 via-[#06120E]/65 to-[#050E0B]/30 lg:from-[#050E0B]/92 lg:via-[#06120E]/55 lg:to-transparent" />
          {/* Gentle top and bottom feathering for seamless transition */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080D10] via-transparent to-black/25" />
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content with Motion and High Contrast Backdrop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 space-y-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08130E]/85 backdrop-blur-md border border-[#14532D] text-[#22C55E] text-xs font-semibold shadow-md">
                <Globe2 className="w-3.5 h-3.5 text-[#F5B942]" />
                <span className="text-slate-100">Pan-African Agricultural Operating System • 54 Nations</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#FDFBF7] leading-[1.1] drop-shadow-md">
                Africa's Agriculture. <br />
                <span className="text-[#22C55E]">Powered by Intelligence.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-100 font-normal leading-relaxed max-w-xl drop-shadow-sm">
                A unified digital infrastructure connecting African farmers, markets, finance,
                logistics, and institutions—from farmgate intelligence to Pan-African market commerce.
              </p>

              {/* Action Buttons with Brand Balance CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsOnboardingOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-[#14532D] hover:bg-[#0F3D22] text-[#FDFBF7] font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer min-h-[44px] border border-[#1E6B3E]"
                  id="hero-get-started-button"
                >
                  <span>Get Started (Onboard in 60s)</span>
                  <ArrowRight className="w-4 h-4 text-[#F5B942]" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentView("dashboard")}
                  className="px-6 py-3.5 rounded-xl bg-[#F5B942] hover:bg-[#E5A832] text-[#1A1105] font-extrabold text-sm shadow-md transition-colors flex items-center gap-2 cursor-pointer min-h-[44px]"
                  id="hero-explore-dashboard-button"
                >
                  <Satellite className="w-4 h-4 text-[#1A1105]" />
                  <span>Explore Farmer Dashboard</span>
                </motion.button>
              </div>

              {/* Highlights & Positioning */}
              <div className="grid grid-cols-3 gap-3 pt-6">
                <div className="bg-[#0A1410]/80 backdrop-blur-md border border-[#173827]/50 p-3 rounded-xl shadow-md">
                  <div className="font-extrabold text-white text-lg sm:text-xl font-mono">7 Pillars</div>
                  <div className="text-xs text-slate-300 font-medium">Farm to Export OS</div>
                </div>
                <div className="bg-[#0A1410]/80 backdrop-blur-md border border-[#173827]/50 p-3 rounded-xl shadow-md">
                  <div className="font-extrabold text-white text-lg sm:text-xl font-mono">54 Nations</div>
                  <div className="text-xs text-slate-300 font-medium">AfCFTA Corridors</div>
                </div>
                <div className="bg-[#0A1410]/80 backdrop-blur-md border border-[#173827]/50 p-3 rounded-xl shadow-md">
                  <div className="font-extrabold text-white text-lg sm:text-xl font-mono">&lt;8h Advice</div>
                  <div className="text-xs text-slate-300 font-medium">Real-Time Copilot</div>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Visualization: High-Precision Continental Telemetry Visual Deck */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <PremiumTelemetryVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY LEADING AGRICULTURAL ENTERPRISES ACROSS AFRICA */}
      <TrustedBySection />

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
                className="px-6 py-3 rounded-xl bg-[#14532D] hover:bg-[#0F3D22] text-[#FDFBF7] font-bold text-xs transition-all shadow-md cursor-pointer inline-flex items-center gap-2 min-h-[42px]"
              >
                <span>Launch Your Customized OS</span>
                <ChevronRight className="w-4 h-4 text-[#F5B942]" />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Website Footer */}
      <WebsiteFooter />
    </div>
  );
};
