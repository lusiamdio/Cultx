import React, { useState, useMemo } from "react";
import {
  Package,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  ShoppingCart,
  Send,
  Sparkles,
  Plus,
  RefreshCw,
  Zap,
  ShieldCheck,
  ChevronRight,
  Info,
  X,
  Wheat,
  Droplets,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";
import { AgriInventoryItem, FarmInputOrder } from "../../types";

const INITIAL_INVENTORY: AgriInventoryItem[] = [
  {
    id: "inv-fert-01",
    sku: "FERT-NPK-102010",
    name: "NPK 10-20-10 Basal Compound",
    category: "Fertilizer",
    brandOrGrade: "Granular Basal Foundation (Ammoniacal N + P2O5 + K2O)",
    unit: "Metric Tonnes",
    currentStock: 520,
    safetyStockThreshold: 160,
    reorderPoint: 280,
    allocatedToOrders: 335,
    availableStock: 185,
    unitCostUSD: 540,
    unitPriceUSD: 685,
    dailyBurnRateNormal: 14.5,
    dailyBurnRatePeak: 32.0,
    seasonalDemandPhase: "Peak Basal Application",
    predictedStockoutDays: 12,
    stockHealthStatus: "Reorder Recommended",
    incomingShipment: {
      orderId: "PO-OCP-9921",
      volume: 240,
      expectedArrival: "Sep 22, 2026",
      originHub: "Port of Lobito Atlantic Hub",
      transitCorridor: "Lobito Rail Express (Train LAR-8842)",
    },
    weeklyProjections: [
      { week: "W1 (Sep 9)", projectedStock: 520, farmOrdersDemand: 135, safetyLevel: 160 },
      { week: "W2 (Sep 16)", projectedStock: 385, farmOrdersDemand: 150, safetyLevel: 160 },
      { week: "W3 (Sep 23)", projectedStock: 475, farmOrdersDemand: 110, safetyLevel: 160 }, // arrives 240
      { week: "W4 (Sep 30)", projectedStock: 365, farmOrdersDemand: 95, safetyLevel: 160 },
      { week: "W5 (Oct 7)", projectedStock: 270, farmOrdersDemand: 70, safetyLevel: 160 },
      { week: "W6 (Oct 14)", projectedStock: 200, farmOrdersDemand: 55, safetyLevel: 160 },
      { week: "W7 (Oct 21)", projectedStock: 145, farmOrdersDemand: 40, safetyLevel: 160 },
      { week: "W8 (Oct 28)", projectedStock: 105, farmOrdersDemand: 30, safetyLevel: 160 },
    ],
  },
  {
    id: "inv-fert-02",
    sku: "FERT-UREA-4600",
    name: "Urea 46-0-0 Granular",
    category: "Fertilizer",
    brandOrGrade: "High-Nitrogen Top-Dress (Pure Prilled / White Granular)",
    unit: "Metric Tonnes",
    currentStock: 340,
    safetyStockThreshold: 140,
    reorderPoint: 220,
    allocatedToOrders: 260,
    availableStock: 80,
    unitCostUSD: 490,
    unitPriceUSD: 620,
    dailyBurnRateNormal: 12.0,
    dailyBurnRatePeak: 26.5,
    seasonalDemandPhase: "Vegetative Top-Dressing",
    predictedStockoutDays: 7,
    stockHealthStatus: "Critical Depletion",
    incomingShipment: null,
    weeklyProjections: [
      { week: "W1 (Sep 9)", projectedStock: 340, farmOrdersDemand: 110, safetyLevel: 140 },
      { week: "W2 (Sep 16)", projectedStock: 230, farmOrdersDemand: 125, safetyLevel: 140 },
      { week: "W3 (Sep 23)", projectedStock: 105, farmOrdersDemand: 90, safetyLevel: 140 },
      { week: "W4 (Sep 30)", projectedStock: 15, farmOrdersDemand: 60, safetyLevel: 140 },
      { week: "W5 (Oct 7)", projectedStock: 0, farmOrdersDemand: 40, safetyLevel: 140 },
      { week: "W6 (Oct 14)", projectedStock: 0, farmOrdersDemand: 30, safetyLevel: 140 },
      { week: "W7 (Oct 21)", projectedStock: 0, farmOrdersDemand: 20, safetyLevel: 140 },
      { week: "W8 (Oct 28)", projectedStock: 0, farmOrdersDemand: 10, safetyLevel: 140 },
    ],
  },
  {
    id: "inv-fert-03",
    sku: "FERT-DAP-18460",
    name: "DAP 18-46-0 Starter Phosphate",
    category: "Fertilizer",
    brandOrGrade: "Diammonium Phosphate (High Water-Soluble P2O5)",
    unit: "Metric Tonnes",
    currentStock: 410,
    safetyStockThreshold: 100,
    reorderPoint: 180,
    allocatedToOrders: 145,
    availableStock: 265,
    unitCostUSD: 610,
    unitPriceUSD: 780,
    dailyBurnRateNormal: 8.0,
    dailyBurnRatePeak: 18.0,
    seasonalDemandPhase: "Early Seeding Spike",
    predictedStockoutDays: 26,
    stockHealthStatus: "Optimal Buffer",
    incomingShipment: {
      orderId: "PO-IND-8041",
      volume: 180,
      expectedArrival: "Oct 04, 2026",
      originHub: "Onne Port Fertilizer Terminal",
      transitCorridor: "Intermodal Road Freight",
    },
    weeklyProjections: [
      { week: "W1 (Sep 9)", projectedStock: 410, farmOrdersDemand: 60, safetyLevel: 100 },
      { week: "W2 (Sep 16)", projectedStock: 350, farmOrdersDemand: 55, safetyLevel: 100 },
      { week: "W3 (Sep 23)", projectedStock: 295, farmOrdersDemand: 50, safetyLevel: 100 },
      { week: "W4 (Sep 30)", projectedStock: 245, farmOrdersDemand: 40, safetyLevel: 100 },
      { week: "W5 (Oct 7)", projectedStock: 385, farmOrdersDemand: 35, safetyLevel: 100 }, // arrives 180
      { week: "W6 (Oct 14)", projectedStock: 350, farmOrdersDemand: 30, safetyLevel: 100 },
      { week: "W7 (Oct 21)", projectedStock: 320, farmOrdersDemand: 25, safetyLevel: 100 },
      { week: "W8 (Oct 28)", projectedStock: 295, farmOrdersDemand: 20, safetyLevel: 100 },
    ],
  },
  {
    id: "inv-fert-04",
    sku: "FERT-CAN-2700",
    name: "CAN 27% Calcium Ammonium Nitrate",
    category: "Fertilizer",
    brandOrGrade: "Non-Acidifying Limestone Fortified Top-Dressing",
    unit: "Metric Tonnes",
    currentStock: 185,
    safetyStockThreshold: 70,
    reorderPoint: 120,
    allocatedToOrders: 155,
    availableStock: 30,
    unitCostUSD: 460,
    unitPriceUSD: 590,
    dailyBurnRateNormal: 6.5,
    dailyBurnRatePeak: 15.0,
    seasonalDemandPhase: "Vegetative Top-Dressing",
    predictedStockoutDays: 5,
    stockHealthStatus: "Critical Depletion",
    incomingShipment: {
      orderId: "PO-YARA-3112",
      volume: 120,
      expectedArrival: "Sep 15, 2026",
      originHub: "Durban Multimodal Railhead",
      transitCorridor: "North-South Rail Corridor",
    },
    weeklyProjections: [
      { week: "W1 (Sep 9)", projectedStock: 185, farmOrdersDemand: 65, safetyLevel: 70 },
      { week: "W2 (Sep 16)", projectedStock: 240, farmOrdersDemand: 60, safetyLevel: 70 }, // arrives 120
      { week: "W3 (Sep 23)", projectedStock: 180, farmOrdersDemand: 50, safetyLevel: 70 },
      { week: "W4 (Sep 30)", projectedStock: 130, farmOrdersDemand: 45, safetyLevel: 70 },
      { week: "W5 (Oct 7)", projectedStock: 85, farmOrdersDemand: 35, safetyLevel: 70 },
      { week: "W6 (Oct 14)", projectedStock: 50, farmOrdersDemand: 25, safetyLevel: 70 },
      { week: "W7 (Oct 21)", projectedStock: 25, farmOrdersDemand: 15, safetyLevel: 70 },
      { week: "W8 (Oct 28)", projectedStock: 10, farmOrdersDemand: 10, safetyLevel: 70 },
    ],
  },
  {
    id: "inv-seed-01",
    sku: "SEED-MZ-SC719",
    name: "SC719 Ultra-Yield White Maize",
    category: "Seed",
    brandOrGrade: "Certified Hybrid Seed (Late Maturity • 9–11 MT/ha Potential)",
    unit: "50kg Bags",
    currentStock: 2850,
    safetyStockThreshold: 600,
    reorderPoint: 1200,
    allocatedToOrders: 2150,
    availableStock: 700,
    unitCostUSD: 85,
    unitPriceUSD: 118,
    dailyBurnRateNormal: 45,
    dailyBurnRatePeak: 110,
    seasonalDemandPhase: "Early Seeding Spike",
    predictedStockoutDays: 9,
    stockHealthStatus: "Reorder Recommended",
    incomingShipment: {
      orderId: "PO-SEEDCO-449",
      volume: 1500,
      expectedArrival: "Sep 20, 2026",
      originHub: "Lusaka Agro-Processing Complex",
      transitCorridor: "Dedicated Sealed Road Fleet",
    },
    weeklyProjections: [
      { week: "W1 (Sep 9)", projectedStock: 2850, farmOrdersDemand: 750, safetyLevel: 600 },
      { week: "W2 (Sep 16)", projectedStock: 2100, farmOrdersDemand: 850, safetyLevel: 600 },
      { week: "W3 (Sep 23)", projectedStock: 2750, farmOrdersDemand: 700, safetyLevel: 600 }, // arrives 1500
      { week: "W4 (Sep 30)", projectedStock: 2050, farmOrdersDemand: 550, safetyLevel: 600 },
      { week: "W5 (Oct 7)", projectedStock: 1500, farmOrdersDemand: 400, safetyLevel: 600 },
      { week: "W6 (Oct 14)", projectedStock: 1100, farmOrdersDemand: 280, safetyLevel: 600 },
      { week: "W7 (Oct 21)", projectedStock: 820, farmOrdersDemand: 180, safetyLevel: 600 },
      { week: "W8 (Oct 28)", projectedStock: 640, farmOrdersDemand: 100, safetyLevel: 600 },
    ],
  },
  {
    id: "inv-seed-02",
    sku: "SEED-MZ-PAN53",
    name: "PAN 53 Drought-Tolerant Yellow Maize",
    category: "Seed",
    brandOrGrade: "Certified Yellow Maize Hybrid (Drought Shield • Medium Maturity)",
    unit: "50kg Bags",
    currentStock: 2100,
    safetyStockThreshold: 500,
    reorderPoint: 950,
    allocatedToOrders: 1050,
    availableStock: 1050,
    unitCostUSD: 82,
    unitPriceUSD: 112,
    dailyBurnRateNormal: 35,
    dailyBurnRatePeak: 85,
    seasonalDemandPhase: "Early Seeding Spike",
    predictedStockoutDays: 22,
    stockHealthStatus: "Optimal Buffer",
    incomingShipment: null,
    weeklyProjections: [
      { week: "W1 (Sep 9)", projectedStock: 2100, farmOrdersDemand: 420, safetyLevel: 500 },
      { week: "W2 (Sep 16)", projectedStock: 1680, farmOrdersDemand: 460, safetyLevel: 500 },
      { week: "W3 (Sep 23)", projectedStock: 1220, farmOrdersDemand: 390, safetyLevel: 500 },
      { week: "W4 (Sep 30)", projectedStock: 830, farmOrdersDemand: 300, safetyLevel: 500 },
      { week: "W5 (Oct 7)", projectedStock: 530, farmOrdersDemand: 210, safetyLevel: 500 },
      { week: "W6 (Oct 14)", projectedStock: 320, farmOrdersDemand: 140, safetyLevel: 500 },
      { week: "W7 (Oct 21)", projectedStock: 180, farmOrdersDemand: 90, safetyLevel: 500 },
      { week: "W8 (Oct 28)", projectedStock: 90, farmOrdersDemand: 40, safetyLevel: 500 },
    ],
  },
  {
    id: "inv-seed-03",
    sku: "SEED-SOY-TGX1904",
    name: "TGx 1904 Inoculated Soybean Seed",
    category: "Seed",
    brandOrGrade: "Dual-Purpose Pulse Seed (Rhizobium Treated • Shatter Resistant)",
    unit: "50kg Bags",
    currentStock: 1350,
    safetyStockThreshold: 400,
    reorderPoint: 750,
    allocatedToOrders: 1150,
    availableStock: 200,
    unitCostUSD: 94,
    unitPriceUSD: 130,
    dailyBurnRateNormal: 28,
    dailyBurnRatePeak: 68,
    seasonalDemandPhase: "Early Seeding Spike",
    predictedStockoutDays: 6,
    stockHealthStatus: "Critical Depletion",
    incomingShipment: null,
    weeklyProjections: [
      { week: "W1 (Sep 9)", projectedStock: 1350, farmOrdersDemand: 380, safetyLevel: 400 },
      { week: "W2 (Sep 16)", projectedStock: 970, farmOrdersDemand: 410, safetyLevel: 400 },
      { week: "W3 (Sep 23)", projectedStock: 560, farmOrdersDemand: 320, safetyLevel: 400 },
      { week: "W4 (Sep 30)", projectedStock: 240, farmOrdersDemand: 220, safetyLevel: 400 },
      { week: "W5 (Oct 7)", projectedStock: 20, farmOrdersDemand: 150, safetyLevel: 400 },
      { week: "W6 (Oct 14)", projectedStock: 0, farmOrdersDemand: 90, safetyLevel: 400 },
      { week: "W7 (Oct 21)", projectedStock: 0, farmOrdersDemand: 50, safetyLevel: 400 },
      { week: "W8 (Oct 28)", projectedStock: 0, farmOrdersDemand: 20, safetyLevel: 400 },
    ],
  },
  {
    id: "inv-seed-04",
    sku: "SEED-SOR-GADAM",
    name: "Gadam Arid-Hardy Sorghum",
    category: "Seed",
    brandOrGrade: "Semi-Dwarf White Sorghum (Dryland Specialist • High BRIX)",
    unit: "25kg Seed Packs",
    currentStock: 1600,
    safetyStockThreshold: 350,
    reorderPoint: 600,
    allocatedToOrders: 420,
    availableStock: 1180,
    unitCostUSD: 42,
    unitPriceUSD: 58,
    dailyBurnRateNormal: 15,
    dailyBurnRatePeak: 38,
    seasonalDemandPhase: "Early Seeding Spike",
    predictedStockoutDays: 38,
    stockHealthStatus: "Optimal Buffer",
    incomingShipment: null,
    weeklyProjections: [
      { week: "W1 (Sep 9)", projectedStock: 1600, farmOrdersDemand: 180, safetyLevel: 350 },
      { week: "W2 (Sep 16)", projectedStock: 1420, farmOrdersDemand: 195, safetyLevel: 350 },
      { week: "W3 (Sep 23)", projectedStock: 1225, farmOrdersDemand: 170, safetyLevel: 350 },
      { week: "W4 (Sep 30)", projectedStock: 1055, farmOrdersDemand: 140, safetyLevel: 350 },
      { week: "W5 (Oct 7)", projectedStock: 915, farmOrdersDemand: 110, safetyLevel: 350 },
      { week: "W6 (Oct 14)", projectedStock: 805, farmOrdersDemand: 80, safetyLevel: 350 },
      { week: "W7 (Oct 21)", projectedStock: 725, farmOrdersDemand: 50, safetyLevel: 350 },
      { week: "W8 (Oct 28)", projectedStock: 675, farmOrdersDemand: 30, safetyLevel: 350 },
    ],
  },
];

const INITIAL_FARM_ORDERS: FarmInputOrder[] = [
  {
    id: "ord-881",
    orderNumber: "ORD-2026-881",
    farmName: "Nakuru Highland Cooperative (45 smallholders)",
    farmLocation: "Rift Valley, KE",
    hectares: 320,
    crop: "White Maize",
    itemOrdered: "SC719 Ultra-Yield White Maize",
    category: "Seed",
    quantity: 640,
    unit: "50kg Bags",
    orderDate: "Sep 07, 2026",
    requestedDeliveryDate: "Sep 15, 2026",
    urgency: "Immediate Planting",
    status: "Confirmed & Allocated",
    paymentStatus: "Escrow Funded",
  },
  {
    id: "ord-882",
    orderNumber: "ORD-2026-882",
    farmName: "Cape Grain Farm (James Ndlovu)",
    farmLocation: "Free State, ZA",
    hectares: 250,
    crop: "Yellow Maize & Soy",
    itemOrdered: "NPK 10-20-10 Basal Compound",
    category: "Fertilizer",
    quantity: 115,
    unit: "Metric Tonnes",
    orderDate: "Sep 08, 2026",
    requestedDeliveryDate: "Sep 18, 2026",
    urgency: "Immediate Planting",
    status: "Confirmed & Allocated",
    paymentStatus: "Escrow Funded",
  },
  {
    id: "ord-883",
    orderNumber: "ORD-2026-883",
    farmName: "Luapula Agri Hub (Mweemba Brothers)",
    farmLocation: "Kabwe, ZM",
    hectares: 180,
    crop: "Soybeans",
    itemOrdered: "TGx 1904 Inoculated Soybean Seed",
    category: "Seed",
    quantity: 420,
    unit: "50kg Bags",
    orderDate: "Sep 09, 2026",
    requestedDeliveryDate: "Sep 16, 2026",
    urgency: "Immediate Planting",
    status: "Pending Allocation",
    paymentStatus: "Credit Line Backed",
  },
  {
    id: "ord-884",
    orderNumber: "ORD-2026-884",
    farmName: "Dawanau Commercial Grain Producers",
    farmLocation: "Kano, NG",
    hectares: 450,
    crop: "Sorghum & Maize",
    itemOrdered: "Urea 46-0-0 Granular",
    category: "Fertilizer",
    quantity: 120,
    unit: "Metric Tonnes",
    orderDate: "Sep 08, 2026",
    requestedDeliveryDate: "Sep 22, 2026",
    urgency: "Upcoming Sowing Window",
    status: "Confirmed & Allocated",
    paymentStatus: "Paid",
  },
  {
    id: "ord-885",
    orderNumber: "ORD-2026-885",
    farmName: "Huambo Plateau Maize Growers Association",
    farmLocation: "Huambo, AO",
    hectares: 290,
    crop: "White Maize",
    itemOrdered: "NPK 10-20-10 Basal Compound",
    category: "Fertilizer",
    quantity: 90,
    unit: "Metric Tonnes",
    orderDate: "Sep 09, 2026",
    requestedDeliveryDate: "Sep 20, 2026",
    urgency: "Immediate Planting",
    status: "Confirmed & Allocated",
    paymentStatus: "Escrow Funded",
  },
  {
    id: "ord-886",
    orderNumber: "ORD-2026-886",
    farmName: "Eldoret Seed Outgrower Union",
    farmLocation: "Uasin Gishu, KE",
    hectares: 140,
    crop: "Wheat & Maize",
    itemOrdered: "DAP 18-46-0 Starter Phosphate",
    category: "Fertilizer",
    quantity: 55,
    unit: "Metric Tonnes",
    orderDate: "Sep 09, 2026",
    requestedDeliveryDate: "Sep 25, 2026",
    urgency: "Upcoming Sowing Window",
    status: "Pending Allocation",
    paymentStatus: "Credit Line Backed",
  },
];

export const AutomatedInventoryTracker: React.FC = () => {
  const [inventory, setInventory] = useState<AgriInventoryItem[]>(INITIAL_INVENTORY);
  const [farmOrders, setFarmOrders] = useState<FarmInputOrder[]>(INITIAL_FARM_ORDERS);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "Fertilizer" | "Seed">("all");
  const [healthFilter, setHealthFilter] = useState<"all" | "warnings_only">("all");
  const [selectedItemId, setSelectedItemId] = useState<string>("inv-fert-01");
  const [seasonalScenario, setSeasonalScenario] = useState<"normal" | "early_surge" | "staggered">("normal");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Reorder Purchase Order Modal State
  const [reorderModalItem, setReorderModalItem] = useState<AgriInventoryItem | null>(null);
  const [reorderVolume, setReorderVolume] = useState<number>(150);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("OCP Group (Casablanca / Jorf Lasfar)");
  const [selectedCorridor, setSelectedCorridor] = useState<string>("Lobito Atlantic Rail Corridor (LAR)");
  const [isSubmittingPO, setIsSubmittingPO] = useState<boolean>(false);
  const [poSuccessMessage, setPoSuccessMessage] = useState<string | null>(null);

  // Selected item for projection chart
  const activeItem = useMemo(() => {
    return inventory.find((i) => i.id === selectedItemId) || inventory[0];
  }, [inventory, selectedItemId]);

  // Dynamic calculation based on scenario
  const scenarioMultiplier = useMemo(() => {
    if (seasonalScenario === "early_surge") return 1.35; // +35% demand spike from early rains
    if (seasonalScenario === "staggered") return 0.8; // -20% delayed sowing
    return 1.0;
  }, [seasonalScenario]);

  // Adjust chart projection data based on scenario
  const chartData = useMemo(() => {
    if (!activeItem) return [];
    let runningStock = activeItem.currentStock;
    return activeItem.weeklyProjections.map((p, idx) => {
      const adjustedDemand = Math.round(p.farmOrdersDemand * scenarioMultiplier);
      const isArrivalWeek = idx === 2 && activeItem.incomingShipment;
      const inboundAmt = isArrivalWeek ? activeItem.incomingShipment!.volume : 0;
      
      if (idx > 0) {
        runningStock = Math.max(0, runningStock - adjustedDemand + inboundAmt);
      }

      return {
        week: p.week,
        projectedStock: idx === 0 ? activeItem.currentStock : runningStock,
        farmDemand: adjustedDemand,
        safetyThreshold: p.safetyLevel,
        inboundDelivery: inboundAmt > 0 ? inboundAmt : null,
      };
    });
  }, [activeItem, scenarioMultiplier]);

  // Filtered Inventory List
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
      const matchesHealth =
        healthFilter === "all" ||
        item.stockHealthStatus === "Critical Depletion" ||
        item.stockHealthStatus === "Reorder Recommended";
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brandOrGrade.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesHealth && matchesSearch;
    });
  }, [inventory, selectedCategory, healthFilter, searchQuery]);

  // Top Aggregates
  const totalStockValuationUSD = useMemo(() => {
    return inventory.reduce((acc, item) => acc + item.currentStock * item.unitCostUSD, 0);
  }, [inventory]);

  const totalFertilizerTonnage = useMemo(() => {
    return inventory
      .filter((i) => i.category === "Fertilizer")
      .reduce((acc, item) => acc + item.currentStock, 0);
  }, [inventory]);

  const totalSeedBags = useMemo(() => {
    return inventory
      .filter((i) => i.category === "Seed")
      .reduce((acc, item) => acc + item.currentStock, 0);
  }, [inventory]);

  const itemsAtRiskCount = useMemo(() => {
    return inventory.filter(
      (i) => i.stockHealthStatus === "Critical Depletion" || i.stockHealthStatus === "Reorder Recommended"
    ).length;
  }, [inventory]);

  const totalPendingOrdersCount = useMemo(() => {
    return farmOrders.filter((o) => o.status === "Pending Allocation").length;
  }, [farmOrders]);

  // Handle PO Modal Open
  const handleOpenReorderModal = (item: AgriInventoryItem) => {
    setReorderModalItem(item);
    const suggestedAmt = Math.max(
      item.safetyStockThreshold * 2,
      item.reorderPoint - item.availableStock + item.allocatedToOrders
    );
    setReorderVolume(Math.round(suggestedAmt));
    if (item.category === "Fertilizer") {
      setSelectedSupplier("OCP Group (Casablanca / Jorf Lasfar)");
    } else {
      setSelectedSupplier("Seed Co Group (Lusaka Genetics Hub)");
    }
  };

  // Submit PO
  const handleSubmitPO = () => {
    if (!reorderModalItem) return;
    setIsSubmittingPO(true);

    setTimeout(() => {
      const generatedPO = `PO-${Math.floor(1000 + Math.random() * 9000)}`;
      // Update inventory item with incoming shipment
      setInventory((prev) =>
        prev.map((item) => {
          if (item.id === reorderModalItem.id) {
            return {
              ...item,
              stockHealthStatus: "Optimal Buffer",
              incomingShipment: {
                orderId: generatedPO,
                volume: reorderVolume,
                expectedArrival: "Oct 02, 2026",
                originHub: selectedSupplier.split(" (")[0],
                transitCorridor: selectedCorridor,
              },
            };
          }
          return item;
        })
      );

      setIsSubmittingPO(false);
      setPoSuccessMessage(
        `Purchase Order #${generatedPO} dispatched to ${selectedSupplier} for ${reorderVolume} ${reorderModalItem.unit}. Inbound freight booked via ${selectedCorridor}.`
      );
      setReorderModalItem(null);

      setTimeout(() => setPoSuccessMessage(null), 6000);
    }, 1200);
  };

  // Quick Allocate Order
  const handleAllocateOrder = (orderId: string) => {
    setFarmOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Confirmed & Allocated" } : o))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Inventory Engine Overview */}
      <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#0B3D2C] border border-[#14533C] text-emerald-400 flex items-center justify-center shadow-sm">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Automated Inventory Tracker & Predictive Replenishment
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-300 bg-[#07261B] px-2.5 py-0.5 rounded-full border border-[#14533C]">
              Fertilizer & Hybrid Seeds
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Algorithmic stock forecasting calibrating real-time farm pre-orders against regional seasonal sowing trends, agronomic application rates, and inbound corridor freight.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Seasonal Scenario Simulation Selector */}
          <div className="bg-[#162228] p-1.5 rounded-xl border border-[#1D2A32] flex items-center gap-1 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-2 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sowing Scenario:</span>
            </span>
            <button
              onClick={() => setSeasonalScenario("normal")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                seasonalScenario === "normal"
                  ? "bg-[#0B3D2C] text-emerald-300 border border-[#196349] font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Standard Season
            </button>
            <button
              onClick={() => setSeasonalScenario("early_surge")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                seasonalScenario === "early_surge"
                  ? "bg-amber-950/80 text-amber-300 border border-amber-800 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Early Rains (+35% Surge)
            </button>
            <button
              onClick={() => setSeasonalScenario("staggered")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                seasonalScenario === "staggered"
                  ? "bg-blue-950/80 text-blue-300 border border-blue-800 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Staggered (-20%)
            </button>
          </div>
        </div>
      </div>

      {/* PO Success Notification */}
      {poSuccessMessage && (
        <div className="p-4 bg-[#07261B] border border-[#14533C] rounded-2xl flex items-center justify-between text-xs text-white animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">Automated Purchase Order Dispatched!</span>
              <span className="text-emerald-200 text-[11px]">{poSuccessMessage}</span>
            </div>
          </div>
          <span className="font-mono text-[10px] text-emerald-300 bg-[#0B3D2C] px-2.5 py-1 rounded-lg border border-[#196349]">
            Status: Confirmed with Supplier
          </span>
        </div>
      )}

      {/* 4 Inventory Strategic KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Inventory Value</span>
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-white">
            ${(totalStockValuationUSD / 1000).toFixed(1)}k USD
          </div>
          <div className="text-[11px] text-slate-400">
            ~R{( (totalStockValuationUSD * 17.5) / 1000000 ).toFixed(2)}M ZAR Warehoused Stock
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Bulk Fertilizer On-Hand</span>
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-cyan-300">
            {totalFertilizerTonnage.toLocaleString()} MT
          </div>
          <div className="text-[11px] text-slate-400">
            Basal NPK, Urea, DAP & CAN silos
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Certified Seed Reserves</span>
            <Wheat className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-amber-300">
            {totalSeedBags.toLocaleString()} Bags
          </div>
          <div className="text-[11px] text-slate-400">
            Maize, Soybean & Sorghum hybrids
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#10171B] border border-amber-900/40 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Stockout Risk Runway</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-amber-400 flex items-baseline gap-1.5">
            <span>{itemsAtRiskCount} Items</span>
            <span className="text-xs font-normal text-slate-400 font-sans">&lt; 14 Days</span>
          </div>
          <div className="text-[11px] text-amber-300/90 font-medium">
            Urea 46-0-0 & TGx Soybeans near safety buffer
          </div>
        </div>
      </div>

      {/* Predictive Recharts Chart: Multi-Week Stock Level Depletion & Farm Orders Projection */}
      <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] shadow-md space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#1D2A32] pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                <span>8-Week Predictive Stock Depletion & Farm Order Absorption Runway</span>
              </h4>
              <span className="text-xs font-mono font-bold text-emerald-300 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                {activeItem.name} ({activeItem.unit})
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulates dynamic inventory burn against confirmed farm orders and seasonal application demand.
            </p>
          </div>

          {/* Item Selector Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-[11px] text-slate-400 shrink-0 font-medium">Select SKU:</span>
            {inventory.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium shrink-0 transition-all cursor-pointer ${
                  selectedItemId === item.id
                    ? "bg-[#0B3D2C] text-emerald-300 border border-[#196349] font-bold shadow-xs"
                    : "bg-[#162228] text-slate-400 hover:text-white border border-[#1D2A32]"
                }`}
              >
                {item.sku.split("-")[1] || item.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Telemetry Status Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#162228] p-3 rounded-xl border border-[#1D2A32] text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Current On-Hand</span>
            <span className="font-mono font-extrabold text-white text-base">
              {activeItem.currentStock.toLocaleString()} {activeItem.unit}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Allocated to Farm Orders</span>
            <span className="font-mono font-extrabold text-amber-300 text-base">
              {activeItem.allocatedToOrders.toLocaleString()} {activeItem.unit}
            </span>
            <span className="text-[10px] text-slate-400 block">
              ({((activeItem.allocatedToOrders / activeItem.currentStock) * 100).toFixed(0)}% committed)
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Safety Buffer Baseline</span>
            <span className="font-mono font-extrabold text-slate-300 text-base">
              {activeItem.safetyStockThreshold.toLocaleString()} {activeItem.unit}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Depletion Window</span>
            <span
              className={`font-mono font-extrabold text-base flex items-center gap-1 ${
                activeItem.predictedStockoutDays <= 7
                  ? "text-red-400"
                  : activeItem.predictedStockoutDays <= 14
                  ? "text-amber-400"
                  : "text-emerald-400"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{Math.round(activeItem.predictedStockoutDays / scenarioMultiplier)} Days Runway</span>
            </span>
          </div>
        </div>

        {/* Recharts Composed Chart */}
        <div className="w-full h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 15, right: 15, bottom: 5, left: 10 }}>
              <defs>
                <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1D2A32" vertical={false} />
              <XAxis
                dataKey="week"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#1D2A32" }}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#1D2A32" }}
                tickFormatter={(val) => `${val}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#0B1013] p-3 rounded-xl border border-[#1D2A32] text-xs space-y-1.5 shadow-xl min-w-[200px]">
                        <div className="font-extrabold text-white text-sm pb-1 border-b border-[#1D2A32]">
                          {label}
                        </div>
                        {payload.map((entry: any, i: number) => (
                          <div key={i} className="flex justify-between items-center font-mono">
                            <span className="flex items-center gap-1.5 text-slate-300">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span>{entry.name}:</span>
                            </span>
                            <span className="font-bold text-white">
                              {entry.value} {activeItem.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
              />

              {/* Safety stock reference line */}
              <ReferenceLine
                y={activeItem.safetyStockThreshold}
                stroke="#EF4444"
                strokeDasharray="4 4"
                label={{
                  value: `Safety Threshold (${activeItem.safetyStockThreshold} ${activeItem.unit})`,
                  fill: "#EF4444",
                  fontSize: 10,
                  position: "insideBottomRight",
                }}
              />

              {/* Weekly Farm Order Demand Bars */}
              <Bar
                dataKey="farmDemand"
                name="Projected Farm Demand"
                fill="#F59E0B"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />

              {/* Inbound Shipment Spike if available */}
              <Bar
                dataKey="inboundDelivery"
                name="Inbound Corridor Freight Arrival"
                fill="#38BDF8"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />

              {/* Projected Stock Level Area/Line */}
              <Area
                type="monotone"
                dataKey="projectedStock"
                name="Projected Available Stock"
                stroke="#10B981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#stockGrad)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Inbound Shipment Telemetry Card */}
        {activeItem.incomingShipment ? (
          <div className="p-3.5 bg-[#07261B] rounded-xl border border-[#14533C] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0B3D2C] border border-[#196349] text-emerald-300 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white">
                    Inbound Shipment En Route: {activeItem.incomingShipment.orderId}
                  </span>
                  <span className="font-mono text-[10px] bg-[#0B3D2C] text-emerald-300 px-2 py-0.5 rounded border border-[#196349]">
                    +{activeItem.incomingShipment.volume} {activeItem.unit}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Origin: <strong>{activeItem.incomingShipment.originHub}</strong> • Transit: {activeItem.incomingShipment.transitCorridor}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Expected Port/Hub Arrival</span>
                <span className="font-mono font-bold text-white">{activeItem.incomingShipment.expectedArrival}</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                Track Live
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                No active inbound freight orders currently scheduled for {activeItem.name}. Stock will reach safety boundary in {Math.round(activeItem.predictedStockoutDays / scenarioMultiplier)} days.
              </span>
            </div>
            <button
              onClick={() => handleOpenReorderModal(activeItem)}
              className="px-3 py-1.5 bg-[#0B3D2C] hover:bg-[#0E4B37] text-emerald-300 text-xs font-bold rounded-lg border border-[#196349] transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Purchase Order</span>
            </button>
          </div>
        )}
      </div>

      {/* Real-time Inventory Catalog & Stockout Health Grid */}
      <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1D2A32]">
          <div>
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-400" />
              <span>Comprehensive Fertilizer & Seed Inventory Ledger</span>
            </h4>
            <p className="text-xs text-slate-400">
              Unit allocation against verified farm purchase contracts & seasonal reserve limits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SKU, grade..."
                className="pl-8 pr-3 py-1.5 bg-[#162228] border border-[#1D2A32] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-44"
              />
            </div>

            {/* Category Filter */}
            <div className="bg-[#162228] p-1 rounded-xl border border-[#1D2A32] flex items-center gap-1 text-xs">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-[#0B3D2C] text-emerald-300 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All Inputs
              </button>
              <button
                onClick={() => setSelectedCategory("Fertilizer")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedCategory === "Fertilizer"
                    ? "bg-[#0B3D2C] text-emerald-300 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Fertilizers
              </button>
              <button
                onClick={() => setSelectedCategory("Seed")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedCategory === "Seed"
                    ? "bg-[#0B3D2C] text-emerald-300 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Seeds
              </button>
            </div>

            {/* Warnings Filter */}
            <button
              onClick={() => setHealthFilter(healthFilter === "all" ? "warnings_only" : "all")}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                healthFilter === "warnings_only"
                  ? "bg-amber-950/80 border-amber-800 text-amber-300 font-bold"
                  : "bg-[#162228] border-[#1D2A32] text-slate-400 hover:text-white"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Risk Only</span>
            </button>
          </div>
        </div>

        {/* Item Cards Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1D2A32] text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-bold">Input Item & SKU</th>
                <th className="pb-3 font-bold">Category</th>
                <th className="pb-3 font-bold">Current On-Hand</th>
                <th className="pb-3 font-bold">Order Allocations</th>
                <th className="pb-3 font-bold">Stock Runway</th>
                <th className="pb-3 font-bold">Health Status</th>
                <th className="pb-3 font-bold text-right">Replenishment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2A32]">
              {filteredInventory.map((item) => {
                const isSelected = selectedItemId === item.id;
                const allocationPct = Math.round((item.allocatedToOrders / item.currentStock) * 100);
                const isWarning =
                  item.stockHealthStatus === "Critical Depletion" ||
                  item.stockHealthStatus === "Reorder Recommended";

                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? "bg-[#16242B]" : "hover:bg-[#162228]/80"
                    }`}
                  >
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                            item.category === "Fertilizer"
                              ? "bg-[#0B3D2C] border-[#14533C] text-emerald-400"
                              : "bg-amber-950/60 border-amber-800 text-amber-400"
                          }`}
                        >
                          {item.category === "Fertilizer" ? (
                            <Droplets className="w-3.5 h-3.5" />
                          ) : (
                            <Wheat className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{item.name}</span>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {item.sku} • {item.brandOrGrade}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span className="text-[10px] font-mono text-slate-300 bg-[#162228] px-2 py-0.5 rounded border border-[#1D2A32]">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <div className="font-mono font-bold text-white text-sm">
                        {item.currentStock.toLocaleString()}{" "}
                        <span className="text-xs text-slate-400 font-normal">{item.unit}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Available uncommitted: <strong className="text-emerald-300">{item.availableStock}</strong>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <div className="w-28 space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="font-mono text-slate-300 font-bold">
                            {item.allocatedToOrders} {item.unit}
                          </span>
                          <span className="font-mono text-slate-400">{allocationPct}%</span>
                        </div>
                        <div className="w-full bg-[#162228] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              allocationPct > 85 ? "bg-red-500" : allocationPct > 65 ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.min(100, allocationPct)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <div className="font-mono font-bold text-white">
                        {Math.round(item.predictedStockoutDays / scenarioMultiplier)} Days
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.seasonalDemandPhase}
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md border ${
                          item.stockHealthStatus === "Critical Depletion"
                            ? "bg-red-950/80 border-red-800 text-red-300"
                            : item.stockHealthStatus === "Reorder Recommended"
                            ? "bg-amber-950/80 border-amber-800 text-amber-300"
                            : item.stockHealthStatus === "Optimal Buffer"
                            ? "bg-[#07261B] border-[#14533C] text-emerald-300"
                            : "bg-blue-950/80 border-blue-800 text-blue-300"
                        }`}
                      >
                        {isWarning && <AlertTriangle className="w-3 h-3" />}
                        {item.stockHealthStatus}
                      </span>
                    </td>

                    <td className="py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenReorderModal(item);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-emerald-300 text-xs font-bold border border-[#196349] transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Reorder PO</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Farm Input Order Book & Demand Matching */}
      <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1D2A32]">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-emerald-400" />
                <span>Active Farm Input Orders & Outgrower Commitments</span>
              </h4>
              <span className="text-xs font-mono font-bold text-emerald-300 bg-[#07261B] px-2 py-0.5 rounded-full border border-[#14533C]">
                {farmOrders.length} Confirmed Contracts
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Input requisitions locked via forward off-take escrow accounts and agricultural development credit lines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono">
              Pending Allocation:{" "}
              <strong className="text-amber-300">{totalPendingOrdersCount} orders</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {farmOrders.map((order) => {
            const isAllocated = order.status === "Confirmed & Allocated";

            return (
              <div
                key={order.id}
                className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32] hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">{order.orderNumber}</span>
                    <h5 className="font-bold text-sm text-white leading-tight mt-0.5">
                      {order.farmName}
                    </h5>
                    <span className="text-[11px] text-slate-400">{order.farmLocation}</span>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                      order.urgency === "Immediate Planting"
                        ? "bg-red-950/80 border border-red-800 text-red-300"
                        : "bg-blue-950/80 border border-blue-800 text-blue-300"
                    }`}
                  >
                    {order.urgency}
                  </span>
                </div>

                <div className="p-2.5 bg-[#10171B] rounded-lg border border-[#1D2A32] space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Input Requisition</div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-white text-xs">{order.itemOrdered}</span>
                    <span className="font-mono font-extrabold text-emerald-300 text-xs">
                      {order.quantity} {order.unit}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Target Crop: <strong className="text-slate-300">{order.crop}</strong> ({order.hectares} ha)
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#1D2A32]">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Req Delivery:</span>
                    <span className="font-mono text-white text-xs">{order.requestedDeliveryDate}</span>
                  </div>

                  {isAllocated ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-[#07261B] px-2 py-1 rounded border border-[#14533C]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Stock Allocated</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAllocateOrder(order.id)}
                      className="px-2.5 py-1 rounded bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-[11px] font-bold border border-[#196349] transition-all cursor-pointer"
                    >
                      Allocate Buffer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Automated Purchase Order (PO) Modal */}
      {reorderModalItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#10171B] border border-[#1D2A32] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#1D2A32] pb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-400" />
                <h4 className="font-extrabold text-white text-base">
                  Automated Purchase Order Dispatch
                </h4>
              </div>
              <button
                onClick={() => setReorderModalItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#162228] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Selected Input SKU</span>
                <div className="font-extrabold text-white text-sm">{reorderModalItem.name}</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {reorderModalItem.sku} • {reorderModalItem.brandOrGrade}
                </div>
                <div className="flex justify-between text-[11px] pt-1 text-slate-300">
                  <span>Current Available: <strong>{reorderModalItem.availableStock} {reorderModalItem.unit}</strong></span>
                  <span>Safety Buffer: <strong>{reorderModalItem.safetyStockThreshold} {reorderModalItem.unit}</strong></span>
                </div>
              </div>

              {/* Order Quantity Stepper */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-200 block">
                  Replenishment Order Volume ({reorderModalItem.unit}):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={reorderVolume}
                    onChange={(e) => setReorderVolume(Number(e.target.value))}
                    className="w-full bg-[#162228] border border-[#1D2A32] rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <span className="font-mono text-xs text-slate-400 shrink-0 font-semibold">
                    {reorderModalItem.unit}
                  </span>
                </div>
              </div>

              {/* Supplier Selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-200 block">
                  Certified Tier-1 Agro-Manufacturer:
                </label>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="w-full bg-[#162228] border border-[#1D2A32] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  {reorderModalItem.category === "Fertilizer" ? (
                    <>
                      <option value="OCP Group (Casablanca / Jorf Lasfar)">OCP Group (Casablanca / Jorf Lasfar)</option>
                      <option value="Indorama Eleme Fertilizer Complex (Port Harcourt)">Indorama Eleme Fertilizer Complex (Port Harcourt)</option>
                      <option value="Yara International (Durban Blending Hub)">Yara International (Durban Blending Hub)</option>
                      <option value="Sasol Nitro Chemicals (Secunda)">Sasol Nitro Chemicals (Secunda)</option>
                    </>
                  ) : (
                    <>
                      <option value="Seed Co Group (Lusaka Genetics Hub)">Seed Co Group (Lusaka Genetics Hub)</option>
                      <option value="Pannar Seed (Greytown / South Africa)">Pannar Seed (Greytown / South Africa)</option>
                      <option value="Kenya Seed Company (Kitale Breeding Station)">Kenya Seed Company (Kitale Breeding Station)</option>
                      <option value="IITA Certified Breeder Stock (Ibadan)">IITA Certified Breeder Stock (Ibadan)</option>
                    </>
                  )}
                </select>
              </div>

              {/* Transport Logistics Corridor */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-200 block">
                  Inbound Logistics Corridor:
                </label>
                <select
                  value={selectedCorridor}
                  onChange={(e) => setSelectedCorridor(e.target.value)}
                  className="w-full bg-[#162228] border border-[#1D2A32] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="Lobito Atlantic Rail Corridor (LAR)">Lobito Atlantic Rail Corridor (LAR) — 4.5 Days</option>
                  <option value="North-South Rail Freight Corridor (Durban - Lusaka)">North-South Rail Freight Corridor (Durban - Lusaka) — 6 Days</option>
                  <option value="Northern Transport Corridor (Mombasa - Eldoret)">Northern Transport Corridor (Mombasa - Eldoret) — 3 Days</option>
                  <option value="Direct Agro-Dealer Trucking Fleet">Direct Agro-Dealer Trucking Fleet — 2 Days</option>
                </select>
              </div>

              {/* Financial Calculation */}
              <div className="p-3 bg-[#0B1013] rounded-xl border border-[#1D2A32] space-y-1 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Unit Base Price:</span>
                  <span>${reorderModalItem.unitCostUSD} USD / {reorderModalItem.unit}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Freight & Corridor Handling:</span>
                  <span>${Math.round(reorderVolume * 18)} USD</span>
                </div>
                <div className="flex justify-between font-bold text-white pt-1 border-t border-[#1D2A32]">
                  <span>Total Purchase Commitment:</span>
                  <span className="text-emerald-400 text-sm">
                    ${(reorderVolume * reorderModalItem.unitCostUSD + reorderVolume * 18).toLocaleString()} USD
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setReorderModalItem(null)}
                className="px-4 py-2 rounded-xl bg-[#162228] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPO}
                disabled={isSubmittingPO}
                className="px-5 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold border border-[#196349] transition-all cursor-pointer flex items-center gap-2 shadow-md min-h-[40px]"
              >
                <Send className="w-3.5 h-3.5 text-emerald-300" />
                <span>{isSubmittingPO ? "Transmitting PO..." : "Issue Purchase Order & Freight"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
