import React, { useState } from "react";
import { AlertCircle, Camera, CheckCircle2, Upload } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { postJson } from "../../utils/apiClient";

type Diagnostic = { diseaseName: string; pathogenType: string; confidence: number; severity: string; symptoms: string[]; recommendedActions: string[]; organicAlternatives: string[]; preventativeMeasures: string[]; professionalDisclaimer?: string };

/** Launch-safe diagnostic workflow: it only analyzes images supplied by the authenticated user. */
export const CropDoctorView: React.FC = () => {
  const { currentFarm } = useApp();
  const [image, setImage] = useState<string | null>(null);
  const [cropType, setCropType] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<Diagnostic | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setImage(String(reader.result)); setResult(null); setError(""); };
    reader.readAsDataURL(file);
  };
  const analyze = async () => {
    if (!image || !cropType.trim()) { setError("Upload a crop image and enter the crop type before requesting an analysis."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await postJson<{ result?: Diagnostic }>("/api/gemini/crop-doctor", { imageBase64: image, cropType, symptomsDescription: notes });
      if (!data.result) throw new Error("No diagnostic was returned.");
      setResult(data.result);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "The diagnostic service is unavailable. No result has been generated."); }
    finally { setLoading(false); }
  };
  return <section className="mx-auto w-full max-w-5xl space-y-6">
    <header><p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Crop doctor</p><h1 className="mt-2 text-3xl font-bold text-white">Analyze your crop image</h1><p className="mt-2 text-slate-400">Start with a field image from your operation. CULTx does not prepopulate diagnostic examples.</p></header>
    <div className="grid gap-6 lg:grid-cols-2"><div className="rounded-2xl border border-[#1D2A32] bg-[#10171B] p-6 space-y-4">
      <label className="block rounded-xl border border-dashed border-slate-600 p-8 text-center cursor-pointer hover:border-emerald-500"><Upload className="mx-auto h-8 w-8 text-emerald-400" /><span className="mt-3 block font-semibold">Upload crop image</span><span className="mt-1 block text-sm text-slate-400">JPG, PNG, or TIFF from your field</span><input className="sr-only" type="file" accept="image/jpeg,image/png,image/tiff" onChange={upload} /></label>
      {image && <img src={image} alt="Uploaded crop for analysis" className="max-h-72 w-full rounded-xl object-contain bg-black" />}
      <label className="block text-sm font-medium">Crop type<input value={cropType} onChange={(event) => setCropType(event.target.value)} placeholder="e.g. Maize" className="mt-2 w-full rounded-lg border border-slate-700 bg-[#090D0F] px-3 py-2.5" /></label>
      <label className="block text-sm font-medium">Observed symptoms (optional)<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Describe what you observed" className="mt-2 min-h-24 w-full rounded-lg border border-slate-700 bg-[#090D0F] px-3 py-2.5" /></label>
      <button onClick={analyze} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-bold disabled:opacity-60"><Camera className="h-4 w-4" />{loading ? "Analyzing uploaded image…" : "Request diagnostic"}</button>
      {currentFarm.name && <p className="text-xs text-slate-500">Analysis is associated with {currentFarm.name}.</p>}
    </div><div className="rounded-2xl border border-[#1D2A32] bg-[#10171B] p-6">{error && <p role="alert" className="flex gap-2 text-amber-300"><AlertCircle className="h-5 w-5 shrink-0" />{error}</p>}{!result && !error && <p className="text-slate-400">Your verified diagnostic will appear here after the service processes an uploaded image.</p>}{result && <div className="space-y-5"><div className="flex gap-3"><CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-400" /><div><h2 className="text-xl font-bold">{result.diseaseName}</h2><p className="text-sm text-slate-400">{result.pathogenType} · {result.severity} · {result.confidence}% confidence</p></div></div>{[["Symptoms", result.symptoms], ["Recommended actions", result.recommendedActions], ["Organic alternatives", result.organicAlternatives], ["Prevention", result.preventativeMeasures]].map(([title, items]) => <div key={String(title)}><h3 className="font-semibold text-emerald-300">{title}</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">{(items as string[]).map((item) => <li key={item}>{item}</li>)}</ul></div>)}<p className="border-t border-slate-700 pt-4 text-xs text-slate-500">{result.professionalDisclaimer}</p></div>}</div></div>
  </section>;
};
