import React, { useState } from "react";
import {
  Users,
  ShoppingBag,
  TrendingDown,
  Warehouse,
  CheckCircle2,
  FileCheck,
  Plus,
  Coins,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  X,
  Calculator,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const CooperativeView: React.FC = () => {
  const { currentFarm } = useApp();
  const [selectedCampaign, setSelectedCampaign] = useState<number>(0);
  const [pledgeModalOpen, setPledgeModalOpen] = useState(false);
  const [pledgeAmount, setPledgeAmount] = useState("10"); // 10 MT or 10 ha
  const [pledgeSuccess, setPledgeSuccess] = useState(false);

  const [bulkCampaigns, setBulkCampaigns] = useState([
    {
      id: "urea",
      title: "Consolidated Urea 46% N & NPK 10-20-10 Pool",
      provider: "Omnia Fertilizer Africa",
      currentTonnage: 1240,
      targetTonnage: 1500,
      discountPct: 14,
      individualPrice: 12400,
      groupPrice: 10664,
      unit: "MT",
      deadlineDays: 4,
      membersParticipating: 184,
    },
    {
      id: "seed",
      title: "Certified Drought-Tolerant Hybrid Maize Seed (SC719)",
      provider: "Seed Co West & Southern Africa",
      currentTonnage: 85,
      targetTonnage: 100,
      discountPct: 11,
      individualPrice: 940,
      groupPrice: 836,
      unit: "25kg Bag",
      deadlineDays: 7,
      membersParticipating: 212,
    },
  ]);

  const activeCamp = bulkCampaigns[selectedCampaign];
  const pledgeQty = Number(pledgeAmount) || 1;
  const unitSaving = activeCamp.individualPrice - activeCamp.groupPrice;
  const totalSavings = pledgeQty * unitSaving;

  const handleConfirmPledge = (e: React.FormEvent) => {
    e.preventDefault();
    setBulkCampaigns((prev) =>
      prev.map((c, idx) =>
        idx === selectedCampaign
          ? {
              ...c,
              currentTonnage: Math.min(c.targetTonnage, c.currentTonnage + pledgeQty),
              membersParticipating: c.membersParticipating + 1,
            }
          : c
      )
    );
    setPledgeSuccess(true);
    setTimeout(() => {
      setPledgeSuccess(false);
      setPledgeModalOpen(false);
    }, 1500);
  };

  const cooperativeMembers = [
    { name: "James Ndlovu (Cape Farm)", hectares: "42 ha", crop: "Maize", health: "94%", status: "Active" },
    { name: "Grace Osei", hectares: "28 ha", crop: "Soybean", health: "91%", status: "Active" },
    { name: "Kofi Mensah", hectares: "65 ha", crop: "Yellow Maize", health: "88%", status: "Active" },
    { name: "Amina Diallo", hectares: "34 ha", crop: "Sunflower", health: "96%", status: "Active" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Highveld Smallholders Agricultural Cooperative
            </h2>
            <span className="text-xs font-bold text-emerald-300 bg-[#07261B] px-2.5 py-0.5 rounded-full border border-[#14533C]">
              428 Active Farm Members
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Aggregating smallholder bargaining power for collective fertilizer procurement, storage, and off-take contracts.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#07261B] px-4 py-2 rounded-xl border border-[#14533C]">
          <div>
            <div className="text-[10px] font-bold uppercase text-emerald-300">Consolidated Savings</div>
            <div className="text-sm font-mono font-extrabold text-white">R1,420,000 Saved</div>
          </div>
          <Coins className="w-5 h-5 text-emerald-300" />
        </div>
      </div>

      {/* Collective Bargaining & Bulk Input Purchase Pools (Blueprint Mandate) */}
      <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] mb-4 gap-2">
          <div>
            <h3 className="font-extrabold text-base text-white">
              Bulk Input Procurement Campaigns (Consolidated Purchasing)
            </h3>
            <p className="text-xs text-slate-400">
              Direct factory gate discounts by aggregating demand across all cooperative members.
            </p>
          </div>
          <span className="text-xs font-bold text-cyan-300 bg-[#07261B] border border-cyan-800/60 px-2.5 py-1 rounded-lg">
            Direct Manufacturer Direct-to-Farm
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bulkCampaigns.map((camp, idx) => {
            const pct = Math.min(100, Math.round((camp.currentTonnage / camp.targetTonnage) * 100));
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#162228] border border-[#1D2A32] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-white">{camp.title}</h4>
                      <span className="text-[11px] text-slate-400">Supplier: {camp.provider}</span>
                    </div>
                    <span className="text-xs font-mono font-extrabold text-emerald-300 bg-[#07261B] border border-[#14533C] px-2.5 py-1 rounded-lg shrink-0">
                      -{camp.discountPct}% Group Discount
                    </span>
                  </div>

                  <div className="my-3 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Pool Volume Progress:</span>
                      <span className="font-mono font-bold text-white">
                        {camp.currentTonnage} / {camp.targetTonnage} {camp.unit} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#10171B] h-2 rounded-full overflow-hidden border border-[#1D2A32]">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#19262F] font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Retail Price</span>
                      <span className="line-through text-slate-500">R{camp.individualPrice.toLocaleString()} / {camp.unit}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Cooperative Pool Price</span>
                      <span className="font-bold text-emerald-300">R{camp.groupPrice.toLocaleString()} / {camp.unit}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#19262F] flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-amber-400 font-bold">
                    Closes in {camp.deadlineDays} Days ({camp.membersParticipating} Farms Joined)
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCampaign(idx);
                      setPledgeModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs border border-[#196349] min-h-[40px]"
                  >
                    <span>Pledge Farm Demand</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Member Roster & Crop Consolidation */}
      <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#19262F] mb-4">
          <div>
            <h3 className="font-bold text-sm text-white">Registered Cooperative Members</h3>
            <p className="text-xs text-slate-400">
              Aggregated collective capacity: 4,120 Hectares • 24,000 Tonnes Off-take Forward Volume
            </p>
          </div>
          <button className="text-xs font-bold text-emerald-300 hover:underline cursor-pointer min-h-[36px] flex items-center">
            + Invite Local Smallholder
          </button>
        </div>

        <div className="divide-y divide-[#19262F] text-xs">
          {cooperativeMembers.map((m, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#162228] border border-[#1D2A32] text-emerald-300 font-bold flex items-center justify-center">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-white">{m.name}</div>
                  <div className="text-[11px] text-slate-400">{m.hectares} • Primary: {m.crop}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Twin Health</div>
                  <div className="font-mono font-bold text-emerald-300">{m.health}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#07261B] border border-[#14533C] text-emerald-300 font-bold text-[10px]">
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pledge Demand Modal */}
      {pledgeModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B1013]/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#10171B] rounded-3xl max-w-md w-full border border-[#1D2A32] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#19262F]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-300" />
                <h3 className="font-extrabold text-white text-sm">
                  Commit Volume to Collective Pool
                </h3>
              </div>
              <button
                onClick={() => setPledgeModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 font-bold uppercase">Campaign</span>
              <div className="font-bold text-xs text-white">{activeCamp.title}</div>
              <div className="text-[11px] text-slate-400">Supplier: {activeCamp.provider}</div>
            </div>

            {pledgeSuccess ? (
              <div className="p-6 text-center bg-[#07261B] rounded-2xl border border-[#14533C] space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-300 mx-auto" />
                <div className="font-bold text-sm text-white">
                  Volume Successfully Committed!
                </div>
                <p className="text-xs text-emerald-200">
                  Your collective order is pooled with {activeCamp.membersParticipating} other smallholders. Discount locked!
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmPledge} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Your Demand ({activeCamp.unit}) for {currentFarm.name}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pledgeAmount}
                    onChange={(e) => setPledgeAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#1D2A32] bg-[#162228] font-mono font-bold text-white text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="p-3.5 bg-[#07261B] rounded-xl border border-[#14533C] space-y-1">
                  <div className="flex justify-between font-bold text-emerald-300">
                    <span>Your Group Discount:</span>
                    <span>-{activeCamp.discountPct}%</span>
                  </div>
                  <div className="flex justify-between font-bold text-white font-mono text-sm">
                    <span>Direct Farm Cash Savings:</span>
                    <span className="text-emerald-300">R{totalSavings.toLocaleString()} ZAR</span>
                  </div>
                  <div className="text-[10px] text-slate-300">
                    Subsidized collective freight directly delivered to Cape Farm gate.
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPledgeModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[#1D2A32] bg-[#162228] text-slate-300 font-bold cursor-pointer hover:bg-[#1D2A32] min-h-[40px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold cursor-pointer shadow-xs transition-colors border border-[#196349] min-h-[40px]"
                  >
                    Confirm Order ({pledgeQty} {activeCamp.unit}) →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
