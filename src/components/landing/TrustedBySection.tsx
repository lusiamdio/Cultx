import React from "react";

interface AgriEnterprise {
  name: string;
  sector: string;
  headquarters: string;
}

const TOP_AFRICAN_AGRI_COMPANIES: AgriEnterprise[] = [
  {
    name: "Dangote Sugar & Agro Industries",
    sector: "Agro-Processing & Refining",
    headquarters: "Nigeria",
  },
  {
    name: "OCP Africa",
    sector: "Soil Nutrition & Crop Diagnostics",
    headquarters: "Morocco",
  },
  {
    name: "BUA Foods",
    sector: "Grain Milling & Sugar Estates",
    headquarters: "Nigeria",
  },
  {
    name: "Tiger Brands",
    sector: "Diversified Agricultural FMCG",
    headquarters: "South Africa",
  },
  {
    name: "Illovo Sugar Africa",
    sector: "Cane Production & Bio-Energy",
    headquarters: "South Africa",
  },
  {
    name: "Zambeef Products",
    sector: "Cold-Chain Protein & Grains",
    headquarters: "Zambia",
  },
  {
    name: "Kakuzi PLC",
    sector: "Horticulture & Macadamia",
    headquarters: "Kenya",
  },
  {
    name: "Olam Agri Africa",
    sector: "Pan-African Bulk Sourcing",
    headquarters: "Pan-Africa",
  },
  {
    name: "Export Trading Group (ETG)",
    sector: "Supply Chain & Input Distribution",
    headquarters: "Tanzania & East Africa",
  },
  {
    name: "Flour Mills of Nigeria",
    sector: "Commercial Grains & Animal Feeds",
    headquarters: "Nigeria",
  },
  {
    name: "Omnia Holdings Agriculture",
    sector: "Precision Agronomy & Fertilizer",
    headquarters: "South Africa",
  },
  {
    name: "Sasaby Agribusiness",
    sector: "Integrated Cereal Outgrowers",
    headquarters: "Ghana",
  },
  {
    name: "Tongaat Hulett",
    sector: "Agriculture & Starch Milling",
    headquarters: "Southern Africa",
  },
  {
    name: "Golden Agri Pan-Africa",
    sector: "Oil Palm & Seed Crushing",
    headquarters: "West Africa",
  },
  {
    name: "Seed Co Group",
    sector: "Certified Hybrid Seed Breeding",
    headquarters: "Zimbabwe & Pan-Africa",
  },
  {
    name: "Cevital Agro-Industrie",
    sector: "Agro-Refining & Port Logistics",
    headquarters: "Algeria",
  },
];

export const TrustedBySection: React.FC = () => {
  return (
    <section className="py-14 bg-[#080D10] border-y border-[#18232A]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
            Institutional Trust & Wholesale Off-Take
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FDFBF7] tracking-tight mt-2">
            Trusted by Africa's Top Agricultural Enterprises
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Powering sovereign data infrastructure, commercial off-take contracts, and precision supply chain intelligence for the continent's leading producers, millers, and agribusiness corporations.
          </p>
        </div>

        {/* Company Names Display Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {TOP_AFRICAN_AGRI_COMPANIES.map((company, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl bg-[#0E151A] border border-[#1D2A32] hover:border-[#14533C] transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400/90 uppercase block mb-1">
                  {company.headquarters}
                </span>
                <h3 className="text-sm font-extrabold text-white group-hover:text-emerald-200 transition-colors leading-snug">
                  {company.name}
                </h3>
              </div>
              <div className="pt-3 mt-3 border-t border-[#18232A]">
                <span className="text-[11px] text-slate-400 font-medium block leading-tight">
                  {company.sector}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Sub-Metric Guarantee Bar */}
        <div className="mt-8 pt-6 border-t border-[#141C22] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Over 12.4M Metric Tonnes Under Digital Contract</span>
          </div>
          <div className="flex items-center gap-2">
            <span>AfCFTA Protocol-Compliant Clearing</span>
            <span>•</span>
            <span>Zero Data Leakage Sovereign Cloud Architecture</span>
          </div>
        </div>
      </div>
    </section>
  );
};
