import React, { useState } from "react";
import {
  Satellite,
  Layers,
  Thermometer,
  Droplets,
  Activity,
  Bug,
  Compass,
  TrendingUp,
  Info,
  Sliders,
  ChevronRight,
  Radio,
  Download,
  Plane,
  CheckCircle2,
  FileCode2,
  Mountain,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SoilSensorDashboard } from "./SoilSensorDashboard";
import { SmartIrrigationControl } from "./SmartIrrigationControl";

export const PrecisionAgriView: React.FC = () => {
  const { currentFarm, soilSensorNodes, soilAlerts } = useApp();
  const [activePrecisionTab, setActivePrecisionTab] = useState<
    "multispectral" | "soil_sensors" | "unified" | "irrigation"
  >("multispectral");
  const [selectedLayer, setSelectedLayer] = useState<
    "ndvi" | "moisture" | "temperature" | "nitrogen" | "topography" | "pest"
  >("ndvi");

  // VRA Prescription Generator State
  const [isVraModalOpen, setIsVraModalOpen] = useState(false);
  const [dronePlatform, setDronePlatform] = useState("DJI Agras T40 / T50");
  const [inputProduct, setInputProduct] = useState("Calcium Ammonium Nitrate (CAN 28% N)");
  const [targetField, setTargetField] = useState("Field 03 - River Basin");
  const [baseRate, setBaseRate] = useState("85"); // kg/ha or L/ha
  const [swathWidth, setSwathWidth] = useState("7.5"); // meters
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const layers = [
    {
      id: "ndvi",
      name: "NDVI (Vegetation Index)",
      metric: "Mean 0.77",
      status: "Optimal Photosynthesis",
      color: "text-emerald-700 bg-emerald-50 border-emerald-300",
      description: "Normalized Difference Vegetation Index measuring live green vegetation canopy and biomass density.",
      source: "Sentinel-2 (10m Resolution, L2A)",
    },
    {
      id: "moisture",
      name: "Soil Moisture Map",
      metric: "38% Average (Field 03: 28%)",
      status: "Deficit in River Basin",
      color: "text-blue-700 bg-blue-50 border-blue-300",
      description: "Sub-surface volumetric water content measured across 18 telemetry probes.",
      source: "Ground IoT Mesh + SMAP Satellite",
    },
    {
      id: "temperature",
      name: "Canopy Temperature",
      metric: "26.4°C Peak",
      status: "Within Tolerable Range",
      color: "text-amber-700 bg-amber-50 border-amber-300",
      description: "Thermal infrared scanning of foliar canopy to detect plant transpiration stress before visual wilting.",
      source: "Landsat-9 Thermal Infrared Sensor",
    },
    {
      id: "nitrogen",
      name: "Foliar Nitrogen (Chlorophyll)",
      metric: "Field 04 Chlorosis",
      status: "Top-Dress Advisory Active",
      color: "text-purple-700 bg-purple-50 border-purple-300",
      description: "Red-edge spectral reflectance reflecting leaf chlorophyll synthesis and protein formation.",
      source: "Drone Multispectral Orthomosaic",
    },
    {
      id: "topography",
      name: "Topography & Drainage",
      metric: "1,240m - 1,282m Elev.",
      status: "Runoff Vectoring to Basin",
      color: "text-cyan-700 bg-cyan-50 border-cyan-300",
      description: "Digital Elevation Model (DEM) showing contour lines, natural water drainage paths, and potential erosion gullying.",
      source: "Copernicus GLO-30 DEM + LiDAR",
    },
    {
      id: "pest",
      name: "Fall Armyworm & Pest Risk",
      metric: "Low Risk (91% Resistance)",
      status: "Pheromone Traps Clear",
      color: "text-emerald-700 bg-emerald-50 border-emerald-300",
      description: "Predictive thermal degree-day bio-models coupled with field acoustic trap sensors.",
      source: "AgriIntel Entomological Forecasting",
    },
  ];

  // Export GeoJSON function
  const handleDownloadGeoJSON = () => {
    const geojson = {
      type: "FeatureCollection",
      name: `VRA_Prescription_${currentFarm.name.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}`,
      crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
      features: [
        {
          type: "Feature",
          properties: {
            zoneId: "Zone_A_HighRate",
            rateUnit: "kg/ha",
            prescribedRate: Number(baseRate) * 1.25,
            product: inputProduct,
            dronePlatform: dronePlatform,
            swathMeters: Number(swathWidth),
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [26.889, -28.421],
                [26.895, -28.421],
                [26.895, -28.425],
                [26.889, -28.425],
                [26.889, -28.421],
              ],
            ],
          },
        },
        {
          type: "Feature",
          properties: {
            zoneId: "Zone_B_StandardRate",
            rateUnit: "kg/ha",
            prescribedRate: Number(baseRate),
            product: inputProduct,
            dronePlatform: dronePlatform,
            swathMeters: Number(swathWidth),
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [26.895, -28.421],
                [26.901, -28.421],
                [26.901, -28.425],
                [26.895, -28.425],
                [26.895, -28.421],
              ],
            ],
          },
        },
        {
          type: "Feature",
          properties: {
            zoneId: "Zone_C_BufferZeroSpray",
            rateUnit: "kg/ha",
            prescribedRate: 0,
            product: inputProduct,
            dronePlatform: dronePlatform,
            swathMeters: Number(swathWidth),
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [26.889, -28.425],
                [26.901, -28.425],
                [26.901, -28.428],
                [26.889, -28.428],
                [26.889, -28.425],
              ],
            ],
          },
        },
      ],
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/geo+json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `VRA_Prescription_${targetField.replace(/[^a-zA-Z0-9]/g, "_")}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess("GeoJSON exported successfully!");
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // Export ISO-XML function
  const handleDownloadIsoXml = () => {
    const isoxml = `<?xml version="1.0" encoding="UTF-8"?>
