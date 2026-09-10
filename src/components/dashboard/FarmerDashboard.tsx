import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Sprout,
  Droplet,
  CloudRain,
  AlertTriangle,
  Bug,
  Sparkles,
  Camera,
  Coins,
  Truck,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Star,
  CheckCircle2,
  Calendar,
  Satellite,
  ChevronRight,
  Radio,
  Activity,
  Lock,
  FileText,
  Landmark,
  Globe2,
  Fingerprint,
  Unlock,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DocumentRepository } from "./DocumentRepository";
import { HarvestYieldPrediction } from "./HarvestYieldPrediction";
import { WorldFoodSecurityStandards } from "./WorldFoodSecurityStandards";

export const FarmerDashboard: React.FC = () => {
  const {
    currentFarm,
    setCurrentFarm,
    farms,
    recommendations,
    applyRecommendation,
    setCurrentView,
    setIsCropDoctorOpen,
    setIsCopilotOpen,
    isOffline,
    farmerDocuments,
    isSensitiveDataLocked,
    setIsBiometricModalOpen,
    toggleSensitiveDataLock,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"operations" | "yield_prediction" | "food_security" | "documents">("operations");

  const healthScore = currentFarm.overallHealthScore;
  const strokeDashoffset = 283 - (283 * healthScore) / 100;

  return (
    <div className="space-y-6">
      {/* Farmers Hub Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#10171B] p-4 sm:p-5 rounded-2xl border border-[#1D2A32] shadow-sm">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#14532D] text-[#FDFBF7] text-xs font-bold flex items-center gap-1.5 shadow-xs">
              <Sprout className="w-3.5 h-3.5 text-[#F5B942]" />
              <span>Farmers Hub & Operations</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-300 bg-[#07261B] px-2.5 py-0.5 rounded-lg border border-[#14532D]">
              Micro Plot-Level Telemetry
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#FDFBF7] tracking-tight">
            On-Farm Production & Agronomic Management
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Manage individual field parcel vegetative health, continuous soil moisture telemetry,
            daily agronomic task dispatches, and certified land passports.
          </p>
        </div>

        {/* Farm Portfolio Switcher */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Farm:
          </label>
          <select
            value={currentFarm.id}
            onChange={(e) => {
              const f = farms.find((farm) => farm.id === e.target.value);
              if (f) setCurrentFarm(f);
            }}
            className="px-3 py-2 rounded-xl bg-[#162228] text-white text-xs font-semibold border border-[#1D2A32] focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id} className="bg-[#162228] text-white">
                {f.name} ({f.country} • {f.totalHectares} ha)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Header Card: Farm Name, Location, Crop, Status, Trust Score */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#10171B] rounded-2xl p-4 sm:p-5 border border-[#1D2A32] shadow-md flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#14532D] border border-[#196349] text-white flex items-center justify-center shadow-sm shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent animate-pulse" />
            <Sprout className="w-6 h-6 sm:w-7 sm:h-7 relative z-10 text-[#F5B942]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                {currentFarm.name}
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#07261B] text-emerald-300 border border-[#14533C] text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Farm Twin
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1.5 flex flex-wrap items-center gap-2 sm:gap-3">
              <span>{currentFarm.region}, {currentFarm.country}</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="font-semibold text-slate-300">
                {currentFarm.primaryCrop} ({currentFarm.totalHectares} ha)
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-400 font-mono text-[11px]">Pass: {currentFarm.lastSatellitePass}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#19262F]">
          {/* Trust Score */}
          <div className="bg-[#162228] px-3.5 py-2 rounded-xl border border-[#1D2A32] text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Agri Trust Score
            </div>
            <div className="flex items-center gap-1 text-amber-400 justify-end mt-0.5">
              {[...Array(currentFarm.trustScore)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs font-mono font-bold text-white ml-1">5.0</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setCurrentView("farm_twin")}
            className="px-4 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#0F3D22] text-[#FDFBF7] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md min-h-[44px]"
          >
            <span>View Full Digital Twin</span>
            <ChevronRight className="w-4 h-4 text-[#F5B942]" />
          </motion.button>
        </div>
      </motion.div>

      {/* Dashboard View Mode Selector */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-[#10171B] p-2 rounded-2xl border border-[#1D2A32] shadow-xs">
        <button
          onClick={() => setActiveTab("operations")}
          className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "operations"
              ? "bg-[#14532D] text-[#FDFBF7] shadow-xs"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Activity className="w-4 h-4 text-[#22C55E]" />
          <span>Farm Operations</span>
        </button>

        <button
          onClick={() => setActiveTab("yield_prediction")}
          className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "yield_prediction"
              ? "bg-[#14532D] text-[#FDFBF7] shadow-xs"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <TrendingUp className="w-4 h-4 text-[#22C55E]" />
          <span>Yield Prediction</span>
          <span className="font-mono text-[10px] bg-[#07261B] text-emerald-300 px-2 py-0.5 rounded-full border border-[#14533C]">
            7.42 t/ha
          </span>
        </button>

        <button
          onClick={() => setActiveTab("food_security")}
          className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "food_security"
              ? "bg-[#14532D] text-[#FDFBF7] shadow-xs"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Globe2 className="w-4 h-4 text-[#22C55E]" />
          <span>World Food Security</span>
          <span className="font-mono text-[10px] bg-[#07261B] text-emerald-300 px-2 py-0.5 rounded-full border border-[#14533C]">
            Codex & FAO
          </span>
        </button>

        <button
          onClick={() => setActiveTab("documents")}
          className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "documents"
              ? "bg-[#14532D] text-[#FDFBF7] shadow-xs"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Lock className="w-4 h-4 text-[#22C55E]" />
          <span>Document Vault</span>
          <span className="font-mono text-[10px] bg-[#07261B] text-emerald-300 px-2 py-0.5 rounded-full border border-[#14533C]">
            {farmerDocuments.length}
          </span>
        </button>
      </div>

      {activeTab === "documents" ? (
        <DocumentRepository />
      ) : activeTab === "yield_prediction" ? (
        <HarvestYieldPrediction />
      ) : activeTab === "food_security" ? (
        <WorldFoodSecurityStandards />
      ) : (
        <>
          {/* Grid: Farm Health Circular Gauge + Agricultural Copilot Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* SECTION 1: Farm Health (Large Circular Indicator + Sub-Pillars) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="lg:col-span-5 bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-md flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-[#19262F] pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Aggregate Farm Health</span>
              </h3>
              <p className="text-[11px] text-slate-400">Autonomous Sentinel-2 & Ground IoT telemetry</p>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-300 bg-[#07261B] px-2.5 py-1 rounded-lg border border-[#14533C]">
              Optimal (Grade A)
            </span>
          </div>

          {/* Large Circular Gauge with Telemetry Sweeps */}
          <div className="flex items-center justify-center py-5">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Outer telemetry pulse ring */}
              <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-pulse" />

              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="healthGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                </defs>
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#19262F"
                  strokeWidth="7"
                />
                {/* Value Ring with Gradient */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="url(#healthGaugeGrad)"
                  strokeWidth="7"
                  strokeDasharray="283"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
                  {healthScore}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                  Farm Health
                </span>
              </div>
            </div>
          </div>

          {/* 5 Sub-Pillars: Soil, Crop Health, Water, Weather Risk, Pest Risk */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 border-t border-[#19262F] text-xs">
            <motion.div whileHover={{ y: -2 }} className="p-3 rounded-xl bg-[#162228] border border-[#1D2A32] transition-colors">
              <div className="text-[11px] text-slate-400 font-medium">Soil Health</div>
              <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                {currentFarm.soilHealth}%
              </div>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} className="p-3 rounded-xl bg-[#162228] border border-[#1D2A32] transition-colors">
              <div className="text-[11px] text-slate-400 font-medium">Crop Health</div>
              <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                {currentFarm.cropHealth}%
              </div>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} className="p-3 rounded-xl bg-[#162228] border border-[#1D2A32] transition-colors">
              <div className="text-[11px] text-slate-400 font-medium">Water Index</div>
              <div className="text-sm font-mono font-bold text-amber-400 mt-0.5">
                {currentFarm.waterIndex}%
              </div>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} className="p-3 rounded-xl bg-[#162228] border border-[#1D2A32] transition-colors">
              <div className="text-[11px] text-slate-400 font-medium">Weather Risk</div>
              <div className="text-sm font-mono font-bold text-blue-400 mt-0.5">
                {currentFarm.weatherRisk}%
              </div>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} className="p-3 rounded-xl bg-[#162228] border border-[#1D2A32] col-span-2 sm:col-span-2 transition-colors">
              <div className="text-[11px] text-slate-400 font-medium">Pest Resistance</div>
              <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                {currentFarm.pestRisk}% (Safe)
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* SECTION 2: Agricultural Copilot Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="lg:col-span-7 bg-[#07261B] rounded-2xl p-5 sm:p-6 border border-[#14533C] shadow-lg text-white flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#0F4A34]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0B3D2C] text-emerald-300 flex items-center justify-center border border-[#196349] relative">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1 right-1 animate-pulse" />
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-wide text-white">
                    Agricultural Advisory Copilot
                  </h3>
                  <p className="text-[11px] text-emerald-200/80">
                    Good morning James. 3 priority agronomic directives for today:
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsCopilotOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold border border-[#196349] transition-colors cursor-pointer min-h-[44px]"
              >
                Chat with Copilot
              </motion.button>
            </div>

            {/* The 3 Directives matching Blueprint */}
            <div className="space-y-2.5 mt-4">
              {recommendations.slice(0, 3).map((rec, idx) => (
                <motion.div
                  key={rec.id}
                  whileHover={{ scale: 1.01 }}
                  className={`p-3.5 rounded-xl border transition-all ${
                    rec.applied
                      ? "bg-[#0B1013]/60 border-[#19262F] opacity-60"
                      : rec.urgency === "urgent"
                      ? "bg-red-950/40 border-red-800/80"
                      : rec.urgency === "important"
                      ? "bg-amber-950/40 border-amber-700/80"
                      : "bg-[#0A3324] border-[#14533C]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-white">
                          {idx + 1}. {rec.title}
                        </span>
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                            rec.urgency === "urgent"
                              ? "bg-red-600 text-white"
                              : rec.urgency === "important"
                              ? "bg-amber-500 text-slate-900"
                              : "bg-emerald-400 text-slate-950"
                          }`}
                        >
                          {rec.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {rec.description}
                      </p>
                      <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5 pt-0.5">
                        <span className="text-emerald-400">Action:</span>
                        <span className="text-white">{rec.action}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => applyRecommendation(rec.id)}
                      disabled={rec.applied}
                      className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer min-h-[44px] ${
                        rec.applied
                          ? "bg-[#162228] text-slate-500 cursor-default"
                          : "bg-[#0B3D2C] hover:bg-[#0E4B37] text-white shadow-md font-extrabold"
                      }`}
                    >
                      {rec.applied ? "Applied ✓" : "Execute"}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#0F4A34] flex flex-wrap items-center justify-between text-xs text-emerald-200/90 mt-3 gap-2">
            <span>Expected yield impact: <strong className="text-white font-mono">+6.4 t/ha projected</strong></span>
            <span className="text-[11px] font-mono text-emerald-300">Precision: Sentinel-2 + Weather radar</span>
          </div>
        </motion.div>
      </div>

      {/* Biometric Sovereign Data Vault Banner */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
        isSensitiveDataLocked
          ? "bg-[#181111] border-red-900/50"
          : "bg-[#0B1713] border-[#14533C]"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isSensitiveDataLocked
                ? "bg-red-950/70 border-red-800 text-red-400"
                : "bg-[#07261B] border-[#14533C] text-emerald-400"
            }`}>
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white">
                  {isSensitiveDataLocked
                    ? "Biometric Sovereign Vault: Locked"
                    : "Biometric Sovereign Vault: Active & Unlocked"}
                </h3>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isSensitiveDataLocked
                    ? "bg-red-900/60 text-red-300"
                    : "bg-[#14532D] text-[#FDFBF7]"
                }`}>
                  {isSensitiveDataLocked ? "TouchID/FaceID Required" : "FIDO2 Verified"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isSensitiveDataLocked
                  ? "Sensitive bank facilities, cadastral deed registrations, and private off-take prices are cryptographically masked."
                  : "Private agricultural balances and off-take contracts are currently decrypted in active session."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {isSensitiveDataLocked ? (
              <button
                onClick={() => setIsBiometricModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#14532D] hover:bg-[#0F3D22] text-[#FDFBF7] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md min-h-[40px]"
                id="btn-unlock-biometric-dashboard"
              >
                <Fingerprint className="w-4 h-4 text-[#F5B942]" />
                <span>Unlock with Biometrics</span>
              </button>
            ) : (
              <button
                onClick={toggleSensitiveDataLock}
                className="px-3.5 py-2 rounded-xl bg-[#162228] hover:bg-[#1D2A32] text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border border-[#1D2A32] min-h-[40px]"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Lock Vault Now</span>
              </button>
            )}
          </div>
        </div>

        {/* Vault Values Preview (Masked or Unmasked) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-slate-800/60 text-xs">
          <div className="bg-[#0B1013] p-2.5 rounded-xl border border-[#1D2A32]">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Pre-Approved Seasonal Credit</span>
            <span className="font-mono font-bold text-white text-sm">
              {isSensitiveDataLocked ? "•••••••• (Encrypted)" : "$42,000 USD Active Facility"}
            </span>
          </div>
          <div className="bg-[#0B1013] p-2.5 rounded-xl border border-[#1D2A32]">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Cadastral Deed Registration</span>
            <span className="font-mono font-bold text-white text-sm">
              {isSensitiveDataLocked ? "••••••••••••••••" : "SHA256-ZA-FREE-STATE-2026-9481"}
            </span>
          </div>
          <div className="bg-[#0B1013] p-2.5 rounded-xl border border-[#1D2A32]">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Escrow Buyer Pre-Funding</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {isSensitiveDataLocked ? "•••••••• (Protected)" : "R1,452,560 (~$79,000 USD)"}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: Quick Action Buttons (5 Essential Farm Workflows) */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Rapid Farm Operations
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="p-3.5 rounded-2xl bg-[#10171B] hover:bg-[#162228] border border-[#1D2A32] hover:border-[#14533C] transition-all text-left shadow-xs cursor-pointer group min-h-[96px]"
          >
            <div className="w-9 h-9 rounded-xl bg-[#07261B] border border-[#14533C] text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Droplet className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-white">Request Irrigation</div>
            <div className="text-[11px] text-slate-400">Field 03 moisture plan</div>
          </button>

          <button
            onClick={() => setCurrentView("crop_doctor")}
            className="p-3.5 rounded-2xl bg-[#10171B] hover:bg-[#162228] transition-all text-left shadow-xs cursor-pointer group min-h-[96px]"
          >
            <div className="w-9 h-9 rounded-xl bg-[#07261B] text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-white">Scan Crop Doctor</div>
            <div className="text-[11px] text-slate-400">Leaf disease diagnostics</div>
          </button>

          <button
            onClick={() => setCurrentView("marketplace")}
            className="p-3.5 rounded-2xl bg-[#10171B] hover:bg-[#162228] border border-[#1D2A32] hover:border-[#14533C] transition-all text-left shadow-xs cursor-pointer group min-h-[96px]"
          >
            <div className="w-9 h-9 rounded-xl bg-[#07261B] border border-[#14533C] text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Coins className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-white">Check Crop Price</div>
            <div className="text-[11px] text-slate-400">R5,420 / MT (+1.4%)</div>
          </button>

          <button
            onClick={() => setCurrentView("finance")}
            className="p-3.5 rounded-2xl bg-[#10171B] hover:bg-[#162228] border border-[#1D2A32] hover:border-[#14533C] transition-all text-left shadow-xs cursor-pointer group min-h-[96px]"
          >
            <div className="w-9 h-9 rounded-xl bg-[#07261B] border border-[#14533C] text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-white">Apply Financing</div>
            <div className="text-[11px] text-slate-400">Pre-approved input loan</div>
          </button>

          <button
            onClick={() => setCurrentView("logistics")}
            className="p-3.5 rounded-2xl bg-[#10171B] hover:bg-[#162228] border border-[#1D2A32] hover:border-[#14533C] transition-all text-left shadow-xs cursor-pointer group min-h-[96px]"
          >
            <div className="w-9 h-9 rounded-xl bg-[#07261B] border border-[#14533C] text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-white">Move Harvest</div>
            <div className="text-[11px] text-slate-400">Silo booking & freight</div>
          </button>

          <button
            onClick={() => setActiveTab("documents")}
            className="p-3.5 rounded-2xl bg-[#10171B] hover:bg-[#162228] border border-[#1D2A32] hover:border-[#14533C] transition-all text-left shadow-xs cursor-pointer group min-h-[96px]"
          >
            <div className="w-9 h-9 rounded-xl bg-[#07261B] border border-[#14533C] text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Lock className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-white">Document Vault</div>
            <div className="text-[11px] text-slate-400">{farmerDocuments.length} Deeds & Certs</div>
          </button>
        </div>
      </div>

      {/* SECTION 4 & 5: Field Map with Parcels + Market Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Field Parcels Map (Field 01 to 04) */}
        <div className="lg:col-span-7 bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-extrabold text-sm text-white">Today's Field Parcels</h3>
              <p className="text-[11px] text-slate-400">Sentinel-2 Normalized Difference Vegetation Index (NDVI)</p>
            </div>
            <button
              onClick={() => setCurrentView("precision")}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer min-h-[44px]"
            >
              <span>Satellite & Drone Map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Parcels Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentFarm.fields.map((field) => (
              <div
                key={field.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  field.health === "Critical" || field.health === "Attention Required"
                    ? "bg-red-950/25 border-red-800/60"
                    : field.health === "Moderate"
                    ? "bg-amber-950/25 border-amber-700/60"
                    : "bg-[#07261B]/60 border-[#14533C]"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-xs text-white">{field.name}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      field.health === "Critical" || field.health === "Attention Required"
                        ? "bg-red-600 text-white"
                        : field.health === "Moderate"
                        ? "bg-amber-500 text-slate-900"
                        : "bg-[#0B3D2C] text-emerald-300 border border-[#196349]"
                    }`}
                  >
                    {field.health}
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 mb-2">
                  {field.crop} • {field.areaHa} ha
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-[#1D2A32]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">NDVI Index</span>
                    <span className="font-bold text-white">{field.ndviScore}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Soil Moisture</span>
                    <span
                      className={`font-bold ${
                        field.soilMoisture < 30 ? "text-red-400 animate-pulse" : "text-white"
                      }`}
                    >
                      {field.soilMoisture}%
                    </span>
                  </div>
                </div>

                {field.alerts && field.alerts.length > 0 && (
                  <div className="mt-2 text-[11px] text-red-300 bg-red-950/60 border border-red-800/60 p-1.5 rounded-lg font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 shrink-0 text-red-400" />
                    <span className="truncate">{field.alerts[0]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Market Snapshot & Off-Take Match */}
        <div className="lg:col-span-5 bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-sm text-white">Pan-African Market Snapshot</h3>
              <span className="text-[10px] font-bold text-emerald-300 bg-[#07261B] border border-[#14533C] px-2 py-0.5 rounded">
                Live SAFEX Spot
              </span>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32] mb-3">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Yellow Maize Spot (Johannesburg)
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-mono font-extrabold text-white">R5,420</span>
                <span className="text-xs text-slate-400">/ MT</span>
                <span className="text-xs font-mono font-bold text-emerald-300 bg-[#07261B] border border-[#14533C] px-1.5 py-0.5 rounded ml-auto flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3 text-emerald-400" /> +1.4%
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Forward 30-day projection: <strong className="text-emerald-400 font-mono">R5,780 (+6.8%)</strong>
              </div>
            </div>

            {/* Buyer Request Card matching Blueprint Section 9 */}
            <div className="p-4 rounded-xl bg-[#082B1E] border border-[#14533C]">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-emerald-300">Active Buyer Sourcing Match</span>
                <span className="text-[10px] font-bold bg-[#0B3D2C] border border-[#196349] text-white px-1.5 py-0.5 rounded">
                  Verified Off-Taker
                </span>
              </div>
              <div className="text-xs font-bold text-white">
                Pan-African Milling Corp: "10,000 tonnes maize"
              </div>
              <p className="text-[11px] text-emerald-200/80 mt-1 leading-relaxed">
                Seeking Grade 1 yellow maize with escrow pre-funding. Minimum lot 100 tonnes.
              </p>
              <button
                onClick={() => setCurrentView("marketplace")}
                className="w-full mt-3 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] transition-all cursor-pointer shadow-md min-h-[44px]"
              >
                Forward-Contract Harvest (Sell 200 MT) →
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-[#19262F] flex items-center justify-between text-[11px] text-slate-400 mt-3">
            <span>Arbitrage spreads across 54 African exchanges active</span>
            <span className="text-emerald-400 font-bold hover:underline cursor-pointer" onClick={() => setCurrentView("marketplace")}>
              All 54 Markets →
            </span>
          </div>
        </div>
      </div>

      {/* Harvest Yield Prediction Quick-Access Banner */}
      <div className="bg-[#10171B] rounded-2xl p-4 sm:p-5 border border-emerald-900/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B3D2C] border border-[#14533C] text-emerald-400 flex items-center justify-center shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-extrabold text-sm text-white">
                Harvest Yield Prediction Engine
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#07261B] text-emerald-300 border border-[#14533C]">
                7.42 MT/ha (+19.6% vs 5-Yr Mean)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-spectral vegetation index & soil sensor analysis estimates 890 MT total harvest (~R4.82M ZAR value).
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("yield_prediction")}
          className="px-4 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold border border-[#196349] transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 min-h-[40px]"
        >
          <span>View Yield Model</span>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
        </button>
      </div>

      {/* World Food Security & Global G.A.P. Quick-Access Banner */}
      <div className="bg-[#10171B] rounded-2xl p-4 sm:p-5 border border-[#14533C] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#07261B] border border-[#14533C] text-emerald-400 flex items-center justify-center shrink-0">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-extrabold text-sm text-white">
                World Food Security & Global G.A.P. Policy Engine
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#07261B] text-emerald-300 border border-[#14533C]">
                92% Global Export Grade (Tier-1)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              UN FAO Committee on World Food Security (CFS) & Codex Alimentarius compliance audit. Unlocks +$42/MT export price premium.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("food_security")}
          className="px-4 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold border border-[#196349] transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 min-h-[40px]"
        >
          <span>Audit Global Standards</span>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
        </button>
      </div>

      {/* Vaulted Legal & Land Documents Banner */}
      <div className="bg-[#10171B] rounded-2xl p-4 sm:p-5 border border-[#1D2A32] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#07261B] border border-[#14533C] text-emerald-400 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <span>Secure Digital Document Repository</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#07261B] text-emerald-300 border border-[#14533C]">
                {farmerDocuments.length} Verified Records
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Land titles, GlobalGAP certifications, off-take forward agreements, and soil assays anchored with SHA-256 ledgers.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("documents")}
          className="px-4 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold border border-[#196349] transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 min-h-[40px]"
        >
          <span>Open Secure Vault</span>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
        </button>
      </div>
    </>
  )}
</div>
  );
};
