export type UserRole =
  | "farmer"
  | "agribusiness"
  | "buyer"
  | "logistics"
  | "finance"
  | "government"
  | "cooperative"
  | "researcher"
  | "input_supplier"
  | "superadmin";

export type ExperienceLevel = "simple" | "professional" | "intelligence";

export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  exchangeRateToUSD: number;
  primaryCrops: string[];
  majorMarkets: string[];
  climateZones: string[];
  regulations: string[];
}

export interface FieldZone {
  id: string;
  name: string;
  crop: string;
  areaHa: number;
  health: "Excellent" | "Good" | "Moderate" | "Attention Required" | "Critical";
  ndviScore: number; // 0.0 - 1.0
  soilMoisture: number; // percentage
  nitrogenStatus: "Deficient" | "Optimal" | "Excess";
  coordinates: [number, number][]; // SVG polygon relative points
  alerts?: string[];
}

export interface Farm {
  id: string;
  name: string;
  ownerName: string;
  country: string;
  region: string;
  totalHectares: number;
  primaryCrop: string;
  overallHealthScore: number; // 0 - 100
  soilHealth: number; // percentage
  cropHealth: number;
  waterIndex: number;
  weatherRisk: number;
  pestRisk: number;
  expectedYieldTonnesPerHa: number;
  fields: FieldZone[];
  sensorsOnline: number;
  lastSatellitePass: string;
  verifiedStatus: "verified" | "pending" | "unverified";
  trustScore: number; // 1-5 stars
}

export interface AIRecommendation {
  id: string;
  category: "Irrigation" | "Weather" | "Crop Health" | "Market" | "Finance";
  title: string;
  description: string;
  action: string;
  urgency: "urgent" | "important" | "opportunity" | "routine";
  metricImpact?: string;
  applied?: boolean;
}

export interface CommodityPrice {
  commodity: string;
  country: string;
  cityMarket: string;
  pricePerTonne: number;
  currency: string;
  priceUSD: number;
  dailyChangePct: number;
  trend30Day: number; // percentage change
  volumeTradedTonnes: number;
  qualityGrade: "Grade 1 (Export)" | "Standard Milling" | "Feed Grade";
}

export interface MarketListing {
  id: string;
  sellerName: string;
  farmName: string;
  commodity: string;
  quantityTonnes: number;
  qualityGrade: string;
  harvestDate: string;
  location: string;
  country: string;
  minPricePerTonne: string;
  verified: boolean;
  deliveryOptions: string;
}

export interface PurchaseContract {
  id: string;
  contractNumber: string;
  buyerName: string;
  sellerName: string;
  commodity: string;
  quantityTonnes: number;
  pricePerTonne: string;
  qualityStandard: string;
  deliveryDate: string;
  deliveryLocation: string;
  paymentTerms: string;
  status: "Draft" | "Under Review" | "Escrow Funded" | "In Transit" | "Completed";
  aiRiskScore: number;
  aiRisksIdentified: {
    title: string;
    severity: "High" | "Medium" | "Low";
    description: string;
    remedy: string;
  }[];
}

export interface FinancingProduct {
  id: string;
  name: string;
  type: "Input Financing" | "Working Capital" | "Equipment Finance" | "Seasonal Loan" | "Inventory Finance" | "Export Finance";
  provider: string;
  maxAmount: string;
  interestRateAnnual: string;
  tenureMonths: number;
  eligibilityCriteria: string[];
  features: string[];
}

export interface LogisticsRoute {
  id: string;
  trackingNumber: string;
  carrier: string;
  origin: string;
  destination: string;
  cargo: string;
  volumeTonnes: number;
  vehiclePlate: string;
  status: "Dispatched" | "In Transit" | "Customs Clearance" | "Delivered";
  etaHours: number;
  temperatureControlled: boolean;
  riskLevel: "Low" | "Moderate" | "Elevated";
  lat: number;
  lng: number;
  corridorName?: string;
  transitMode?: "Road Freight" | "Rail Express" | "Multimodal (Rail + Road)" | "Maritime";
  railwayLine?: string;
  customsClearanceSpeedHours?: number;
}

export interface Warehouse {
  id: string;
  name: string;
  city: string;
  country: string;
  totalCapacityTonnes: number;
  utilizedTonnes: number;
  commoditiesStored: { commodity: string; tonnes: number }[];
  predictedDaysToCapacity: number;
  certifiedReceiptEnabled: boolean;
}

export interface NotificationItem {
  id: string;
  type: "urgent" | "important" | "opportunity" | "financial";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  targetView?: string;
}

export interface SyncQueueItem {
  id: string;
  action: string;
  entity: string;
  timestamp: string;
  status: "pending" | "syncing" | "synced" | "failed";
  retryCount?: number;
  lastError?: string;
}

export interface PersonaProfile {
  id: string;
  name: string;
  role: UserRole;
  location: string;
  organization: string;
  countryCode: string;
  avatar: string;
  defaultView: string;
  bio: string;
}

