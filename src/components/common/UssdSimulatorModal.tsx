import React, { useState } from "react";
import { X, Smartphone, MessageSquare, PhoneCall, RefreshCw, Send, CheckCircle2 } from "lucide-react";
import { useApp } from "../../context/AppContext";

interface UssdSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UssdSimulatorModal: React.FC<UssdSimulatorModalProps> = ({ isOpen, onClose }) => {
  const { currentFarm, commodityPrices } = useApp();
  const [activeTab, setActiveTab] = useState<"ussd" | "sms">("ussd");

  // USSD Session State
  const [sessionActive, setSessionActive] = useState(false);
  const [ussdInput, setUssdInput] = useState("*384*2858#");
  const [ussdHistory, setUssdHistory] = useState<string[]>([]);
  const [currentMenuKey, setCurrentMenuKey] = useState<string>("main");

  // SMS Simulator State
  const [smsInput, setSmsInput] = useState("PRICE MAIZE");
  const [smsMessages, setSmsMessages] = useState<
    { sender: "user" | "cultx"; text: string; time: string }[]
  >([
    {
      sender: "cultx",
      text: "CULTx Agri-SMS Alert: 34mm rainfall forecast in 72h for Free State. Postpone pesticide spraying. Call *384*2858# for full twin advisory.",
      time: "08:14",
    },
  ]);

  if (!isOpen) return null;

  const ussdMenus: Record<string, { title: string; prompt: string }> = {
    main: {
      title: "CULTx PAN-AFRICAN AGRI-OPERATING SYSTEM",
      prompt: `Welcome, ${currentFarm.ownerName} (${currentFarm.name})\n1. Weather & 72h Rain Advisory\n2. Silo Deposit & e-WRS Balance\n3. Local Spot Commodity Prices\n4. Request Extension Officer\n5. Draw 70% Harvest Loan\n0. Exit`,
    },
    "1": {
      title: "72H WEATHER & SPRAY ADVISORY",
      prompt: `Farm: ${currentFarm.name}\n• 72h Rain: 34-48mm expected (78% prob)\n• Soil Moisture: 28% (Field 03 Critical)\n• Action: Irrigate 20mm now; DO NOT spray fungicide before storm.\n99. Back`,
    },
    "2": {
      title: "SILO DEPOSIT & e-WRS",
      prompt: `Warehouse Receipt: #EWRS-08819\nSilo: Zambezi Silo #04\nVolume: 150 MT Yellow Maize\nGrade: SAFEX Grade 1 (12.1% Moisture)\nAsset Valuation: R813,000 ZAR\n99. Back`,
    },
    "3": {
      title: "LIVE COMMODITY SPOT PRICES",
      prompt: `Spot Prices Today (per MT):\n1. Yellow Maize: R5,420 (SAFEX)\n2. White Maize: R5,380 (Johannesburg)\n3. Soybeans: R9,850 (Durban)\n4. Sorghum: R4,210 (Free State)\n99. Back`,
    },
    "4": {
      title: "REQUEST EXTENSION OFFICER",
      prompt: `Lead Agronomist Dr. Naidoo assigned to your district.\nOfficer phone: +27 82 491 0023\nVisit scheduled: Thursday 10:00 AM.\nSMS confirmation dispatched.\n99. Back`,
    },
    "5": {
      title: "DRAW 70% HARVEST LOAN",
      prompt: `e-WRS Collateral Approved!\nEligible Amount: R569,100 ZAR\nInterest: 9.2% Subsidized Annual Rate\nFunds will be sent to M-Pesa / Bank account within 10 minutes.\n1. Confirm Drawdown\n99. Back`,
    },
    "5_confirm": {
      title: "TRANSACTION SUCCESSFUL",
      prompt: `Transfer approved! R569,100 has been initiated to your linked account. Bank Ref: TXN-AFDB-9941.\nThank you for choosing CULTx.\n0. Exit`,
    },
  };

  const handleDialUssd = () => {
    setSessionActive(true);
    setCurrentMenuKey("main");
  };

  const handleSendUssdInput = (key: string) => {
    if (key === "0") {
      setSessionActive(false);
      return;
    }
    if (key === "99") {
      setCurrentMenuKey("main");
      return;
    }
    if (currentMenuKey === "5" && key === "1") {
      setCurrentMenuKey("5_confirm");
      return;
    }
    if (ussdMenus[key]) {
      setCurrentMenuKey(key);
    }
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsInput.trim()) return;

    const userText = smsInput.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMessages = [
      ...smsMessages,
      { sender: "user" as const, text: userText, time: timeNow },
    ];
    setSmsMessages(newMessages);
    setSmsInput("");

