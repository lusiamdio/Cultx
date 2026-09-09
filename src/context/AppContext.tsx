import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserRole,
  ExperienceLevel,
  CountryConfig,
  Farm,
  AIRecommendation,
  CommodityPrice,
  MarketListing,
  PurchaseContract,
  FinancingProduct,
  LogisticsRoute,
  Warehouse,
  NotificationItem,
  SyncQueueItem,
  FarmerDocument,
  SoilSensorNode,
  SensorTelemetryAlert,
} from "../types";
import { AFRICAN_COUNTRIES } from "../data/countries";
import {
  INITIAL_FARMS,
  INITIAL_AI_RECOMMENDATIONS,
  PAN_AFRICAN_COMMODITY_PRICES,
  INITIAL_MARKET_LISTINGS,
  INITIAL_PURCHASE_CONTRACTS,
  FINANCING_PRODUCTS,
  LOGISTICS_ROUTES,
  INITIAL_WAREHOUSES,
  INITIAL_NOTIFICATIONS,
  INITIAL_FARMER_DOCUMENTS,
  INITIAL_SOIL_NODES,
  INITIAL_SOIL_ALERTS,
} from "../data/mockData";

export interface DataConsentSettings {
  shareWithFinancialInstitutions: boolean;
  shareWithGovernmentPolicy: boolean;
  shareWithMarketplaceBuyers: boolean;
  allowSatelliteNdviAnalysis: boolean;
  shareWithLenders?: boolean;
  shareWithBuyers?: boolean;
  shareWithGovernment?: boolean;
  shareSatelliteNDVI?: boolean;
  retentionMonths: number;
}