export interface EwrsReceipt {
  id: string;
  receiptNumber: string;
  warehouseName: string;
  commodity: string;
  tonnes: number;
  grade: string;
  moisturePct: number;
  marketValueZAR: number;
  loanDisbursedZAR: number;
  interestRatePct: number;
  issueDate: string;
  qrToken: string;
  status: "Active" | "Loan Disbursed" | "Liquidated";
}

export type DocumentCategory =
  | "Land Title"
  | "Certification"
  | "Contract"
  | "Soil Report"
  | "Insurance";

export interface FarmerDocument {
  id: string;
  farmId: string;
  title: string;
  category: DocumentCategory;
  fileType: "pdf" | "jpg" | "png" | "tiff";
  fileSize: string;
  uploadDate: string;
  expiryDate?: string;
  issuingAuthority: string;
  documentNumber: string;
  parcelOrContractRef?: string;
  sha256Hash: string;
  verificationStatus: "Verified" | "Registry Validated" | "Under Review" | "Expiring Soon";
  securityTier: "AES-256 Encrypted Vault" | "Deeds Office Ledger Anchor" | "Ministry Blockchain Stamp";
  sharedWith: string[];
  notes?: string;
  verifiedBy?: string;
}

export interface SoilDepthReading {
  depthCm: number;
  moisturePct: number;
  temperatureC: number;
  status: "Optimal" | "Deficit" | "Waterlogged" | "Dry";
}

export interface SoilNutrients {
  nitrogenPpm: number;
  nitrogenStatus: "Deficient" | "Optimal" | "Excess";
  nitrogenTargetPpm?: number;
  phosphorusPpm: number;
  phosphorusStatus: "Deficient" | "Optimal" | "Excess";
  phosphorusTargetPpm?: number;
  potassiumPpm: number;
  potassiumStatus: "Deficient" | "Optimal" | "Excess";
  potassiumTargetPpm?: number;
  ph: number;
  phStatus: "Acidic" | "Optimal" | "Alkaline";
  ecMilliSiemens: number;
  organicMatterPct: number;
  microbialActivityScore: number;
}

export interface SensorTelemetryHistoryPoint {
  timestamp: string;
  moistureAvg: number;
  nitrogenPpm: number;
  temperatureC: number;
  soilEc: number;
}

export interface SoilSensorNode {
  id: string;
  nodeCode: string;
  fieldId: string;
  fieldName: string;
  coordinates: { lat: number; lng: number };
  batteryPct: number;
  signalRssi: number;
  networkType: "LoRaWAN (868MHz)" | "NB-IoT Cellular" | "Satellite Direct";
  lastPingSeconds: number;
  status: "online" | "warning" | "offline";
  activeIrrigationValve?: boolean;
  depths: SoilDepthReading[];
  nutrients: SoilNutrients;
  recentHistory: SensorTelemetryHistoryPoint[];
}

export interface SensorTelemetryAlert {
  id: string;
  nodeId: string;
  fieldName: string;
  type: "moisture_deficit" | "nitrogen_leach" | "ph_imbalance" | "high_salinity" | "low_battery";
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  suggestedAction: string;
  timestamp: string;
}

export interface AgriInventoryItem {
  id: string;
  sku: string;
  name: string;
  category: "Fertilizer" | "Seed";
  brandOrGrade: string;
  unit: string;
  currentStock: number;
  safetyStockThreshold: number;
  reorderPoint: number;
  allocatedToOrders: number;
  availableStock: number;
  unitCostUSD: number;
  unitPriceUSD: number;
  dailyBurnRateNormal: number;
  dailyBurnRatePeak: number;
  seasonalDemandPhase: "Early Seeding Spike" | "Peak Basal Application" | "Vegetative Top-Dressing" | "Post-Planting Lull";
  predictedStockoutDays: number;
  stockHealthStatus: "Critical Depletion" | "Reorder Recommended" | "Optimal Buffer" | "Surplus";
  incomingShipment?: {
    orderId: string;
    volume: number;
    expectedArrival: string;
    originHub: string;
    transitCorridor?: string;
  } | null;
  weeklyProjections: {
    week: string;
    projectedStock: number;
    farmOrdersDemand: number;
    safetyLevel: number;
  }[];
}

export interface FarmInputOrder {
  id: string;
  orderNumber: string;
  farmName: string;
  farmLocation: string;
  hectares: number;
  crop: string;
  itemOrdered: string;
  category: "Fertilizer" | "Seed";
  quantity: number;
  unit: string;
  orderDate: string;
  requestedDeliveryDate: string;
  urgency: "Immediate Planting" | "Upcoming Sowing Window" | "Seasonal Pre-Order";
  status: "Confirmed & Allocated" | "Pending Allocation" | "Dispatched" | "In Transit";
  paymentStatus: "Escrow Funded" | "Credit Line Backed" | "Paid";
}
