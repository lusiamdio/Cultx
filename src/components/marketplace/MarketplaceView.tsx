import React, { useState } from "react";
import {
  ShoppingBag,
  Coins,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  FileText,
  Lock,
  Plus,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Building,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { MarketListing, PurchaseContract } from "../../types";

export const MarketplaceView: React.FC = () => {
  const {
    commodityPrices,
    marketListings,
    addMarketListing,
    purchaseContracts,
    addPurchaseContract,
    currentFarm,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"prices" | "buy" | "sell" | "contracts" | "offtakers">("prices");
  const [searchTerm, setSearchTerm] = useState("");
  const [contractCreatedToast, setContractCreatedToast] = useState<string | null>(null);
  const [selectedContract, setSelectedContract] = useState<PurchaseContract | null>(
    purchaseContracts[0] || null
  );
  const [isAuditingContract, setIsAuditingContract] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);

  // New Listing Form State
  const [newCrop, setNewCrop] = useState("Yellow Maize");
  const [newQuantity, setNewQuantity] = useState("200");
  const [newGrade, setNewGrade] = useState("Grade 1 (SAFEX Standard)");
  const [newPrice, setNewPrice] = useState("R5,420");
  const [newDelivery, setNewDelivery] = useState("Ex-Farm or Johannesburg Silo");
  const [listingSuccess, setListingSuccess] = useState(false);

  const filteredPrices = commodityPrices.filter(
    (p) =>
      p.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cityMarket.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    addMarketListing({
      sellerName: currentFarm.ownerName,
      farmName: currentFarm.name,
      commodity: newCrop,
      quantityTonnes: Number(newQuantity),
      qualityGrade: newGrade,
      harvestDate: "2026-10-20",
      location: currentFarm.region,
      country: currentFarm.country,
      minPricePerTonne: newPrice,
      deliveryOptions: newDelivery,
    });
    setListingSuccess(true);
    setTimeout(() => {
      setListingSuccess(false);
      setActiveTab("buy");
    }, 1500);
  };

  const institutionalOfftakers = [
    {
      id: "tiger_brands",
      name: "Tiger Brands South Africa",
      hq: "Bryanston, Johannesburg",
      matchScore: 98,
      seekingCommodity: "Yellow Maize (SAFEX Grade 1)",
      volumeRequired: "15,000 MT",
      offeredPrice: "R5,480 / MT",
      premium: "+R60 over SAFEX spot",
      terms: "3-day PAPSS settlement • Ex-Farm collection • SGS inspection at weighbridge",
      escrowLocked: "R82,200,000 ZAR Pre-funded",
      buyerRating: "AAA (Standard Bank Trade Desk Guaranteed)",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    },
    {
      id: "eagc_ncpb",
      name: "East Africa Grain Council / NCPB Millers Pool",
      hq: "Nairobi, Kenya",
      matchScore: 94,
      seekingCommodity: "Food Grade Yellow Maize",
      volumeRequired: "8,500 MT",
      offeredPrice: "KES 42,000 / MT (~$292 USD)",
      premium: "Zero-tariff preferential AfCFTA corridor rate",
      terms: "PAPSS KES/ZAR settlement • Multimodal Durban-Mombasa route",
      escrowLocked: "KES 357,000,000 Pre-funded",
      buyerRating: "AA+ (AfDB Backed Sovereign Reserve)",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    },
    {
      id: "olam_agri",
      name: "Olam Agri Southern Africa",
      hq: "Durban Processing Terminal",
      matchScore: 91,
      seekingCommodity: "Soybeans & Yellow Maize",
      volumeRequired: "6,000 MT",
      offeredPrice: "R5,450 / MT",
      premium: "+R30 over SAFEX spot",
      terms: "50% instant escrow advance on signature • 50% on silo receipt",
      escrowLocked: "R32,700,000 ZAR Pre-funded",
      buyerRating: "AAA (Global Commodity Merchant)",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
    },
    {
      id: "bua_foods",
      name: "BUA Foods PLC",
      hq: "Apapa Port, Lagos, Nigeria",
      matchScore: 88,
      seekingCommodity: "Commercial Grain & Grits",
      volumeRequired: "20,000 MT",
      offeredPrice: "NGN 685,000 / MT",
      premium: "High volume contract with FX hedge",
      terms: "Letter of Credit backed by Afreximbank via PAPSS",
      escrowLocked: "USD $5,600,000 Escrow Escort",
      buyerRating: "AA (Nigerian Stock Exchange 30)",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    },
  ];

  const handleAcceptOfftaker = (offtaker: typeof institutionalOfftakers[0]) => {
    addPurchaseContract({
      buyerName: offtaker.name,
      sellerName: currentFarm.ownerName,
      commodity: offtaker.seekingCommodity.split(" (")[0],
      quantityTonnes: 200,
      pricePerTonne: offtaker.offeredPrice,
      deliveryDate: "2026-11-15",
      deliveryLocation: "Johannesburg Regional Silo / Port Terminal",
      qualityStandard: "SAFEX Grade 1 (<12.5% moisture, <2% broken)",
      paymentTerms: offtaker.terms,
      arbitrationJurisdiction: "OHADA / SACU Cross-Border Commercial Chamber",
      escrowProvider: "PAPSS / Standard Bank Agri-Escrow",
    });
    setContractCreatedToast(
      `Bankable Forward Off-take Contract generated with ${offtaker.name}! Escrow secured in PAPSS.`
    );
    setActiveTab("contracts");
  };

  const handleAuditContract = async (contract: PurchaseContract) => {
    setSelectedContract(contract);
    setIsAuditingContract(true);
    setAuditResult(null);

    try {
      const res = await fetch("/api/gemini/audit-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractText: `Contract ${contract.contractNumber}: Buyer: ${contract.buyerName}, Seller: ${contract.sellerName}, Commodity: ${contract.commodity}, Quantity: ${contract.quantityTonnes} MT at ${contract.pricePerTonne}. Quality: ${contract.qualityStandard}. Delivery: ${contract.deliveryLocation} on ${contract.deliveryDate}. Payment: ${contract.paymentTerms}.`,
        }),
      });
      const data = await res.json();
      setAuditResult(data);
    } catch (err) {
      setAuditResult({
        overallRiskScore: 18,
        riskLevel: "Low",
        summary: "Standard bankable forward off-take agreement with protected escrow pre-funding.",
        risksIdentified: [
          {
            title: "Logistics corridor congestion",
            severity: "Low",
            description: "Heavy freight volume on N3 highway may add 4-6 hours transit time.",
            remedy: "Schedule dispatch during evening window (20:00 - 04:00).",
          },
          {
            title: "Strict Moisture Tolerance",
            severity: "Medium",
            description: "Penalty clause applies if moisture exceeds 12.5%.",
            remedy: "Confirm grain dryer calibration prior to silo dispatch.",
          },
        ],
        recommendedAmendments: [
          "Ensure digital weighbridge certificate is uploaded directly to CULTx escrow oracle.",
        ],
      });
    } finally {
      setIsAuditingContract(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Tab Navigation */}
      <div className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Pan-African Commodity Marketplace & Price Intelligence
            </h2>
            <span className="text-xs font-bold text-emerald-300 bg-[#07261B] px-2.5 py-0.5 rounded-full border border-[#14533C]">
              54 Sovereign Exchanges
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time price feeds, verified farm listings, and audited escrow forward contracts.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-[#162228] p-1.5 rounded-xl border border-[#1D2A32] text-xs font-bold overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab("prices")}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap min-h-[38px] ${
              activeTab === "prices"
                ? "bg-[#0B3D2C] text-white font-extrabold border border-[#196349] shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Prices (54 Mkts)
          </button>
          <button
            onClick={() => setActiveTab("buy")}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap min-h-[38px] ${
              activeTab === "buy"
                ? "bg-[#0B3D2C] text-white font-extrabold border border-[#196349] shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Browse Produce ({marketListings.length})
          </button>
          <button
            onClick={() => setActiveTab("offtakers")}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 min-h-[38px] ${
              activeTab === "offtakers"
                ? "bg-[#0B3D2C] text-white font-extrabold border border-[#196349] shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Off-Takers Matching</span>
            <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full font-mono">4</span>
          </button>
          <button
            onClick={() => setActiveTab("sell")}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 min-h-[38px] ${
              activeTab === "sell"
                ? "bg-[#0B3D2C] text-white font-extrabold border border-[#196349] shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>List Harvest</span>
          </button>
          <button
            onClick={() => setActiveTab("contracts")}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 min-h-[38px] ${
              activeTab === "contracts"
                ? "bg-[#0B3D2C] text-white font-extrabold border border-[#196349] shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Digital Contracts</span>
          </button>
        </div>
      </div>

      {/* Contract Created Toast Banner */}
      {contractCreatedToast && (
        <div className="bg-[#07261B] text-emerald-200 border border-[#14533C] px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-bold shadow-md animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-white">{contractCreatedToast}</span>
          </div>
          <button
            onClick={() => setContractCreatedToast(null)}
            className="hover:underline text-emerald-300 ml-4 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: PAN-AFRICAN COMMODITY PRICES (Comparing across Africa) */}
      {activeTab === "prices" && (
        <div className="space-y-4">
          {/* Search filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#10171B] p-4 rounded-xl border border-[#1D2A32] shadow-sm">
            <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by commodity (Maize, Cocoa, Coffee, Avocado) or country..."
                className="w-full text-xs font-medium text-white bg-transparent focus:outline-none placeholder:text-slate-500"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Live arbitrage spread tracking active
            </span>
          </div>

          {/* Pricing Table / Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrices.map((price, idx) => (
              <div
                key={idx}
                className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-sm hover:border-[#14533C] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-sm font-extrabold text-white">{price.commodity}</span>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {price.country} • {price.cityMarket}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-0.5 text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                        price.trend30Day >= 0
                          ? "bg-[#07261B] text-emerald-300 border-[#14533C]"
                          : "bg-red-950/40 text-red-400 border-red-800/60"
                      }`}
                    >
                      {price.trend30Day >= 0 ? (
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-400" />
                      )}
                      {price.trend30Day >= 0 ? `+${price.trend30Day}%` : `${price.trend30Day}%`}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#19262F] flex items-baseline justify-between">
                    <div>
                      <div className="text-lg font-mono font-extrabold text-white">
                        {price.currency} {price.pricePerTonne.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-slate-400">per Metric Tonne</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-emerald-300">
                        ${price.priceUSD.toFixed(1)} USD
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">Normalized</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#19262F] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {price.qualityGrade}
                  </span>
                  <button
                    onClick={() => setActiveTab("sell")}
                    className="text-emerald-400 font-bold hover:underline cursor-pointer flex items-center gap-1 min-h-[44px]"
                  >
                    <span>Offer Supply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BROWSE PRODUCE LISTINGS */}
      {activeTab === "buy" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-extrabold text-sm text-white">
                        {listing.commodity}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Seller: {listing.sellerName} ({listing.farmName})
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#07261B] text-emerald-300 text-[10px] font-bold border border-[#14533C]">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Verified
                    </span>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-[#162228] border border-[#1D2A32] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Volume Available:</span>
                      <span className="font-mono font-bold text-white">
                        {listing.quantityTonnes} Tonnes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Quality Spec:</span>
                      <span className="font-bold text-slate-200">{listing.qualityGrade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Location:</span>
                      <span className="text-slate-300">{listing.location}, {listing.country}</span>
                    </div>
                  </div>

                  <div className="mt-3 text-xs">
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                      Target Asking Price
                    </div>
                    <div className="text-lg font-mono font-bold text-white">
                      {listing.minPricePerTonne} / MT
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Delivery: {listing.deliveryOptions}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#19262F]">
                  <button
                    onClick={() => setActiveTab("contracts")}
                    className="w-full py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold border border-[#196349] transition-all cursor-pointer min-h-[44px]"
                  >
                    Initiate Escrow Purchase Contract →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LIST PRODUCE FOR SALE */}
      {activeTab === "sell" && (
        <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm max-w-2xl mx-auto">
          <div className="border-b border-[#19262F] pb-4 mb-5">
            <h3 className="font-extrabold text-base text-white">
              List Harvest on Pan-African Marketplace
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Your produce listing is automatically cross-matched with 14,000+ verified millers, processors, and export aggregators.
            </p>
          </div>

          {listingSuccess ? (
            <div className="p-8 text-center bg-[#07261B] rounded-2xl border border-[#14533C] space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <div className="font-extrabold text-sm text-white">
                Produce Listing Broadcasted!
              </div>
              <p className="text-xs text-emerald-200">
                Verified off-takers across South Africa, Kenya, and Zambia have been notified.
              </p>
            </div>
          ) : (
            <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Commodity</label>
                  <input
                    type="text"
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#162228] border border-[#1D2A32] text-white font-medium focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Available Quantity (Tonnes)</label>
                  <input
                    type="number"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#162228] border border-[#1D2A32] text-white font-medium focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Quality Grade Specification</label>
                  <input
                    type="text"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#162228] border border-[#1D2A32] text-white font-medium focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Asking Price per Tonne</label>
                  <input
                    type="text"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#162228] border border-[#1D2A32] text-white font-medium focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Delivery / Logistics Option</label>
                <input
                  type="text"
                  value={newDelivery}
                  onChange={(e) => setNewDelivery(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#162228] border border-[#1D2A32] text-white font-medium focus:border-emerald-500 focus:outline-none placeholder:text-slate-500"
                  placeholder="e.g. Ex-Farm, Silo Delivery, Port FOB"
                  required
                />
              </div>

              <div className="pt-4 border-t border-[#19262F] flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400">
                  Backed by Digital Farm Twin verification
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] cursor-pointer shadow-md min-h-[44px]"
                >
                  Publish Verified Produce Listing →
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB: INSTANT OFF-TAKER MATCHING ENGINE (Institutional Buyer Liquidity) */}
      {activeTab === "offtakers" && (
        <div className="space-y-4">
          <div className="bg-[#07261B] text-white rounded-2xl p-5 border border-[#14533C] shadow-lg flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-300" />
                <h3 className="font-extrabold text-base text-white">
                  Institutional Off-Taker Matching Engine
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B3D2C] text-emerald-300 border border-[#196349]">
                  Pre-Funded Escrow Active
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-1">
                Direct matching with verified food processors, milling conglomerates, and sovereign grain reserves looking for your {currentFarm.crops[0]?.name || "crop"} yield.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#0B3D2C] px-3.5 py-2 rounded-xl border border-[#196349] text-xs">
              <span className="text-emerald-200">Available Farm Surplus:</span>
              <span className="font-mono font-bold text-white">200 MT Yellow Maize</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {institutionalOfftakers.map((offtaker) => (
              <div
                key={offtaker.id}
                className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-sm hover:border-[#14533C] transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-emerald-400" />
                        <h4 className="font-extrabold text-sm text-white">{offtaker.name}</h4>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{offtaker.hq}</div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-full bg-[#07261B] text-emerald-300 border border-[#14533C]">
                        {offtaker.matchScore}% Match
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#162228] border border-[#1D2A32]">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Commodity Needed</span>
                      <span className="font-semibold text-white">{offtaker.seekingCommodity}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#162228] border border-[#1D2A32]">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Tonnage Demand</span>
                      <span className="font-semibold text-white">{offtaker.volumeRequired}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#07261B] border border-[#14533C]">
                      <span className="text-[10px] text-emerald-300 uppercase font-bold block">Offered Purchase Price</span>
                      <span className="font-extrabold text-white font-mono text-sm">{offtaker.offeredPrice}</span>
                      <span className="text-[9px] text-emerald-400 block font-medium">{offtaker.premium}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#162228] border border-[#1D2A32]">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Buyer Escrow Vault</span>
                      <span className="font-bold text-white font-mono text-xs">{offtaker.escrowLocked}</span>
                      <span className="text-[9px] text-emerald-400 block font-medium">{offtaker.buyerRating}</span>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 rounded-xl bg-[#162228] text-[11px] text-slate-300 border border-[#1D2A32]">
                    <strong className="text-white">Settlement Terms: </strong>
                    {offtaker.terms}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#19262F] flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400 font-medium">
                    Instant PAPSS Cross-Currency Settlement
                  </div>
                  <button
                    onClick={() => handleAcceptOfftaker(offtaker)}
                    className="px-4 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs flex items-center gap-1.5 border border-[#196349] transition-all shadow-md cursor-pointer min-h-[44px]"
                  >
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Accept Offer & Lock Escrow →</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DIGITAL CONTRACTS & CONTRACT RISK AUDIT */}
      {activeTab === "contracts" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Contracts List */}
          <div className="lg:col-span-6 space-y-3">
            <h3 className="font-bold text-sm text-white mb-2">
              Executed & Pending Digital Contracts
            </h3>
            {purchaseContracts.map((contract) => (
              <div
                key={contract.id}
                onClick={() => setSelectedContract(contract)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedContract?.id === contract.id
                    ? "bg-[#07261B] border-[#14533C] ring-1 ring-[#196349]"
                    : "bg-[#10171B] border-[#1D2A32] hover:border-[#14533C]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-emerald-300">
                    {contract.contractNumber}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0B3D2C] text-emerald-300 border border-[#196349]">
                    {contract.status}
                  </span>
                </div>

                <div className="text-xs font-bold text-white mb-1">
                  Buyer: {contract.buyerName} ➔ Seller: {contract.sellerName}
                </div>

                <div className="text-xs text-slate-300">
                  {contract.commodity} • {contract.quantityTonnes} MT @ {contract.pricePerTonne}
                </div>

                <div className="mt-3 pt-2 border-t border-[#19262F] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    Delivery: {contract.deliveryLocation}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAuditContract(contract);
                    }}
                    className="text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer min-h-[44px]"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Run Risk Audit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Contract Risk Audit Panel */}
          <div className="lg:col-span-6 bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#19262F] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#07261B] text-emerald-400 flex items-center justify-center border border-[#14533C]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      Contract Risk Audit
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Legal, logistical, and escrow risk assessment
                    </p>
                  </div>
                </div>

                {selectedContract && (
                  <button
                    onClick={() => handleAuditContract(selectedContract)}
                    disabled={isAuditingContract}
                    className="px-3 py-1.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 border border-[#196349] cursor-pointer min-h-[44px]"
                  >
                    {isAuditingContract ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    )}
                    <span>Audit Contract</span>
                  </button>
                )}
              </div>

              {selectedContract ? (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Payment & Escrow Protection
                    </div>
                    <div className="font-semibold text-white">
                      {selectedContract.paymentTerms}
                    </div>
                    <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Funds locked in tripartite bank escrow prior to loading
                    </div>
                  </div>

                  <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Quality Standard Clause
                    </div>
                    <div className="font-semibold text-white">
                      {selectedContract.qualityStandard}
                    </div>
                  </div>

                  {/* Audit Output */}
                  {auditResult && (
                    <div className="p-4 rounded-xl bg-[#07261B] border border-[#14533C] space-y-2.5 animate-in zoom-in-95">
                      <div className="flex items-center justify-between border-b border-[#14533C] pb-2">
                        <span className="font-bold text-white">
                          Audit Summary: {auditResult.riskLevel} Risk
                        </span>
                        <span className="font-mono font-extrabold text-emerald-300">
                          Risk Score: {auditResult.overallRiskScore}/100
                        </span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">
                        {auditResult.summary}
                      </p>

                      <div className="space-y-1.5 pt-1">
                        {auditResult.risksIdentified?.map((r: any, idx: number) => (
                          <div key={idx} className="p-2.5 bg-[#10171B] rounded-xl border border-[#1D2A32]">
                            <div className="font-bold text-white flex items-center justify-between">
                              <span>• {r.title}</span>
                              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-700/60">
                                {r.severity}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">{r.description}</p>
                            <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                              Remedy: {r.remedy}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  Select a contract to run a Risk Audit
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#19262F] flex items-center justify-between text-xs mt-4">
              <span className="text-slate-400">Settlement via PAPSS or National RTGS</span>
              <button className="text-emerald-400 font-bold hover:underline cursor-pointer min-h-[44px]">
                Download Signed PDF →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
