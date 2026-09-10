import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sprout,
  Globe2,
  Satellite,
  Truck,
  Coins,
  ShieldCheck,
  ShoppingBag,
  CloudSunRain,
  Stethoscope,
  Landmark,
  Users2,
  Building2,
  Sparkles,
  PhoneCall,
  Mail,
  ArrowRight,
  ChevronUp,
  CheckCircle2,
  Radio,
  FileText,
  Layers,
  Lock,
  Compass,
  ExternalLink,
  Heart,
  Cpu,
  Activity,
  Check,
  Share2,
  Send,
  Smartphone,
  ChevronRight,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AFRICAN_COUNTRIES } from "../../data/countries";

export const WebsiteFooter: React.FC = () => {
  const {
    setCurrentView,
    selectedCountry,
    setSelectedCountry,
    setIsVoiceModalOpen,
    setIsUssdModalOpen,
    setIsCropDoctorOpen,
    setIsCopilotOpen,
    setIsOnboardingOpen,
  } = useApp();

  // Newsletter Subscription State
  const [emailInput, setEmailInput] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("Smallholder Farmer");
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState("");

  // Country Switcher & Language State
  const [activeLanguage, setActiveLanguage] = useState("English");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // Legal Modal Simulation
  const [activeLegalModal, setActiveLegalModal] = useState<string | null>(null);

  const languages = [
    { code: "en", name: "English", region: "Pan-African Standard" },
    { code: "sw", name: "Kiswahili", region: "East Africa & Great Lakes" },
    { code: "fr", name: "Français", region: "West & Central Africa" },
    { code: "ha", name: "Hausa", region: "West Africa & Sahel" },
    { code: "yo", name: "Yorùbá", region: "Nigeria & Benin" },
    { code: "pt", name: "Português", region: "Angola & Mozambique" },
    { code: "am", name: "አማርኛ (Amharic)", region: "Ethiopia & Horn of Africa" },
    { code: "ar", name: "العربية (Arabic)", region: "North Africa & Sudan" },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@") || !emailInput.includes(".")) {
      setSubscriptionError("Please provide a valid institutional or personal email address.");
      return;
    }
    setSubscriptionError("");
    setSubscriptionSuccess(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#070B0E] text-slate-300 relative overflow-hidden" id="cultx-main-footer">
      {/* Decorative Brand Accent Background Blur */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#14532D]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F5B942]/10 rounded-full blur-3xl pointer-events-none" />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: Pre-Footer Interactive Dispatch & Engagement Hub
         ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="rounded-3xl bg-gradient-to-br from-[#10171B] via-[#0D1814] to-[#162228] p-6 sm:p-8 lg:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle top indicator bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#14532D] via-[#F5B942] to-[#22C55E]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Col: Mission Statement & Direct Action CTAs */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14532D] text-[#FDFBF7] text-xs font-bold shadow-xs">
                <Globe2 className="w-3.5 h-3.5 text-[#F5B942]" />
                <span>Pan-African Agri-Intelligence • 54 Nations</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#FDFBF7] tracking-tight leading-tight">
                Transforming African Agriculture <br className="hidden sm:inline" />
                <span className="text-[#22C55E]">From Farmgate to Global Trade.</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Connect your farm, cooperative, or agribusiness to planetary remote sensing,
                verified commodity contracts, in-situ soil IoT, and AfCFTA cross-border liquidity.
              </p>

              {/* Quick Platform Launchers */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentView("farms")}
                  className="px-5 py-3 rounded-xl bg-[#14532D] hover:bg-[#0F3D22] text-[#FDFBF7] font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer min-h-[44px]"
                  id="footer-open-farmer-hub-btn"
                >
                  <Sprout className="w-4 h-4 text-[#F5B942]" />
                  <span>Launch Farmers Hub</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#F5B942]" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsUssdModalOpen(true)}
                  className="px-4 py-3 rounded-xl bg-[#162228] hover:bg-[#1D2A32] text-slate-200 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer min-h-[44px]"
                  id="footer-launch-ussd-btn"
                >
                  <Smartphone className="w-4 h-4 text-[#F5B942]" />
                  <span>2G USSD (*384*285#)</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="px-4 py-3 rounded-xl bg-[#2A180E] hover:bg-[#3D2314] text-[#F5B942] text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer min-h-[44px]"
                  id="footer-launch-voice-btn"
                >
                  <PhoneCall className="w-4 h-4 text-[#F5B942]" />
                  <span>Voice in 9 Languages</span>
                </motion.button>
              </div>
            </div>

            {/* Right Col: Weekly Pan-African Commodity & Weather Dispatch */}
            <div className="lg:col-span-6 bg-[#0B1013] rounded-2xl p-6 sm:p-7 shadow-inner space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#F5B942]" />
                    <span>Pan-African Commodity & Radar Dispatch</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Weekly wholesale grain prices, satellite rainfall alerts, and AfCFTA export bulletins.
                  </p>
                </div>
                <span className="hidden sm:inline-flex text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#07261B] text-[#22C55E]">
                  Free Weekly Digest
                </span>
              </div>

              {subscriptionSuccess ? (
                <div className="p-4 rounded-xl bg-[#07261B] text-emerald-300 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                    <span>Subscribed to CULTx Continental Dispatch!</span>
                  </div>
                  <p className="text-slate-300">
                    You will receive weekly verified commodity spot prices (SAFEX, ZAMACE, ECX) and regional precipitation radar tailored for <span className="font-bold text-[#F5B942]">{selectedRole}s</span>.
                  </p>
                  <button
                    onClick={() => {
                      setSubscriptionSuccess(false);
                      setEmailInput("");
                    }}
                    className="text-[11px] font-bold text-[#22C55E] underline cursor-pointer hover:text-white"
                  >
                    Subscribe another email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  {/* Persona Selector Pill Row */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Your Sector Focus:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Smallholder Farmer",
                        "Commercial Grower",
                        "Commodity Buyer",
                        "Logistics & Silo",
                        "Agri-Lender / Insurer",
                      ].map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setSelectedRole(role)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            selectedRole === role
                              ? "bg-[#14532D] text-[#FDFBF7] font-bold shadow-xs"
                              : "bg-[#162228] text-slate-300 hover:text-white"
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input and Submit Group */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        setSubscriptionError("");
                      }}
                      placeholder="Enter your institutional or business email..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#162228] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#0F3D22] text-[#FDFBF7] font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md min-h-[42px] shrink-0"
                    >
                      <span>Subscribe</span>
                      <Send className="w-3.5 h-3.5 text-[#F5B942]" />
                    </motion.button>
                  </div>

                  {subscriptionError && (
                    <div className="text-[11px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{subscriptionError}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Zero spam. Encrypted sovereign storage under the Pan-African Data Privacy Charter.</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: Real-Time Continental Infrastructure Health Bar
         ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="rounded-2xl bg-[#0F161A] p-3.5 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            <span className="font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#22C55E] animate-pulse" />
              <span>Continental Telemetry Mesh:</span>
            </span>

            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
              <span>Sentinel-2 L2A:</span>
              <span className="font-mono text-emerald-300 font-bold">100% Orbit Sync</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <span>AfCFTA Trade Corridors:</span>
              <span className="font-mono text-emerald-300 font-bold">54 Active</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Silo Storage Reserves:</span>
              <span className="font-mono text-cyan-300 font-bold">78.4% Available</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#F5B942]" />
              <span>2G USSD & SMS Gateway:</span>
              <span className="font-mono text-[#F5B942] font-bold">Operational</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] ml-auto">
            <span>Network Latency: 18ms</span>
            <span>•</span>
            <span>Pan-Africa UTC+2</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: Deep 5-Column Navigation & Architecture Hierarchy
         ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* COLUMN 1: On-Farm Operations & Agronomy */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#22C55E]">
              <Sprout className="w-4 h-4 text-[#22C55E]" />
              <span>Farm Operations</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView("farms")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Digital Farm Twins</span>
                  <span className="text-[10px] text-emerald-400 font-mono">#TWIN</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsCropDoctorOpen(true)}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">AI Crop Doctor Scanner</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#14532D] text-[9px] text-[#FDFBF7] font-bold">AI</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("farms")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">In-Situ Soil Moisture IoT</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("farms")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Yield Prediction Modeling</span>
                  <span className="text-[10px] text-slate-400 font-mono">7.4 t/ha</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("farms")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Certified Land Deed Vault</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsUssdModalOpen(true)}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">2G USSD Fallback (*384#)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 2: Markets, Corridors & Silos */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#F5B942]">
              <ShoppingBag className="w-4 h-4 text-[#F5B942]" />
              <span>Markets & Freight</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView("marketplace")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Wholesale Spot Markets</span>
                  <span className="text-[10px] text-amber-300 font-mono">54 Hubs</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("marketplace")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Forward Off-Take Contracts</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("logistics")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Lobito Atlantic Rail (LAR)</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#2A180E] text-[9px] text-[#F5B942] font-bold">Express</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("logistics")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Reefer Cold-Chain Silos</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("cooperative")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Cooperative Bulk Pooling</span>
                  <span className="text-[10px] text-emerald-400 font-mono">-11% Cost</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("agribusiness")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Input Inventory Forecasting</span>
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: Remote Sensing & Climate Radar */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-cyan-400">
              <Satellite className="w-4 h-4 text-cyan-400" />
              <span>Climate & Satellite</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView("climate")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Sentinel-2 Multispectral NDVI</span>
                  <span className="text-[10px] text-cyan-300 font-mono">10m</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("climate")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">72h Precipitation Radar</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("precision")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Drone Orthomosaic Scouting</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("farm_twin")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Soil Carbon Offsets (MRV)</span>
                  <span className="text-[10px] text-emerald-400 font-mono">1.8 tCO2e</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("climate")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Sahel & Rift Drought Watch</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("farms")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Evapotranspiration Index</span>
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: Capital, Escrow & Standards */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-400">
              <Coins className="w-4 h-4 text-purple-400" />
              <span>Capital & Standards</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView("finance")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Seasonal Input Credit Lines</span>
                  <span className="text-[10px] text-purple-300 font-mono">$42M</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("finance")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Parametric Rainfall Insurance</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("finance")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Warehouse Receipt Escrow (WRF)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("farms")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Codex Alimentarius MRL Rules</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("agribusiness")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">ISTA Certified Seed Registry</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("consent")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Data Sovereignty Charter</span>
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 5: Governance, Policy & Assistants */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-400">
              <Landmark className="w-4 h-4 text-emerald-400" />
              <span>AfCFTA & Policy</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView("trade")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">AfCFTA Digital Rules of Origin</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#07261B] text-[9px] text-[#22C55E] font-bold">0% Tariff</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("government")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">National Food Security Reserves</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Voice Assistant (9 African Langs)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsCopilotOpen(true)}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">CULTx Strategic Copilot</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#2A180E] text-[9px] text-[#F5B942] font-bold">Copilot</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("admin")}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Super Admin Console</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Platform Architecture Tour</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: Brand Identity & Interactive Localizer Bar
         ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="rounded-2xl bg-[#0F161A] p-6 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Logo & Brand Mission */}
          <div className="flex items-center gap-3.5">
            <img
              src="/cultx_logo.png"
              alt="CULTx"
              className="w-11 h-11 rounded-2xl object-contain shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold text-white tracking-tight">CULTx</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#14532D] text-[#FDFBF7]">
                  PAN-AFRICAN OS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 max-w-md">
                Unifying 33M+ smallholder and commercial producers through planetary remote sensing,
                sovereign data privacy, and transparent AfCFTA market trade.
              </p>
            </div>
          </div>

          {/* Interactive Country & Language Localizers */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
            {/* Country Selector with Flag */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsCountryDropdownOpen(!isCountryDropdownOpen);
                  setIsLanguageDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#162228] hover:bg-[#1D2A32] text-xs font-semibold text-white transition-colors cursor-pointer"
                title="Switch Pan-African Operational Country"
              >
                <span className="text-base leading-none">{selectedCountry.flag}</span>
                <span>{selectedCountry.name}</span>
                <span className="text-slate-400 font-mono text-[11px]">({selectedCountry.currency})</span>
                <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCountryDropdownOpen ? "rotate-90" : ""}`} />
              </button>

              {isCountryDropdownOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-64 bg-[#10171B] rounded-2xl shadow-2xl p-2 z-50 max-h-72 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select African Hub
                  </div>
                  {AFRICAN_COUNTRIES.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setSelectedCountry(country);
                        setIsCountryDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-xs rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
                        selectedCountry.code === country.code
                          ? "bg-[#14532D] text-[#FDFBF7] font-bold"
                          : "text-slate-300 hover:bg-[#162228]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{country.flag}</span>
                        <span>{country.name}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">
                        {country.currency}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
                  setIsCountryDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#162228] hover:bg-[#1D2A32] text-xs font-semibold text-white transition-colors cursor-pointer"
                title="Select Interface Language"
              >
                <Globe2 className="w-3.5 h-3.5 text-[#F5B942]" />
                <span>{activeLanguage}</span>
                <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isLanguageDropdownOpen ? "rotate-90" : ""}`} />
              </button>

              {isLanguageDropdownOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-60 bg-[#10171B] rounded-2xl shadow-2xl p-2 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Interface Language
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setActiveLanguage(lang.name);
                        setIsLanguageDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-xs rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
                        activeLanguage === lang.name
                          ? "bg-[#14532D] text-[#FDFBF7] font-bold"
                          : "text-slate-300 hover:bg-[#162228]"
                      }`}
                    >
                      <span>{lang.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Back to top smooth button */}
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-[#162228] hover:bg-[#1D2A32] text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center min-h-[38px] min-w-[38px]"
              title="Scroll to Top of Page"
            >
              <ChevronUp className="w-4 h-4 text-[#F5B942]" />
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: Sub-Footer Institutional Accreditations & Copyright
         ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#05080A] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Institutional Compliance Badges Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 text-[11px] text-slate-400">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>AfCFTA Digital Trade Protocol</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F5B942]" />
                <span>FAO & WHO Codex Alimentarius Audited</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Satellite className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copernicus Sentinel-2 Constellation</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>African Sovereign Data Privacy Certified</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView("consent")}
                className="hover:text-white transition-colors cursor-pointer underline"
              >
                Data Sovereignty & Privacy
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveLegalModal("terms")}
                className="hover:text-white transition-colors cursor-pointer underline"
              >
                Terms of Service
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveLegalModal("standards")}
                className="hover:text-white transition-colors cursor-pointer underline"
              >
                Codex Standards
              </button>
            </div>
          </div>

          {/* Final Copyright & Architectural Attribution */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 pt-4">
            <p>
              © 2026 CULTx Operating System. Architected and validated for all 54 African Union Member States.
            </p>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>Powered by Satellite NDVI, Micro-Climate IoT & Pan-African Liquidity.</span>
              <span className="text-[#22C55E]">●</span>
              <span className="text-white font-medium">All Systems Operational</span>
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Modal for Legal / Terms simulation */}
      <AnimatePresence>
        {activeLegalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#10171B] rounded-3xl p-6 shadow-2xl space-y-4 text-xs text-slate-300"
            >
              <div className="flex items-center justify-between border-b border-[#1D2A32] pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                  <span>
                    {activeLegalModal === "terms"
                      ? "CULTx Pan-African Operating Terms"
                      : "World Food Security & Codex Standards"}
                  </span>
                </h3>
                <button
                  onClick={() => setActiveLegalModal(null)}
                  className="w-7 h-7 rounded-lg bg-[#162228] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                <p>
                  The CULTx Operating System enforces data sovereignty for all registered farmers, cooperatives,
                  and agricultural institutions across the 54 African member states.
                </p>
                <div className="p-3 rounded-xl bg-[#162228] space-y-1">
                  <div className="font-bold text-white">Sovereign Data Protection (SDP)</div>
                  <p className="text-slate-400">
                    Farm coordinates and satellite vegetative indices (NDVI) belong exclusively to the farmer and cannot be monetized or transferred to third parties without explicit cryptographic consent.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#162228] space-y-1">
                  <div className="font-bold text-white">Codex Alimentarius Alignment</div>
                  <p className="text-slate-400">
                    All commodity lots traded through the CULTx wholesale marketplace are verified against maximum residue limits (MRLs) and international phytosanitary certificates for tariff-free AfCFTA clearance.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1D2A32] flex justify-end">
                <button
                  onClick={() => setActiveLegalModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#14532D] hover:bg-[#0F3D22] text-white font-bold cursor-pointer"
                >
                  Close Notice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};
