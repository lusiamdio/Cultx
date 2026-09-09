import React, { useState } from "react";
import {
  Globe2,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  Circle,
  TrendingUp,
  Download,
  Building2,
  Sparkles,
  ArrowRight,
  CreditCard,
  Truck,
  Calculator,
  Lock,
  RefreshCw,
  Clock,
  Coins,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { ExportDossierModal } from "./ExportDossierModal";

export const ExportTradeView: React.FC = () => {
  const { currentFarm } = useApp();
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);

  // 7 Required AfCFTA Export Documents (Blueprint Section 17)
  const [checklist, setChecklist] = useState([
    { id: "phyto", name: "Phytosanitary Certificate", authority: "NPPO / Ministry of Agriculture", status: "Verified & Digitally Sealed", completed: true },
    { id: "origin", name: "Certificate of Origin (AfCFTA)", authority: "Chamber of Commerce", status: "0% Preferential Duty Granted", completed: true },
    { id: "bol", name: "Multimodal Bill of Lading", authority: "Durban Grain Terminal / Ocean Carrier", status: "Issued #BL-ZA-2026-991", completed: true },
    { id: "invoice", name: "Commercial Invoice (PAPSS E-Invoicing)", authority: "Standard Bank Trade Desk", status: "Pre-cleared with Buyer", completed: true },
    { id: "packing", name: "Verified Packing List", authority: "Cape Farm Packing Station", status: "250 MT in 50kg Bags", completed: true },
    { id: "quality", name: "Quality Inspection Certificate (SAFEX/SGS)", authority: "SGS Agricultural Testing", status: "Moisture 12.1%, Grade 1", completed: true },
    { id: "fumigation", name: "Fumigation & Quarantine Certificate", authority: "Port Health Authority", status: "Phosphine Gas Treated", completed: true },
  ]);

  // Interactive PAPSS Escrow Lifecycle Tracker
  const [escrowStage, setEscrowStage] = useState<1 | 2 | 3 | 4>(2);
  const [isAdvancingEscrow, setIsAdvancingEscrow] = useState(false);

  // AfCFTA Tariff & Duty Calculator State
  const [calcCorridor, setCalcCorridor] = useState("za_ke");
  const [calcCommodity, setCalcCommodity] = useState("Yellow Maize (HS 1005.90)");
  const [calcTonnage, setCalcTonnage] = useState("200");

  const corridorsData: Record<
    string,
    { name: string; origin: string; dest: string; mfnRate: number; fxSavingPct: number; transitDays: number; origCurr: string; destCurr: string }
  > = {
    za_ke: {
      name: "Durban ➔ Mombasa (Southern-East Africa Corridor)",
      origin: "South Africa",
      dest: "Kenya",
      mfnRate: 25.0,
      fxSavingPct: 4.4,
      transitDays: 8,
      origCurr: "ZAR",
      destCurr: "KES",
    },
    ci_ng: {
      name: "Abidjan ➔ Lagos (Abidjan-Lagos Coastal Corridor)",
      origin: "Côte d'Ivoire",
      dest: "Nigeria",
      mfnRate: 20.0,
      fxSavingPct: 5.1,
      transitDays: 4,
      origCurr: "XOF",
      destCurr: "NGN",
    },
    gh_eg: {
      name: "Tema ➔ Alexandria (West-North Trans-Sahara Route)",
      origin: "Ghana",
      dest: "Egypt",
      mfnRate: 30.0,
      fxSavingPct: 4.8,
      transitDays: 14,
      origCurr: "GHS",
      destCurr: "EGP",
    },
    et_rw: {
      name: "Addis Ababa ➔ Kigali (Northern Corridor Extension)",
      origin: "Ethiopia",
      dest: "Rwanda",
      mfnRate: 18.0,
      fxSavingPct: 3.9,
      transitDays: 6,
      origCurr: "ETB",
      destCurr: "RWF",
    },
    lobito_ao_zm: {
      name: "Ndola / Kolwezi ➔ Port of Lobito (Lobito Atlantic Rail Corridor)",
      origin: "Zambia & DR Congo",
      dest: "Angola (Atlantic Deepwater Port)",
      mfnRate: 22.0,
      fxSavingPct: 6.8,
      transitDays: 2,
      origCurr: "ZMW",
      destCurr: "AOA",
    },
  };

  const currentCorridorInfo = corridorsData[calcCorridor];
  const tons = Number(calcTonnage) || 100;
  const cargoValueUsd = tons * 280; // approx $280/MT
  const mfnDutyUsd = (cargoValueUsd * currentCorridorInfo.mfnRate) / 100;
  const afcftaDutyUsd = 0; // 0% under AfCFTA preferential regime
  const fxSavingsUsd = (cargoValueUsd * currentCorridorInfo.fxSavingPct) / 100;
  const netSavingsUsd = mfnDutyUsd + fxSavingsUsd;

  const toggleDoc = (id: string) => {
    setChecklist((docs) =>
      docs.map((d) => (d.id === id ? { ...d, completed: !d.completed } : d))
    );
  };

  const completedCount = checklist.filter((d) => d.completed).length;

  const handleAdvanceEscrow = () => {
    setIsAdvancingEscrow(true);
    setTimeout(() => {
      setIsAdvancingEscrow(false);
      setEscrowStage((prev) => (prev < 4 ? ((prev + 1) as 1 | 2 | 3 | 4) : 1));
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              AfCFTA Trade Corridors & Cross-Border Export
            </h2>
            <span className="text-xs font-bold text-emerald-300 bg-[#07261B] px-2.5 py-0.5 rounded-full border border-[#14533C]">
              Zero-Tariff Protocol Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Accelerating intra-African agricultural commerce under the African Continental Free Trade Area.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#162228] px-4 py-2 rounded-xl border border-[#1D2A32]">
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-400">PAPSS Multi-Currency</div>
            <div className="text-xs font-bold text-white">Instant Local Settlement</div>
          </div>
          <CreditCard className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      {/* Export Checklist (The 7 Documents Blueprint Mandate) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#19262F] mb-4">
            <div>
              <h3 className="font-extrabold text-base text-white">
                AfCFTA Export Documentation Checklist (7 Core Certificates)
              </h3>
              <p className="text-xs text-slate-400">
                Mandatory sanitary, origin, and transport documents required for zero-duty clearance.
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm font-mono font-extrabold text-emerald-300">
                {completedCount} / 7
              </span>
              <span className="text-xs text-slate-400 block">Compliant</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {checklist.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setIsDossierModalOpen(true)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  doc.completed
                    ? "bg-[#07261B] border-[#14533C] hover:border-[#196349]"
                    : "bg-[#162228] border-[#1D2A32] hover:border-[#14533C]"
                }`}
              >
                <div className="flex items-center gap-3">
                  {doc.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                  <div>
                    <div className="font-bold text-xs text-white">{doc.name}</div>
                    <div className="text-[11px] text-slate-400">Authority: {doc.authority}</div>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      doc.completed
                        ? "bg-[#0B3D2C] text-emerald-300 border-[#196349]"
                        : "bg-amber-950/40 text-amber-300 border-amber-800/60"
                    }`}
                  >
                    {doc.status}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-[#19262F] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              Encrypted digital single-window submission to African Customs
            </span>
            <button
              onClick={() => setIsDossierModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] cursor-pointer shadow-md transition-all flex items-center gap-2 min-h-[44px]"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Inspect 7-Document Dossier Package →</span>
            </button>
          </div>
        </div>

        {/* Pan-African Payment & Settlement System (PAPSS) Live Escrow Tracker */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#07261B] text-white rounded-2xl p-6 border border-[#14533C] shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h4 className="font-extrabold text-sm text-white">PAPSS Live Escrow Milestones</h4>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#0B3D2C] text-emerald-300 px-2 py-0.5 rounded border border-[#196349]">
                Corridor Escrow #ZA-KE-91
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Real-time payment release tied directly to GPS telematic weighbridge and phytosanitary border clearance without foreign currency delays.
            </p>

            {/* 4 Interactive Escrow Milestones */}
            <div className="space-y-3 pt-1">
              {/* Milestone 1 */}
              <div
                className={`p-3 rounded-xl border text-xs transition-all ${
                  escrowStage >= 1
                    ? "bg-[#0B3D2C] border-[#196349] text-white"
                    : "bg-[#10171B] border-[#1D2A32] text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>1. Buyer Escrow Locked in Local Currency</span>
                  {escrowStage >= 1 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div className="text-[11px] text-slate-300 mt-1 font-mono">
                  KES 41,180,000 locked via Safaricom / Stanbic Kenya
                </div>
              </div>

              {/* Milestone 2 */}
              <div
                className={`p-3 rounded-xl border text-xs transition-all ${
                  escrowStage >= 2
                    ? "bg-[#0B3D2C] border-[#196349] text-white"
                    : "bg-[#10171B] border-[#1D2A32] text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>2. Corridor Weighbridge Checkpoint</span>
                  {escrowStage >= 2 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div className="text-[11px] text-slate-300 mt-1 font-mono">
                  Beitbridge Weighbridge Slip #BB-8812 verified (201.2 MT)
                </div>
              </div>

              {/* Milestone 3 */}
              <div
                className={`p-3 rounded-xl border text-xs transition-all ${
                  escrowStage >= 3
                    ? "bg-[#0B3D2C] border-[#196349] text-white"
                    : "bg-[#10171B] border-[#1D2A32] text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>3. Phytosanitary Customs Green Light</span>
                  {escrowStage >= 3 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div className="text-[11px] text-slate-300 mt-1 font-mono">
                  Malaba Single-Window Digital Phytosanitary Stamp Issued
                </div>
              </div>

              {/* Milestone 4 */}
              <div
                className={`p-3 rounded-xl border text-xs transition-all ${
                  escrowStage >= 4
                    ? "bg-[#0B3D2C] border-[#196349] text-white"
                    : "bg-[#10171B] border-[#1D2A32] text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>4. Instant Multi-Currency Disbursement</span>
                  {escrowStage >= 4 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div className="text-[11px] text-slate-300 mt-1 font-mono">
                  R5,420,000 ZAR auto-credited to Cape Farm Reserve Bank account
                </div>
              </div>
            </div>

            {/* Advance Escrow Milestone Simulator Button */}
            <button
              onClick={handleAdvanceEscrow}
              disabled={isAdvancingEscrow}
              className="w-full py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] cursor-pointer shadow-md transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-300 ${isAdvancingEscrow ? "animate-spin" : ""}`} />
              <span>
                {escrowStage === 4
                  ? "Reset Escrow Simulation"
                  : `Advance to Milestone ${escrowStage + 1} →`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* AfCFTA Preferential Duty vs Traditional MFN Tariff Calculator */}
      <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#07261B] text-emerald-400 flex items-center justify-center font-bold border border-[#14533C]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                AfCFTA Preferential Duty & PAPSS Currency Savings Calculator
              </h3>
              <p className="text-xs text-slate-400">
                Simulate exact duty savings under AfCFTA vs traditional WTO Most-Favored-Nation (MFN) tariffs.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-300 bg-[#07261B] px-2.5 py-1 rounded-lg border border-[#14533C]">
            Annex 2 Rules of Origin
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Select Trade Corridor</label>
            <select
              value={calcCorridor}
              onChange={(e) => setCalcCorridor(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#1D2A32] font-semibold text-white bg-[#162228] focus:border-emerald-500 focus:outline-none"
            >
              {Object.entries(corridorsData).map(([key, c]) => (
                <option key={key} value={key} className="bg-[#162228] text-white">
                  {c.origin} ➔ {c.dest} ({c.name.split(" ")[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Commodity & HS Code</label>
            <select
              value={calcCommodity}
              onChange={(e) => setCalcCommodity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#1D2A32] font-semibold text-white bg-[#162228] focus:border-emerald-500 focus:outline-none"
            >
              <option value="Yellow Maize (HS 1005.90)" className="bg-[#162228] text-white">Yellow Maize (HS 1005.90)</option>
              <option value="Raw Soybeans (HS 1201.90)" className="bg-[#162228] text-white">Raw Soybeans (HS 1201.90)</option>
              <option value="Sunflower Oil Cake (HS 2306.30)" className="bg-[#162228] text-white">Sunflower Oil Cake (HS 2306.30)</option>
              <option value="Sorghum Grain (HS 1007.90)" className="bg-[#162228] text-white">Sorghum Grain (HS 1007.90)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Consignment Volume (Metric Tonnes)</label>
            <input
              type="number"
              value={calcTonnage}
              onChange={(e) => setCalcTonnage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#1D2A32] font-mono font-bold text-white bg-[#162228] focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Real-time Economic Comparison Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32] space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Traditional MFN Duty</span>
            <div className="text-lg font-mono font-extrabold text-red-400">
              ${mfnDutyUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Rate: {currentCorridorInfo.mfnRate}% tariff before AfCFTA
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#07261B] border border-[#14533C] space-y-1">
            <span className="text-[11px] font-bold text-emerald-300 uppercase">AfCFTA Preferential Duty</span>
            <div className="text-lg font-mono font-extrabold text-emerald-300">
              $0.00 (100% Exempt)
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">
              0% Import Tariff (Wholly Produced RoO)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32] space-y-1">
            <span className="text-[11px] font-bold text-emerald-300 uppercase">PAPSS Currency Savings</span>
            <div className="text-lg font-mono font-extrabold text-white">
              +${fxSavingsUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Zero USD routing ({currentCorridorInfo.origCurr} ⇄ {currentCorridorInfo.destCurr})
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0B3D2C] border border-[#196349] text-white space-y-1">
            <span className="text-[11px] font-bold text-emerald-300 uppercase">Net Economic Benefit</span>
            <div className="text-lg font-mono font-extrabold text-white">
              +${netSavingsUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-[10px] text-slate-300 font-mono">
              Est. Transit: {currentCorridorInfo.transitDays} Days
            </div>
          </div>
        </div>
      </div>

      <ExportDossierModal
        isOpen={isDossierModalOpen}
        onClose={() => setIsDossierModalOpen(false)}
      />
    </div>
  );
};
