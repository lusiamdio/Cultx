import React, { useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  RefreshCw,
  Sparkles,
  Truck,
  ExternalLink,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface ExportComplianceAlertBannerProps {
  currentBufferPct: number;
  mandatoryThresholdPct: number;
  onOpenReportModal: () => void;
  onBufferRestored?: () => void;
}

export const ExportComplianceAlertBanner: React.FC<ExportComplianceAlertBannerProps> = ({
  currentBufferPct,
  mandatoryThresholdPct,
  onOpenReportModal,
  onBufferRestored,
}) => {
  const { addNotification, setIsNotificationDrawerOpen } = useApp();
  const [alertDispatched, setAlertDispatched] = useState<boolean>(false);
  const [isRestocking, setIsRestocking] = useState<boolean>(false);
  const [isRestocked, setIsRestocked] = useState<boolean>(false);

  const isBreached = !isRestocked && currentBufferPct < mandatoryThresholdPct;

  const handleDispatchManagerAlert = () => {
    addNotification({
      type: "urgent",
      title: "Regional Export Compliance Alert: Buffer Depletion",
      message: `Predictive fertilizer stock level fell to ${currentBufferPct}% (below mandatory ${mandatoryThresholdPct}% regional export compliance reserve). Outgrower cross-border phytosanitary certification is at risk.`,
      timestamp: "Just now",
      read: false,
      actionLabel: "Review Compliance Audit",
      targetView: "agribusiness",
    });

    setAlertDispatched(true);
  };

  const handleTriggerEmergencyRestock = () => {
    setIsRestocking(true);
    setTimeout(() => {
      setIsRestocking(false);
      setIsRestocked(true);
      if (onBufferRestored) {
        onBufferRestored();
      }
      addNotification({
        type: "important",
        title: "Emergency Restock Initiated: PO-LOBITO-4412",
        message: "240 MT Urea diverted from Lobito Atlantic Terminal via priority rail express. Predictive export buffer restored to 24.6%.",
        timestamp: "Just now",
        read: false,
        actionLabel: "Track Freight",
        targetView: "logistics",
      });
    }, 1200);
  };

  if (!isBreached && isRestocked) {
    return (
      <div className="bg-[#0B3D2C] border border-[#196349] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#07261B] text-[#22C55E] flex items-center justify-center shrink-0 border border-[#14533C]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-[#FDFBF7]">
                Regional Export Compliance Buffer Restored
              </h4>
              <span className="text-[10px] font-mono font-bold bg-[#07261B] text-[#22C55E] px-2 py-0.5 rounded border border-[#14533C]">
                24.6% Buffer Safe
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Emergency restock PO-LOBITO-4412 active. Outgrower cross-border AfCFTA phyto-export clearance verified.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenReportModal}
          className="px-4 py-2 rounded-xl bg-[#F5B942] hover:bg-[#E5A832] text-[#1A1105] text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer min-h-[40px]"
        >
          <span>View Updated Compliance Dossier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#2A180E] border border-[#78350F] rounded-2xl p-4 sm:p-5 shadow-lg space-y-3 relative overflow-hidden">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DC2626] via-[#F5B942] to-[#78350F]" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Warning Details */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#3E1010] border border-red-800 text-[#FCA5A5] flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-6 h-6 text-[#DC2626] animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-extrabold text-sm sm:text-base text-[#FDFBF7] flex items-center gap-2">
                <span>Predictive Stock Level Warning: Regional Export Compliance Breach</span>
              </h4>
              <span className="text-[10px] font-mono font-extrabold bg-[#3E1010] text-[#FCA5A5] px-2 py-0.5 rounded border border-red-900">
                {currentBufferPct}% Stock (Floor: {mandatoryThresholdPct}%)
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Algorithmic depletion models project fertilizer inventory dipping to <strong>{currentBufferPct}%</strong> in late Q4 / Feb 2027. Under SADC and AfCFTA food security treaties, maintaining less than a <strong>15% strategic reserve</strong> invalidates regional outgrower phyto-export clearance for 682 contracted smallholders.
            </p>
          </div>
        </div>

        {/* Action Controls with Brand Color Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Dispatch Manager Alert Trigger Button */}
          <button
            onClick={handleDispatchManagerAlert}
            disabled={alertDispatched}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer min-h-[40px] ${
              alertDispatched
                ? "bg-[#14532D] text-[#FDFBF7] border border-[#196349] opacity-90 cursor-default"
                : "bg-[#14532D] hover:bg-[#0F3D22] text-[#FDFBF7] shadow-sm active:scale-95"
            }`}
            title="Dispatch immediate alert to the Platform Notification Drawer"
          >
            {alertDispatched ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span>Alert Dispatched to Manager</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 text-[#F5B942]" />
                <span>Trigger Manager Alert</span>
              </>
            )}
          </button>

          {/* Emergency Restock PO Simulation Button (Harvest Gold) */}
          <button
            onClick={handleTriggerEmergencyRestock}
            disabled={isRestocking}
            className="px-3.5 py-2 rounded-xl bg-[#F5B942] hover:bg-[#E5A832] text-[#1A1105] text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer min-h-[40px] active:scale-95"
          >
            {isRestocking ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#1A1105]" />
                <span>Expediting Rail Cargo...</span>
              </>
            ) : (
              <>
                <Truck className="w-4 h-4 text-[#1A1105]" />
                <span>Trigger Emergency Restock PO</span>
              </>
            )}
          </button>

          {/* View Full Compliance Audit Button */}
          <button
            onClick={onOpenReportModal}
            className="px-3.5 py-2 rounded-xl bg-[#162228] hover:bg-[#1D2A32] text-[#FDFBF7] text-xs font-bold border border-[#1D2A32] transition-colors flex items-center gap-1.5 cursor-pointer min-h-[40px]"
          >
            <span>Compliance Audit</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F5B942]" />
          </button>
        </div>
      </div>

      {alertDispatched && (
        <div className="bg-[#07261B] px-3.5 py-2 rounded-xl border border-[#14533C] flex items-center justify-between text-xs text-emerald-300">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span>High-priority push alert has been queued in the Notification Drawer.</span>
          </span>
          <button
            onClick={() => setIsNotificationDrawerOpen(true)}
            className="font-bold underline text-[#F5B942] hover:text-white cursor-pointer ml-2"
          >
            Open Drawer →
          </button>
        </div>
      )}
    </div>
  );
};
