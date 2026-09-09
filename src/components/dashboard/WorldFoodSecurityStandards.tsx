import React, { useState } from "react";
import {
  ShieldCheck,
  Globe2,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Award,
  Download,
  Share2,
  ExternalLink,
  ChevronRight,
  Info,
  Droplets,
  Sprout,
  Sparkles,
  HelpCircle,
  FileText,
  Clock,
  Wheat,
  QrCode,
  X,
  TrendingUp,
  BarChart3,
  Layers,
  HeartHandshake,
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from "recharts";
import { useApp } from "../../context/AppContext";

export interface StandardPillar {
  id: string;
  title: string;
  authority: string;
  frameworkRef: string;
  score: number;
  weightPct: number;
  status: "Compliant" | "Action Required" | "Certified Benchmark";
  keyMetric: string;
  benchmarkValue: string;
  measuredValue: string;
  exportPremiumUSD: number;
  summary: string;
  remedyAction: string;
  isActionDone: boolean;
  checklist: {
    item: string;
    passed: boolean;
    standardClause: string;
  }[];
}

const INITIAL_PILLARS: StandardPillar[] = [
  {
    id: "pillar-codex-mrl",
    title: "Codex Alimentarius & Chemical Safety (MRL)",
    authority: "FAO / WHO Codex Alimentarius & GlobalG.A.P. IFA v6",
    frameworkRef: "CXS 193-1995 • Maximum Residue Limits (MRL)",
    score: 96,
    weightPct: 25,
    status: "Compliant",
    keyMetric: "Total Aflatoxins & Mycotoxin Contamination",
    benchmarkValue: "< 10.0 ppb (Export Tier-1)",
    measuredValue: "3.2 ppb (Certified Safe)",
    exportPremiumUSD: 14,
    summary:
      "Codex global threshold mandates strict limits on biological contaminants and agrochemical residues. Farm grain samples tested significantly below safety thresholds with zero synthetic organophosphates detected.",
    remedyAction:
      "Maintain active 18-day Pre-Harvest Interval (PHI) on Field 2 before final harvest pass.",
    isActionDone: true,
    checklist: [
      { item: "Aflatoxin B1 < 5.0 ppb and Total Aflatoxins < 10.0 ppb", passed: true, standardClause: "Codex Stan 193-1995 §3.1" },
      { item: "Zero banned persistent organic pollutants (POPs) in soil", passed: true, standardClause: "Stockholm Convention Annex A" },
      { item: "Calibrated boom sprayer pressure with zero spray drift", passed: true, standardClause: "GlobalG.A.P. CB 7.4.2" },
      { item: "Pre-Harvest Interval (PHI) digital timestamp log verified", passed: true, standardClause: "Codex MRL Database 2026" },
    ],
  },
  {
    id: "pillar-soil-cfs",
    title: "Soil Stewardship & Sustainable Nutrient Management",
    authority: "UN Committee on World Food Security (CFS-RAI) & FAO",
    frameworkRef: "CFS-RAI Principle 6 • Sustainable Soil Governance",
    score: 93,
    weightPct: 20,
    status: "Compliant",
    keyMetric: "Soil Organic Matter (SOM) & 4R Nutrient Balance",
    benchmarkValue: "> 3.0% SOM • Balanced N-P-K",
    measuredValue: "3.82% SOM • 44 ppm Available N",
    exportPremiumUSD: 10,
    summary:
      "World Food Security policy prioritizes soil biological vitality to guarantee generational yield resilience. The farm deploys 4R Nutrient Stewardship, cover cropping with vetch, and minimum tillage.",
    remedyAction:
      "Expand legume cover cropping to Field 4 perimeter to prevent micro-nutrient depletion during off-season.",
    isActionDone: false,
    checklist: [
      { item: "Soil organic matter maintained > 3.0% across all arable zones", passed: true, standardClause: "FAO VGSSM Guidelines §2.4" },
      { item: "Precision nitrogen application preventing groundwater nitrate leaching", passed: true, standardClause: "4R Nutrient Stewardship Standard" },
      { item: "Contour plowing and vegetative buffer strips along drainage contours", passed: true, standardClause: "CFS-RAI Principle 6.2" },
      { item: "Annual accredited multi-element soil chemistry lab assay", passed: true, standardClause: "ISO/IEC 17025 Certified Test" },
    ],
  },
  {
    id: "pillar-water-spring",
    title: "Water Stewardship & Pathogen Safety",
    authority: "GlobalG.A.P. SPRING Standard & WHO Irrigation Hygiene",
    frameworkRef: "SPRING Add-on v2 • Sustainable Water Use in Agriculture",
    score: 95,
    weightPct: 20,
    status: "Compliant",
    keyMetric: "Microbiological Irrigation Water Quality",
    benchmarkValue: "< 100 CFU / 100ml E. coli",
    measuredValue: "6 CFU / 100ml (Potable Grade)",
    exportPremiumUSD: 8,
    summary:
      "Safeguarding aquatic ecosystems while eliminating pathogenic contamination in irrigation and crop wash channels. Micro-drip fertigation achieves 38% water savings over regional benchmarks.",
    remedyAction:
      "Install solar telemetry sensor at secondary intake pump to verify seasonal extraction quota limits.",
    isActionDone: true,
    checklist: [
      { item: "Zero fecal coliforms or Salmonella in pre-harvest irrigation water", passed: true, standardClause: "WHO Guidelines for Safe Water Use" },
      { item: "Permitted water abstraction rights registered with River Basin Authority", passed: true, standardClause: "GlobalG.A.P. SPRING §1.1" },
      { item: "15-meter uncultivated natural riparian buffer zone preserved", passed: true, standardClause: "Ramsar Wetland Stewardship Protocol" },
      { item: "Volumetric soil moisture tensiometer-guided irrigation scheduling", passed: true, standardClause: "FAO Irrigation and Drainage Paper 56" },
    ],
  },
  {
    id: "pillar-postharvest-loss",
    title: "Post-Harvest Food Loss Prevention & Moisture Control",
    authority: "FAO Global Food Loss Index & CFS Food Loss Framework",
    frameworkRef: "SDG 12.3 • Global Reduction of Post-Harvest Food Loss",
    score: 91,
    weightPct: 20,
    status: "Compliant",
    keyMetric: "Stored Grain Moisture & Insect Spoilage Index",
    benchmarkValue: "≤ 12.5% Moisture • 0% Weevil Damage",
    measuredValue: "12.2% Moisture • 0.08% Grain Damage",
    exportPremiumUSD: 12,
    summary:
      "The UN CFS mandates eliminating post-harvest grain losses to stabilize domestic food reserves. Hermetic multi-layer bags and aeration fans in certified silos halt fungal proliferation.",
    remedyAction:
      "Equip batch warehouse pallets with raised moisture-barrier plastic skids before peak delivery.",
    isActionDone: false,
    checklist: [
      { item: "Grain moisture measured with calibrated dielectric moisture meter at < 12.5%", passed: true, standardClause: "WFP Food Quality Manual §4.2" },
      { item: "Hermetic sealed grain storage liners (PICS technology) deployed", passed: true, standardClause: "FAO Food Loss Mitigation Protocol" },
      { item: "Rodent-proof concrete aprons and insect traps logged bi-weekly", passed: true, standardClause: "ISO 22000 Food Safety Management" },
      { item: "Traceable bin identifiers matching farm harvest date and field zone", passed: true, standardClause: "e-WRS Digital Collateral Standard" },
    ],
  },
  {
    id: "pillar-traceability-sps",
    title: "AfCFTA Sanitary/Phytosanitary & Fair Labor Standards",
    authority: "IPPC ePhyto Hub & CFS-RAI Principle 2 (Fair Labor)",
    frameworkRef: "AfCFTA Annex 7 SPS Protocol & IPPC ISPM 12",
    score: 88,
    weightPct: 15,
    status: "Action Required",
    keyMetric: "Cryptographic Provenance & Worker Safety Compliance",
    benchmarkValue: "100% Polygon Traceability • Zero Child Labor",
    measuredValue: "GPS Geofenced • PPE Compliance 92%",
    exportPremiumUSD: 6,
    summary:
      "Global buyers require verifiable provenance to ensure products are legally grown on non-deforested land with ethical labor practices and complete pest-free phytosanitary clearance.",
    remedyAction:
      "Complete annual worker occupational health & safety training logbook to achieve 100% compliance.",
    isActionDone: false,
    checklist: [
      { item: "Farm boundary polygon verified against non-deforestation registries (EUDR compliant)", passed: true, standardClause: "EU Regulation 2023/1115" },
      { item: "Zero child labor policy strictly enforced with birth registry verification", passed: true, standardClause: "ILO Conventions 138 & 182" },
      { item: "Certified digital phytosanitary certificate (e-Phyto) XML generated", passed: true, standardClause: "IPPC ISPM 12 Standard" },
      { item: "Personal Protective Equipment (PPE) inspection and first-aid kits verified", passed: false, standardClause: "GlobalG.A.P. AF 3.1 & GRASP" },
    ],
  },
];

export const WorldFoodSecurityStandards: React.FC = () => {
  const { currentFarm } = useApp();
  const [pillars, setPillars] = useState<StandardPillar[]>(INITIAL_PILLARS);
  const [selectedPillarId, setSelectedPillarId] = useState<string>("pillar-codex-mrl");
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [certificateCopied, setCertificateCopied] = useState<boolean>(false);

  // Overall Weighted Score Calculation
  const totalWeightedScore = Math.round(
    pillars.reduce((acc, p) => acc + (p.score * p.weightPct) / 100, 0)
  );

  // Total Export Premium Potential
  const totalExportPremiumUSD = pillars.reduce((acc, p) => acc + p.exportPremiumUSD, 0);
  const estimatedHarvestTonnes = 890; // from yield engine
  const totalFinancialBonusUSD = totalExportPremiumUSD * estimatedHarvestTonnes;

  // Selected Pillar
  const selectedPillar = pillars.find((p) => p.id === selectedPillarId) || pillars[0];

  // Radar Data for Benchmarking Chart
  const radarData = pillars.map((p) => ({
    pillarName: p.title.split(" & ")[0].replace("Codex Alimentarius", "Codex MRL").replace("Sustainable ", "").replace("AfCFTA ", ""),
    farmScore: p.score,
    codexBenchmark: 85,
    regionalAverage: 62,
  }));

  // Toggle Action Remediation
  const handleToggleRemedy = (pillarId: string) => {
    setPillars((prev) =>
      prev.map((p) => {
        if (p.id === pillarId) {
          const newDone = !p.isActionDone;
          const scoreDelta = newDone ? 4 : -4;
          return {
            ...p,
            isActionDone: newDone,
            score: Math.min(100, p.score + scoreDelta),
            status: p.score + scoreDelta >= 90 ? "Compliant" : "Action Required",
            checklist: p.checklist.map((c, i) =>
              i === p.checklist.length - 1 ? { ...c, passed: newDone } : c
            ),
          };
        }
        return p;
      })
    );
  };

  const handleCopyCertificate = () => {
    setCertificateCopied(true);
    setTimeout(() => setCertificateCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Policy Framework Hero Banner */}
      <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#0B3D2C] border border-[#14533C] text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>World Food Security & Global G.A.P. Compliance Engine</span>
              </h3>
              <p className="text-xs text-slate-400">
                UN FAO Committee on World Food Security (CFS) • Codex Alimentarius • GlobalG.A.P. IFA v6
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Aligns smallholder and commercial farm agronomy with international food safety thresholds, preventing post-harvest loss, eliminating hazardous agrochemicals, and certifying commodities for premium global export contracts.
          </p>
        </div>

        {/* Global Compliance Badge Card */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#162228] p-4 rounded-2xl border border-[#1D2A32] shrink-0">
          <div className="relative flex items-center justify-center">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="#1D2A32"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="#10B981"
                strokeWidth="6"
                strokeDasharray="213.6"
                strokeDashoffset={213.6 - (213.6 * totalWeightedScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-mono text-xl font-extrabold text-white">{totalWeightedScore}%</span>
              <span className="text-[9px] uppercase font-bold text-slate-400">Index</span>
            </div>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-extrabold text-xs text-white uppercase tracking-wider">
                Tier-1 Global Export Certified
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Codex Compliant • WFP Approved
            </div>
            <button
              onClick={() => setShowCertificateModal(true)}
              className="mt-1 px-3 py-1.5 rounded-lg bg-[#0B3D2C] hover:bg-[#0E4B37] text-emerald-300 text-xs font-bold border border-[#196349] transition-all cursor-pointer flex items-center gap-1.5 justify-center w-full shadow-xs"
            >
              <Award className="w-3.5 h-3.5" />
              <span>View Global Certificate</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Financial & Policy Impact Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Export Price Premium</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-400">
            +${totalExportPremiumUSD} / MT
          </div>
          <div className="text-[11px] text-slate-400">
            Above baseline regional local spot rates
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Harvest Value Boost</span>
            <Award className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-cyan-300">
            +${totalFinancialBonusUSD.toLocaleString()} USD
          </div>
          <div className="text-[11px] text-slate-400">
            ~R{(totalFinancialBonusUSD * 17.5).toLocaleString()} ZAR for 890 MT output
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Aflatoxin Hazard Level</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-white">
            3.2 ppb <span className="text-xs text-slate-400 font-normal">/ 10 max</span>
          </div>
          <div className="text-[11px] text-emerald-300">
            Zero rejection risk at export ports
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">WFP & Off-Take Status</span>
            <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-amber-300">
            FtMA Pre-Qualified
          </div>
          <div className="text-[11px] text-slate-400">
            UN World Food Programme priority buy
          </div>
        </div>
      </div>

      {/* Main Grid: Pillar Navigator + Deep Audit Details & Radar Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 5 Pillars List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>5 Core World Food Security Policy Pillars</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">Select to audit</span>
          </div>

          <div className="space-y-2.5">
            {pillars.map((pillar) => {
              const isSelected = selectedPillarId === pillar.id;
              return (
                <div
                  key={pillar.id}
                  onClick={() => setSelectedPillarId(pillar.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? "bg-[#16242B] border-emerald-500/50 shadow-md"
                      : "bg-[#10171B] border-[#1D2A32] hover:bg-[#162228]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                        {pillar.authority.split(" & ")[0]}
                      </div>
                      <h5 className="font-bold text-sm text-white leading-tight mt-0.5">
                        {pillar.title}
                      </h5>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-extrabold text-base text-white">
                        {pillar.score}%
                      </span>
                      <span className="block text-[9px] text-slate-400">
                        {pillar.weightPct}% Weight
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#0B1013] rounded-lg border border-[#1D2A32] flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Audited Metric:</span>
                      <span className="font-medium text-slate-200">{pillar.measuredValue}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">Benchmark:</span>
                      <span className="font-mono text-emerald-300 font-bold">{pillar.benchmarkValue}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#1D2A32]">
                    <span
                      className={`font-bold px-2 py-0.5 rounded ${
                        pillar.status === "Compliant"
                          ? "bg-[#07261B] text-emerald-300 border border-[#14533C]"
                          : "bg-amber-950/80 text-amber-300 border border-amber-800"
                      }`}
                    >
                      {pillar.status}
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      +${pillar.exportPremiumUSD} / MT Premium
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Radar Comparison Chart */}
          <div className="p-4 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-xs text-white flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Global Standard Radar Benchmark</span>
              </h5>
              <span className="text-[10px] font-mono text-slate-400">Codex vs. Regional</span>
            </div>

            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#1D2A32" />
                  <PolarAngleAxis dataKey="pillarName" stroke="#94A3B8" fontSize={10} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                  <Radar
                    name="Your Farm"
                    dataKey="farmScore"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.4}
                  />
                  <Radar
                    name="Global Codex Standard"
                    dataKey="codexBenchmark"
                    stroke="#38BDF8"
                    fill="#38BDF8"
                    fillOpacity={0.15}
                  />
                  <Radar
                    name="Regional Smallholder Mean"
                    dataKey="regionalAverage"
                    stroke="#64748B"
                    fill="#64748B"
                    fillOpacity={0.05}
                  />
                  <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "5px" }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#0B1013] p-2.5 rounded-lg border border-[#1D2A32] text-[11px] space-y-1 font-mono">
                            <div className="font-bold text-white pb-1 border-b border-[#1D2A32]">
                              {payload[0].payload.pillarName}
                            </div>
                            {payload.map((e: any, i: number) => (
                              <div key={i} className="flex justify-between gap-3 text-slate-300">
                                <span>{e.name}:</span>
                                <span className="font-bold text-white">{e.value}%</span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Pillar Deep-Dive, Action Plan & Checklist (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 bg-[#10171B] rounded-2xl border border-[#1D2A32] shadow-md space-y-5">
            {/* Pillar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1D2A32] pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-300 bg-[#07261B] px-2.5 py-0.5 rounded border border-[#14533C]">
                  {selectedPillar.frameworkRef}
                </span>
                <h4 className="text-lg font-extrabold text-white mt-1.5">
                  {selectedPillar.title}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Governing Authority: {selectedPillar.authority}
                </p>
              </div>

              <div className="text-right sm:text-right bg-[#162228] p-3 rounded-xl border border-[#1D2A32] shrink-0">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Compliance Score</span>
                <span className="font-mono text-2xl font-extrabold text-emerald-400">
                  {selectedPillar.score}%
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Export Bonus: +${selectedPillar.exportPremiumUSD}/MT
                </span>
              </div>
            </div>

            {/* Pillar Descriptive Summary */}
            <p className="text-xs text-slate-300 leading-relaxed bg-[#162228]/60 p-3.5 rounded-xl border border-[#1D2A32]">
              {selectedPillar.summary}
            </p>

            {/* Agronomic Clause Checklist */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-xs text-white uppercase tracking-wider">
                  International Standard Verification Checklist
                </h5>
                <span className="text-[10px] font-mono text-slate-400">
                  {selectedPillar.checklist.filter((c) => c.passed).length} of {selectedPillar.checklist.length} Passed
                </span>
              </div>

              <div className="space-y-2">
                {selectedPillar.checklist.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#162228] border border-[#1D2A32] flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {c.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <div className={`font-medium ${c.passed ? "text-slate-200" : "text-amber-200"}`}>
                          {c.item}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                          Standard Ref: {c.standardClause}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono shrink-0 uppercase ${
                        c.passed
                          ? "bg-[#07261B] text-emerald-300 border border-[#14533C]"
                          : "bg-amber-950/80 text-amber-300 border border-amber-800"
                      }`}
                    >
                      {c.passed ? "Verified" : "Pending Log"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actionable Remediation Box */}
            <div className="p-4 bg-[#0B1013] rounded-xl border border-emerald-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-xs text-white">Recommended Policy Remediation Step</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-300">
                  {selectedPillar.isActionDone ? "Completed (+4% Boost)" : "Pending Implementation"}
                </span>
              </div>

              <p className="text-xs text-slate-300">
                {selectedPillar.remedyAction}
              </p>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  Completing this action upgrades your farm to highest international assurance grade.
                </span>
                <button
                  onClick={() => handleToggleRemedy(selectedPillar.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedPillar.isActionDone
                      ? "bg-[#07261B] text-emerald-300 border border-[#14533C]"
                      : "bg-[#0B3D2C] hover:bg-[#0E4B37] text-white border border-[#196349]"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{selectedPillar.isActionDone ? "Marked as Done" : "Mark as Completed"}</span>
                </button>
              </div>
            </div>

            {/* WFP & International Off-Take Contract Linkage */}
            <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0B3D2C] border border-[#196349] text-emerald-300 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">
                    UN WFP Farm to Market Alliance (FtMA) Procurement
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Compliant farms gain direct priority access to emergency food reserve purchase quotas at locked floor prices.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowCertificateModal(true)}
                className="px-3 py-1.5 rounded-lg bg-[#10171B] hover:bg-[#1D2A32] text-slate-200 text-xs font-semibold border border-[#1D2A32] transition-colors cursor-pointer shrink-0"
              >
                Inspect Pass
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Official Global Standard Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#10171B] border border-[#1D2A32] rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Certificate Header */}
            <div className="flex items-center justify-between border-b border-[#1D2A32] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B3D2C] border border-[#14533C] text-emerald-400 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base sm:text-lg">
                    World Food Security & Global G.A.P. Standard Passport
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    Certificate ID: CFS-CODEX-2026-{currentFarm.id.toUpperCase()}-9941
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#162228] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Body Container */}
            <div className="p-6 bg-[#0B1013] rounded-2xl border-2 border-[#196349] space-y-5 text-xs relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 opacity-5 text-white pointer-events-none">
                <Globe2 className="w-64 h-64" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1D2A32] pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Certified Producer</span>
                  <span className="font-extrabold text-white text-base">{currentFarm.name}</span>
                  <span className="text-slate-400 block text-[11px]">
                    Owner: {currentFarm.ownerName} • {currentFarm.region}, {currentFarm.country}
                  </span>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Global Compliance Rating</span>
                  <span className="font-mono text-xl font-extrabold text-emerald-400">
                    {totalWeightedScore}% (Grade A Export)
                  </span>
                  <span className="text-slate-400 block text-[10px]">Audit Cycle: 2026/2027 Season</span>
                </div>
              </div>

              {/* Policy Framework Accreditations */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-2.5 bg-[#162228] rounded-lg border border-[#1D2A32]">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Food Safety</span>
                  <span className="font-bold text-white text-xs">Codex Alimentarius</span>
                  <span className="text-[10px] text-emerald-300 block">Aflatoxin &lt; 3.2 ppb</span>
                </div>

                <div className="p-2.5 bg-[#162228] rounded-lg border border-[#1D2A32]">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Good Practice</span>
                  <span className="font-bold text-white text-xs">GlobalG.A.P. IFA v6</span>
                  <span className="text-[10px] text-emerald-300 block">SPRING Certified</span>
                </div>

                <div className="p-2.5 bg-[#162228] rounded-lg border border-[#1D2A32] col-span-2 sm:col-span-1">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Trade Treaty</span>
                  <span className="font-bold text-white text-xs">AfCFTA Annex 7 SPS</span>
                  <span className="text-[10px] text-emerald-300 block">e-Phyto Validated</span>
                </div>
              </div>

              {/* Attestation Text */}
              <p className="text-[11px] text-slate-300 leading-relaxed border-t border-[#1D2A32] pt-3">
                This document certifies that agricultural produce harvested at this facility complies with United Nations Committee on World Food Security (CFS-RAI) principles, Codex Alimentarius Maximum Residue Limits, and international phytosanitary safeguards. Authorized for unrestricted border crossing along the Lobito Atlantic Corridor and direct delivery to international commercial grain terminals.
              </p>

              {/* Cryptographic Hash & QR Verification */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#1D2A32] text-[10px] font-mono text-slate-400">
                <div className="space-y-0.5">
                  <div>SHA-256 Ledger Stamp:</div>
                  <div className="text-emerald-400 break-all">
                    8f4b2e91a07d391c49e257b60c91837d9910c2834b7190d65a881923719cf012
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-12 h-12 bg-white p-1 rounded-md text-black flex items-center justify-center">
                    <QrCode className="w-10 h-10 text-black" />
                  </div>
                  <div className="text-[9px] text-slate-400">
                    Scan for UN FAO<br />Registry Valid
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-400">
                Issued by: <strong className="text-slate-200">Pan-African Food Safety & SPS Directorate</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCertificate}
                  className="px-4 py-2 rounded-xl bg-[#162228] hover:bg-[#1D2A32] text-slate-200 text-xs font-semibold border border-[#1D2A32] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{certificateCopied ? "Pass Link Copied!" : "Copy Digital Token"}</span>
                </button>

                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="px-5 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold border border-[#196349] transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Done</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
