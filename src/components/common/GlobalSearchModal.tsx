import React, { useEffect, useState } from "react";
import { Search, X, Sprout, ShoppingBag, Truck, Coins, ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const GlobalSearchModal: React.FC = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, setCurrentView, farms, marketListings, commodityPrices } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isSearchModalOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSearchModalOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const filteredFarms = farms.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.primaryCrop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCommodities = commodityPrices.filter(
    (c) =>
      c.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cityMarket.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredListings = marketListings.filter(
    (l) =>
      l.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1013]/80 backdrop-blur-md flex items-start justify-center pt-16 px-4 animate-in fade-in" onMouseDown={() => setIsSearchModalOpen(false)}>
      <div role="dialog" aria-modal="true" aria-label="Global search" className="bg-[#10171B] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-white" onMouseDown={(event) => event.stopPropagation()}>
        {/* Search Input Bar */}
        <div className="p-3.5 flex items-center gap-3 bg-[#07261B]">
          <img
            src="/cultx_logo.png"
            alt="CULTx"
            className="w-8 h-8 rounded-lg object-contain shadow-xs shrink-0"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search CULTx: 'Maize buyers in Zambia', 'Cape Farm', 'Drought forecast'..."
            className="w-full bg-transparent text-sm font-medium text-white focus:outline-none placeholder:text-slate-400"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-xs text-slate-400 hover:text-white font-semibold cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#162228] cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Query Index Banner */}
        <div className="px-4 py-2 bg-[#0B3D2C] flex items-center justify-between text-xs text-emerald-200">
          <span className="font-medium">
            Unified index across 54 Pan-African agricultural market databases
          </span>
          <span className="text-[10px] uppercase font-bold text-emerald-300 font-mono">
            {searchTerm ? "Filtered" : "All Repositories"}
          </span>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Quick Filter Categories */}
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
            {["All", "Farms", "Prices", "Buyers", "Warehouses", "Contracts"].map((cat, idx) => (
              <button
                key={cat}
                onClick={() => {
                  if (cat === "Farms") setSearchTerm("Farm");
                  else if (cat === "Prices") setSearchTerm("Maize");
                  else if (cat === "Buyers") setSearchTerm("Grade");
                  else setSearchTerm("");
                }}
                className={`px-3 py-1 rounded-full border text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  idx === 0
                    ? "bg-[#0B3D2C] text-white border-[#196349]"
                    : "bg-[#162228] text-slate-300 border-[#1D2A32] hover:bg-[#1D2A32]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Farms Results */}
          {filteredFarms.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-emerald-300" />
                Registered Farms ({filteredFarms.length})
              </div>
              <div className="space-y-1.5">
                {filteredFarms.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setCurrentView("farms");
                      setIsSearchModalOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#1D2A32] hover:border-[#14533C] hover:bg-[#162228] text-left transition-colors cursor-pointer group"
                  >
                    <div>
                      <div className="font-semibold text-xs text-white group-hover:text-emerald-300">
                        {f.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {f.country} • {f.primaryCrop} • {f.totalHectares} ha • Health: {f.overallHealthScore}%
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-300" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Commodity Spot Prices Results */}
          {filteredCommodities.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                Commodity Market Intelligence ({filteredCommodities.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredCommodities.slice(0, 4).map((c, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentView("marketplace");
                      setIsSearchModalOpen(false);
                    }}
                    className="p-2.5 rounded-xl border border-[#1D2A32] hover:border-[#14533C] hover:bg-[#162228] text-left transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-xs text-white">{c.commodity}</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-300 bg-[#07261B] px-1 rounded border border-[#14533C]">
                        +{c.trend30Day}%
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {c.country} ({c.cityMarket})
                    </div>
                    <div className="text-xs font-mono font-bold text-emerald-300 mt-1">
                      {c.currency} {c.pricePerTonne.toLocaleString()} / MT (${c.priceUSD} USD)
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Produce Listings Results */}
          {filteredListings.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
                Verified Produce Available ({filteredListings.length})
              </div>
              <div className="space-y-1.5">
                {filteredListings.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setCurrentView("marketplace");
                      setIsSearchModalOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#1D2A32] hover:border-[#14533C] hover:bg-[#162228] text-left transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-xs text-white">
                        {l.commodity} • {l.quantityTonnes} Tonnes ({l.qualityGrade})
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Seller: {l.sellerName} ({l.farmName}) • {l.location}, {l.country}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-300 bg-[#07261B] px-2 py-1 rounded-lg border border-[#14533C]">
                      {l.minPricePerTonne}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
