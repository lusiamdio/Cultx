import React, { useState, useEffect } from "react";
import {
  Train,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Thermometer,
  Activity,
  Anchor,
  Truck,
  Building,
  FileText,
  QrCode,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Radio,
  ExternalLink,
  Layers,
} from "lucide-react";

interface CorridorStage {
  id: string;
  name: string;
  location: string;
  country: string;
  distanceKm: number;
  lat: number;
  lng: number;
  altitudeMeters: number;
  type: "farm" | "railhead" | "border" | "highland" | "port";
  status: "completed" | "active" | "pending";
  estimatedTime: string;
  actualTime?: string;
  description: string;
  sensorReadings: {
    tempC: number;
    moisturePct: number;
    vibrationG: number;
    sealStatus: "SECURE" | "VERIFIED" | "INSPECTED";
  };
  customsCheckpoint?: {
    postName: string;
    clearanceDurationMin: number;
    system: string;
    status: string;
  };
}

const LOBITO_SUPPLY_CHAIN_STAGES: CorridorStage[] = [
  {
    id: "stage-1",
    name: "Farm Aggregation & Silo Consolidation",
    location: "Kolwezi / Copperbelt Agro-Cooperative Silos",
    country: "DR Congo / Zambia Border Basin",
    distanceKm: 0,
    lat: -10.7167,
    lng: 25.4667,
    altitudeMeters: 1460,
    type: "farm",
    status: "completed",
    estimatedTime: "Day 1, 06:00 UTC",
    actualTime: "Day 1, 06:14 UTC (Departed)",
    description: "540 MT Non-GMO Soybeans & Grade 1 White Maize aggregated from 84 smallholder farms. Tested for moisture (12.1%) and aflatoxin (<1.8 ppb). Sealed with digital phytosanitary cert.",
    sensorReadings: {
      tempC: 21.2,
      moisturePct: 12.1,
      vibrationG: 0.02,
      sealStatus: "VERIFIED",
    },
    customsCheckpoint: {
      postName: "SADC Phyto Origin Station",
      clearanceDurationMin: 22,
      system: "e-Phyto / SADC Single Window",
      status: "Electronic Seal Hash Anchored",
    },
  },
  {
    id: "stage-2",
    name: "Ndola Intermodal Railhead Transshipment",
    location: "Ndola Central Freight Yard",
    country: "Zambia",
    distanceKm: 210,
    lat: -12.9667,
    lng: 28.6333,
    altitudeMeters: 1300,
    type: "railhead",
    status: "completed",
    estimatedTime: "Day 1, 13:30 UTC",
    actualTime: "Day 1, 13:45 UTC (Marshalled)",
    description: "Consignment transferred into 18 sealed 30-tonne bulk rail hoppers. LAR unit train assembled with dual GE C30-ACi diesel-electric heavy haul locomotives. Gross tonnage: 1,140 MT.",
    sensorReadings: {
      tempC: 22.8,
      moisturePct: 12.0,
      vibrationG: 0.05,
      sealStatus: "SECURE",
    },
  },
  {
    id: "stage-3",
    name: "Luau One-Stop Border Post (OSBP)",
    location: "Luau Smart Customs Portal",
    country: "DRC / Angola International Border",
    distanceKm: 590,
    lat: -10.7073,
    lng: 22.2350,
    altitudeMeters: 1100,
    type: "border",
    status: "completed",
    estimatedTime: "Day 2, 02:00 UTC",
    actualTime: "Day 2, 02:44 UTC (Cleared)",
    description: "AfCFTA Green Channel automated transit clearance. High-speed OCR car scanner and RFID container verification. 0% preferential tariff verified under PAPSS local currency escrow.",
    sensorReadings: {
      tempC: 20.5,
      moisturePct: 11.9,
      vibrationG: 0.04,
      sealStatus: "INSPECTED",
    },
    customsCheckpoint: {
      postName: "Luau Bi-National OSBP Smart Gate",
      clearanceDurationMin: 44,
      system: "AfCFTA ASYCUDA / PAPSS",
      status: "Paperless Green Clearance Approved",
    },
  },
  {
    id: "stage-4",
    name: "Benguela Highland Transit & Descent",
    location: "Huambo Intermodal Dry Port & Siding",
    country: "Angola",
    distanceKm: 980,
    lat: -12.7761,
    lng: 15.7389,
    altitudeMeters: 1700,
    type: "highland",
    status: "active",
    estimatedTime: "Day 2, 14:15 UTC",
    description: "Train actively traversing the central Angolan agricultural breadbasket. Continuous-welded rail allowing 65 km/h sustained velocity. IoT telemetry streaming real-time hopper core temperature.",
    sensorReadings: {
      tempC: 19.4,
      moisturePct: 12.0,
      vibrationG: 0.08,
      sealStatus: "SECURE",
    },
  },
  {
    id: "stage-5",
    name: "Atlantic Deep-Water Export Terminal",
    location: "Port of Lobito Pier 3 (Grain Terminal)",
    country: "Angola (Atlantic Ocean)",
    distanceKm: 1344,
    lat: -12.3500,
    lng: 13.5500,
    altitudeMeters: 5,
    type: "port",
    status: "pending",
    estimatedTime: "Day 2, 21:30 UTC",
    description: "Destination: Lobito Atlantic Agro-Silos (85,000 MT capacity). Direct conveyer loading into Panamax Bulk Carrier M/V Atlantic Pioneer for direct deep-sea shipment to European & Americas markets.",
    sensorReadings: {
      tempC: 24.1,
      moisturePct: 11.8,
      vibrationG: 0.01,
      sealStatus: "SECURE",
    },
    customsCheckpoint: {
      postName: "Lobito Port Maritime Customs & Phytosanitary Berth",
      clearanceDurationMin: 35,
      system: "PortNet Electronic Bill of Lading",
      status: "Berth Reserved & Shiploader Armed",
    },
  },
];

