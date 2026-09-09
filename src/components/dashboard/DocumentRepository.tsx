import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  ShieldCheck,
  Lock,
  Upload,
  Download,
  Share2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Landmark,
  FileCheck,
  FileSpreadsheet,
  Shield,
  Copy,
  ExternalLink,
  Search,
  Filter,
  Plus,
  X,
  FileCode,
  QrCode,
  Building,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { FarmerDocument, DocumentCategory } from "../../types";

export const DocumentRepository: React.FC = () => {
  const {
    currentFarm,
    farmerDocuments,
    addFarmerDocument,
    deleteFarmerDocument,
    shareFarmerDocument,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDoc, setSelectedDoc] = useState<FarmerDocument | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);
  const [shareModalDoc, setShareModalDoc] = useState<FarmerDocument | null>(null);
  const [shareEntityInput, setShareEntityInput] = useState<string>("");
  const [shareSuccessMsg, setShareSuccessMsg] = useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // New Document Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<DocumentCategory>("Land Title");
  const [newAuthority, setNewAuthority] = useState("");
  const [newDocNumber, setNewDocNumber] = useState("");
  const [newParcelRef, setNewParcelRef] = useState("");
  const [newExpiry, setNewExpiry] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [fileSizeStr, setFileSizeStr] = useState<string>("3.2 MB");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Filtered documents
  const filteredDocs = farmerDocuments.filter((doc) => {
    const matchesCategory =
      activeCategory === "all" || doc.category === activeCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.issuingAuthority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.parcelOrContractRef &&
        doc.parcelOrContractRef.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopyHash = (docId: string, hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHashId(docId);
    setTimeout(() => setCopiedHashId(null), 2500);
  };

  const handleDownload = (doc: FarmerDocument) => {
    // Generate clean certificate / verified manifest blob
    const manifest = {
      repository: "CULTx Pan-African Agricultural Intelligence Vault",
      farmId: doc.farmId,
      farmName: currentFarm.name,
      documentTitle: doc.title,
      category: doc.category,
      documentNumber: doc.documentNumber,
      issuingAuthority: doc.issuingAuthority,
      parcelOrContractRef: doc.parcelOrContractRef,
      cryptographicHashSha256: doc.sha256Hash,
      securityTier: doc.securityTier,
      verificationStatus: doc.verificationStatus,
      downloadTimestamp: new Date().toISOString(),
      authorizedCustodian: currentFarm.ownerName,
      blockchainAuditProof: `https://cultx.africa/verify/doc/${doc.sha256Hash.slice(0, 16)}`,
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title.replace(/[^a-zA-Z0-9]/g, "_")}_Verified_Vault.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadNotice(`Downloaded authenticated manifest for "${doc.title}"`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareModalDoc || !shareEntityInput.trim()) return;
    shareFarmerDocument(shareModalDoc.id, shareEntityInput.trim());
    setShareSuccessMsg(`Cryptographic access token generated for ${shareEntityInput.trim()}`);
    setShareEntityInput("");
    setTimeout(() => {
      setShareSuccessMsg(null);
      setShareModalDoc(null);
    }, 2000);
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setUploadError("Please provide a document title");
      return;
    }
    if (!newAuthority.trim()) {
      setUploadError("Please specify the issuing authority");
      return;
    }

    addFarmerDocument({
      farmId: currentFarm.id,
      title: newTitle.trim(),
      category: newCategory,
      fileType: "pdf",
      fileSize: fileSizeStr || "2.4 MB",
      issuingAuthority: newAuthority.trim(),
      documentNumber:
        newDocNumber.trim() ||
        `DOC-${newCategory.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
      parcelOrContractRef: newParcelRef.trim() || `${currentFarm.name} Registered Asset`,
      verificationStatus: "Registry Validated",
      securityTier: "Deeds Office Ledger Anchor",
      sharedWith: [],
      expiryDate: newExpiry || undefined,
      notes: newNotes.trim() || "Uploaded to secure farmer digital vault.",
      verifiedBy: "Registrar of Deeds / Notary Network",
    });

    // Reset
    setNewTitle("");
    setNewAuthority("");
    setNewDocNumber("");
    setNewParcelRef("");
    setNewExpiry("");
    setNewNotes("");
    setSelectedFileName("");
    setUploadError(null);
    setIsUploadModalOpen(false);
  };

  const getCategoryIcon = (category: DocumentCategory) => {
    switch (category) {
      case "Land Title":
        return <Landmark className="w-5 h-5 text-amber-400" />;
      case "Certification":
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case "Contract":
        return <FileCheck className="w-5 h-5 text-blue-400" />;
      case "Soil Report":
        return <FileSpreadsheet className="w-5 h-5 text-purple-400" />;
      case "Insurance":
        return <Shield className="w-5 h-5 text-cyan-400" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  const getCategoryColor = (category: DocumentCategory) => {
    switch (category) {
      case "Land Title":
        return "bg-amber-950/60 text-amber-300 border-amber-800/60";
      case "Certification":
        return "bg-emerald-950/60 text-emerald-300 border-emerald-800/60";
      case "Contract":
        return "bg-blue-950/60 text-blue-300 border-blue-800/60";
      case "Soil Report":
        return "bg-purple-950/60 text-purple-300 border-purple-800/60";
      case "Insurance":
        return "bg-cyan-950/60 text-cyan-300 border-cyan-800/60";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {downloadNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-[#0B3D2C] border border-emerald-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Repository Header Card */}
      <div className="bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#19262F]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#0B3D2C] border border-[#14533C] text-emerald-400 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>Secure Digital Document Repository</span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#07261B] text-emerald-300 border border-[#14533C]">
                    AES-256 GCM
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tamper-evident legal vault for land tenure deeds, export certifications, off-take contracts, and soil assays.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-[#162228] px-3.5 py-2 rounded-xl border border-[#1D2A32] flex items-center gap-2 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-slate-400 text-[10px] block font-semibold uppercase">Deeds Anchor</span>
                <span className="text-white font-mono font-bold">SHA-256 Synced</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold border border-[#196349] transition-all cursor-pointer flex items-center gap-2 shadow-md min-h-[44px]"
            >
              <Upload className="w-4 h-4 text-emerald-300" />
              <span>Upload Document</span>
            </motion.button>
          </div>
        </div>

        {/* Security & Verification Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div className="p-3 rounded-xl bg-[#162228] border border-[#1D2A32]">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Vaulted Documents</div>
            <div className="text-xl font-mono font-extrabold text-white mt-0.5">{farmerDocuments.length} Total</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">100% Validated</div>
          </div>

          <div className="p-3 rounded-xl bg-[#162228] border border-[#1D2A32]">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Land Titles & Rights</div>
            <div className="text-xl font-mono font-extrabold text-amber-400 mt-0.5">
              {farmerDocuments.filter((d) => d.category === "Land Title").length} Deeds
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">{currentFarm.totalHectares} ha Registered</div>
          </div>

          <div className="p-3 rounded-xl bg-[#162228] border border-[#1D2A32]">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Certifications</div>
            <div className="text-xl font-mono font-extrabold text-emerald-400 mt-0.5">
              {farmerDocuments.filter((d) => d.category === "Certification").length} Verified
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">GlobalGAP + Organic</div>
          </div>

          <div className="p-3 rounded-xl bg-[#162228] border border-[#1D2A32]">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Commercial Off-Take</div>
            <div className="text-xl font-mono font-extrabold text-blue-400 mt-0.5">
              {farmerDocuments.filter((d) => d.category === "Contract").length} Contracts
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">SAFEX Hedged</div>
          </div>
        </div>

        {/* Filter Tabs and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-5 pt-4 border-t border-[#19262F]">
          <div className="flex flex-wrap items-center gap-1.5 bg-[#162228] p-1.5 rounded-xl text-xs overflow-x-auto">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeCategory === "all"
                  ? "bg-[#0B3D2C] text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Documents ({farmerDocuments.length})
            </button>
            <button
              onClick={() => setActiveCategory("Land Title")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeCategory === "Land Title"
                  ? "bg-[#0B3D2C] text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Land Titles ({farmerDocuments.filter((d) => d.category === "Land Title").length})
            </button>
            <button
              onClick={() => setActiveCategory("Certification")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeCategory === "Certification"
                  ? "bg-[#0B3D2C] text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Certifications ({farmerDocuments.filter((d) => d.category === "Certification").length})
            </button>
            <button
              onClick={() => setActiveCategory("Contract")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeCategory === "Contract"
                  ? "bg-[#0B3D2C] text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Contracts ({farmerDocuments.filter((d) => d.category === "Contract").length})
            </button>
            <button
              onClick={() => setActiveCategory("Soil Report")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeCategory === "Soil Report"
                  ? "bg-[#0B3D2C] text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Soil Reports ({farmerDocuments.filter((d) => d.category === "Soil Report").length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, authority, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#162228] border border-[#1D2A32] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Document Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full bg-[#10171B] border border-[#1D2A32] rounded-2xl p-10 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-600 opacity-60" />
            <div className="text-sm font-bold text-white mb-1">No documents found</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              {searchQuery
                ? "No documents match your search criteria. Try a different query or category filter."
                : "No documents stored in this category yet. Vault your land titles, organic certifications, or forward contracts."}
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold rounded-xl border border-[#196349] transition-all cursor-pointer"
            >
              Upload First Document
            </button>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <motion.div
              key={doc.id}
              whileHover={{ y: -3 }}
              className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] hover:border-[#14533C] transition-all shadow-md flex flex-col justify-between group"
            >
              <div>
                {/* Header: Category Badge + Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getCategoryColor(
                      doc.category
                    )}`}
                  >
                    {getCategoryIcon(doc.category)}
                    <span>{doc.category}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#07261B] text-emerald-300 border border-[#14533C] text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{doc.verificationStatus}</span>
                  </span>
                </div>

                {/* Title and ID */}
                <h4 className="font-extrabold text-sm text-white leading-snug group-hover:text-emerald-300 transition-colors">
                  {doc.title}
                </h4>

                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                  <span className="font-mono text-slate-300 font-semibold">{doc.documentNumber}</span>
                  <span>•</span>
                  <span>{doc.fileSize}</span>
                </div>

                {/* Issuing Authority */}
                <div className="mt-3 p-2.5 rounded-xl bg-[#162228] border border-[#1D2A32] text-xs">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Issuing Authority</div>
                  <div className="text-xs font-medium text-slate-200 mt-0.5 truncate">
                    {doc.issuingAuthority}
                  </div>
                  {doc.parcelOrContractRef && (
                    <div className="text-[11px] text-emerald-400/90 mt-1 truncate">
                      Ref: {doc.parcelOrContractRef}
                    </div>
                  )}
                </div>

                {/* Expiry / Security Tier */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{doc.expiryDate ? `Expires: ${doc.expiryDate}` : "Perpetual Title"}</span>
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    {doc.uploadDate}
                  </span>
                </div>

                {/* SHA-256 Hash Display */}
                <div className="mt-3 pt-2.5 border-t border-[#19262F]">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-mono">SHA-256 FINGERPRINT:</span>
                    <button
                      onClick={() => handleCopyHash(doc.id, doc.sha256Hash)}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono cursor-pointer"
                    >
                      {copiedHashId === doc.id ? (
                        <span className="text-emerald-300">Copied!</span>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-[10px] text-slate-400 bg-[#0B1013] p-1.5 rounded-lg truncate border border-[#162228]">
                    {doc.sha256Hash}
                  </div>
                </div>

                {/* Shared Entities Badges */}
                {doc.sharedWith.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-1 text-[10px]">
                    <span className="text-slate-400">Shared with:</span>
                    {doc.sharedWith.map((org, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-[#162228] text-slate-300 border border-[#1D2A32]"
                      >
                        {org}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-4 border-t border-[#19262F] flex items-center justify-between gap-1.5 mt-4">
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="flex-1 py-2 px-2.5 rounded-xl bg-[#162228] hover:bg-[#1C2C34] text-white text-xs font-bold border border-[#1D2A32] hover:border-slate-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px]"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-300" />
                  <span>Inspect</span>
                </button>

                <button
                  onClick={() => handleDownload(doc)}
                  title="Download Certificate & Manifest"
                  className="p-2 rounded-xl bg-[#162228] hover:bg-[#1C2C34] text-slate-300 hover:text-white border border-[#1D2A32] transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShareModalDoc(doc)}
                  title="Share Encrypted Token with Lender or Off-Taker"
                  className="p-2 rounded-xl bg-[#162228] hover:bg-[#1C2C34] text-emerald-400 hover:text-emerald-300 border border-[#1D2A32] transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteFarmerDocument(doc.id)}
                  title="Delete from Vault"
                  className="p-2 rounded-xl bg-[#162228] hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-[#1D2A32] hover:border-red-800 transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* MODAL 1: Upload Document Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#10171B] border border-[#1D2A32] rounded-3xl w-full max-w-xl p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#19262F]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0B3D2C] text-emerald-400 flex items-center justify-center border border-[#14533C]">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">Vault Legal Document</h3>
                    <p className="text-[11px] text-slate-400">Cryptographically anchor to Deeds Registry</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#162228] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {uploadError && (
                <div className="mt-4 p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <form onSubmit={handleCreateDocument} className="space-y-4 mt-4 text-xs">
                {/* Drag-and-drop file upload area */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      const file = e.dataTransfer.files[0];
                      setSelectedFileName(file.name);
                      setFileSizeStr(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
                      if (!newTitle) setNewTitle(file.name.replace(/\.[^/.]+$/, ""));
                    }
                  }}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
                    isDragging
                      ? "border-emerald-400 bg-[#0B3D2C]/20"
                      : "border-[#1D2A32] bg-[#162228]/50 hover:border-emerald-500/50"
                  }`}
                >
                  <FileText className="w-8 h-8 mx-auto mb-2 text-emerald-400 opacity-80" />
                  <div className="text-white font-bold text-xs mb-1">
                    {selectedFileName ? selectedFileName : "Drag & drop PDF, Scanned Deed, or GeoTIFF"}
                  </div>
                  <div className="text-slate-400 text-[11px] mb-3">
                    {selectedFileName ? `Ready for cryptographic hashing (${fileSizeStr})` : "Supports PDF, JPG, PNG up to 25MB with AES-256 local encryption"}
                  </div>
                  <label className="px-4 py-2 bg-[#162228] hover:bg-[#1C2C34] text-emerald-300 font-bold rounded-xl border border-[#1D2A32] cursor-pointer inline-block">
                    <span>Browse Device Files</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.tiff"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setSelectedFileName(file.name);
                          setFileSizeStr(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
                          if (!newTitle) setNewTitle(file.name.replace(/\.[^/.]+$/, ""));
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Document Category *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as DocumentCategory)}
                      className="w-full px-3 py-2 rounded-xl bg-[#162228] border border-[#1D2A32] text-white font-medium focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Land Title">Land Title / Tenure Deed</option>
                      <option value="Certification">Agricultural Certification (GlobalGAP/Organic)</option>
                      <option value="Contract">Commercial Forward Contract</option>
                      <option value="Soil Report">Soil Laboratory Report</option>
                      <option value="Insurance">Crop Insurance Policy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Document Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Freehold Title Deed - Parcel 04"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#162228] border border-[#1D2A32] text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Issuing Authority *</label>
                    <input
                      type="text"
                      placeholder="e.g. National Deeds Registry / Control Union"
                      value={newAuthority}
                      onChange={(e) => setNewAuthority(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#162228] border border-[#1D2A32] text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Registration / Folio Number</label>
                    <input
                      type="text"
                      placeholder="e.g. T4891/2022-FS"
                      value={newDocNumber}
                      onChange={(e) => setNewDocNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#162228] border border-[#1D2A32] text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Parcel or Contract Allocation Reference</label>
                    <input
                      type="text"
                      placeholder="e.g. Portion B (42.0 Ha) or 200 MT Maize"
                      value={newParcelRef}
                      onChange={(e) => setNewParcelRef(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#162228] border border-[#1D2A32] text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Validity / Expiry Date (Optional)</label>
                    <input
                      type="date"
                      value={newExpiry}
                      onChange={(e) => setNewExpiry(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#162228] border border-[#1D2A32] text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Custody Notes & Verification Attestation</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Validated against cadastral beacon survey. Notarized copy filed."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#162228] border border-[#1D2A32] text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Security Attestation Banner */}
                <div className="p-3 bg-[#07261B] border border-[#14533C] rounded-xl text-emerald-200 flex items-center gap-2.5 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Upon vaulting, a unique SHA-256 fingerprint will be generated and signed with the farmer's verified digital credential.
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#162228] hover:bg-[#1C2C34] text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold border border-[#196349] transition-all cursor-pointer shadow-md flex items-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Vault & Sign Document</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Document Inspection / Preview Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#10171B] border border-[#1D2A32] rounded-3xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#19262F]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#0B3D2C] text-emerald-400 flex items-center justify-center border border-[#14533C]">
                    {getCategoryIcon(selectedDoc.category)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">{selectedDoc.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="font-mono text-emerald-400 font-bold">{selectedDoc.documentNumber}</span>
                      <span>•</span>
                      <span>{selectedDoc.category}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#162228] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Certificate Canvas / Verification Display */}
              <div className="my-5 p-5 rounded-2xl bg-[#07261B]/80 border border-[#14533C] text-white space-y-4">
                <div className="flex items-center justify-between border-b border-[#0F4A34] pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="font-extrabold text-xs tracking-wider uppercase text-emerald-300">
                      Official Cryptographic Legal Attestation
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-400 bg-[#0B3D2C] px-2 py-0.5 rounded border border-[#196349]">
                    STATUS: {selectedDoc.verificationStatus.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Issuing Legal Entity</span>
                    <span className="font-bold text-white text-sm">{selectedDoc.issuingAuthority}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Primary Property / Parcel Allocation</span>
                    <span className="font-bold text-white text-sm">{selectedDoc.parcelOrContractRef || "Registered Land Asset"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Vault Security Tier</span>
                    <span className="font-semibold text-emerald-300">{selectedDoc.securityTier}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Verified Auditor / Notary</span>
                    <span className="font-semibold text-white">{selectedDoc.verifiedBy || "National Registrar of Deeds"}</span>
                  </div>
                </div>

                {selectedDoc.notes && (
                  <div className="pt-3 border-t border-[#0F4A34] text-xs text-emerald-200/90 leading-relaxed">
                    <strong className="text-white block mb-0.5">Verification Notes:</strong>
                    {selectedDoc.notes}
                  </div>
                )}
              </div>

              {/* Cryptographic SHA-256 Ledger Anchor Details */}
              <div className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32] space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300 font-bold">
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    <span>Cryptographic Ledger Fingerprint</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Immutable</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0B1013] font-mono text-[11px] text-slate-300 break-all border border-[#19262F]">
                  {selectedDoc.sha256Hash}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Vaulted on: <strong>{selectedDoc.uploadDate}</strong></span>
                  <span>File type: <strong>{selectedDoc.fileType.toUpperCase()} ({selectedDoc.fileSize})</strong></span>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="mt-5 pt-4 border-t border-[#19262F] flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => {
                    handleDownload(selectedDoc);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold border border-[#196349] transition-all cursor-pointer flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-emerald-300" />
                  <span>Download Verified File & Manifest</span>
                </button>

                <button
                  onClick={() => {
                    setShareModalDoc(selectedDoc);
                    setSelectedDoc(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#162228] hover:bg-[#1C2C34] text-emerald-400 text-xs font-bold border border-[#1D2A32] transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Token with Lender</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Share Document with Institution Modal */}
      <AnimatePresence>
        {shareModalDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#10171B] border border-[#1D2A32] rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#19262F]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0B3D2C] text-emerald-400 flex items-center justify-center border border-[#14533C]">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Share Verified Document</h3>
                    <p className="text-[11px] text-slate-400">{shareModalDoc.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShareModalDoc(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#162228] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {shareSuccessMsg ? (
                <div className="my-6 p-4 rounded-xl bg-[#0B3D2C] border border-emerald-500 text-white text-xs text-center">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
                  <div className="font-bold">{shareSuccessMsg}</div>
                  <p className="text-[11px] text-emerald-200 mt-1">
                    Temporary 30-day verified read token issued.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleShareSubmit} className="space-y-4 mt-4 text-xs">
                  <p className="text-slate-300 text-xs">
                    Issue a secure, read-only token for accredited financing institutions, off-takers, or co-operatives.
                  </p>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Select or Type Institution</label>
                    <input
                      type="text"
                      list="trusted-entities"
                      placeholder="e.g. Land Bank Agri-Credit or Standard Bank"
                      value={shareEntityInput}
                      onChange={(e) => setShareEntityInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#162228] border border-[#1D2A32] text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      required
                    />
                    <datalist id="trusted-entities">
                      <option value="Land Bank of South Africa" />
                      <option value="Standard Bank Agri-Credit" />
                      <option value="Pan-African Milling Corp" />
                      <option value="Department of Agriculture, Land Reform" />
                      <option value="AfCFTA Trade Facilitation Portal" />
                      <option value="Santam Agriculture Underwriters" />
                    </datalist>
                  </div>

                  <div className="p-3 bg-[#162228] border border-[#1D2A32] rounded-xl text-[11px] text-slate-400 space-y-1">
                    <div>🔒 <strong>Permissions:</strong> Read-only certified verification manifest</div>
                    <div>⏱️ <strong>Access Duration:</strong> 30 calendar days (auto-revocable)</div>
                    <div>🛡️ <strong>Encryption:</strong> Recipient public key handshake</div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShareModalDoc(null)}
                      className="px-4 py-2 rounded-xl bg-[#162228] hover:bg-[#1C2C34] text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold border border-[#196349] transition-all cursor-pointer shadow-md"
                    >
                      Authorize Access
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
