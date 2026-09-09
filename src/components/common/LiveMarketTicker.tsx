import React from "react";
import { TrendingUp, TrendingDown, Radio, Satellite, ShieldCheck } from "lucide-react";

interface TickerItem {
  id: string;
  symbol: string;
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
  type?: "commodity" | "telemetry" | "corridor";
}

const TICKER_DATA: TickerItem[] = [
  { id: "1", symbol: "SAFEX-MAIZ", name: "SAFEX White Maize", value: "R 5,420/MT", change: "+1.8%", isPositive: true },
  { id: "2", symbol: "ECX-COFF", name: "ECX Grade 1 Arabica", value: "$4,650/MT", change: "+2.4%", isPositive: true },
  { id: "3", symbol: "AFEX-COCOA", name: "West Africa Cocoa", value: "$7,800/MT", change: "+4.2%", isPositive: true },
  { id: "4", symbol: "S2-ORBIT", name: "Sentinel-2 Constellation", value: "Orbit #412 Active", change: "99.8% Telemetry", isPositive: true, type: "telemetry" },
  { id: "5", symbol: "GCX-CORN", name: "GCX Yellow Maize", value: "$341/MT", change: "-0.6%", isPositive: false },
  { id: "6", symbol: "ZAMACE-WHT", name: "ZAMACE Grain Hub", value: "$284/MT", change: "+0.9%", isPositive: true },
  { id: "7", symbol: "AfCFTA-TRANS", name: "Northern Corridor Transit", value: "42 Convoys Monitored", change: "On Schedule", isPositive: true, type: "corridor" },
  { id: "8", symbol: "DAWANAU-SOR", name: "Dawanau Sorghum", value: "₦480,000/MT", change: "+3.1%", isPositive: true },
  { id: "9", symbol: "MOMBASA-TEA", name: "Mombasa Auction Pekoe", value: "$312/MT", change: "+1.2%", isPositive: true },
  { id: "10", symbol: "NILE-WHT", name: "Nile Valley Durum Wheat", value: "E£ 12,400/MT", change: "-0.4%", isPositive: false },
  { id: "11", symbol: "LOBITO-RAIL", name: "Lobito Atlantic Corridor (LAR)", value: "36h Atlantic Transit", change: "+18% Agro Freight", isPositive: true, type: "corridor" },
];

export const LiveMarketTicker: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div
      className={`w-full overflow-hidden bg-[#071116] py-1.5 px-2 select-none ${className}`}
      aria-label="Real-time commodity ticker"
    >
      <div className="flex items-center">
        {/* Live Status Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#0B1E17] text-emerald-300 text-[10px] font-bold tracking-wider uppercase shrink-0 mr-3 z-10 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="hidden sm:inline">LIVE FEED</span>
          <Radio className="w-2.5 h-2.5 text-emerald-400" />
        </div>

        {/* Scrolling Ticker Track (duplicated for seamless infinite loop) */}
        <div className="overflow-hidden relative flex-1 mask-radial">
          <div className="animate-live-ticker flex items-center gap-6">
            {[...TICKER_DATA, ...TICKER_DATA].map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="flex items-center gap-2 text-xs font-mono shrink-0 px-2 py-0.5 rounded transition-colors hover:bg-[#101F26]"
              >
                {item.type === "telemetry" ? (
                  <Satellite className="w-3 h-3 text-cyan-400" />
                ) : item.type === "corridor" ? (
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                ) : (
                  <span className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-wider">
                    {item.symbol}
                  </span>
                )}

                <span className="text-slate-200 font-medium text-[11px] font-sans">{item.name}</span>
                <span className="text-white font-bold">{item.value}</span>

                <span
                  className={`flex items-center gap-0.5 text-[10px] font-bold ${
                    item.isPositive ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {item.isPositive ? (
                    <TrendingUp className="w-2.5 h-2.5" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5" />
                  )}
                  {item.change}
                </span>
                <span className="text-slate-600 font-sans mx-1">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
