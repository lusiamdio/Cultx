import React, { useState } from "react";
import {
  Search,
  Mic,
  Bell,
  Wifi,
  WifiOff,
  Layers,
  ChevronDown,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  Smartphone,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AFRICAN_COUNTRIES } from "../../data/countries";
import { UserRole } from "../../types";

export const Header: React.FC<{
  onOpenNotifications?: () => void;
}> = ({ onOpenNotifications }) => {
  const {
    selectedCountry,
    setSelectedCountry,
    userRole,
    setUserRole,
    experienceLevel,
    setExperienceLevel,
    isOffline,
    toggleOfflineMode,
    syncQueue,
    unreadNotificationCount,
    setIsVoiceModalOpen,
    setIsUssdModalOpen,
    setIsSearchModalOpen,
    setIsCopilotOpen,
    setIsNotificationDrawerOpen,
    isMenuHidden,
    toggleMenu,
    setCurrentView,
    triggerEventSimulation,
  } = useApp();

  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isSimulationMenuOpen, setIsSimulationMenuOpen] = useState(false);

  const roles: { role: UserRole; label: string }[] = [
    { role: "farmer", label: "Smallholder & Commercial Farmer" },
    { role: "agribusiness", label: "Agribusiness & Aggregator" },
    { role: "buyer", label: "Commodity Buyer & Miller" },
    { role: "cooperative", label: "Farmers Cooperative Union" },
    { role: "logistics", label: "Agri-Logistics & Freight" },
    { role: "finance", label: "Agri-Financier & Insurer" },
    { role: "government", label: "Ministry & Policy Maker" },
    { role: "superadmin", label: "Operations Command Center" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B1013]/95 backdrop-blur-md border-b border-[#19262F] shadow-lg px-3 sm:px-4 lg:px-6 py-2.5 selection:bg-emerald-600 selection:text-white w-full">
      <div className="w-full flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Country Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setCurrentView("landing")}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none min-h-[44px]"
            id="header-brand-button"
          >
            <img
              src="/cultx_logo.png"
              alt="CULTx"
              className="w-10 h-10 rounded-xl object-contain shadow-xs group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center">
                <span className="font-extrabold text-white text-base sm:text-lg tracking-tight">CULTx</span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 leading-none hidden sm:block">
                AgriIntel Africa
              </p>
            </div>
          </button>

          {/* Menu Visibility Toggle (Hide/Show Menu) */}
          <button
            onClick={toggleMenu}
            className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
              isMenuHidden
                ? "bg-[#0B3D2C] hover:bg-[#0E4B37] text-white shadow-sm"
                : "bg-[#10171B] hover:bg-[#162228] text-slate-300 hover:text-white"
            }`}
            title={isMenuHidden ? "Show Navigation Menu" : "Hide Navigation Menu"}
            id="header-toggle-menu-button"
          >
            {isMenuHidden ? (
              <>
                <PanelLeftOpen className="w-4 h-4 text-emerald-300" />
                <span className="hidden sm:inline font-bold">Show Menu</span>
              </>
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline font-bold">Hide Menu</span>
              </>
            )}
          </button>

          {/* 54-Country Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCountryMenuOpen(!isCountryMenuOpen)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-2 rounded-xl border border-[#1D2A32] bg-[#10171B] hover:bg-[#162228] text-xs font-semibold text-slate-200 transition-colors cursor-pointer min-h-[44px]"
              title="Change Pan-African Operating Territory"
              id="country-selector-button"
            >
              <span className="text-base leading-none">{selectedCountry.flag}</span>
              <span className="hidden md:inline text-white font-medium">{selectedCountry.name}</span>
              <span className="text-emerald-400 font-mono font-medium text-[11px]">
                ({selectedCountry.currency})
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isCountryMenuOpen && (
              <div className="absolute left-0 mt-2 w-64 max-h-80 overflow-y-auto bg-[#10171B] rounded-2xl shadow-2xl border border-[#1D2A32] py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-[#19262F]">
                  Select Country Configuration (54 Total)
                </div>
                {AFRICAN_COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setSelectedCountry(c);
                      setIsCountryMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left hover:bg-[#162228] transition-colors cursor-pointer ${
                      selectedCountry.code === c.code
                        ? "bg-[#07261B] text-emerald-300 font-bold border-l-2 border-emerald-400"
                        : "text-slate-300"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{c.flag}</span>
                      <span className="text-white">{c.name}</span>
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400/80">{c.currency}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#10171B] hover:bg-[#162228] border border-[#1D2A32] hover:border-[#14533C] text-slate-400 text-xs transition-colors cursor-pointer min-h-[44px]"
            id="global-search-bar"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              <span className="font-normal text-slate-400">Search agriculture (farms, crops, buyers, prices)...</span>
            </span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-300 bg-[#162228] rounded border border-[#1D2A32]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Real-time Event Trigger Simulator Menu */}
          <div className="relative">
            <button
              onClick={() => setIsSimulationMenuOpen(!isSimulationMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-[#07261B] hover:bg-[#0B3828] border border-[#14533C] text-emerald-300 text-xs font-semibold transition-colors cursor-pointer min-h-[44px]"
              title="Test real-time IoT and market triggers"
              id="event-simulator-button"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline text-white">Simulations</span>
              <ChevronDown className="w-3 h-3 text-emerald-400" />
            </button>

            {isSimulationMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#10171B] rounded-2xl shadow-2xl border border-[#1D2A32] p-2 z-50 animate-in fade-in">
                <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-[#19262F] mb-1">
                  Telemetry & Market Events
                </div>
                <button
                  onClick={() => {
                    triggerEventSimulation("soil_drought");
                    setIsSimulationMenuOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#162228] text-xs text-red-300 flex items-start gap-2.5 cursor-pointer transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Soil Moisture &lt; 25% Alert</div>
                    <div className="text-[11px] text-red-400">Triggers immediate irrigation alert on Field 03</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    triggerEventSimulation("rain_incoming");
                    setIsSimulationMenuOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#162228] text-xs text-amber-300 flex items-start gap-2.5 cursor-pointer transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Weather Radar: 45mm Rain in 18h</div>
                    <div className="text-[11px] text-amber-400">Triggers delay in fertilizer broadcast</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    triggerEventSimulation("buyer_surge");
                    setIsSimulationMenuOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#162228] text-xs text-emerald-300 flex items-start gap-2.5 cursor-pointer transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">2,500 MT Grain Tender Match</div>
                    <div className="text-[11px] text-emerald-400">Instant off-take contract matching</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    triggerEventSimulation("price_rally");
                    setIsSimulationMenuOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#162228] text-xs text-blue-300 flex items-start gap-2.5 cursor-pointer transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Regional Price Surge (+7.4%)</div>
                    <div className="text-[11px] text-blue-400">Advises farmer to forward-lock price</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Voice-First Button */}
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold border border-[#196349] transition-all cursor-pointer shadow-md min-h-[44px]"
            title="Voice interface in 9+ African languages"
            id="voice-assistant-button"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden sm:inline">Voice Assistant</span>
          </button>

          {/* 2G USSD & SMS Fallback Console */}
          <button
            onClick={() => setIsUssdModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-[#1D2A32] bg-[#10171B] hover:bg-[#162228] text-slate-200 text-xs font-semibold transition-colors cursor-pointer min-h-[44px]"
            title="Low-literacy 2G feature phone USSD & SMS fallback (*384*2858#)"
            id="ussd-simulator-button"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline font-mono text-white">2G USSD / SMS</span>
          </button>

          {/* Offline Mode Switcher */}
          <button
            onClick={toggleOfflineMode}
            className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer min-h-[44px] ${
              isOffline
                ? "bg-amber-950/60 border-amber-600 text-amber-300"
                : "bg-[#10171B] border-[#1D2A32] text-slate-300 hover:bg-[#162228]"
            }`}
            title={isOffline ? "Currently in Offline Mode" : "Online connection active"}
            id="offline-mode-toggle"
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline font-semibold text-white">Offline</span>
                {syncQueue.length > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-500 text-slate-900 rounded-full text-[10px] font-bold font-mono">
                    {syncQueue.length}
                  </span>
                )}
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline text-white font-medium">Online</span>
              </>
            )}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => {
              if (onOpenNotifications) {
                onOpenNotifications();
              } else {
                setIsNotificationDrawerOpen(true);
              }
            }}
            className="relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-[#162228] border border-transparent hover:border-[#1D2A32] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Notification Center"
            id="notification-bell-button"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0B1013] animate-pulse" />
            )}
          </button>

          {/* Role & Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-2 p-1.5 pl-2 sm:pl-3 rounded-xl border border-[#1D2A32] bg-[#10171B] hover:bg-[#162228] text-xs text-slate-200 transition-colors cursor-pointer min-h-[44px]"
              id="user-profile-menu-button"
            >
              <div className="text-left hidden sm:block">
                <div className="font-bold text-white leading-tight capitalize">
                  {userRole === "farmer" ? "James Banda" : userRole === "agribusiness" ? "AfriGrain Corp" : "Min. Agriculture"}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold capitalize leading-none">
                  {userRole} • {experienceLevel}
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#0B3D2C] border border-[#14533C] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {userRole === "farmer" ? "JB" : userRole === "agribusiness" ? "AG" : "GOV"}
              </div>
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 mt-2 w-68 bg-[#10171B] rounded-2xl shadow-2xl border border-[#1D2A32] py-2 z-50 animate-in fade-in">
                <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-[#19262F]">
                  Switch Persona & Operating Level (Section 54)
                </div>
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      setUserRole(r.role);
                      setIsRoleMenuOpen(false);
                      if (r.role === "farmer") setCurrentView("dashboard");
                      else if (r.role === "government") setCurrentView("government");
                      else if (r.role === "agribusiness") setCurrentView("agribusiness");
                      else if (r.role === "cooperative") setCurrentView("cooperative");
                      else if (r.role === "superadmin") setCurrentView("admin");
                    }}
                    className={`w-full px-3.5 py-2.5 text-xs text-left flex items-center gap-2.5 hover:bg-[#162228] transition-colors cursor-pointer ${
                      userRole === r.role
                        ? "bg-[#07261B] text-emerald-300 font-bold border-l-2 border-emerald-400"
                        : "text-slate-300"
                    }`}
                  >
                    <span className="text-white font-medium">{r.label}</span>
                  </button>
                ))}
                <div className="border-t border-[#19262F] mt-1 pt-1.5 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Data Sovereignty</span>
                  <button
                    onClick={() => {
                      setCurrentView("consent");
                      setIsRoleMenuOpen(false);
                    }}
                    className="text-emerald-400 font-semibold hover:underline cursor-pointer"
                  >
                    Control Sharing →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
