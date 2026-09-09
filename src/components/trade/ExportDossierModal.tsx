import React, { useState } from "react";
import {
  X,
  FileCheck,
  Download,
  Printer,
  ShieldCheck,
  QrCode,
  Building,
  CheckCircle2,
  ExternalLink,
  Award,
  Stamp,
  Truck,
  Layers,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface ExportDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportDossierModal: React.FC<ExportDossierModalProps> = ({ isOpen, onClose }) => {
  const { currentFarm } = useApp();
  const [activeDocTab, setActiveDocTab] = useState<number>(0);

  if (!isOpen) return null;

  const documents = [
    {
      id: "phyto",
      title: "1. Phytosanitary Certificate",
      authority: "National Plant Protection Organisation (NPPO)",
      docNumber: "NPPO/ZA/2026/04192",
      status: "Verified & Inspected",
      color: "border-emerald-500",
      content: {
        botanicalName: "Zea mays var. indentata (Yellow Maize)",
        declaration:
          "This is to certify that the plants, plant products or other regulated articles described herein have been inspected and found free from quarantine pests (including Spodoptera frugiperda and Prostephanus truncatus) and conform with current phytosanitary regulations of the importing contracting party (Republic of Kenya).",
        treatment: "Phosphine (PH3) Fumigation @ 1.5g/m³ for 120 hours at 24°C",
        consignmentWeight: "200.00 Metric Tonnes (4,000 x 50kg bags)",
        pointOfEntry: "Port of Mombasa, Kenya / Malaba Border Post",
      },
    },
    {
      id: "origin",
      title: "2. AfCFTA Certificate of Origin",
      authority: "AfCFTA Secretariat / SACU Customs Directorate",
      docNumber: "AfCFTA-COO-2026-98124",
      status: "Preferential Tariff Qualified (0% Duty)",
      color: "border-blue-500",
      content: {
        exporter: `${currentFarm.name}, Free State, South Africa`,
        importer: "Kenya National Cereals and Produce Board (NCPB), Nairobi",
        originCriterion: "100% Wholly Produced in AU Member State (Rule of Origin Annex 2)",
        hsCode: "HS 1005.90 - Maize (Corn), Other Than Seed",
        customsTariffTreatment: "Preferential AfCFTA Regime - 0.0% Import Tariff (Regular MFN: 25.0%)",
        papssInvoiceRef: "PAPSS-INV-ZA-KE-2026-7789",
      },
    },
    {
      id: "bol",
      title: "3. Multimodal Bill of Lading",
      authority: "Bolloré / CMA CGM African Logistics Corridor",
      docNumber: "BOL-MULT-2026-8831",
      status: "Telematic Escort Active",
      color: "border-cyan-500",
      content: {
        carrier: "Trans-East Multimodal Rail & Freight",
        vesselVoyage: "MV African Sun v.2604 / Beitbridge-Malaba Rail Escort",
        portOfLoading: "Durban Container Terminal, South Africa",
        portOfDischarge: "Inland Container Depot Nairobi (ICDN), Kenya",
        containers: "8 x 40ft High-Cube Sealed Grain Containers (TGHU-99214 to TGHU-99221)",
        tamperSealStatus: "Digital RFID Tamper Seals Armed (0 Breaches)",
      },
    },
    {
      id: "papss_inv",
      title: "4. Commercial E-Invoice (PAPSS)",
      authority: "Pan-African Payment and Settlement System",
      docNumber: "PAPSS-TX-992104-EINV",
      status: "Escrow Deposited in KES",
      color: "border-purple-500",
      content: {
        settlementRoute: "Central Bank of Kenya (CBK) ⇄ South African Reserve Bank (SARB)",
        contractValueLocal: "KES 41,180,000 Locked in Escrow",
        disbursementValueLocal: "R5,420,000 ZAR Auto-Credit on Delivery",
        fxIntermediation: "Zero USD conversion required (Saved $2,840 in correspondent banking fees)",
        taxExemption: "AfCFTA Cross-Border Trade Exemption Article 13",
      },
    },
    {
      id: "packing",
      title: "5. Export Packing List",
      authority: "Verified Weighbridge & Logistics Inspectorate",
      docNumber: "PL-EXP-2026-5542",
      status: "Axle Weighbridge Certified",
      color: "border-amber-500",
      content: {
        packaging: "Heavy-duty UV-stabilized food grade Polypropylene Bags",
        bagCount: "4,000 Bags @ 50.0 kg Net each",
        grossWeight: "201,240 kg (Palletized & stretch wrapped)",
        tareWeight: "1,240 kg",
        markings: "CULTX / AFRIGRAIN EXPORT LOT #ZA-2026-08 - FOOD AID & COMMERCIAL RESERVE",
      },
    },
    {
      id: "quality",
      title: "6. SGS / SAFEX Quality & Grade Certificate",
      authority: "Société Générale de Surveillance (SGS Africa)",
      docNumber: "SGS-QIS-2026-1189",
      status: "Grade 1 Export Premium",
      color: "border-emerald-600",
      content: {
        moistureContent: "12.1% (Standard Export Ceiling: 13.5%)",
        totalAflatoxin: "1.8 ppb (Strict AU Ceiling: < 10 ppb)",
        brokenKernels: "1.4% (Max Allowable: 3.0%)",
        foreignMatter: "0.2% (Max Allowable: 1.0%)",
        proteinDryBasis: "9.2% (Optimal Feed & Milling Grade)",
      },
    },
    {
      id: "fumigation",
      title: "7. Quarantine & Fumigation Clearance",
      authority: "SADC Plant Health Biosecurity Division",
      docNumber: "FUM-BIO-2026-3391",
      status: "Residue Level 0.0 ppm (Safe)",
      color: "border-teal-500",
      content: {
        fumigantGas: "Aluminium Phosphide (Celphos pellets generating Phosphine gas)",
        gasConcentrationRetained: "450 ppm for 120 hours minimum",
        degassingVentilationTime: "48 hours aeration completed",
        postTreatmentLiveInsects: "NIL (Zero live weevils or borer insects)",
        safetyOfficerSignOff: "Dr. K. Naidoo, Reg. Biosecurity Inspector #441",
      },
    },
  ];

  const currentDoc = documents[activeDocTab];

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1013]/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-[#10171B] rounded-3xl max-w-4xl w-full border border-[#1D2A32] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#07261B] text-white flex items-center justify-between border-b border-[#14533C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B3D2C] border border-[#196349] text-white flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  AfCFTA 7-Document Harmonized Trade Dossier
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B3D2C] text-emerald-300 border border-[#196349]">
                  PAPSS & Single-Window Compliant
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Official cross-border legal, customs, and phytosanitary packet for {currentFarm.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#0B3D2C] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Switcher Tabs */}
        <div className="bg-[#162228] p-2 border-b border-[#1D2A32] flex items-center gap-1.5 overflow-x-auto">
          {documents.map((doc, idx) => (
            <button
              key={doc.id}
              onClick={() => setActiveDocTab(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeDocTab === idx
                  ? "bg-[#0B3D2C] text-white shadow-sm border border-[#196349]"
                  : "text-slate-400 hover:text-white hover:bg-[#1D2A32]"
              }`}
            >
              {doc.title}
            </button>
          ))}
        </div>

        {/* Active Document Viewer Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-6 bg-[#162228] rounded-2xl border-2 border-dashed border-[#1D2A32] relative space-y-4 shadow-inner">
            {/* Official Watermark & Stamp */}
            <div className="absolute top-6 right-6 flex flex-col items-center opacity-85">
              <div className="w-20 h-20 rounded-full border-2 border-emerald-500 flex flex-col items-center justify-center text-emerald-300 text-[9px] font-mono uppercase font-bold text-center p-1 transform rotate-12 bg-[#07261B]/60">
                <span>★ AfCFTA ★</span>
                <span className="text-[8px] font-extrabold text-white">VERIFIED</span>
                <span>ORIGIN SACU</span>
              </div>
              <div className="text-[9px] font-mono text-slate-500 mt-1">Hash: 0x9e4b...8a12</div>
            </div>

            {/* Document Header */}
            <div className="border-b border-[#1D2A32] pb-4 pr-24">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                {currentDoc.authority}
              </div>
              <h4 className="text-lg font-extrabold text-white mt-0.5">
                {currentDoc.title}
              </h4>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
                <span>Document Ref: <strong className="text-white">{currentDoc.docNumber}</strong></span>
                <span>•</span>
                <span className="text-emerald-300 font-bold bg-[#07261B] border border-[#14533C] px-2 py-0.5 rounded">
                  {currentDoc.status}
                </span>
              </div>
            </div>

            {/* Document Content Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {Object.entries(currentDoc.content).map(([key, value], idx) => (
                <div key={idx} className="p-3.5 bg-[#10171B] rounded-xl border border-[#1D2A32] space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </div>
                  <div className="font-semibold text-slate-200 leading-relaxed">
                    {String(value)}
                  </div>
                </div>
              ))}
            </div>

            {/* Verification Signatures & QR */}
            <div className="pt-4 border-t border-[#1D2A32] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-300 p-1 flex items-center justify-center shadow-xs">
                  <QrCode className="w-10 h-10 text-slate-900" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">Single-Window Digital Signature</div>
                  <div className="text-[11px] font-mono text-slate-400">
                    ECDSA P-256 Public Key Verified • Nonce: 8841029
                  </div>
                </div>
              </div>

              <div className="text-right text-xs">
                <div className="text-slate-400 font-medium">Certified Officer</div>
                <div className="font-bold text-emerald-300 font-serif italic text-sm">
                  Dr. K. Naidoo (Lead Inspector)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#10171B] border-t border-[#1D2A32] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Export packet accepted at all 54 African Union border posts under AfCFTA protocols.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintDossier}
              className="px-4 py-2 rounded-xl border border-[#1D2A32] bg-[#162228] hover:bg-[#1D2A32] text-slate-300 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer min-h-[44px]"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Print Document Packet</span>
            </button>

            <button
              onClick={() => {
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md border border-[#196349] min-h-[44px]"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Download Signed Dossier (.ZIP / PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
