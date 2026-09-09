import React, { useState } from "react";
import {
  X,
  MapPin,
  Sprout,
  Maximize2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  CloudSun,
  Coins,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AFRICAN_COUNTRIES } from "../../data/countries";

export const ProgressiveOnboarding: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, setCurrentView, setSelectedCountry, selectedCountry } = useApp();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [farmCountry, setFarmCountry] = useState(selectedCountry.name);
  const [farmRegion, setFarmRegion] = useState("Free State & Highveld");
  const [selectedCrop, setSelectedCrop] = useState("Maize");
  const [farmHectares, setFarmHectares] = useState("42");

  if (!isOnboardingOpen) return null;

  const popularCrops = [
    { name: "Maize", category: "Cereal", season: "Main Summer Crop" },
    { name: "Coffee", category: "Cash Crop", season: "Highland Perennial" },
    { name: "Cassava", category: "Tuber", season: "Drought Tolerant" },
    { name: "Wheat", category: "Cereal", season: "Winter Cereal" },
    { name: "Soybeans", category: "Legume", season: "Legume Rotation" },
    { name: "Sorghum", category: "Grain", season: "Arid Resilient" },
    { name: "Tea", category: "Beverage", season: "Highland Cash Crop" },
    { name: "Cocoa", category: "Tree Crop", season: "Tropical Export" },
  ];

  const handleFinish = () => {
    const countryObj = AFRICAN_COUNTRIES.find((c) => c.name === farmCountry);
    if (countryObj) setSelectedCountry(countryObj);
    setIsOnboardingOpen(false);
    setCurrentView("dashboard");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header with Step Progress */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <img
              src="/cultx_logo.png"
              alt="CULTx"
              className="w-9 h-9 rounded-xl object-contain shadow-xs shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                  CULTx Setup • Step {step} of 4
                </span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
                {step === 1 && "Where is your farm located?"}
                {step === 2 && "What are you growing this season?"}
                {step === 3 && "How large is your cultivated land?"}
                {step === 4 && "Instant Digital Twin Initialized!"}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="bg-emerald-600 h-1 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* STEP 1: Location */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Pinpoint your region to automatically connect satellite radar, local soil taxonomy, and regional commodity exchanges.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Country Territory (54 Available)
                </label>
                <select
                  value={farmCountry}
                  onChange={(e) => setFarmCountry(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {AFRICAN_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name} ({c.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  District / Agricultural Basin
                </label>
                <input
                  type="text"
                  value={farmRegion}
                  onChange={(e) => setFarmRegion(e.target.value)}
                  placeholder="e.g. Free State, Nakuru County, Kano Agricultural Zone"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Geofencing auto-activates European Space Agency Sentinel-2 satellite passes.</span>
              </div>
            </div>
          )}

          {/* STEP 2: Crop */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Select your primary crop. The agronomic engine loads tailored phenological models, fertilizer calendars, and disease indicators.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {popularCrops.map((c) => {
                  const isSelected = selectedCrop === c.name;
                  return (
                    <button
                      key={c.name}
                      onClick={() => setSelectedCrop(c.name)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider mb-1">
                        {c.category}
                      </div>
                      <div className="font-bold text-xs text-slate-900">{c.name}</div>
                      <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{c.season}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Farm Size */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                How many hectares are under active cultivation? This determines input ratios, yield forecasts, and bulk buyer matches.
              </p>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={farmHectares}
                  onChange={(e) => setFarmHectares(e.target.value)}
                  className="w-32 px-3 py-2.5 rounded-xl border border-slate-300 text-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="font-semibold text-xs text-slate-700">Hectares (~{(Number(farmHectares) * 2.47).toFixed(0)} acres)</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { label: "Smallholder (<5 ha)", val: "4" },
                  { label: "Emerging (10-50 ha)", val: "42" },
                  { label: "Commercial (>100 ha)", val: "150" },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    onClick={() => setFarmHectares(preset.val)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-center cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Instant Value Delivery (Blueprint Section 31 Mandate) */}
          {step === 4 && (
            <div className="space-y-4 animate-in zoom-in-95">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold">Instant Agricultural Intelligence Loaded!</div>
                  <div>Here is your farm's weather, soil index, and current spot prices:</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Weather card */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1">
                    <CloudSun className="w-4 h-4 text-amber-500" />
                    <span>Micro-Climate</span>
                  </div>
                  <div className="text-xl font-mono font-bold text-slate-900">24°C / Sunny</div>
                  <div className="text-[11px] text-slate-500 mt-1">72h: 32mm rain expected</div>
                </div>

                {/* Soil card */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1">
                    <Sprout className="w-4 h-4 text-emerald-600" />
                    <span>Soil Health Index</span>
                  </div>
                  <div className="text-xl font-mono font-bold text-emerald-700">91 / 100</div>
                  <div className="text-[11px] text-slate-500 mt-1">Optimal organic carbon</div>
                </div>

                {/* Market price card */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1">
                    <Coins className="w-4 h-4 text-blue-600" />
                    <span>Current Price</span>
                  </div>
                  <div className="text-xl font-mono font-bold text-slate-900">R5,420 / MT</div>
                  <div className="text-[11px] text-emerald-700 font-bold mt-1">+6.8% 30-day trend</div>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Your data sovereignty is protected under African digital privacy protocols.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {step > 1 && step < 4 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 && (
            <button
              onClick={() => setStep((s) => (s + 1) as any)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 3 && (
            <button
              onClick={() => setStep(4)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <span>Generate Digital Twin</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 4 && (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer ml-auto"
            >
              <span>Open Operating Dashboard</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
