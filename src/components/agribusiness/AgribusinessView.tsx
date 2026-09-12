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
  LineChart as LineChartIcon,
  Globe2,
  Award,
  Download,
  Bell,
  RefreshCw,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AutomatedInventoryTracker } from "./AutomatedInventoryTracker";
import { D3QuarterlyProjectionChart } from "./D3QuarterlyProjectionChart";
import { AIComplianceReportModal } from "./AIComplianceReportModal";
import { ExportComplianceAlertBanner } from "./ExportComplianceAlertBanner";

export const AgribusinessView: React.FC = () => {
  const { currentFarm } = useApp();
  const [activeTab, setActiveTab] = useState<"projections" | "inventory" | "procurement">("projections");
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [currentBufferPct, setCurrentBufferPct] = useState<number>(11.4);

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
      {/* Top Command Banner with African Agricultural Tech Brand Palette */}
      <div className="bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#FDFBF7] tracking-tight">
              Enterprise Agribusiness & Input Supply Command
            </h2>
            <span className="text-xs font-mono font-bold text-[#22C55E] bg-[#07261B] px-2.5 py-0.5 rounded border border-[#14533C]">
              AfCFTA Cross-Border Verified
            </span>
            <span className="text-xs font-mono font-bold text-[#F5B942] bg-[#3D2C0D] px-2.5 py-0.5 rounded border border-[#785418]">
              Codex Compliant
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Multi-quarter algorithmic forecasting for seeds and fertilizers, predictive outgrower supply chains, and automated alignment with global food security standards.
          </p>
        </div>

        {/* Global Compliance Report Trigger Button (Primary CTA #14532D) */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#0F3D22] text-[#FDFBF7] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95 min-h-[44px]"
            id="generate-compliance-report-btn"
          >
            <Sparkles className="w-4 h-4 text-[#F5B942]" />
            <span>Generate Compliance Report</span>
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#F5B942] hover:bg-[#E5A832] text-[#1A1105] text-xs font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95 min-h-[44px]"
            id="view-food-security-audit-btn"
          >
            <Award className="w-4 h-4 text-[#1A1105]" />
            <span>Audit Standards</span>
          </button>
        </div>
      </div>

      {/* Regional Export Compliance Notification Trigger Banner */}
      <ExportComplianceAlertBanner
        currentBufferPct={currentBufferPct}
        mandatoryThresholdPct={15.0}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onBufferRestored={() => setCurrentBufferPct(24.6)}
      />

      {/* Navigation Switcher Tabs */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-[#10171B] p-2 rounded-2xl border border-[#1D2A32] shadow-xs">
        <button
          onClick={() => setActiveTab("projections")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "projections"
              ? "bg-[#14532D] text-[#FDFBF7] shadow-xs"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <LineChartIcon className="w-4 h-4 text-[#F5B942]" />
          <span>3-Quarter Demand vs. Stock (D3)</span>
          <span className="font-mono text-[10px] bg-[#3D2C0D] text-[#F5B942] px-2 py-0.5 rounded-full border border-[#785418]">
            Interactive D3.js
          </span>
        </button>

        <button
          onClick={() => setActiveTab("inventory")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "inventory"
              ? "bg-[#14532D] text-[#FDFBF7] shadow-xs"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Package className="w-4 h-4 text-[#22C55E]" />
          <span>Automated Inventory Tracker</span>
          <span className="font-mono text-[10px] bg-[#07261B] text-[#22C55E] px-2 py-0.5 rounded-full border border-[#14533C]">
            SKU Depletion
          </span>
        </button>

        <button
          onClick={() => setActiveTab("procurement")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "procurement"
              ? "bg-[#14532D] text-[#FDFBF7] shadow-xs"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Building2 className="w-4 h-4 text-[#22C55E]" />
          <span>Outgrower Procurement & Off-Take</span>
          <span className="font-mono text-[10px] bg-[#07261B] text-[#22C55E] px-2 py-0.5 rounded-full border border-[#14533C]">
            1,300 MT Earmarked
          </span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === "projections" && (
        <div className="space-y-6">
          {/* Integrated D3 Line Chart */}
          <D3QuarterlyProjectionChart
            onTriggerAlert={(month, stock, threshold) => {
              setCurrentBufferPct(Number(((stock / 1250) * 100).toFixed(1)));
            }}
          />

          {/* Strategic Context Cards for the 3-Quarter Outlook */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Q4 2026: Basal Planting Window
                </span>
                <span className="text-[10px] font-mono font-bold bg-[#14532D] text-[#FDFBF7] px-2 py-0.5 rounded">
                  High Demand
                </span>
              </div>
              <div className="text-xl font-mono font-extrabold text-[#FDFBF7]">1,020 MT Combined</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                682 smallholders broadcasting NPK 10-20-10 basal compound with PAN 53 hybrid seed. Peak burn rate reaches 32 MT/day during initial soil wetting.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#10171B] border border-[#78350F] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Q1 2027: Top-Dress Vulnerability
                </span>
                <span className="text-[10px] font-mono font-bold bg-[#3E1010] text-[#FCA5A5] px-2 py-0.5 rounded">
                  Buffer Deficit
                </span>
              </div>
              <div className="text-xl font-mono font-extrabold text-[#DC2626]">Feb 2027: 140 MT Stock</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Urea 46-0-0 stocks dip below the 175 MT (15%) export compliance floor without expedited transit. Lobito rail cargo PO-OCP-9921 must arrive before week 20.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Q2 2027: Grain Intake & Storage
                </span>
                <span className="text-[10px] font-mono font-bold bg-[#07261B] text-[#22C55E] px-2 py-0.5 rounded">
                  Stabilized
                </span>
              </div>
              <div className="text-xl font-mono font-extrabold text-[#22C55E]">1,300 MT Intake</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Commercial grain silos accept contracted harvest with verified moisture &lt; 12.5% and zero aflatoxin contamination for regional export.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "inventory" && <AutomatedInventoryTracker />}

      {activeTab === "procurement" && (
        <div className="space-y-6">
          {/* Top KPI Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contracted Smallholders</div>
              <div className="text-xl font-mono font-extrabold text-[#FDFBF7] mt-1">682 Farms</div>
              <div className="text-[11px] text-[#22C55E] mt-0.5">100% Geofenced</div>
            </div>

            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pre-Harvest Quality Index</div>
              <div className="text-xl font-mono font-extrabold text-[#22C55E] mt-1">94.8% Grade 1</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Sentinel-2 Predicted</div>
            </div>

            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fulfilled to Date</div>
              <div className="text-xl font-mono font-extrabold text-[#FDFBF7] mt-1">420 MT</div>
              <div className="text-[11px] text-cyan-300 mt-0.5">32.3% In Silo</div>
            </div>

            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Escrow Value Protected</div>
              <div className="text-xl font-mono font-extrabold text-[#FDFBF7] mt-1">$440,000</div>
              <div className="text-[11px] text-[#22C55E] mt-0.5">Zero Default Risk</div>
            </div>
          </div>

          {/* Outgrower & Supplier Quality Scorecard Table */}
          <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] mb-4 gap-2">
              <div>
                <h3 className="font-bold text-sm text-[#FDFBF7]">Contracted Outgrower Pipeline & Quality Scorecard</h3>
                <p className="text-xs text-slate-400">Live NDVI spectral biomass vs. agreed forward delivery volume</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#22C55E] bg-[#07261B] px-2.5 py-1 rounded-lg border border-[#14533C]">
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
                        <div className="font-bold text-[#FDFBF7]">{s.name}</div>
                        <div className="text-[11px] text-slate-400">{s.region}</div>
                      </td>
                      <td className="py-3.5 font-medium text-slate-300">{s.crop}</td>
                      <td className="py-3.5 font-mono font-bold text-[#FDFBF7]">{s.contractedMT} MT</td>
                      <td className="py-3.5 text-slate-300 font-semibold">{s.predictedQuality}</td>
                      <td className="py-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            s.riskScore.startsWith("Low")
                              ? "bg-[#07261B] border border-[#14533C] text-[#22C55E]"
                              : "bg-[#2A180E] border border-[#78350F] text-[#F5B942]"
                          }`}
                        >
                          {s.riskScore}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-400 font-mono">{s.deliveryDate}</td>
                      <td className="py-3.5 text-right">
                        <button onClick={() => setActiveTab("procurement")} className="text-[#22C55E] font-bold hover:underline cursor-pointer min-h-[36px] px-2">
                          Inspect Twin →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* AI Compliance Report Modal */}
      <AIComplianceReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
