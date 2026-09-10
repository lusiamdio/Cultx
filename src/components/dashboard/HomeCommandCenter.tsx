import React, { useState } from "react";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Sprout,
  ShoppingBag,
  CloudSunRain,
  Truck,
  Coins,
  Globe2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users2,
  Radio,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Mic,
  Satellite,
  Compass,
  CheckCircle2,
  Search,
  Droplets,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const HomeCommandCenter: React.FC = () => {
  const {
    setCurrentView,
    selectedCountry,
    setSelectedCountry,
    setIsCopilotOpen,
    setIsVoiceModalOpen,
    commodityPrices,
    notifications,
    farms,
  } = useApp();

  const [activeMarketTab, setActiveMarketTab] = useState<"all" | "grains" | "cash_crops" | "inputs">("all");

  // Macro Pan-African Ecosystem Telemetry
  const ecosystemKpis = [
    {
      id: "harvest_liquidity",
      title: "Continental Trade Liquidity",
      value: "$184.2M",
      subtext: "SAFEX, ZAMACE, ECX, GCX 30d turnover",
      change: "+8.4%",
      isPositive: true,
      icon: Coins,
      accent: "text-[#F5B942]",
      badgeBg: "bg-[#2A180E] text-[#F5B942] border-[#78350F]",
    },
    {
      id: "active_producers",
      title: "Verified Producers in Network",
      value: "38,450",
      subtext: "Smallholder & commercial farm twins",
      change: "+1,240 this month",
      isPositive: true,
      icon: Users2,
      accent: "text-[#22C55E]",
      badgeBg: "bg-[#07261B] text-[#22C55E] border-[#14532D]",
    },
    {
      id: "silo_reserves",
      title: "Regional Silo & Silo Reserves",
      value: "78.4%",
      subtext: "524,000 MT stored in 18 hubs",
      change: "Safe Buffer",
      isPositive: true,
      icon: Truck,
      accent: "text-cyan-400",
      badgeBg: "bg-[#0A2228] text-cyan-300 border-[#10434F]",
    },
    {
      id: "climate_alerts",
      title: "Active Regional Climate Threats",
      value: "2 Active",
      subtext: "Limpopo basin & Sahel corridor watch",
      change: "Hydrological Monitor",
      isPositive: false,
      icon: AlertTriangle,
      accent: "text-amber-400",
      badgeBg: "bg-[#2A180E] text-[#F5B942] border-[#78350F]",
    },
  ];

  // The 6 Core Agricultural Ecosystem Portals
  const ecosystemPortals = [
    {
      id: "farms",
      title: "Farmers Hub & Field Operations",
      subtitle: "Micro-Field Agronomy",
      description: "Manage farm twins, field NDVI polygons, in-situ soil moisture sensors, and dispatch Crop Doctor leaf diagnostics.",
      icon: Sprout,
      metrics: "38,450 Farmers • 142k Hectares",
      actionText: "Open Farmers Hub",
      viewTarget: "farms",
      themeColor: "from-[#0B3D2C] to-[#07261B]",
      borderHover: "hover:border-[#22C55E]/60",
      iconColor: "text-[#22C55E]",
      badgeText: "3 Active Farms",
    },
    {
      id: "marketplace",
      title: "Pan-African Commodity Exchange",
      subtitle: "Wholesale & Spot Pricing",
      description: "Trade physical grains, forward off-take contracts, and inspect Grade 1 export quality across 54 wholesale markets.",
      icon: ShoppingBag,
      metrics: "54 Markets • $3.4k/t Cocoa Peak",
      actionText: "Browse Marketplace",
      viewTarget: "marketplace",
      themeColor: "from-[#1D2513] to-[#10171B]",
      borderHover: "hover:border-[#F5B942]/60",
      iconColor: "text-[#F5B942]",
      badgeText: "Live Order Book",
    },
    {
      id: "precision_ag",
      title: "Satellite Sentinel & Climate Intel",
      subtitle: "Orbital Earth Observation",
      description: "10m Sentinel-2 multispectral vegetation heatmaps, 72-hour precipitation radar, and micro-climate frost alerts.",
      icon: Satellite,
      metrics: "Pass: 14 mins ago • 0.77 Mean NDVI",
      actionText: "Launch Spectral Intel",
      viewTarget: "climate",
      themeColor: "from-[#0D212B] to-[#10171B]",
      borderHover: "hover:border-cyan-500/60",
      iconColor: "text-cyan-400",
      badgeText: "Cloud-Free Radar",
    },
    {
      id: "logistics",
      title: "Agri-Logistics & Silo Corridors",
      subtitle: "Intermodal Freight & Cold Chain",
      description: "Track dry bulk trains along the Lobito Atlantic Corridor, Reefer trucks to Durban, and terminal grain silos.",
      icon: Truck,
      metrics: "Lobito Rail Active • 18 Silos",
      actionText: "Inspect Corridors",
      viewTarget: "logistics",
      themeColor: "from-[#1E1929] to-[#10171B]",
      borderHover: "hover:border-purple-500/60",
      iconColor: "text-purple-400",
      badgeText: "4 Transits Moving",
    },
    {
      id: "finance",
      title: "Agri-Finance, Credit & Escrow",
      subtitle: "Smallholder Capital & Insurance",
      description: "Pre-approved seasonal input credit lines, automated grain warehouse receipts, and parametric rainfall drought payouts.",
      icon: Coins,
      metrics: "Tier 1 Prime • $42M Available",
      actionText: "Access Financing",
      viewTarget: "finance",
      themeColor: "from-[#241A12] to-[#10171B]",
      borderHover: "hover:border-[#F5B942]/60",
      iconColor: "text-[#F5B942]",
      badgeText: "Prime Approved",
    },
    {
      id: "trade",
      title: "AfCFTA Trade & Food Security",
      subtitle: "Cross-Border Phytosanitary",
      description: "Verify digital rules of origin, monitor national strategic food reserves, and ensure Codex Alimentarius MRL compliance.",
      icon: Globe2,
      metrics: "54 Nations • Codex Standards",
      actionText: "View Trade & Policy",
      viewTarget: "trade",
      themeColor: "from-[#14261F] to-[#10171B]",
      borderHover: "hover:border-[#22C55E]/60",
      iconColor: "text-[#22C55E]",
      badgeText: "AfCFTA Tariff-Free",
    },
  ];

  // Pan-African Market Data
  const panAfricanCommodities = [
    {
      name: "White Maize (ZMS 606)",
      category: "Grains",
      exchange: "SAFEX / ZAMACE",
      priceUSD: 284,
      localPrice: "R4,970/t",
      change24h: "+2.4%",
      isPositive: true,
      volume: "18,400 MT",
      trend: "Rising seasonal demand for milling",
      quality: "Grade 1 (Export)",
    },
    {
      name: "Soybeans (Oilseed Hybrid)",
      category: "Grains",
      exchange: "SAFEX Grain Division",
      priceUSD: 465,
      localPrice: "R8,135/t",
      change24h: "+1.8%",
      isPositive: true,
      volume: "12,200 MT",
      trend: "Crush plants competing for stock",
      quality: "Grade 1 (Protein 38%)",
    },
    {
      name: "Specialty Arabica (SL28 / AA)",
      category: "Cash Crops",
      exchange: "Nairobi Coffee Exchange / ECX",
      priceUSD: 4650,
      localPrice: "$4.65/kg",
      change24h: "+3.9%",
      isPositive: true,
      volume: "3,800 MT",
      trend: "European specialty roaster contracts",
      quality: "Single Origin Highland",
    },
    {
      name: "Raw Cocoa Beans (Grade 1)",
      category: "Cash Crops",
      exchange: "Abidjan & San Pedro Terminal",
      priceUSD: 7800,
      localPrice: "CFA 4,750/kg",
      change24h: "+5.1%",
      isPositive: true,
      volume: "24,500 MT",
      trend: "Global deficit driving spot premiums",
      quality: "Certified Fair Trade & RainForest",
    },
    {
      name: "NPK 10-20-10 Basal Compound",
      category: "Inputs",
      exchange: "OCP / Lobito Fertilizer Corridor",
      priceUSD: 540,
      localPrice: "$540/MT",
      change24h: "-1.2%",
      isPositive: false,
      volume: "9,600 MT",
      trend: "Pre-planting bulk shipments landing",
      quality: "Granular Ammoniacal",
    },
    {
      name: "Raw Cashew Nuts (In-Shell)",
      category: "Cash Crops",
      exchange: "Ghana GCX / Tanzania CBT",
      priceUSD: 1420,
      localPrice: "$1.42/kg",
      change24h: "+0.7%",
      isPositive: true,
      volume: "8,100 MT",
      trend: "Direct export container bookings",
      quality: "KOR 48+ lbs",
    },
  ];

  const filteredCommodities =
    activeMarketTab === "all"
      ? panAfricanCommodities
      : activeMarketTab === "grains"
      ? panAfricanCommodities.filter((c) => c.category === "Grains")
      : activeMarketTab === "cash_crops"
      ? panAfricanCommodities.filter((c) => c.category === "Cash Crops")
      : panAfricanCommodities.filter((c) => c.category === "Inputs");

  // Regional Strategic Alerts Feed
  const strategicAlerts = [
    {
      id: "alert-1",
      corridor: "East African Rift Valley",
      title: "Precipitation Surge (+35% early rains)",
      advice: "Outgrowers in Nakuru & Eldoret advised to accelerate basal fertilizer distribution before soil saturation.",
      time: "22 mins ago",
      severity: "opportunity",
    },
    {
      id: "alert-2",
      corridor: "Southern Africa Rail Corridor",
      title: "Lobito Rail Express (LAR-8842) Confirmed",
      advice: "240 MT bulk fertilizer train cleared customs at Luau border crossing. Delivery on schedule.",
      time: "1 hour ago",
      severity: "info",
    },
    {
      id: "alert-3",
      corridor: "West African Grain Vault",
      title: "Cassava & Sorghum Spot Liquidity Tightening",
      advice: "Dawanau market prices rose +4.1% following increased processing demand from regional breweries.",
      time: "3 hours ago",
      severity: "warning",
    },
  ];

  return (
    <div className="space-y-6">
      {/* SECTION 1: Pan-African Macro Command Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-gradient-to-r from-[#10171B] via-[#0D1814] to-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-lg relative overflow-hidden"
      >
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14532D] text-[#FDFBF7] text-xs font-bold shadow-xs">
                <Globe2 className="w-3.5 h-3.5 text-[#F5B942]" />
                Pan-African Command Center
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-[#07261B] px-2.5 py-1 rounded-lg border border-[#14532D] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                54 Nations Connected • Sentinel-2 Synced
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFBF7] tracking-tight">
              African Agricultural Operating System
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time continental intelligence unifying farmgate production, wholesale commodity exchanges,
              intermodal freight corridors, and AfCFTA cross-border food security.
            </p>
          </div>

          {/* Header Action Launcher */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setCurrentView("farms")}
              className="px-4 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#0F3D22] text-[#FDFBF7] text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-md min-h-[42px]"
              title="Switch to micro-farm operations"
              id="home-open-farmers-hub-btn"
            >
              <Sprout className="w-4 h-4 text-[#F5B942]" />
              <span>Enter Farmers Hub</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#F5B942]" />
            </button>

            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-[#162228] hover:bg-[#1C2C34] text-slate-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer border border-[#1D2A32] flex items-center gap-2 min-h-[42px]"
              title="Voice advisory in 9+ African languages"
              id="home-voice-assistant-btn"
            >
              <Mic className="w-4 h-4 text-[#F5B942]" />
              <span className="hidden sm:inline">Voice Assistant</span>
            </button>

            <button
              onClick={() => setIsCopilotOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-[#2A180E] hover:bg-[#3D2314] text-[#F5B942] text-xs font-bold transition-colors cursor-pointer border border-[#78350F] flex items-center gap-2 min-h-[42px]"
              title="Ask AI Copilot regarding Pan-African trade"
              id="home-copilot-btn"
            >
              <Sparkles className="w-4 h-4 text-[#F5B942]" />
              <span className="hidden sm:inline">Copilot</span>
            </button>
          </div>
        </div>

        {/* Selected Territory Mini Ribbon */}
        <div className="mt-5 pt-4 border-t border-[#1D2A32] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Current Territory:</span>
            <span className="font-bold text-white flex items-center gap-1.5">
              <span>{selectedCountry.flag}</span>
              <span>{selectedCountry.name}</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="font-mono text-slate-300">
              Currency: {selectedCountry.currency} ({selectedCountry.currencySymbol})
            </span>
            <span className="text-slate-500 hidden md:inline">•</span>
            <span className="text-slate-400 hidden md:inline">
              Rate: $1 USD = {selectedCountry.exchangeRateToUSD} {selectedCountry.currency}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">Primary Crops:</span>
            <div className="flex items-center gap-1.5">
              {selectedCountry.primaryCrops.slice(0, 3).map((crop) => (
                <span
                  key={crop}
                  className="px-2 py-0.5 rounded-md bg-[#162228] text-emerald-300 font-medium text-[11px] border border-[#1D2A32]"
                >
                  {crop}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* SECTION 2: 4 Continental Macro KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {ecosystemKpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.id}
              whileHover={{ y: -2 }}
              className="bg-[#10171B] rounded-2xl p-4 sm:p-5 border border-[#1D2A32] shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {kpi.title}
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#162228] flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${kpi.accent}`} />
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                {kpi.value}
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="text-slate-400 truncate max-w-[170px]">{kpi.subtext}</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border font-mono ${kpi.badgeBg}`}>
                  {kpi.change}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* SECTION 3: The 6 Core Agricultural Portals (Interactive Bento Grid) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#22C55E]" />
              <span>Core Ecosystem Portals</span>
            </h2>
            <p className="text-xs text-slate-400">
              Direct entry points to on-farm operations, commodity trading, satellite remote sensing, logistics, and finance.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">6 Operational Hubs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ecosystemPortals.map((portal) => {
            const Icon = portal.icon;
            const isFarms = portal.id === "farms";
            return (
              <motion.div
                key={portal.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                onClick={() => setCurrentView(portal.viewTarget)}
                className={`bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] ${portal.borderHover} transition-all cursor-pointer shadow-sm flex flex-col justify-between group relative overflow-hidden`}
              >
                {/* Visual accent background */}
                <div
                  className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${portal.themeColor} opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity pointer-events-none`}
                />

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#162228] border border-[#1D2A32] flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${portal.iconColor}`} />
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isFarms
                          ? "bg-[#07261B] text-[#22C55E] border-[#14532D]"
                          : "bg-[#162228] text-slate-300 border-[#1D2A32]"
                      }`}
                    >
                      {portal.badgeText}
                    </span>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {portal.subtitle}
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mt-0.5">
                      {portal.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1 line-clamp-2">
                      {portal.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-[#1D2A32] flex items-center justify-between text-xs relative z-10">
                  <span className="font-mono text-[11px] text-slate-400">{portal.metrics}</span>
                  <span className="font-bold text-[#FDFBF7] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>{portal.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F5B942]" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Live Pan-African Commodity Exchange Board */}
      <div className="bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1D2A32]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#F5B942]" />
                <span>Pan-African Real-Time Commodity Exchange Board</span>
              </h3>
              <span className="text-[10px] font-mono font-bold text-emerald-300 bg-[#07261B] px-2 py-0.5 rounded-full border border-[#14532D]">
                54 Commodity Hubs
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Wholesale grain and export cash crop quotations across major African commodity exchanges.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#0B1013] p-1 rounded-xl border border-[#1D2A32] self-start sm:self-auto">
            <button
              onClick={() => setActiveMarketTab("all")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeMarketTab === "all"
                  ? "bg-[#14532D] text-[#FDFBF7] font-bold shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Commodities
            </button>
            <button
              onClick={() => setActiveMarketTab("grains")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeMarketTab === "grains"
                  ? "bg-[#14532D] text-[#FDFBF7] font-bold shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Grains & Oilseeds
            </button>
            <button
              onClick={() => setActiveMarketTab("cash_crops")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeMarketTab === "cash_crops"
                  ? "bg-[#14532D] text-[#FDFBF7] font-bold shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Export Cash Crops
            </button>
            <button
              onClick={() => setActiveMarketTab("inputs")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeMarketTab === "inputs"
                  ? "bg-[#14532D] text-[#FDFBF7] font-bold shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Fertilizer Inputs
            </button>
          </div>
        </div>

        {/* Commodity Quotation Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1D2A32] text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-bold">Commodity & Grade</th>
                <th className="pb-3 font-bold">Exchange Floor</th>
                <th className="pb-3 font-bold">Spot Price (USD)</th>
                <th className="pb-3 font-bold">Local Currency</th>
                <th className="pb-3 font-bold">24h Change</th>
                <th className="pb-3 font-bold">24h Traded Vol</th>
                <th className="pb-3 font-bold text-right">Market Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2A32]">
              {filteredCommodities.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-[#162228]/80 transition-colors"
                >
                  <td className="py-3.5">
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{item.name}</span>
                        <span className="text-[10px] font-normal text-slate-400">({item.category})</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{item.quality}</div>
                    </div>
                  </td>

                  <td className="py-3.5 font-mono text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-[#162228] border border-[#1D2A32] text-[11px]">
                      {item.exchange}
                    </span>
                  </td>

                  <td className="py-3.5 font-mono font-bold text-white text-sm">
                    ${item.priceUSD.toLocaleString()} / MT
                  </td>

                  <td className="py-3.5 font-mono text-slate-300">
                    {item.localPrice}
                  </td>

                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 font-mono font-bold text-xs ${
                        item.isPositive ? "text-[#22C55E]" : "text-red-400"
                      }`}
                    >
                      {item.isPositive ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      <span>{item.change24h}</span>
                    </span>
                  </td>

                  <td className="py-3.5 font-mono text-slate-400">
                    {item.volume}
                  </td>

                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => setCurrentView("marketplace")}
                      className="px-3 py-1.5 rounded-xl bg-[#14532D] hover:bg-[#0F3D22] text-[#FDFBF7] text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Trade</span>
                      <ArrowRight className="w-3 h-3 text-[#F5B942]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: Continental Satellite Radar & Strategic Advisory Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Continental Weather & Hydrological Radar */}
        <div className="lg:col-span-6 bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1D2A32]">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CloudSunRain className="w-4 h-4 text-cyan-400" />
                <span>Pan-African Hydrological & Radar Telemetry</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Orbital precipitation forecasts for major agricultural river basins.
              </p>
            </div>
            <button
              onClick={() => setCurrentView("climate")}
              className="text-xs font-bold text-[#22C55E] hover:underline flex items-center gap-1"
            >
              <span>Climate Hub</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32] space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                East African Rift (Kenya / Uganda)
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                <span>38mm Expected (72h)</span>
              </div>
              <p className="text-[11px] text-emerald-300">Optimal soil moisture for planting</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32] space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Limpopo Basin (South Africa / Zim)
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#F5B942]" />
                <span>Low Rainfall (4mm)</span>
              </div>
              <p className="text-[11px] text-amber-300">Irrigation schedules activated</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32] space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Guinea Savanna Belt (Nigeria / Ghana)
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                <span>52mm Humid Surge</span>
              </div>
              <p className="text-[11px] text-emerald-300">Sorghum vegetative peak</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32] space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Zambezi River Basin (Zambia / Moz)
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Moderate (22mm)</span>
              </div>
              <p className="text-[11px] text-slate-300">White maize silking phase</p>
            </div>
          </div>
        </div>

        {/* Live Strategic Advisories Feed */}
        <div className="lg:col-span-6 bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1D2A32]">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#22C55E] animate-pulse" />
                <span>Strategic Ecosystem Advisories & Corridors</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                AI synthesized recommendations for aggregators, farmers, and policymakers.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#F5B942] bg-[#2A180E] px-2 py-0.5 rounded border border-[#78350F]">
              Live Feed
            </span>
          </div>

          <div className="space-y-3">
            {strategicAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32] space-y-1 hover:border-[#14532D] transition-colors"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#F5B942] uppercase tracking-wider">
                    {alert.corridor}
                  </span>
                  <span className="text-slate-400 font-mono text-[10px] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.time}
                  </span>
                </div>
                <div className="text-xs font-bold text-white">{alert.title}</div>
                <p className="text-xs text-slate-300 leading-relaxed">{alert.advice}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