export const RealTimeTransportTracker: React.FC = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(3); // currently at Huambo (stage 4)
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [simulatedKmProgress, setSimulatedKmProgress] = useState<number>(1045); // between Huambo and Lobito
  const [trainSpeedKmH, setTrainSpeedKmH] = useState<number>(64);
  const [telemetryTick, setTelemetryTick] = useState<number>(0);
  const [showWaybillModal, setShowWaybillModal] = useState<boolean>(false);

  const totalDistance = 1344;
  const currentStage = LOBITO_SUPPLY_CHAIN_STAGES[currentStageIndex];
  const progressPct = Math.min(100, Math.round((simulatedKmProgress / totalDistance) * 100));

  // Dynamic live coordinates computed based on simulated Km progress
  const currentLat = Number((-10.7167 + ((simulatedKmProgress / totalDistance) * (-12.35 - -10.7167))).toFixed(4));
  const currentLng = Number((25.4667 + ((simulatedKmProgress / totalDistance) * (13.55 - 25.4667))).toFixed(4));
  const remainingKm = Math.max(0, totalDistance - simulatedKmProgress);
  const estimatedHoursRemaining = (remainingKm / (trainSpeedKmH || 60)).toFixed(1);

  // Carbon and savings metric computations
  const roadTrucksReplaced = Math.ceil(540 / 22); // 25 heavy trucks
  const co2SavedTonnes = ((simulatedKmProgress / totalDistance) * 48.6).toFixed(1);

  // Real-time animation ticker for realism
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTelemetryTick((prev) => prev + 1);

      // Micro-fluctuate train speed around 62-68 km/h
      setTrainSpeedKmH((prev) => {
        const delta = (Math.random() - 0.48) * 3;
        const newSpeed = Math.min(72, Math.max(54, prev + delta));
        return Math.round(newSpeed);
      });

      // Increment distance
      setSimulatedKmProgress((prev) => {
        const increment = 2.5 * playbackSpeed;
        const nextDist = prev + increment;
        if (nextDist >= totalDistance) {
          setCurrentStageIndex(4);
          return totalDistance;
        }
        // Check stage progression
        if (nextDist < 210) setCurrentStageIndex(0);
        else if (nextDist < 590) setCurrentStageIndex(1);
        else if (nextDist < 980) setCurrentStageIndex(2);
        else if (nextDist < 1300) setCurrentStageIndex(3);
        else setCurrentStageIndex(4);

        return Math.round(nextDist);
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const handleReset = () => {
    setSimulatedKmProgress(70);
    setCurrentStageIndex(0);
    setTrainSpeedKmH(58);
  };

  const handleStageSelect = (idx: number) => {
    setCurrentStageIndex(idx);
    const stage = LOBITO_SUPPLY_CHAIN_STAGES[idx];
    setSimulatedKmProgress(stage.distanceKm);
  };

  return (
    <div className="bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-cyan-900/40 shadow-xl space-y-6 relative overflow-hidden">
      {/* Background ambient rail glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title, Status Pill, and Live Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1D2A32] relative z-10">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400 shadow-sm">
              <Train className="w-4 h-4 animate-pulse" />
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
              Real-Time Transport & Supply Chain Flow Tracker
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800 text-[11px] font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              LOBITO ATLANTIC RAIL (LAR-8842)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracking 540 MT agricultural consignment from interior farm gate aggregation directly to the Port of Lobito Atlantic deep-water berth.
          </p>
        </div>

        {/* Live Simulation Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Speed selector */}
          <div className="flex bg-[#162228] p-1 rounded-xl text-xs font-mono font-bold border border-[#1D2A32]">
            {[1, 5, 10].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  playbackSpeed === spd
                    ? "bg-cyan-900 text-cyan-200 shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Play / Pause Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md ${
              isPlaying
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30"
                : "bg-cyan-600 text-white hover:bg-cyan-500"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Live Stream</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Tracking</span>
              </>
            )}
          </button>

          {/* Reset button */}
          <button
            onClick={handleReset}
            title="Reset to Farm Origin"
            className="p-2 rounded-xl bg-[#162228] hover:bg-[#1F2E37] text-slate-300 border border-[#1D2A32] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Digital Waybill Trigger */}
          <button
            onClick={() => setShowWaybillModal(true)}
            className="px-3 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-emerald-300 border border-[#14533C] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Digital Waybill</span>
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Telematics HUD Grid (Speed, GPS, Seal, Remaining, CO2) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Locomotive Speed</span>
            <Compass className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="text-lg font-mono font-extrabold text-cyan-400 flex items-baseline gap-1">
            <span>{trainSpeedKmH}</span>
            <span className="text-xs text-slate-400 font-normal">km/h</span>
          </div>
          <div className="text-[10px] text-slate-300">Continuous Welded Rail</div>
        </div>

        <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Live Coordinates</span>
            <MapPin className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-[12px] font-mono font-bold text-white tracking-tight">
            {currentLat}°, {currentLng}°
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1">
            <Radio className="w-2.5 h-2.5 animate-pulse" /> Starlink IoT Active
          </div>
        </div>

        <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Remaining Distance</span>
            <Clock className="w-3 h-3 text-amber-400" />
          </div>
          <div className="text-lg font-mono font-extrabold text-white">
            {remainingKm} <span className="text-xs text-slate-400 font-normal">km</span>
          </div>
          <div className="text-[10px] text-amber-400 font-semibold">
            ETA: ~{estimatedHoursRemaining} hrs to Berth
          </div>
        </div>

        <div className="p-3 bg-[#07261B] rounded-xl border border-[#14533C] space-y-1">
          <div className="flex items-center justify-between text-emerald-300">
            <span className="text-[10px] font-bold uppercase tracking-wider">Smart Tamper Seal</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-sm font-mono font-extrabold text-emerald-300">
            SECURE • UNBROKEN
          </div>
          <div className="text-[10px] text-slate-300 font-mono">
            RFID Hash: 0x8fa9c2
          </div>
        </div>

        <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Cargo Core Temp</span>
            <Thermometer className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="text-lg font-mono font-extrabold text-white">
            {currentStage.sensorReadings.tempC}°C
          </div>
          <div className="text-[10px] text-emerald-300">
            Moisture: {currentStage.sensorReadings.moisturePct}% (Grade 1)
          </div>
        </div>

        <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">CO₂ Abatement</span>
            <Zap className="w-3 h-3 text-blue-400" />
          </div>
          <div className="text-lg font-mono font-extrabold text-blue-400">
            -{co2SavedTonnes} MT
          </div>
          <div className="text-[10px] text-slate-300">
            Replaced {roadTrucksReplaced} heavy trucks
          </div>
        </div>
      </div>

      {/* Dynamic Visual Corridor Progress Bar & Elevation Profile */}
      <div className="bg-[#0B1013] p-4 rounded-xl border border-[#1D2A32] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Consignment Journey Progress:</span>
            <span className="font-mono text-cyan-400 font-extrabold">{progressPct}%</span>
            <span className="text-slate-400 text-[11px]">
              ({simulatedKmProgress} km / {totalDistance} km)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Completed
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" /> Current Convoy
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-600" /> Terminal Berth
            </span>
          </div>
        </div>

        {/* Multi-segmented animated progress bar */}
        <div className="relative w-full h-3 bg-[#162228] rounded-full overflow-hidden border border-[#1D2A32]">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500 transition-all duration-500 rounded-full relative"
            style={{ width: `${progressPct}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-white animate-pulse" />
          </div>
        </div>

        {/* 5 Stage Waypoint Stepper along the Bar */}
        <div className="grid grid-cols-5 gap-1 pt-1 text-[11px]">
          {LOBITO_SUPPLY_CHAIN_STAGES.map((stg, i) => {
            const isPassed = simulatedKmProgress >= stg.distanceKm;
            const isCurrent = currentStageIndex === i;

            return (
              <div
                key={stg.id}
                onClick={() => handleStageSelect(i)}
                className={`p-2 rounded-lg transition-all cursor-pointer border text-center ${
                  isCurrent
                    ? "bg-cyan-950/80 border-cyan-500 text-white shadow-xs"
                    : isPassed
                    ? "bg-[#162228]/80 border-emerald-900/50 text-slate-200"
                    : "bg-[#10171B]/50 border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  {stg.type === "farm" && <Building className="w-3 h-3 text-amber-400" />}
                  {stg.type === "railhead" && <Train className="w-3 h-3 text-cyan-400" />}
                  {stg.type === "border" && <ShieldCheck className="w-3 h-3 text-purple-400" />}
                  {stg.type === "highland" && <Activity className="w-3 h-3 text-blue-400" />}
                  {stg.type === "port" && <Anchor className="w-3 h-3 text-emerald-400" />}
                  <span className="font-mono text-[10px] font-bold">{stg.distanceKm} km</span>
                </div>
                <div className="font-bold truncate text-[11px]">{stg.name.split(" ")[0]}</div>
                <div className="text-[9px] text-slate-400 truncate">{stg.country.split("/")[0]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Stage Deep-Dive Card + Elevation / Sensor Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Active Stage Detailed Status Card */}
        <div className="lg:col-span-7 p-4 sm:p-5 bg-[#141E24] rounded-xl border border-cyan-900/50 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1D2A32] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                Active Waypoint #{currentStageIndex + 1} of {LOBITO_SUPPLY_CHAIN_STAGES.length}
              </span>
              <h4 className="text-base font-extrabold text-white mt-1.5 flex items-center gap-2">
                <span>{currentStage.name}</span>
                {currentStage.type === "port" && <Anchor className="w-4 h-4 text-emerald-400" />}
              </h4>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{currentStage.location} ({currentStage.country})</span>
              </p>
            </div>

            <div className="text-right">
              <span className="font-mono text-xs font-bold text-slate-400 block">Elevation</span>
              <span className="font-mono text-sm font-extrabold text-cyan-300">
                {currentStage.altitudeMeters}m AMSL
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed bg-[#0B1013] p-3.5 rounded-xl border border-[#1D2A32]">
            {currentStage.description}
          </p>

          {/* If there's a customs checkpoint at this stage */}
          {currentStage.customsCheckpoint && (
            <div className="p-3 bg-[#07261B] rounded-xl border border-[#14533C] text-xs space-y-1.5">
              <div className="flex items-center justify-between text-emerald-300">
                <span className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {currentStage.customsCheckpoint.postName}
                </span>
                <span className="font-mono text-[10px] bg-[#0B3D2C] px-2 py-0.5 rounded text-white border border-[#196349]">
                  {currentStage.customsCheckpoint.clearanceDurationMin} min clearance
                </span>
              </div>
              <div className="text-slate-300 text-[11px]">
                Protocol: <strong>{currentStage.customsCheckpoint.system}</strong> • {currentStage.customsCheckpoint.status}
              </div>
            </div>
          )}

          {/* Sensor telematics for current point */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
            <div className="p-2.5 bg-[#162228] rounded-xl border border-[#1D2A32] text-center">
              <span className="text-[10px] text-slate-400 block">Hopper Moisture</span>
              <span className="font-mono font-extrabold text-white text-sm">
                {currentStage.sensorReadings.moisturePct}%
              </span>
              <span className="text-[9px] text-emerald-400 block">Dry Grain Target</span>
            </div>

            <div className="p-2.5 bg-[#162228] rounded-xl border border-[#1D2A32] text-center">
              <span className="text-[10px] text-slate-400 block">Vibration Force</span>
              <span className="font-mono font-extrabold text-white text-sm">
                {currentStage.sensorReadings.vibrationG} G
              </span>
              <span className="text-[9px] text-cyan-400 block">Smooth Glide</span>
            </div>

            <div className="p-2.5 bg-[#162228] rounded-xl border border-[#1D2A32] text-center">
              <span className="text-[10px] text-slate-400 block">Digital Seal</span>
              <span className="font-mono font-extrabold text-emerald-400 text-sm">
                {currentStage.sensorReadings.sealStatus}
              </span>
              <span className="text-[9px] text-slate-400 block">Zero Tamper</span>
            </div>
          </div>
        </div>

        {/* Elevation Descent Profile & Consignment Details */}
        <div className="lg:col-span-5 bg-[#141E24] p-4 sm:p-5 rounded-xl border border-cyan-900/50 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1D2A32]">
              <span className="font-bold text-xs text-white flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Corridor Elevation Profile (Interior Plateau ➔ Atlantic)
              </span>
              <span className="text-[10px] font-mono text-slate-400">1,700m ➔ 0m</span>
            </div>

            {/* SVG Elevation Cross-Section */}
            <div className="w-full h-32 bg-[#0B1013] rounded-xl p-2 relative overflow-hidden border border-[#1D2A32]">
              <svg viewBox="0 0 400 120" className="w-full h-full">
                <defs>
                  <linearGradient id="elevationGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Elevation Area Graph */}
                <path
                  d="M 10 30 Q 80 40 140 55 T 240 15 Q 320 60 390 110 L 390 115 L 10 115 Z"
                  fill="url(#elevationGrad)"
                />
                <path
                  d="M 10 30 Q 80 40 140 55 T 240 15 Q 320 60 390 110"
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="2"
                />

                {/* Markers for key waypoints */}
                <circle cx="10" cy="30" r="3" fill="#F59E0B" />
                <text x="15" y="32" fontSize="8" fill="#94A3B8">Kolwezi (1460m)</text>

                <circle cx="240" cy="15" r="3" fill="#A855F7" />
                <text x="210" y="28" fontSize="8" fill="#94A3B8">Huambo (1700m)</text>

                <circle cx="390" cy="110" r="4" fill="#10B981" />
                <text x="320" y="105" fontSize="8" fill="#10B981" fontWeight="bold">Lobito Port (0m)</text>

                {/* Live position pin */}
                {(() => {
                  const pinX = Math.max(15, Math.min(385, 10 + (simulatedKmProgress / totalDistance) * 380));
                  return (
                    <g transform={`translate(${pinX}, 50)`}>
                      <circle cx="0" cy="0" r="5" fill="#38BDF8" className="animate-ping" />
                      <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
                      <line x1="0" y1="0" x2="0" y2="60" stroke="#38BDF8" strokeDasharray="2 2" strokeWidth="1" />
                    </g>
                  );
                })()}
              </svg>
            </div>
          </div>

          {/* Consignment Identity Overview */}
          <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32] space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span>Consignment ID:</span>
              <span className="font-mono font-bold text-white">LAR-AF-2026-0924</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Cargo & Tonnage:</span>
              <span className="font-bold text-emerald-300">540 MT Non-GMO Soybeans</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Maritime Destination:</span>
              <span className="font-bold text-cyan-300">Rotterdam / Lisbon (Panamax)</span>
            </div>
          </div>

          <button
            onClick={() => setShowWaybillModal(true)}
            className="w-full py-2.5 rounded-xl bg-cyan-900/60 hover:bg-cyan-800/80 text-cyan-200 border border-cyan-700/60 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[40px]"
          >
            <span>Inspect Electronic Consignment Waybill & Phyto Seals</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Modal: Full Electronic Consignment Waybill & Blockchain Hash */}
      {showWaybillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#10171B] rounded-2xl max-w-xl w-full border border-cyan-900/80 p-6 space-y-4 shadow-2xl text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1D2A32] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="font-extrabold text-base text-white">
                    Multimodal Consignment Electronic Waybill
                  </h4>
                  <span className="font-mono text-[10px] text-cyan-400">
                    Lobito Atlantic Railway • AfCFTA Green Transit Pass
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowWaybillModal(false)}
                className="p-1.5 rounded-lg bg-[#162228] text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-[#0B1013] rounded-xl border border-[#1D2A32] space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Waybill Number:</span>
                <span className="text-white font-bold">CFB-LAR-2026-8842-AF</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Shipper / Cooperative:</span>
                <span className="text-white">Copperbelt & Katanga Agro-Federation</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Consignee:</span>
                <span className="text-white">AgroVenture Global B.V., Rotterdam</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Carrier / Rail Operator:</span>
                <span className="text-cyan-400 font-bold">Lobito Atlantic Railway (LAR Concession)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rolling Stock:</span>
                <span className="text-white">18 x 30-Tonne Sealed Hopper Cars</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gross / Net Weight:</span>
                <span className="text-white">1,140 MT Gross / 540 MT Net Cargo</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Customs & Phyto Status</span>
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved AfCFTA 0%
                </div>
                <div className="text-[10px] text-slate-400">Luau OSBP clearance stamp verified</div>
              </div>

              <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Payment Settlement</span>
                <div className="text-cyan-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> PAPSS Escrow Active
                </div>
                <div className="text-[10px] text-slate-400">Direct Kwacha-Kwanza-Euro clearing</div>
              </div>
            </div>

            <div className="p-3 bg-[#07261B] rounded-xl border border-[#14533C] flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <QrCode className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block text-xs">Immutable Ledger Verification</span>
                  <span className="font-mono text-[10px] text-emerald-300">
                    Hash: 0x9f4a8b12...c7702e81 (Polygon AgroChain)
                  </span>
                </div>
              </div>
              <span className="px-2 py-1 bg-[#0B3D2C] text-emerald-300 font-mono text-[10px] rounded border border-[#196349]">
                VERIFIED
              </span>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowWaybillModal(false)}
                className="px-4 py-2 rounded-xl bg-[#162228] text-white font-bold hover:bg-[#1D2A32] transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