interface AppContextType {
  // Navigation & Personas
  currentView: string;
  setCurrentView: (view: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  experienceLevel: ExperienceLevel;
  setExperienceLevel: (level: ExperienceLevel) => void;
  selectedCountry: CountryConfig;
  setSelectedCountry: (country: CountryConfig) => void;

  // Farm Data
  farms: Farm[];
  currentFarm: Farm;
  setCurrentFarm: (farm: Farm) => void;
  updateFarmFieldHealth: (farmId: string, fieldId: string, status: string) => void;

  // Agronomic Recommendations
  recommendations: AIRecommendation[];
  applyRecommendation: (id: string) => void;

  // Markets & Contracts
  commodityPrices: CommodityPrice[];
  marketListings: MarketListing[];
  addMarketListing: (listing: Omit<MarketListing, "id" | "verified">) => void;
  purchaseContracts: PurchaseContract[];
  addPurchaseContract: (contract: Omit<PurchaseContract, "id" | "status" | "contractNumber">) => void;

  // Finance & Logistics
  financingProducts: FinancingProduct[];
  logisticsRoutes: LogisticsRoute[];
  warehouses: Warehouse[];

  // Offline & Sync
  isOffline: boolean;
  toggleOfflineMode: () => void;
  syncQueue: SyncQueueItem[];
  triggerManualSync: () => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  unreadNotificationCount: number;

  // Modals & Drawers
  isCropDoctorOpen: boolean;
  setIsCropDoctorOpen: (open: boolean) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  isUssdModalOpen: boolean;
  setIsUssdModalOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isMenuHidden: boolean;
  setIsMenuHidden: (hidden: boolean) => void;
  toggleMenu: () => void;

  // Data Consent
  dataConsent: DataConsentSettings;
  updateDataConsent: (settings: Partial<DataConsentSettings>) => void;
  consentSettings: DataConsentSettings;
  toggleConsent: (key: keyof DataConsentSettings) => void;

  // Trigger Simulation
  triggerEventSimulation: (eventName: "soil_drought" | "rain_incoming" | "buyer_surge" | "price_rally") => void;

  // Digital Document Repository
  farmerDocuments: FarmerDocument[];
  addFarmerDocument: (doc: Omit<FarmerDocument, "id" | "uploadDate" | "sha256Hash">) => void;
  deleteFarmerDocument: (id: string) => void;
  shareFarmerDocument: (id: string, entityName: string) => void;

  // Soil Moisture & Nutrient Telemetry Sensors
  soilSensorNodes: SoilSensorNode[];
  updateSoilNodeMoisture: (nodeId: string, depthIndex: number, newMoisture: number) => void;
  triggerIrrigationValve: (nodeId: string) => void;
  soilAlerts: SensorTelemetryAlert[];
  dismissSoilAlert: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<string>("landing");
  const [userRole, setUserRole] = useState<UserRole>("farmer");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("simple");
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(AFRICAN_COUNTRIES[0]); // South Africa

  const [farms, setFarms] = useState<Farm[]>(INITIAL_FARMS);
  const [currentFarm, setCurrentFarm] = useState<Farm>(INITIAL_FARMS[0]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(INITIAL_AI_RECOMMENDATIONS);

  const [commodityPrices] = useState<CommodityPrice[]>(PAN_AFRICAN_COMMODITY_PRICES);
  const [marketListings, setMarketListings] = useState<MarketListing[]>(INITIAL_MARKET_LISTINGS);
  const [purchaseContracts, setPurchaseContracts] = useState<PurchaseContract[]>(INITIAL_PURCHASE_CONTRACTS);

  // Digital Document Repository State
  const [farmerDocuments, setFarmerDocuments] = useState<FarmerDocument[]>(INITIAL_FARMER_DOCUMENTS);

  // Soil Sensor Telemetry State
  const [soilSensorNodes, setSoilSensorNodes] = useState<SoilSensorNode[]>(INITIAL_SOIL_NODES);
  const [soilAlerts, setSoilAlerts] = useState<SensorTelemetryAlert[]>(INITIAL_SOIL_ALERTS);

  const [financingProducts] = useState<FinancingProduct[]>(FINANCING_PRODUCTS);
  const [logisticsRoutes] = useState<LogisticsRoute[]>(LOGISTICS_ROUTES);
  const [warehouses] = useState<Warehouse[]>(INITIAL_WAREHOUSES);

  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Modals
  const [isCropDoctorOpen, setIsCropDoctorOpenState] = useState<boolean>(false);
  const setIsCropDoctorOpen = (open: boolean) => {
    setIsCropDoctorOpenState(open);
    if (open) {
      setCurrentView("crop_doctor");
    }
  };
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isUssdModalOpen, setIsUssdModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);
  const [isMenuHidden, setIsMenuHidden] = useState<boolean>(false);
  const toggleMenu = () => setIsMenuHidden((prev) => !prev);

  // Consent
  const [dataConsent, setDataConsent] = useState<DataConsentSettings>({
    shareWithFinancialInstitutions: true,
    shareWithGovernmentPolicy: false,
    shareWithMarketplaceBuyers: true,
    allowSatelliteNdviAnalysis: true,
    shareWithLenders: true,
    shareWithBuyers: true,
    shareWithGovernment: false,
    shareSatelliteNDVI: true,
    retentionMonths: 24,
  });

  // Sync role to experience level automatically
  useEffect(() => {
    if (userRole === "farmer") {
      setExperienceLevel("simple");
    } else if (userRole === "agribusiness" || userRole === "buyer" || userRole === "logistics" || userRole === "cooperative") {
      setExperienceLevel("professional");
    } else if (userRole === "government" || userRole === "researcher" || userRole === "superadmin") {
      setExperienceLevel("intelligence");
    }
  }, [userRole]);

  const toggleOfflineMode = () => {
    setIsOffline((prev) => {
      const next = !prev;
      if (!next && syncQueue.length > 0) {
        // Auto-synced
        triggerManualSync();
      }
      return next;
    });
  };

  const triggerManualSync = () => {
    setSyncQueue((queue) =>
      queue.map((item) => ({ ...item, status: "synced" }))
    );
    setTimeout(() => {
      setSyncQueue([]);
    }, 2500);
  };

  const applyRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, applied: true } : rec))
    );
    if (isOffline) {
      setSyncQueue((q) => [
        ...q,
        {
          id: `sync-${Date.now()}`,
          action: "Applied Recommendation",
          entity: id,
          timestamp: new Date().toLocaleTimeString(),
          status: "pending",
        },
      ]);
    }
  };

  const updateFarmFieldHealth = (farmId: string, fieldId: string, status: string) => {
    setFarms((prev) =>
      prev.map((f) => {
        if (f.id === farmId) {
          return {
            ...f,
            fields: f.fields.map((fld) =>
              fld.id === fieldId ? { ...fld, health: status as any } : fld
            ),
          };
        }
        return f;
      })
    );
  };

  const addMarketListing = (listing: Omit<MarketListing, "id" | "verified">) => {
    const newListing: MarketListing = {
      ...listing,
      id: `list-${Date.now()}`,
      verified: true,
    };
    setMarketListings((prev) => [newListing, ...prev]);
    if (isOffline) {
      setSyncQueue((q) => [
        ...q,
        {
          id: `sync-${Date.now()}`,
          action: "New Produce Market Listing",
          entity: listing.commodity,
          timestamp: new Date().toLocaleTimeString(),
          status: "pending",
        },
      ]);
    }
  };

  const addPurchaseContract = (contract: Omit<PurchaseContract, "id" | "status" | "contractNumber">) => {
    const newContract: PurchaseContract = {
      ...contract,
      id: `contract-${Date.now()}`,
      contractNumber: `AGRI-CTR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Under Review",
    };
    setPurchaseContracts((prev) => [newContract, ...prev]);
  };

  // Farmer Document Repository Actions
  const addFarmerDocument = (doc: Omit<FarmerDocument, "id" | "uploadDate" | "sha256Hash">) => {
    const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const newDoc: FarmerDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().slice(0, 10),
      sha256Hash: randomHex,
    };
    setFarmerDocuments((prev) => [newDoc, ...prev]);
    if (isOffline) {
      setSyncQueue((q) => [
        ...q,
        {
          id: `sync-${Date.now()}`,
          action: "Vaulted Digital Document",
          entity: newDoc.title,
          timestamp: new Date().toLocaleTimeString(),
          status: "pending",
        },
      ]);
    }
  };

  const deleteFarmerDocument = (id: string) => {
    setFarmerDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const shareFarmerDocument = (id: string, entityName: string) => {
    setFarmerDocuments((prev) =>
      prev.map((d) => {
        if (d.id === id && !d.sharedWith.includes(entityName)) {
          return { ...d, sharedWith: [...d.sharedWith, entityName] };
        }
        return d;
      })
    );
  };

  // Soil Telemetry Actions
  const updateSoilNodeMoisture = (nodeId: string, depthIndex: number, newMoisture: number) => {
    setSoilSensorNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === nodeId) {
          const newDepths = [...node.depths];
          if (newDepths[depthIndex]) {
            newDepths[depthIndex] = {
              ...newDepths[depthIndex],
              moisturePct: newMoisture,
              status: newMoisture < 30 ? "Deficit" : newMoisture > 52 ? "Waterlogged" : "Optimal",
            };
          }
          return { ...node, depths: newDepths, lastPingSeconds: 2 };
        }
        return node;
      })
    );
  };

  const triggerIrrigationValve = (nodeId: string) => {
    setSoilSensorNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === nodeId) {
          const isActive = !node.activeIrrigationValve;
          const updatedDepths = node.depths.map((d) => {
            const nextVal = isActive ? Math.min(52, d.moisturePct + 14) : d.moisturePct;
            return {
              ...d,
              moisturePct: nextVal,
              status: (nextVal < 30 ? "Deficit" : "Optimal") as any,
            };
          });
          return {
            ...node,
            activeIrrigationValve: isActive,
            depths: updatedDepths,
            status: "online" as const,
            lastPingSeconds: 1,
          };
        }
        return node;
      })
    );
  };

  const dismissSoilAlert = (id: string) => {
    setSoilAlerts((alerts) => alerts.filter((a) => a.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const updateDataConsent = (settings: Partial<DataConsentSettings>) => {
    setDataConsent((prev) => ({ ...prev, ...settings }));
  };

  const toggleConsent = (key: keyof DataConsentSettings) => {
    setDataConsent((prev) => {
      const currentVal = prev[key];
      if (typeof currentVal === "boolean") {
        return { ...prev, [key]: !currentVal };
      }
      return prev;
    });
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const triggerEventSimulation = (eventName: "soil_drought" | "rain_incoming" | "buyer_surge" | "price_rally") => {
    if (eventName === "soil_drought") {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: "urgent",
        title: "Soil Moisture Critical Alert",
        message: "Center-pivot telemetry in Field 03 fell below 25%. Vegetative stress warning triggered.",
        timestamp: "Just now",
        read: false,
        actionLabel: "View Field 03",
        targetView: "farms",
      };
      setNotifications((n) => [newNotif, ...n]);
      // Update field 3
      updateFarmFieldHealth(currentFarm.id, "field-03", "Critical");
    } else if (eventName === "rain_incoming") {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: "important",
        title: "Weather Alert: Free State Convective Storm",
        message: "High-resolution Doppler radar detects front with 45mm precipitation in 18 hours.",
        timestamp: "Just now",
        read: false,
        actionLabel: "View Radar",
        targetView: "climate",
      };
      setNotifications((n) => [newNotif, ...n]);
    } else if (eventName === "buyer_surge") {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: "opportunity",
        title: "Market Opportunity: 2,500 MT Grain Tender",
        message: "East African Grain Council published verified spot tender at +9.2% premium.",
        timestamp: "Just now",
        read: false,
        actionLabel: "Bid on Tender",
        targetView: "marketplace",
      };
      setNotifications((n) => [newNotif, ...n]);
    } else if (eventName === "price_rally") {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: "financial",
        title: "Commodity Alert: Regional Maize Price +7.4%",
        message: "SAFEX spot rates breached R5,550/MT due to low harvest inventory carryover.",
        timestamp: "Just now",
        read: false,
        actionLabel: "Lock Forward Price",
        targetView: "marketplace",
      };
      setNotifications((n) => [newNotif, ...n]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        userRole,
        setUserRole,
        experienceLevel,
        setExperienceLevel,
        selectedCountry,
        setSelectedCountry,
        farms,
        currentFarm,
        setCurrentFarm,
        updateFarmFieldHealth,
        recommendations,
        applyRecommendation,
        commodityPrices,
        marketListings,
        addMarketListing,
        purchaseContracts,
        addPurchaseContract,
        financingProducts,
        logisticsRoutes,
        warehouses,
        isOffline,
        toggleOfflineMode,
        syncQueue,
        triggerManualSync,
        notifications,
        markNotificationAsRead,
        unreadNotificationCount,
        isCropDoctorOpen,
        setIsCropDoctorOpen,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        isUssdModalOpen,
        setIsUssdModalOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isCopilotOpen,
        setIsCopilotOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isMenuHidden,
        setIsMenuHidden,
        toggleMenu,
        dataConsent,
        updateDataConsent,
        consentSettings: dataConsent,
        toggleConsent,
        triggerEventSimulation,
        farmerDocuments,
        addFarmerDocument,
        deleteFarmerDocument,
        shareFarmerDocument,
        soilSensorNodes,
        updateSoilNodeMoisture,
        triggerIrrigationValve,
        soilAlerts,
        dismissSoilAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
