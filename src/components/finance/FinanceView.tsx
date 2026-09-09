import React, { useState } from "react";
import {
  Coins,
  ShieldCheck,
  Building,
  CheckCircle2,
  TrendingUp,
  Percent,
  Calendar,
  Lock,
  ArrowRight,
  Sparkles,
  FileCheck,
  Star,
  Users,
  Warehouse,
  QrCode,
  DollarSign,
  Download,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { EwrsReceipt } from "../../types";
import { FarmRevenueInputCostChart } from "./FarmRevenueInputCostChart";

export const FinanceView: React.FC = () => {
  const { currentFarm, financingProducts } = useApp();
  const [selectedProduct, setSelectedProduct] = useState(financingProducts[0]);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [requestedAmount, setRequestedAmount] = useState("150000");

  // Electronic Warehouse Receipt (e-WRS) State
  const [ewrsReceipt, setEwrsReceipt] = useState<EwrsReceipt>({
    receiptId: "EWRS-ZA-2026-08819",
    siloName: "Zambezi Commercial Silo #04 (SAFEX Licensed)",
    siloOperator: "Afrilog Grain Depots Ltd",
    commodity: "Yellow Maize (Grade 1)",
    metricTonnes: 150,
    moistureContent: 12.1,
    grade: "SAFEX Grade 1 (<12.5% moisture, <2% broken)",
    spotValueZar: 813000,
    tokenized: true,
    loanEligibility70Pct: 569100,
    loanStatus: "available",
    blockchainHash: "0x8fa19e42c771b009",
  });
  const [isDrawingLoan, setIsDrawingLoan] = useState(false);
  const [loanDrawnSuccess, setLoanDrawnSuccess] = useState(false);

  const handleDrawEwrsLoan = () => {
    setIsDrawingLoan(true);
    setTimeout(() => {
      setIsDrawingLoan(false);
      setEwrsReceipt((prev) => ({ ...prev, loanStatus: "drawn" }));
      setLoanDrawnSuccess(true);
    }, 1200);
  };

  const creditComponents = [
    { name: "Digital Twin Completeness", score: 98, weight: "25%", status: "Geofenced + 4 Parcels" },
    { name: "Historical Yield Consistency", score: 92, weight: "20%", status: "5-yr Mean: 6.2 t/ha" },
    { name: "Satellite NDVI Verification", score: 89, weight: "20%", status: "Optimal Chlorophyll" },
    { name: "Contract Delivery Reliability", score: 100, weight: "15%", status: "100% Off-Take Fulfilled" },
    { name: "Soil Health Index", score: 91, weight: "10%", status: "Mollisol Organic 3.8%" },
    { name: "Mobile Money & Bank Cashflow", score: 85, weight: "10%", status: "Clean Settlement History" },
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationSubmitted(true);
    setTimeout(() => {
      setApplicationSubmitted(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Alternative Agricultural Credit Profile */}
      <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Agri-Financing & Alternative Credit Intelligence
            </h2>
            <span className="text-xs font-bold text-emerald-300 bg-[#07261B] px-2.5 py-0.5 rounded-full border border-[#14533C]">
              Tier-1 Bankable Rating
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Overcoming traditional banking collateral constraints using satellite NDVI telemetry, soil health metrics, and verified digital off-take agreements.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#07261B] px-4 py-2.5 rounded-2xl border border-[#14533C]">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Composite Agri Trust Score
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold font-mono text-white">93.4</span>
              <span className="text-xs font-bold text-emerald-300">/ 100 (Prime)</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#0B3D2C] border border-[#196349] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            A+
          </div>
        </div>
      </div>

      {/* Credit Scoring Breakdown */}
      <div className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-sm">
        <h3 className="font-bold text-sm text-white mb-1">
          Alternative Underwriting Score Components
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Institutional underwriting algorithm transparently computed for African commercial lenders and development banks.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {creditComponents.map((comp, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32] space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">{comp.name}</span>
                <span className="font-mono text-[11px] font-bold text-slate-400">Weight: {comp.weight}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-mono font-extrabold text-emerald-300">
                  {comp.score} / 100
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{comp.status}</span>
              </div>
              <div className="w-full bg-[#10171B] h-1.5 rounded-full overflow-hidden border border-[#1D2A32]">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full"
                  style={{ width: `${comp.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Revenue vs Input Cost Optimization Widget (Recharts) */}
      <FarmRevenueInputCostChart />

      {/* Electronic Warehouse Receipt System (e-WRS) & Collateral Liquidity Engine */}
      <div className="bg-[#07261B] text-white rounded-2xl p-6 border border-[#14533C] shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B3D2C] border border-[#196349] flex items-center justify-center">
              <Warehouse className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  Electronic Warehouse Receipt (e-WRS) & 70% Grain Liquidity
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B3D2C] text-emerald-300 border border-[#196349]">
                  SAFEX Licensed Collateral
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Unlock immediate cashflow without forced harvest dumping. Your physical grain deposit is verified and tokenized.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold bg-[#10171B] px-3 py-1 rounded-xl text-emerald-300 border border-[#1D2A32]">
            Receipt: {ewrsReceipt.receiptId}
          </span>
        </div>

        {loanDrawnSuccess && (
          <div className="p-4 bg-[#0B3D2C] border border-[#196349] rounded-xl flex items-center justify-between text-xs text-white animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>
                <strong className="text-white">R{ewrsReceipt.loanEligibility70Pct.toLocaleString()} ZAR Disbursed!</strong> Working capital loan credited to your Cape Farm operational account at 9.2% AfDB rate.
              </span>
            </div>
            <span className="font-mono text-[10px] text-emerald-300">Lien Registered</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32] space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Licensed Silo Hub</span>
            <div className="font-bold text-white">{ewrsReceipt.siloName}</div>
            <div className="text-[10px] text-slate-400">{ewrsReceipt.siloOperator}</div>
          </div>

          <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32] space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Deposited Commodity</span>
            <div className="font-bold text-white">{ewrsReceipt.metricTonnes} MT {ewrsReceipt.commodity}</div>
            <div className="text-[10px] text-emerald-300 font-mono">Moisture: {ewrsReceipt.moistureContent}% (Grade 1)</div>
          </div>

          <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32] space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Collateral Spot Value</span>
            <div className="font-mono font-extrabold text-white text-base">R{ewrsReceipt.spotValueZar.toLocaleString()} ZAR</div>
            <div className="text-[10px] text-slate-400 font-mono">SAFEX spot parity benchmark</div>
          </div>

          <div className="p-3 bg-[#0B3D2C]/60 rounded-xl border border-[#196349] space-y-1">
            <span className="text-[10px] font-bold text-emerald-300 uppercase">70% Loan Drawdown Power</span>
            <div className="font-mono font-extrabold text-white text-base">
              R{ewrsReceipt.loanEligibility70Pct.toLocaleString()} ZAR
            </div>
            <div className="text-[10px] text-emerald-300">9.2% Subsidized Annual Interest</div>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-[#14533C]">
          <div className="flex items-center gap-2 text-slate-300">
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-[11px]">Cryptographic Token Hash: {ewrsReceipt.blockchainHash}</span>
          </div>

          <div className="flex items-center gap-2">
            {ewrsReceipt.loanStatus === "drawn" ? (
              <span className="px-4 py-2 rounded-xl bg-[#0B3D2C] border border-[#196349] text-white font-bold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Loan Active (R569,100 ZAR Drawn)</span>
              </span>
            ) : (
              <button
                onClick={handleDrawEwrsLoan}
                disabled={isDrawingLoan}
                className="px-5 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all border border-[#196349] min-h-[44px]"
              >
                <DollarSign className="w-4 h-4" />
                <span>{isDrawingLoan ? "Liquidating..." : "Draw Down 70% Working Capital Loan →"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Financial Products Catalog & Instant Pre-Approval Application */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Products List */}
        <div className="lg:col-span-6 space-y-3">
          <h3 className="font-bold text-sm text-white mb-2">
            Available Pre-Approved Financial Products
          </h3>
          {financingProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => setSelectedProduct(prod)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedProduct.id === prod.id
                  ? "bg-[#07261B] border-[#14533C] ring-1 ring-[#196349]"
                  : "bg-[#10171B] border-[#1D2A32] hover:border-[#14533C]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-extrabold text-sm text-white">{prod.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#162228] text-slate-300 border border-[#1D2A32]">
                  {prod.type}
                </span>
              </div>

              <div className="text-xs text-slate-400 mb-2">
                Underwritten by: <strong className="text-slate-200">{prod.provider}</strong>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#19262F] font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">Maximum Facility</span>
                  <span className="font-bold text-white">{prod.maxAmount}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Subsidized Annual Rate</span>
                  <span className="font-bold text-emerald-300">{prod.interestRateAnnual}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Application & Instant Pre-Approval Form */}
        <div className="lg:col-span-6 bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-[#19262F] mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                Direct Disbursement Protocol
              </span>
              <h4 className="font-extrabold text-base text-white mt-2">
                Apply for {selectedProduct.name}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Zero physical paperwork required. Auto-shares verified Digital Farm Twin telemetry.
              </p>
            </div>

            {applicationSubmitted ? (
              <div className="p-8 text-center bg-[#07261B] rounded-2xl border border-[#14533C] space-y-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <div className="font-bold text-sm text-white">
                  Facility Pre-Approved Instantly!
                </div>
                <p className="text-xs text-emerald-200">
                  Term sheet issued for R{Number(requestedAmount).toLocaleString()} via AfDB Green Facility. Funds earmarked for certified seed and fertilizer suppliers.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Requested Amount ({currentFarm.country === "South Africa" ? "ZAR" : "USD"})
                  </label>
                  <input
                    type="number"
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#162228] border border-[#1D2A32] font-mono font-bold text-white text-sm focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="p-3.5 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1.5">
                  <div className="font-bold text-white">Automatic Collateral Binding:</div>
                  <div className="text-[11px] text-slate-300">
                    • 200 Tonnes Maize crop lien recorded on digital registry
                  </div>
                  <div className="text-[11px] text-slate-300">
                    • Parametric climate rainfall insurance policy attached
                  </div>
                  <div className="text-[11px] text-slate-300">
                    • Settlement auto-repaid from forward contract off-take escrow
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] cursor-pointer shadow-md transition-colors min-h-[44px]"
                  >
                    Submit Underwriting Application →
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="pt-4 border-t border-[#19262F] flex items-center justify-between text-[11px] text-slate-400 mt-4">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" /> End-to-end encrypted bank underwriting
            </span>
            <span className="font-mono text-slate-500">AFDB-FIN-ZA</span>
          </div>
        </div>
      </div>
    </div>
  );
};
