import React from "react";
import {
  LayoutDashboard,
  Sprout,
  Satellite,
  Stethoscope,
  CloudSunRain,
  ShoppingBag,
  Coins,
  Truck,
  Globe2,
  Users2,
  Landmark,
  ShieldCheck,
  Settings,
  MessageSquare,
  Compass,
  FileText,
  PanelLeftClose,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    userRole,
    experienceLevel,
    setIsCopilotOpen,
    setIsCropDoctorOpen,
    toggleMenu,
  } = useApp();

  const navItems = [
    { id: "dashboard", label: "Home (Command)", icon: LayoutDashboard },
    { id: "farms", label: "Farmers & Farm Hub", icon: Sprout, count: 3 },
    { id: "precision", label: "Precision Agriculture", icon: Satellite },
    { id: "crop_doctor", label: "Crop Doctor", icon: Stethoscope, isSpecial: true },
    { id: "climate", label: "Climate Intelligence", icon: CloudSunRain, alert: "Rain 72h" },
    { id: "marketplace", label: "Marketplace & Prices", icon: ShoppingBag, count: "54 Mkts" },
    { id: "finance", label: "Agri-Finance & Credit", icon: Coins },
    { id: "logistics", label: "Logistics & Silos", icon: Truck },
    { id: "trade", label: "Trade & AfCFTA Export", icon: Globe2 },
    { id: "cooperative", label: "Cooperative Hub", icon: Users2, badge: "-11% Bulk" },
    { id: "government", label: "National Food Security", icon: Landmark, isGov: true },
  ];

  const adminItems = [
    { id: "admin", label: "Super Admin Control", icon: Settings },
    { id: "consent", label: "Data Sovereignty & Trust", icon: ShieldCheck },
    { id: "landing", label: "Platform Architecture", icon: Compass },
  ];

  return (
    <aside className="w-64 bg-[#0B1013] text-slate-300 shrink-0 flex flex-col justify-between hidden lg:flex selection:bg-emerald-600 selection:text-white">
      <div className="p-4 space-y-5 overflow-y-auto">
        {/* Header with Logo & Hide Menu action */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <img
              src="/cultx_logo.png"
              alt="CULTx"
              className="w-7 h-7 rounded-lg object-contain shadow-xs"
            />
            <span className="font-extrabold text-sm text-white tracking-tight">CULTx</span>
          </div>
          <button
            onClick={toggleMenu}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-[#10171B] hover:bg-[#162228] transition-colors cursor-pointer"
            title="Hide Menu (Expand Workspace)"
            id="sidebar-hide-menu-button"
          >
            <PanelLeftClose className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hide</span>
          </button>
        </div>

        {/* Operating Level indicator */}
        <div className="bg-[#10171B] rounded-2xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              System Level
            </span>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#07261B] text-emerald-300">
              {experienceLevel}
            </span>
          </div>
          <div className="text-xs font-bold text-white mt-1.5 capitalize flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {userRole === "farmer"
              ? "Level 1: Action Advisory"
              : userRole === "agribusiness"
              ? "Level 2: Value Chain Ops"
              : "Level 3: Policy Intelligence"}
          </div>
        </div>

        {/* Core Navigation Items */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Intelligence Pillars
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#14532D] text-[#FDFBF7] font-bold shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-[#162228]"
                }`}
                id={`sidebar-nav-${item.id}`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-300" : "text-slate-400"}`} />
                  <span className={isActive ? "text-white" : "text-slate-200"}>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#07261B] text-emerald-300 border border-[#0F4A34]">
                    {item.badge}
                  </span>
                )}
                {item.count && (
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#162228] text-slate-300">
                    {item.count}
                  </span>
                )}
                {item.alert && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-600/40">
                    {item.alert}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Administration & Architecture */}
        <div className="space-y-1 pt-3 border-t border-[#19262F]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Governance & Controls
          </div>
          {adminItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#07261B] text-emerald-300 font-bold border border-[#14533C]"
                    : "text-slate-400 hover:text-white hover:bg-[#162228]"
                }`}
                id={`sidebar-nav-${item.id}`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span className={isActive ? "text-white font-bold" : ""}>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Copilot Trigger in Sidebar */}
      <div className="p-4 bg-[#0B1013]">
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold shadow-lg transition-all cursor-pointer"
          id="sidebar-copilot-trigger"
        >
          <MessageSquare className="w-4 h-4 text-emerald-300" />
          <span>Copilot Assistant</span>
        </button>
        <p className="text-[10px] text-slate-400 text-center mt-2">
          Grounded with satellite & African market telemetry
        </p>
      </div>
    </aside>
  );
};