<ISO11783_TaskData VersionMajor="4" VersionMinor="2" ManagementSoftwareManufacturer="AgriIntel Africa" ManagementSoftwareVersion="2.4.0">
  <CTR A="CTR1" B="Cape Farm VRA Task" />
  <FRM A="FRM1" B="${currentFarm.name}" />
  <PFD A="PFD1" C="${targetField}" D="${currentFarm.totalHectares * 10000}">
    <TSK A="TSK1" B="Variable Rate Application" C="3" G="1">
      <PNT A="1" B="${Number(baseRate) * 1.25}" C="kg/ha" />
      <PNT A="2" B="${Number(baseRate)}" C="kg/ha" />
      <PNT A="3" B="0" C="kg/ha" />
      <GGP A="${dronePlatform}" B="Swath_${swathWidth}m" />
    </TSK>
  </PFD>
</ISO11783_TaskData>`;

    const blob = new Blob([isoxml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "TASKDATA.XML";
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess("ISO-XML (ISOBUS) exported successfully!");
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Precision Agriculture Mode Selector Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#10171B] p-2.5 rounded-2xl border border-[#1D2A32] shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-[#162228] rounded-xl text-xs w-full sm:w-auto">
          <button
            onClick={() => setActivePrecisionTab("multispectral")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activePrecisionTab === "multispectral"
                ? "bg-[#0B3D2C] text-white border border-[#196349] shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Satellite className="w-4 h-4 text-emerald-400" />
            <span>Multispectral Remote Sensing</span>
          </button>

          <button
            onClick={() => setActivePrecisionTab("soil_sensors")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activePrecisionTab === "soil_sensors"
                ? "bg-[#0B3D2C] text-white border border-[#196349] shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Droplets className="w-4 h-4 text-blue-400" />
            <span>Ground Soil Probes & IoT</span>
            {soilAlerts.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActivePrecisionTab("unified")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activePrecisionTab === "unified"
                ? "bg-[#0B3D2C] text-white border border-[#196349] shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Dual Fusion View</span>
          </button>

          <button
            onClick={() => setActivePrecisionTab("irrigation")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activePrecisionTab === "irrigation"
                ? "bg-[#14532D] text-[#FDFBF7] border border-[#196349] shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
            id="tab-smart-irrigation"
          >
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span>Smart Irrigation Control</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#07261B] text-[#22C55E]">IoT</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 px-2">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px]">
            {soilSensorNodes.length} IoT Probes Active • Sentinel-2 Orbit 10m
          </span>
        </div>
      </div>

      {/* VIEW MODE: Smart Irrigation Control */}
      {activePrecisionTab === "irrigation" && (
        <SmartIrrigationControl />
      )}

      {/* VIEW MODE 1: Soil Sensor Dashboard only */}
      {activePrecisionTab === "soil_sensors" && (
        <SoilSensorDashboard onOpenVraModal={() => setIsVraModalOpen(true)} />
      )}

      {/* VIEW MODE 2: Multispectral Remote Sensing (or Unified) */}
      {(activePrecisionTab === "multispectral" || activePrecisionTab === "unified") && (
        <>
          {/* Top Bar with Multispectral Layer Switcher */}
          <div className="bg-[#10171B] rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 border border-[#1D2A32]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Multispectral Spatial Analytics
                </h2>
                <span className="text-xs font-mono font-bold text-emerald-300 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                  L2A Geoprocessing Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Synthesizing orbital European Space Agency Sentinel-2, drone orthomosaics, and ground IoT sensors.
              </p>
            </div>

            {/* Layer Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#162228] p-1.5 rounded-xl text-xs">
              {layers.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setSelectedLayer(l.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    selectedLayer === l.id
                      ? "bg-[#0B3D2C] text-white shadow-xs border border-[#196349]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {l.name.split(" ")[0]}
                </button>
              ))}

              {(selectedLayer === "moisture" || selectedLayer === "nitrogen") && (
                <button
                  onClick={() => setActivePrecisionTab("soil_sensors")}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-emerald-300 bg-[#07261B] border border-[#14533C] hover:bg-[#0B3D2C] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Droplets className="w-3 h-3 text-blue-400" />
                  <span>Inspect Soil Nodes →</span>
                </button>
              )}
            </div>
          </div>

      {/* Main Multispectral Canvas & Diagnostic Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Map Canvas */}
        <div className="lg:col-span-8 bg-[#10171B] rounded-2xl p-5 text-white shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Active Render: {layers.find((l) => l.id === selectedLayer)?.name}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Source: {layers.find((l) => l.id === selectedLayer)?.source}
            </span>
          </div>

          {/* SVG Heatmap Simulation with Distinct Color Palettes per Layer */}
          <div className="relative w-full h-88 bg-[#0B1013] rounded-xl flex items-center justify-center p-4">
            <svg viewBox="0 0 100 100" className="w-full h-full max-w-md">
              <defs>
                <radialGradient id="moistureGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.3" />
                </radialGradient>
                <radialGradient id="ndviGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="0.4" />
                </radialGradient>
              </defs>

              {/* Dynamic Field Fill based on selected layer */}
              {/* Field 01 */}
              <polygon
                points="15,20 48,15 52,45 20,50"
                fill={
                  selectedLayer === "ndvi"
                    ? "#059669"
                    : selectedLayer === "moisture"
                    ? "#0284C7"
                    : selectedLayer === "temperature"
                    ? "#22C55E"
                    : selectedLayer === "nitrogen"
                    ? "#10B981"
                    : selectedLayer === "topography"
                    ? "#0891B2"
                    : "#059669"
                }
                fillOpacity="0.6"
                stroke="#FFFFFF"
                strokeWidth="0.8"
              />
              <text x="25" y="32" fontSize="3" fill="#FFFFFF" fontWeight="bold">
                {selectedLayer === "topography" ? "Field 01: 1,278m Ridge" : "Field 01: Optimal"}
              </text>

              {/* Field 02 */}
              <polygon
                points="55,18 88,22 84,52 54,48"
                fill={
                  selectedLayer === "ndvi"
                    ? "#D97706"
                    : selectedLayer === "moisture"
                    ? "#38BDF8"
                    : selectedLayer === "temperature"
                    ? "#F59E0B"
                    : selectedLayer === "nitrogen"
                    ? "#10B981"
                    : selectedLayer === "topography"
                    ? "#06B6D4"
                    : "#10B981"
                }
                fillOpacity="0.5"
                stroke="#FFFFFF"
                strokeWidth="0.8"
              />
              <text x="60" y="35" fontSize="3" fill="#FFFFFF" fontWeight="bold">
                {selectedLayer === "topography" ? "Field 02: 1,265m Terrace" : "Field 02: Moderate"}
              </text>

              {/* Field 03 */}
              <polygon
                points="18,54 52,50 50,85 16,82"
                fill={
                  selectedLayer === "moisture"
                    ? "#DC2626"
                    : selectedLayer === "ndvi"
                    ? "#E11D48"
                    : selectedLayer === "topography"
                    ? "#0E7490"
                    : "#EA580C"
                }
                fillOpacity="0.7"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                className={selectedLayer === "moisture" ? "animate-pulse" : ""}
              />
              <text x="22" y="68" fontSize="3.2" fill="#FFFFFF" fontWeight="bold">
                {selectedLayer === "topography" ? "Field 03: 1,240m Natural Sink" : "Field 03: Water Deficit"}
              </text>

              {/* Field 04 */}
              <polygon
                points="55,52 86,55 82,88 52,84"
                fill={
                  selectedLayer === "nitrogen"
                    ? "#A855F7"
                    : selectedLayer === "ndvi"
                    ? "#10B981"
                    : selectedLayer === "topography"
                    ? "#155E75"
                    : "#0284C7"
                }
                fillOpacity="0.6"
                stroke="#FFFFFF"
                strokeWidth="0.8"
              />
              <text x="58" y="70" fontSize="3" fill="#FFFFFF" fontWeight="bold">
                {selectedLayer === "topography" ? "Field 04: 1,250m Slope" : "Field 04: N-Deficiency"}
              </text>

              {/* Topography Contours & Drainage Overlays */}
              {selectedLayer === "topography" && (
                <g opacity="0.85">
                  <path d="M 10 25 Q 50 15 90 28" fill="none" stroke="#67E8F9" strokeWidth="0.6" strokeDasharray="1,1" />
                  <path d="M 12 45 Q 50 40 88 48" fill="none" stroke="#67E8F9" strokeWidth="0.6" strokeDasharray="1,1" />
                  <path d="M 15 65 Q 50 60 85 70" fill="none" stroke="#67E8F9" strokeWidth="0.6" strokeDasharray="1,1" />
                  <path d="M 18 85 Q 50 82 82 88" fill="none" stroke="#67E8F9" strokeWidth="0.8" />
                  {/* Water Drainage Flow Arrow */}
                  <line x1="50" y1="20" x2="35" y2="70" stroke="#38BDF8" strokeWidth="1.2" markerEnd="url(#arrow)" />
                  <text x="44" y="46" fontSize="2.8" fill="#38BDF8" fontWeight="bold">➔ Drainage Runoff (2.4 m/s)</text>
                </g>
              )}
            </svg>

            {/* Live Sensor Inset Overlays */}
            <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1">
              <div className="text-slate-400 font-bold uppercase text-[9px]">IoT Ground Telemetry</div>
              <div>Probe 01: 48% (Optimal)</div>
              <div>Probe 02: 38% (Moderate)</div>
              <div className="text-red-400 font-bold">Probe 03: 28% (Deficit)</div>
              <div>Probe 04: 42% (Normal)</div>
            </div>

            {/* Gradient Legend */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md p-2 rounded-lg border border-slate-800 text-[10px] flex items-center gap-2">
              <span className="text-slate-400">Low</span>
              <div className="w-24 h-2 rounded bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500" />
              <span className="text-slate-400">High Index</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 mt-2">
            <span>Spatial Resolution: 10m Multispectral (B2, B3, B4, B8, B8A)</span>
            <span className="text-emerald-400 font-bold">Next Satellite Pass: Tomorrow 09:42 UTC</span>
          </div>
        </div>

        {/* Layer Insights & Agronomic Prescription */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#10171B] rounded-2xl p-5 shadow-xs">
            <h3 className="font-bold text-sm text-white mb-2">Layer Agronomic Prescription</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {layers.find((l) => l.id === selectedLayer)?.description}
            </p>

            <div className="mt-4 p-3.5 rounded-xl bg-[#162228] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Metric Reading:</span>
                <span className="font-mono font-bold text-white">
                  {layers.find((l) => l.id === selectedLayer)?.metric}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Status Assessment:</span>
                <span className="font-bold text-emerald-400">
                  {layers.find((l) => l.id === selectedLayer)?.status}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Precision Variable-Rate Application
              </div>
              <p className="text-xs text-slate-400">
                Export ISO-XML prescription maps directly to tractor ISOBUS terminals or autonomous spray drones.
              </p>
              <button
                onClick={() => setIsVraModalOpen(true)}
                className="w-full mt-3 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Plane className="w-3.5 h-3.5 text-emerald-400" />
                <span>Generate VRA Drone Flight Plan →</span>
              </button>
            </div>
          </div>

          <div className="bg-[#07261B] rounded-2xl p-4 text-xs text-emerald-200 space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Multi-Year Historical Comparison</span>
            </div>
            <p className="text-emerald-300 leading-relaxed">
              Compared to the same vegetative stage in 2025, Cape Farm shows an <strong className="font-bold text-emerald-200">+11.4% improvement in chlorophyll retention</strong> following organic cover cropping.
            </p>
          </div>
        </div>
      </div>

      {/* Ground Subterranean Probes Cross-Reference Bar (Multispectral Mode) */}
      {activePrecisionTab === "multispectral" && (
        <div className="bg-[#10171B] rounded-2xl p-4 sm:p-5 border border-[#1D2A32] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#07261B] border border-[#14533C] text-blue-400 flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm text-white">
                  Ground Soil Moisture & Nutrient Telemetry Corroboration
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#07261B] text-emerald-300 border border-[#14533C]">
                  {soilSensorNodes.length} In-Situ Probes
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Volumetric water content down to 100cm, ion-selective N-P-K probes, soil pH, and automated pulse valve controls.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActivePrecisionTab("soil_sensors")}
            className="px-4 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold border border-[#196349] transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 min-h-[40px]"
          >
            <span>Open Subterranean Telemetry</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
          </button>
        </div>
      )}

      {/* In Unified Dual Mode, also render the complete Soil Sensor Dashboard below */}
      {activePrecisionTab === "unified" && (
        <div className="pt-2 border-t border-[#19262F]">
          <SoilSensorDashboard onOpenVraModal={() => setIsVraModalOpen(true)} />
        </div>
      )}
    </>
  )}

      {/* VRA Drone Flight Plan & Prescription Generator Modal */}
      {isVraModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#10171B] rounded-3xl max-w-2xl w-full text-white shadow-2xl overflow-hidden my-auto">
            <div className="px-6 py-4 bg-[#0B1013] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B3D2C] text-white flex items-center justify-center">
                  <Plane className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Variable Rate Application (VRA) Prescription Generator
                  </h3>
                  <p className="text-xs text-slate-400">
                    Export calibrated mission flight plans to agricultural UAVs & ISOBUS tractor controllers
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsVraModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#162228] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {downloadSuccess && (
                <div className="p-3 bg-[#07261B] rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{downloadSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Target Field / Parcel</label>
                  <select
                    value={targetField}
                    onChange={(e) => setTargetField(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl font-semibold text-white bg-[#162228]"
                  >
                    <option value="Field 03 - River Basin">Field 03 - River Basin (28% Moisture / Water Deficit)</option>
                    <option value="Field 04 - East Pivot">Field 04 - East Pivot (Chlorosis / N-Deficit)</option>
                    <option value="Field 01 - North Plateau">Field 01 - North Plateau (Full Canopy)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Drone / Machinery Platform</label>
                  <select
                    value={dronePlatform}
                    onChange={(e) => setDronePlatform(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl font-semibold text-white bg-[#162228]"
                  >
                    <option value="DJI Agras T40 / T50">DJI Agras T40 / T50 (Centimeter RTK)</option>
                    <option value="XAG P100 Pro Agricultural Drone">XAG P100 Pro Agricultural Drone</option>
                    <option value="John Deere Gen 4 4600 ISOBUS">John Deere Gen 4 4600 ISOBUS</option>
                    <option value="Case IH AFS Pro 700">Case IH AFS Pro 700</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Prescribed Ag-Chemical / Input</label>
                  <input
                    type="text"
                    value={inputProduct}
                    onChange={(e) => setInputProduct(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl font-semibold text-white bg-[#162228]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Base Target Rate</label>
                  <input
                    type="number"
                    value={baseRate}
                    onChange={(e) => setBaseRate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl font-mono font-bold text-white bg-[#162228]"
                  />
                </div>
              </div>

              {/* Spatial Prescription Rate Matrix Preview */}
              <div className="p-4 bg-[#0B1013] rounded-2xl text-white space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Prescription Zones Matrix:</span>
                  <span className="text-emerald-400 font-bold">3 Delineated Treatment Polygons</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-red-950/80 text-red-200">
                    <div className="text-[10px] text-red-400 font-bold uppercase">Zone A (Stressed)</div>
                    <div className="text-base font-bold font-mono">{(Number(baseRate) * 1.25).toFixed(0)} kg/ha</div>
                    <div className="text-[10px] text-red-300 mt-0.5">+25% Boost Applied</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#07261B] text-emerald-200">
                    <div className="text-[10px] text-emerald-400 font-bold uppercase">Zone B (Normal)</div>
                    <div className="text-base font-bold font-mono">{baseRate} kg/ha</div>
                    <div className="text-[10px] text-emerald-300 mt-0.5">Standard Maintenance</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#162228] text-slate-300">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Zone C (Riparian Buffer)</div>
                    <div className="text-base font-bold font-mono text-slate-400">0 kg/ha</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Zero-Spray River Buffer</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: GeoJSON & ISO-XML */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadGeoJSON}
                  className="w-full sm:w-1/2 py-3 bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download GeoJSON Layer</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadIsoXml}
                  className="w-full sm:w-1/2 py-3 bg-[#162228] hover:bg-[#1C2C34] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileCode2 className="w-4 h-4 text-emerald-400" />
                  <span>Download ISO-XML (ISOBUS)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
