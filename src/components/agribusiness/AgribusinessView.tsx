import React, { useState } from "react";
import {
  Building2,
  Users,
  ShieldCheck,
  TrendingUp,
  BarChart2,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Package,
  Boxes,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AutomatedInventoryTracker } from "./AutomatedInventoryTracker";

export const AgribusinessView: React.FC = () => {
  const { currentFarm } = useApp();
  const [activeTab, setActiveTab] = useState<"inventory" | "procurement">("inventory");

  const suppliers = [
    {
      name: "Cape Grain Farm (James Ndlovu)",
      region: "Free State, ZA",
      crop: "Yellow Maize",
      contractedMT: 250,
      predictedQuality: "Grade 1 (Moisture 12.2%)",
      riskScore: "Low (12/100)",
      deliveryDate: "Oct 24, 2026",
      status: "On Track",
    },
    {
      name: "Nakuru Highland Cooperative",
      region: "Rift Valley, KE",
      crop: "White Maize & Beans",
      contractedMT: 600,
      predictedQuality: "Grade 1 (Moisture 12.8%)",
      riskScore: "Low (16/100)",
      deliveryDate: "Nov 02, 2026",
      status: "On Track",
    },
    {
      name: "Dawanau Grain Aggregators",
      region: "Kano, NG",
      crop: "Sorghum & Millet",
      contractedMT: 450,
      predictedQuality: "Grade 2 (Moisture 13.4%)",
      riskScore: "Medium (34/100)",
      deliveryDate: "Nov 15, 2026",
      status: "Moisture Advisory",
    },
  ];

  return (
    <div className="space-y-6">
      {/* View Mode Navigation Switcher */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-[#10171B] p-2 rounded-2xl border border-[#1D2A32] shadow-xs">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "inventory"
              ? "bg-[#0B3D2C] text-white border border-[#196349] shadow-xs"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Package className="w-4 h-4 text-emerald-400" />
          <span>Automated Inventory Tracker</span>
          <span className="font-mono text-[10px] bg-[#07261B] text-emerald-300 px-2 py-0.5 rounded-full border border-[#14533C]">
            Fertilizer & Seed AI
          </span>
        </button>

        <button
          onClick={() => setActiveTab("procurement")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "procurement"
              ? "bg-[#0B3D2C] text-white border border-[#196349] shadow-xs"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span>Outgrower Procurement & Off-Take</span>
          <span className="font-mono text-[10px] bg-[#07261B] text-emerald-300 px-2 py-0.5 rounded-full border border-[#14533C]">
            1,300 MT Earmarked
          </span>
        </button>
      </div>

      {activeTab === "inventory" ? (
        <AutomatedInventoryTracker />
      ) : (
        <>
          {/* Top Banner */}
          <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Enterprise Agribusiness & Off-Taker Supply Chain
                </h2>
                <span className="text-xs font-mono font-bold text-emerald-300 bg-[#07261B] px-2.5 py-0.5 rounded border border-[#14533C]">
                  Procurement Management
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                End-to-end outgrower visibility, pre-harvest quality forecasting, and automated supplier scorecards.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-[#07261B] px-4 py-2.5 rounded-xl border border-[#14533C] text-right">
                <div className="text-[10px] font-bold uppercase text-slate-400">Total Contracted Volume</div>
                <div className="text-base font-mono font-extrabold text-emerald-300 mt-0.5">
                  1,300 MT Earmarked
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access to Inventory Tracker Banner */}
          <div className="bg-[#10171B] rounded-2xl p-4 sm:p-5 border border-emerald-900/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B3D2C] border border-[#14533C] text-emerald-400 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-extrabold text-sm text-white">
                    Automated Inventory Tracker Active
                  </h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#07261B] text-emerald-300 border border-[#14533C]">
                    Depletion Modeling Live
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Predictive stock levels for fertilizer compounds and hybrid seed varieties calibrated to seasonal planting curves.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("inventory")}
              className="px-4 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold border border-[#196349] transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 min-h-[40px]"
            >
              <span>View Inventory Tracker</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
            </button>
          </div>

          {/* KPI Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contracted Smallholders</div>
              <div className="text-xl font-mono font-extrabold text-white mt-1">682 Farms</div>
              <div className="text-[11px] text-emerald-300 mt-0.5">100% Geofenced</div>
            </div>

            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pre-Harvest Quality Index</div>
              <div className="text-xl font-mono font-extrabold text-emerald-300 mt-1">94.8% Grade 1</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Sentinel-2 Predicted</div>
            </div>

            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fulfilled to Date</div>
              <div className="text-xl font-mono font-extrabold text-white mt-1">420 MT</div>
              <div className="text-[11px] text-cyan-300 mt-0.5">32.3% In Silo</div>
            </div>

            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Escrow Value Protected</div>
              <div className="text-xl font-mono font-extrabold text-white mt-1">$440,000</div>
              <div className="text-[11px] text-emerald-300 mt-0.5">Zero Default Risk</div>
            </div>
          </div>

          {/* Outgrower & Supplier Quality Scorecard Table */}
          <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] mb-4 gap-2">
              <div>
                <h3 className="font-bold text-sm text-white">Contracted Outgrower Pipeline & Quality Scorecard</h3>
                <p className="text-xs text-slate-400">Live NDVI spectral biomass vs. agreed forward delivery volume</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-300 bg-[#07261B] px-2.5 py-1 rounded-lg border border-[#14533C]">
                SGS / SAFEX Calibrated
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#19262F] text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-3 font-bold">Supplier / Farm</th>
                    <th className="pb-3 font-bold">Commodity</th>
                    <th className="pb-3 font-bold">Volume</th>
                    <th className="pb-3 font-bold">Predicted Quality</th>
                    <th className="pb-3 font-bold">Risk Level</th>
                    <th className="pb-3 font-bold">Delivery Window</th>
                    <th className="pb-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#19262F]">
                  {suppliers.map((s, idx) => (
                    <tr key={idx} className="hover:bg-[#162228]/80 transition-colors">
                      <td className="py-3.5">
                        <div className="font-bold text-white">{s.name}</div>
                        <div className="text-[11px] text-slate-400">{s.region}</div>
                      </td>
                      <td className="py-3.5 font-medium text-slate-300">{s.crop}</td>
                      <td className="py-3.5 font-mono font-bold text-white">{s.contractedMT} MT</td>
                      <td className="py-3.5 text-slate-300 font-semibold">{s.predictedQuality}</td>
                      <td className="py-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            s.riskScore.startsWith("Low")
                              ? "bg-[#07261B] border border-[#14533C] text-emerald-300"
                              : "bg-amber-950/80 border border-amber-800 text-amber-300"
                          }`}
                        >
                          {s.riskScore}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-400 font-mono">{s.deliveryDate}</td>
                      <td className="py-3.5 text-right">
                        <button className="text-emerald-300 font-bold hover:underline cursor-pointer min-h-[36px] px-2">
                          Inspect Twin →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

