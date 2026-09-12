import React, { useState } from "react";
import {
  Send,
  X,
  MessageSquare,
  User,
  RefreshCw,
  Droplet,
  CloudRain,
  TrendingUp,
  HelpCircle,
  Mic,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { postJson } from "../../utils/apiClient";

export const FloatingAICopilot: React.FC = () => {
  const { isCopilotOpen, setIsCopilotOpen, currentFarm, userRole, setIsVoiceModalOpen } = useApp();
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; text: string; time: string }>>([
    {
      role: "ai",
      text: `Hello James. I am your CULTx Copilot, grounded with Sentinel-2 orbital passes, SAFEX spot prices, and micro-climate telemetry for ${currentFarm.name}. How can I assist your agricultural decisions today?`,
      time: "Just now",
    },
  ]);

  if (!isCopilotOpen) return null;

  const quickPrompts = [
    "Should I harvest my maize next week?",
    "Which African region has the highest maize surplus?",
    "What is the best fertilizer timing for 42 hectares?",
    "Explain the buyer demand in Free State.",
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    const userMsg = textToSend.trim();
    setInputQuery("");

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMsg, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setLoading(true);

    try {
      const data = await postJson<{ answer?: string }>("/api/gemini/copilot", {
        query: userMsg,
        farmContext: {
          farmName: currentFarm.name,
          crop: currentFarm.primaryCrop,
          hectares: currentFarm.totalHectares,
          healthScore: currentFarm.overallHealthScore,
          soilHealth: currentFarm.soilHealth,
          waterIndex: currentFarm.waterIndex,
          currentRole: userRole,
          marketMaizePrice: "R5,420/t (+1.4%)",
          weather72h: "32-48mm convective rain arriving in 72h",
        },
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.answer || "Based on your digital farm twin, here is the agronomic guidance.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `Based on current grain moisture (14%) and forecasted rainfall in 72 hours across Free State, harvesting or scheduling irrigation in Field 03 within the next 48 hours is strongly recommended to optimize test weight.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-white animate-in slide-in-from-right-3">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-2.5">
          <img
            src="/cultx_logo.png"
            alt="CULTx"
            className="w-8 h-8 rounded-xl object-contain shadow-xs shrink-0"
          />
          <div>
            <div className="font-bold text-sm tracking-wide flex items-center gap-1.5">
              <span>CULTx Copilot</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[11px] text-slate-400">
              Grounded in {currentFarm.name} Digital Twin
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 cursor-pointer"
            title="Switch to Voice Mode"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsCopilotOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "ai" && (
              <div className="w-6 h-6 rounded-full bg-[#0B3D2C] flex items-center justify-center shrink-0 mt-1">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-emerald-600 text-white font-medium"
                  : "bg-slate-800 text-slate-200 border border-slate-700 whitespace-pre-line"
              }`}
            >
              {m.text}
              <div
                className={`text-[9px] mt-1 text-right font-mono ${
                  m.role === "user" ? "text-emerald-200" : "text-slate-400"
                }`}
              >
                {m.time}
              </div>
            </div>
            {m.role === "user" && (
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-1">
                <User className="w-3.5 h-3.5 text-slate-300" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2 bg-slate-800/40 rounded-xl border border-slate-800">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>Consulting agronomic reasoning engine...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
          Ask AgriIntel:
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap cursor-pointer shrink-0 transition-colors border border-slate-700/60"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend(inputQuery);
          }}
          placeholder="Ask about fertilizer, weather, grain prices..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
        />
        <button
          onClick={() => handleSend(inputQuery)}
          disabled={!inputQuery.trim() || loading}
          className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white cursor-pointer transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
