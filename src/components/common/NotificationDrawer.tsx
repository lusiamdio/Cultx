import React from "react";
import { X, CheckCheck, AlertCircle, AlertTriangle, Sparkles, DollarSign, ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const NotificationDrawer: React.FC<{
  isOpen?: boolean;
  onClose?: () => void;
}> = ({ isOpen: propIsOpen, onClose: propOnClose }) => {
  const {
    notifications,
    markNotificationAsRead,
    setCurrentView,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
  } = useApp();

  const isOpen = propIsOpen !== undefined ? propIsOpen : isNotificationDrawerOpen;
  const onClose = propOnClose || (() => setIsNotificationDrawerOpen(false));

  if (!isOpen) return null;

  const getTypeConfig = (type: string) => {
    switch (type) {
      case "urgent":
        return {
          icon: AlertCircle,
          color: "text-red-300 bg-red-950/60 border-red-800",
          tag: "Urgent",
          badge: "bg-red-500",
        };
      case "important":
        return {
          icon: AlertTriangle,
          color: "text-amber-300 bg-amber-950/60 border-amber-800",
          tag: "Important",
          badge: "bg-amber-500",
        };
      case "opportunity":
        return {
          icon: Sparkles,
          color: "text-emerald-300 bg-[#07261B] border-[#14533C]",
          tag: "Opportunity",
          badge: "bg-emerald-500",
        };
      case "financial":
        return {
          icon: DollarSign,
          color: "text-cyan-300 bg-cyan-950/60 border-cyan-800",
          tag: "Financial",
          badge: "bg-cyan-500",
        };
      default:
        return {
          icon: AlertCircle,
          color: "text-slate-300 bg-[#162228] border-[#1D2A32]",
          tag: "General",
          badge: "bg-slate-400",
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1013]/80 backdrop-blur-md flex justify-end animate-in fade-in">
      <div className="bg-[#10171B] w-full max-w-md h-full shadow-2xl border-l border-[#1D2A32] flex flex-col text-white">
        {/* Top Header */}
        <div className="p-4 border-b border-[#1D2A32] flex items-center justify-between bg-[#07261B]">
          <div>
            <div className="font-bold text-sm text-white">Intelligent Alerts & Triggers</div>
            <div className="text-[11px] text-slate-400">Autonomous agricultural event telemetry</div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#162228] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((notif) => {
            const cfg = getTypeConfig(notif.type);
            const Icon = cfg.icon;
            return (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  notif.read ? "bg-[#162228]/50 border-[#19262F] opacity-75" : "bg-[#162228] border-[#1D2A32] shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${cfg.color}`}
                  >
                    <Icon className="w-3 h-3" />
                    {cfg.tag}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{notif.timestamp}</span>
                </div>

                <div className="font-semibold text-xs text-white mb-1">{notif.title}</div>
                <div className="text-xs text-slate-300 leading-relaxed">{notif.message}</div>

                <div className="mt-3 pt-2 border-t border-[#19262F] flex items-center justify-between">
                  {notif.actionLabel && (
                    <button
                      onClick={() => {
                        if (notif.targetView) setCurrentView(notif.targetView);
                        markNotificationAsRead(notif.id);
                        onClose();
                      }}
                      className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{notif.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                  {!notif.read && (
                    <button
                      onClick={() => markNotificationAsRead(notif.id)}
                      className="text-[11px] text-slate-400 hover:text-slate-200 ml-auto flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark read
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