    // Auto reply
    setTimeout(() => {
      let reply = "";
      const upper = userText.toUpperCase();
      if (upper.includes("PRICE")) {
        reply = "CULTx SPOT: Yellow Maize R5,420/MT (+1.8%); Soybeans R9,850/MT; Fertilizer Urea R10,664/MT via Coop Pool.";
      } else if (upper.includes("RAIN") || upper.includes("WEATHER")) {
        reply = "CULTx WEATHER: Free State: 34mm heavy rain incoming in 48-72 hrs. Ensure drain ditches clear. Do not spray chemicals.";
      } else if (upper.includes("LOAN") || upper.includes("WRS")) {
        reply = "CULTx EWRS: 150 MT Yellow Maize verified at Zambezi Silo #04. R569,100 ZAR loan limit pre-approved. Dial *384*2858# to claim.";
      } else {
        reply = "CULTx: Command received. Available keywords: PRICE MAIZE, RAIN, WRS, PEST. Or dial *384*2858# for free interactive menu.";
      }

      setSmsMessages((prev) => [
        ...prev,
        {
          sender: "cultx" as const,
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1013]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-[#10171B] rounded-3xl max-w-xl w-full border border-[#1D2A32] shadow-2xl overflow-hidden my-auto flex flex-col text-white">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-[#07261B] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/cultx_logo.png"
              alt="CULTx"
              className="w-10 h-10 rounded-xl object-contain shadow-xs shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  CULTx 2G USSD & SMS Gateway
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B3D2C] text-emerald-300">
                  Zero Data Required
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300">
                Inclusive telecom gateway for rural farmers without smartphones or 4G data access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#162228] text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-[#0B1013] p-2 flex items-center gap-2">
          <button
            onClick={() => setActiveTab("ussd")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "ussd"
                ? "bg-[#0B3D2C] text-white shadow-xs"
                : "text-slate-400 hover:text-white hover:bg-[#162228]"
            }`}
          >
            <PhoneCall className="w-4 h-4 text-emerald-300" />
            <span className="truncate">USSD Menu (*384*2858#)</span>
          </button>
          <button
            onClick={() => setActiveTab("sms")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "sms"
                ? "bg-[#0B3D2C] text-white shadow-xs"
                : "text-slate-400 hover:text-white hover:bg-[#162228]"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-300" />
            <span className="truncate">2-Way SMS Advisory</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6">
          {activeTab === "ussd" ? (
            <div className="space-y-4">
              {/* Feature Phone Monochrome Screen */}
              <div className="bg-[#8fa781] text-[#1c2918] p-4 sm:p-5 rounded-2xl border-4 border-[#162228] shadow-inner font-mono text-xs space-y-2 min-h-[220px] flex flex-col justify-between select-none">
                {sessionActive ? (
                  <>
                    <div>
                      <div className="font-bold border-b border-[#6f8961] pb-1 uppercase tracking-wider text-[11px]">
                        {ussdMenus[currentMenuKey]?.title || "CULTx USSD"}
                      </div>
                      <div className="mt-2 whitespace-pre-line leading-relaxed text-[12px] font-semibold">
                        {ussdMenus[currentMenuKey]?.prompt || "Session ended."}
                      </div>
                    </div>
                    <div className="text-[10px] text-[#425537] pt-2 border-t border-[#6f8961] flex justify-between">
                      <span>CULTx GSM Gateway</span>
                      <span>Session ID: #88219</span>
                    </div>
                  </>
                ) : (
                  <div className="my-auto text-center space-y-2">
                    <div className="text-sm font-bold">AIRTEL / SAFARICOM / MTN / VODACOM</div>
                    <div className="text-[13px] font-bold">Ready to Dial *384*2858#</div>
                    <p className="text-[11px] text-[#3b4d31]">
                      Free toll-free session sponsored by African Development Bank
                    </p>
                  </div>
                )}
              </div>

              {/* Controls */}
              {sessionActive ? (
                <div className="space-y-3">
                  <div className="text-xs text-slate-300 font-bold">Select Menu Option:</div>
                  <div className="grid grid-cols-5 gap-2">
                    {["1", "2", "3", "4", "5"].map((num) => (
                      <button
                        key={num}
                        onClick={() => handleSendUssdInput(num)}
                        className="py-2.5 rounded-xl bg-[#162228] hover:bg-[#0B3D2C] hover:text-emerald-200 text-white font-mono font-bold text-sm cursor-pointer shadow-xs transition-colors border border-[#1D2A32]"
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleSendUssdInput("99")}
                      className="flex-1 py-2 rounded-xl bg-[#162228] hover:bg-[#1D2A32] text-slate-200 font-bold text-xs cursor-pointer border border-[#1D2A32]"
                    >
                      99. Main Menu
                    </button>
                    <button
                      onClick={() => setSessionActive(false)}
                      className="flex-1 py-2 rounded-xl bg-red-950/70 hover:bg-red-900 text-red-300 font-bold text-xs cursor-pointer border border-red-800/80"
                    >
                      0. End Call
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center pt-2">
                  <button
                    onClick={handleDialUssd}
                    className="w-full py-3 rounded-2xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors border border-[#14533C]"
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-300" />
                    <span>Dial *384*2858# (Launch USSD Session)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* SMS Simulator Tab */
            <div className="space-y-4">
              <div className="bg-[#0B1013] rounded-2xl p-4 border border-[#1D2A32] h-[240px] overflow-y-auto space-y-3">
                {smsMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[85%] text-xs ${
                      msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl ${
                        msg.sender === "user"
                          ? "bg-[#0B3D2C] text-white border border-[#14533C] rounded-br-none"
                          : "bg-[#162228] text-slate-200 border border-[#1D2A32] rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 px-1 font-mono">
                      {msg.sender === "user" ? "You" : "CULTx"} • {msg.time}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendSms} className="flex gap-2">
                <input
                  type="text"
                  value={smsInput}
                  onChange={(e) => setSmsInput(e.target.value)}
                  placeholder="Try: PRICE MAIZE, RAIN, or LOAN"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#1D2A32] bg-[#0B1013] text-white font-medium text-xs focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs border border-[#14533C]"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Send</span>
                </button>
              </form>

              <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-400 items-center">
                <span className="font-bold text-slate-300">Quick Commands:</span>
                {["PRICE MAIZE", "RAIN", "LOAN"].map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => setSmsInput(cmd)}
                    className="px-2 py-0.5 rounded bg-[#162228] hover:bg-[#1D2A32] text-emerald-300 font-mono text-[10px] cursor-pointer border border-[#1D2A32]"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 bg-[#0B1013] border-t border-[#1D2A32] flex items-center justify-between text-xs text-slate-400">
          <span>Works on all GSM feature phones across 54 AU nations</span>
          <span className="font-mono text-[10px] text-emerald-400">Shortcode: 2858</span>
        </div>
      </div>
    </div>
  );
};
