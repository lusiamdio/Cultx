import React, { useState } from "react";
import {
  LayoutDashboard,
  Sprout,
  ShoppingBag,
  MessageSquare,
  Menu,
  X,
  Stethoscope,
  CloudSunRain,
  Coins,
  Truck,
  Globe2,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView, setIsCopilotOpen, setIsCropDoctorOpen } = useApp();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  return (
    <>
      {/* More Drawer on Mobile */}
      {isMoreMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end lg:hidden animate-in fade-in">
          <div className="bg-[#0B1013] rounded-t-3xl p-5 text-white max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <img
                  src="/cultx_logo.png"
                  alt="CULTx"
                  className="w-7 h-7 rounded-lg object-contain shadow-xs"
                />
                <span className="font-extrabold text-base text-white">CULTx Pillars</span>
              </div>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-2 rounded-xl bg-[#10171B] text-slate-400 hover:text-white cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5 mt-4 text-xs font-medium">
              <button
                onClick={() => {
                  setCurrentView("crop_doctor");
                  setIsMoreMenuOpen(false);
                }}
                className="p-3.5 rounded-2xl bg-[#10171B] hover:bg-[#162228] flex items-center gap-3 text-left text-white cursor-pointer min-h-[48px]"
              >
                <div className="w-8 h-8 rounded-xl bg-[#07261B] flex items-center justify-center shrink-0">
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                </div>
                <span>Crop Doctor</span>
              </button>
              <button
                onClick={() => {
                  setCurrentView("climate");
                  setIsMoreMenuOpen(false);
                }}
                className="p-3.5 rounded-2xl bg-[#10171B] hover:bg-[#162228] border border-[#1D2A32] flex items-center gap-3 text-left text-white cursor-pointer min-h-[48px]"
              >
                <div className="w-8 h-8 rounded-xl bg-[#07261B] border border-[#14533C] flex items-center justify-center shrink-0">
                  <CloudSunRain className="w-4 h-4 text-emerald-400" />
                </div>
                <span>Climate Intel</span>
              </button>
              <button
                onClick={() => {
                  setCurrentView("finance");
                  setIsMoreMenuOpen(false);
                }}
                className="p-3.5 rounded-2xl bg-[#10171B] hover:bg-[#162228] border border-[#1D2A32] flex items-center gap-3 text-left text-white cursor-pointer min-h-[48px]"
              >
                <div className="w-8 h-8 rounded-xl bg-[#07261B] border border-[#14533C] flex items-center justify-center shrink-0">
                  <Coins className="w-4 h-4 text-emerald-400" />
                </div>
                <span>Agri-Finance</span>
              </button>
              <button
                onClick={() => {
                  setCurrentView("logistics");
                  setIsMoreMenuOpen(false);
                }}
                className="p-3.5 rounded-2xl bg-[#10171B] hover:bg-[#162228] border border-[#1D2A32] flex items-center gap-3 text-left text-white cursor-pointer min-h-[48px]"
              >
                <div className="w-8 h-8 rounded-xl bg-[#07261B] border border-[#14533C] flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 text-emerald-400" />
                </div>
                <span>Logistics & Silos</span>
              </button>
              <button
                onClick={() => {
                  setCurrentView("trade");
                  setIsMoreMenuOpen(false);
                }}
                className="p-3.5 rounded-2xl bg-[#10171B] hover:bg-[#162228] border border-[#1D2A32] flex items-center gap-3 text-left text-white cursor-pointer min-h-[48px]"
              >
                <div className="w-8 h-8 rounded-xl bg-[#07261B] border border-[#14533C] flex items-center justify-center shrink-0">
                  <Globe2 className="w-4 h-4 text-emerald-400" />
                </div>
                <span>AfCFTA Trade</span>
              </button>
              <button
                onClick={() => {
                  setCurrentView("government");
                  setIsMoreMenuOpen(false);
                }}
                className="p-3.5 rounded-2xl bg-[#10171B] hover:bg-[#162228] border border-[#1D2A32] flex items-center gap-3 text-left text-white cursor-pointer min-h-[48px]"
              >
                <div className="w-8 h-8 rounded-xl bg-[#07261B] border border-[#14533C] flex items-center justify-center shrink-0">
                  <Landmark className="w-4 h-4 text-emerald-400" />
                </div>
                <span>Gov Policy</span>
              </button>
              <button
                onClick={() => {
                  setCurrentView("consent");
                  setIsMoreMenuOpen(false);
                }}
                className="p-3.5 rounded-2xl bg-[#07261B] hover:bg-[#0B3828] flex items-center gap-3 text-left text-emerald-300 col-span-2 cursor-pointer min-h-[48px]"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white">Data Sovereignty & Privacy Controls</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B1013]/95 backdrop-blur-md lg:hidden px-3 py-2 shadow-2xl">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setCurrentView("dashboard")}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 text-[10px] font-semibold transition-colors min-h-[44px] justify-center cursor-pointer ${
              currentView === "dashboard" ? "text-white font-bold" : "text-slate-400"
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 ${currentView === "dashboard" ? "text-emerald-400" : "text-slate-400"}`} />
            <span>Home</span>
          </button>

          <button
            onClick={() => setCurrentView("farms")}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 text-[10px] font-semibold transition-colors min-h-[44px] justify-center cursor-pointer ${
              currentView === "farms" ? "text-white font-bold" : "text-slate-400"
            }`}
          >
            <Sprout className={`w-5 h-5 ${currentView === "farms" ? "text-emerald-400" : "text-slate-400"}`} />
            <span>Farms</span>
          </button>

          {/* Prominent Center Copilot Button */}
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="flex flex-col items-center -mt-6 cursor-pointer"
            id="mobile-copilot-prominent-button"
          >
            <div className="w-13 h-13 rounded-full bg-[#0B3D2C] text-white flex items-center justify-center shadow-xl ring-4 ring-[#0B1013] active:scale-95 transition-transform">
              <MessageSquare className="w-5 h-5 text-emerald-300" />
            </div>
            <span className="text-[10px] font-bold text-white mt-1">Assistant</span>
          </button>

          <button
            onClick={() => setCurrentView("marketplace")}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 text-[10px] font-semibold transition-colors min-h-[44px] justify-center cursor-pointer ${
              currentView === "marketplace" ? "text-white font-bold" : "text-slate-400"
            }`}
          >
            <ShoppingBag className={`w-5 h-5 ${currentView === "marketplace" ? "text-emerald-400" : "text-slate-400"}`} />
            <span>Market</span>
          </button>

          <button
            onClick={() => setIsMoreMenuOpen(true)}
            className="flex flex-col items-center gap-1 py-1.5 px-3 text-[10px] font-semibold text-slate-400 hover:text-white min-h-[44px] justify-center cursor-pointer"
          >
            <Menu className="w-5 h-5" />
            <span>More</span>
          </button>
        </div>
      </nav>
    </>
  );
};
