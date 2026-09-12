import React from "react";
import { WifiOff, RefreshCw, CheckCircle2, CloudLightning } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const OfflineSyncBanner: React.FC = () => {
  const { isOffline, toggleOfflineMode, syncQueue, triggerManualSync } = useApp();

  if (!isOffline && syncQueue.length === 0) return null;

  return (
    <div className="bg-amber-900 text-amber-100 px-4 py-2 text-xs border-b border-amber-800 shadow-sm transition-all animate-in slide-in-from-top-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {isOffline ? (
            <span className="flex items-center gap-1.5 font-bold text-amber-300">
              <WifiOff className="w-4 h-4 text-amber-400" />
              OFFLINE MODE ACTIVE:
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-bold text-emerald-300">
              <CloudLightning className="w-4 h-4 text-emerald-400 animate-pulse" />
              CONNECTION RESTORED:
            </span>
          )}
          <span className="text-amber-200">
            {isOffline
              ? "All telemetry, digital farm twins, offline crop calendars & agronomic advice remain cached locally."
              : "Reconnected to Pan-African cloud mesh."}
          </span>
          {syncQueue.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-800/90 text-amber-200 font-mono font-bold text-[11px]">
              Sync Queue: {syncQueue.filter((item) => item.status !== "synced").length} pending
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {syncQueue.length > 0 && (
            <button
              onClick={triggerManualSync}
              className="px-2.5 py-1 rounded bg-amber-800 hover:bg-amber-700 text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              {isOffline ? "Waiting for connection" : "Sync Now"}
            </button>
          )}
          <button
            onClick={toggleOfflineMode}
            className="px-2.5 py-1 rounded bg-amber-950/80 hover:bg-amber-950 text-amber-300 font-medium text-[11px] border border-amber-700 cursor-pointer"
          >
            {isOffline ? "Simulate Go Online" : "Dismiss"}
          </button>
        </div>
      </div>
    </div>
  );
};
