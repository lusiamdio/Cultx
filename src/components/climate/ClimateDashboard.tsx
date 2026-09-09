import React, { useState } from "react";
import {
  CloudSunRain,
  CloudRain,
  Sun,
  Wind,
  Droplet,
  AlertTriangle,
  Calendar,
  Sparkles,
  TrendingDown,
  Compass,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const ClimateDashboard: React.FC = () => {
  const { currentFarm, setIsCopilotOpen } = useApp();
  const [selectedHorizon, setSelectedHorizon] = useState<"14d" | "30d" | "seasonal">("14d");

  const forecastDays = [
    { day: "Today", temp: "24°C", rainMm: 0, rainProb: "5%", condition: "Sunny", icon: Sun, advice: "Ideal for tractor cultivation" },
    { day: "Tomorrow", temp: "26°C", rainMm: 2, rainProb: "20%", condition: "Partly Cloudy", icon: CloudSunRain, advice: "Monitor Field 03 soil moisture" },
    { day: "Thursday", temp: "22°C", rainMm: 18, rainProb: "65%", condition: "Scattered Showers", icon: CloudRain, advice: "Prepare irrigation shutdown" },
    { day: "Friday", temp: "20°C", rainMm: 34, rainProb: "85%", condition: "Heavy Rain (Convective)", icon: CloudRain, advice: "DO NOT spray foliar chemicals" },
    { day: "Saturday", temp: "21°C", rainMm: 12, rainProb: "55%", condition: "Overcast Showers", icon: CloudRain, advice: "Water runoff absorption" },
    { day: "Sunday", temp: "23°C", rainMm: 0, rainProb: "10%", condition: "Clear Skies", icon: Sun, advice: "Resume top-dress fertilizer" },
    { day: "Monday", temp: "25°C", rainMm: 0, rainProb: "5%", condition: "Sunny", icon: Sun, advice: "Optimal vegetative growth" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Action-Oriented Decision Intelligence */}
      <div className="bg-[#07261B] rounded-2xl p-6 text-white border border-[#14533C] shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0B3D2C] text-emerald-300 border border-[#196349] text-xs font-bold">
              <CloudSunRain className="w-3.5 h-3.5" />
              <span>Actionable Agronomic Weather Intelligence</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              34mm Convective Rain Arriving in 72 Hours
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">Agronomic Directive:</strong> Delay scheduled nitrogen top-dressing and pesticide foliar spraying until Sunday to avoid financial loss from chemical runoff.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#10171B] p-3.5 rounded-xl border border-[#1D2A32] text-center">
              <div className="text-[10px] font-bold uppercase text-slate-400">Drought Index</div>
              <div className="text-lg font-mono font-bold text-emerald-300 mt-0.5">Low (18%)</div>
            </div>
            <div className="bg-[#10171B] p-3.5 rounded-xl border border-[#1D2A32] text-center">
              <div className="text-[10px] font-bold uppercase text-slate-400">Flood Risk</div>
              <div className="text-lg font-mono font-bold text-amber-400 mt-0.5">Moderate</div>
            </div>
          </div>
        </div>
      </div>

      {/* 14-Day Calendar Forecast */}
      <div className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-sm">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] mb-4 gap-3">
          <div>
            <h3 className="font-bold text-sm text-white">14-Day Precipitation & Agronomic Scheduling</h3>
            <p className="text-xs text-slate-400">Telemetry from ECMWF + Multi-satellite GPM radar</p>
          </div>
          <div className="flex gap-1 text-xs">
            {["14d", "30d", "seasonal"].map((h) => (
              <button
                key={h}
                onClick={() => setSelectedHorizon(h as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold uppercase text-[11px] cursor-pointer transition-all min-h-[36px] ${
                  selectedHorizon === h
                    ? "bg-[#0B3D2C] text-white border border-[#196349]"
                    : "bg-[#162228] text-slate-400 hover:text-white border border-[#1D2A32]"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Forecast Days Scroller / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {forecastDays.map((d, i) => {
            const Icon = d.icon;
            const isHeavyRain = d.rainMm > 20;
            return (
              <div
                key={i}
                className={`p-3.5 rounded-xl border text-center flex flex-col justify-between transition-all ${
                  isHeavyRain
                    ? "bg-[#07261B] border-[#14533C] ring-1 ring-[#196349]"
                    : "bg-[#162228] border-[#1D2A32]"
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-white">{d.day}</div>
                  <div className="my-2 flex justify-center">
                    <Icon className={`w-7 h-7 ${isHeavyRain ? "text-emerald-400 animate-bounce" : "text-amber-400"}`} />
                  </div>
                  <div className="font-mono font-extrabold text-sm text-white">{d.temp}</div>
                  <div className="text-[11px] font-semibold text-emerald-300 mt-0.5">
                    {d.rainMm} mm ({d.rainProb})
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#19262F] text-[10px] text-slate-400 font-medium leading-tight">
                  {d.advice}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Climate Risk Indicators & Planting Windows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Optimal Planting & Spraying Windows */}
        <div className="lg:col-span-6 bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-white">Optimal Field Operation Windows</h3>
            <span className="text-[10px] font-bold text-emerald-300 bg-[#07261B] border border-[#14533C] px-2 py-0.5 rounded">
              Crop Phenology Model
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32] flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Chemical Spraying Window</div>
                <div className="text-slate-400 text-[11px]">Wind &lt; 8 km/h, zero precipitation</div>
              </div>
              <span className="font-mono font-bold text-emerald-300 bg-[#07261B] border border-[#14533C] px-2.5 py-1 rounded-lg">
                Sunday 06:00 - 11:00
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32] flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Harvest Readiness (Maize)</div>
                <div className="text-slate-400 text-[11px]">Kernel moisture reaching 13.5% target</div>
              </div>
              <span className="font-mono font-bold text-cyan-300 bg-[#07261B] border border-cyan-800/60 px-2.5 py-1 rounded-lg">
                Oct 15 - Oct 28
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32] flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Winter Cover Crop Seeding</div>
                <div className="text-slate-400 text-[11px]">Soil temperature optimal for legume germination</div>
              </div>
              <span className="font-mono font-bold text-purple-300 bg-[#07261B] border border-purple-800/60 px-2.5 py-1 rounded-lg">
                Nov 10 - Nov 22
              </span>
            </div>
          </div>
        </div>

        {/* Parametric Weather Insurance Trigger */}
        <div className="lg:col-span-6 bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-white">Parametric Climate Insurance</h3>
              <span className="text-[10px] font-bold text-cyan-300 bg-[#07261B] border border-cyan-800/60 px-2 py-0.5 rounded">
                Smart Contract Policy
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Your farm is protected under parametric satellite rainfall coverage. If precipitation falls below 45mm across a 30-day vegetative window, insurance automatically disburses to your account with zero claim forms.
            </p>

            <div className="mt-4 p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32] grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Cumulative Rainfall</span>
                <span className="font-mono font-bold text-white text-sm">62mm / 45mm threshold</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Payout Protection</span>
                <span className="font-mono font-bold text-emerald-300 text-sm">R180,000 Active</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#19262F] flex items-center justify-between text-xs mt-4">
            <span className="text-slate-400">Underwritten by African Risk Capacity (ARC)</span>
            <button
              onClick={() => setIsCopilotOpen(true)}
              className="text-emerald-300 font-bold hover:underline cursor-pointer flex items-center gap-1 min-h-[44px]"
            >
              <span>Simulate Drought Payout →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
