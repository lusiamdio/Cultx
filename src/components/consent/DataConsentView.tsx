import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Download,
  AlertCircle,
  CheckCircle2,
  Trash2,
  KeyRound,
  FileSpreadsheet,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const DataConsentView: React.FC = () => {
  const { consentSettings: contextConsent, toggleConsent, currentFarm } = useApp();
  const [revokedBanner, setRevokedBanner] = useState<string | null>(null);

  const consentSettings = contextConsent || {
    shareWithFinancialInstitutions: true,
    shareWithGovernmentPolicy: false,
    shareWithMarketplaceBuyers: true,
    allowSatelliteNdviAnalysis: true,
    retentionMonths: 24,
  };

  const handleToggle = (key: any, name: string) => {
    if (toggleConsent) {
      toggleConsent(key);
    }
    setRevokedBanner(`Data permission for ${name} updated.`);
    setTimeout(() => setRevokedBanner(null), 2500);
  };

  const handleExportAll = () => {
    if (!currentFarm) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(currentFarm, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `${currentFarm.name.replace(/\s+/g, "_")}_DataSovereignty_Export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const consentItems = [
    {
      key: "shareWithFinancialInstitutions",
      title: "Commercial & Development Banks (Credit Underwriting)",
      dataShared: "Farm boundary coordinates, 5-year historical yield data, soil test index",
      purpose: "Unlocks unsecured low-interest seasonal input financing and working capital",
      retention: "Active loan cycle only (12 months maximum)",
      parties: "Standard Bank, African Development Bank, Land Bank",
      enabled: Boolean(consentSettings.shareWithFinancialInstitutions),
    },
    {
      key: "shareWithGovernmentPolicy",
      title: "Ministry of Agriculture (Anonymized Food Security)",
      dataShared: "Aggregate harvest tonnage and crop type (strictly anonymized, zero GPS/owner identity)",
      purpose: "Calculates national food security reserves and fertilizer import quotas",
      retention: "Aggregated statistical record (Sovereign Open Data)",
      parties: "Department of Agriculture, Land Reform & Rural Development",
      enabled: Boolean(consentSettings.shareWithGovernmentPolicy),
    },
    {
      key: "shareWithMarketplaceBuyers",
      title: "Verified Commercial Off-Takers & Millers",
      dataShared: "Surplus commodity tonnage, harvest readiness date, certified quality grade",
      purpose: "Enables verified buyers to place firm bids and issue advance purchase contracts",
      retention: "Until sale contract is fulfilled",
      parties: "Tiger Brands, Premier FMCG, Export Aggregators",
      enabled: Boolean(consentSettings.shareWithMarketplaceBuyers),
    },
    {
      key: "allowSatelliteNdviAnalysis",
      title: "Orbital Satellite & Earth Observation Telemetry",
      dataShared: "Multispectral optical reflectances (Sentinel-2, Landsat-9)",
      purpose: "Powers your vegetative NDVI health dashboard, pest risk alerts, and drought insurance",
      retention: "Historical time-series agronomic modeling",
      parties: "CULTx Earth Observation Engine",
      enabled: Boolean(consentSettings.allowSatelliteNdviAnalysis),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Farmer Data Sovereignty Manifesto */}
      <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Trust Architecture & Farmer Data Sovereignty
            </h2>
            <span className="text-xs font-bold text-emerald-300 bg-[#07261B] px-2.5 py-0.5 rounded-full border border-[#14533C]">
              100% Farmer Owned
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            You own your farm boundaries, yields, and telemetry. No entity may inspect your agricultural intelligence without your explicit, granular consent.
          </p>
        </div>

        <button
          onClick={handleExportAll}
          className="px-4 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors border border-[#196349] min-h-[44px]"
        >
          <Download className="w-4 h-4" />
          <span>Export All Data (Zero Lock-In)</span>
        </button>
      </div>

      {revokedBanner && (
        <div className="p-3 bg-[#07261B] border border-[#14533C] text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{revokedBanner}</span>
        </div>
      )}

      {/* 5 Core Trust Pillars (Blueprint Mandate) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <div className="font-bold text-white flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>1. What Data & Why</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Every data request explicitly states the data requested, reason, recipient, and the exact tangible economic value returned to you.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <div className="font-bold text-white flex items-center gap-1.5">
            <EyeOff className="w-4 h-4 text-cyan-400" />
            <span>2. Instant 1-Click Revocation</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Revoking access immediately purges bank or buyer cryptographic read access keys with zero lingering data retention.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <div className="font-bold text-white flex items-center gap-1.5">
            <Download className="w-4 h-4 text-emerald-400" />
            <span>3. Zero Platform Lock-In</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Export your entire geocadastre, NDVI time-series, and harvest books into open GeoJSON, CSV, or ISO-XML formats at any moment.
          </p>
        </div>
      </div>

      {/* Granular Permission Control Cards */}
      <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-sm text-white mb-1">
            Active Data Sharing Agreements & Permissions
          </h3>
          <p className="text-xs text-slate-400">
            Control access permissions independently for financial lenders, national ministries, and commercial buyers.
          </p>
        </div>

        <div className="space-y-4">
          {consentItems.map((item) => (
            <div
              key={item.key}
              className={`p-4 rounded-2xl border transition-all ${
                item.enabled
                  ? "bg-[#162228] border-[#1D2A32]"
                  : "bg-[#0B1013]/60 border-[#19262F] opacity-75"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-sm text-white">{item.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.enabled
                          ? "bg-[#07261B] text-emerald-300 border border-[#14533C]"
                          : "bg-[#10171B] text-slate-400 border border-[#1D2A32]"
                      }`}
                    >
                      {item.enabled ? "Access Active" : "Access Revoked"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        What Data Is Shared:
                      </span>
                      <span className="text-slate-300 font-medium">{item.dataShared}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Tangible Value Returned to Farmer:
                      </span>
                      <span className="text-emerald-300 font-semibold">{item.purpose}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-[#19262F]">
                    <span>
                      <strong className="text-slate-300">Authorized Parties:</strong> {item.parties}
                    </span>
                    <span>
                      <strong className="text-slate-300">Retention:</strong> {item.retention}
                    </span>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() => handleToggle(item.key as any, item.title)}
                  className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    item.enabled ? "bg-[#0B3D2C] border border-[#196349]" : "bg-[#1D2A32]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      item.enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
