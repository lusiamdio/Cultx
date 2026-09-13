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
import { supabase } from "../lib/supabase";

const EMPTY_FARM: Farm = { id: "", name: "", ownerName: "", country: "", region: "", totalHectares: 0, primaryCrop: "", overallHealthScore: 0, soilHealth: 0, cropHealth: 0, waterIndex: 0, weatherRisk: 0, pestRisk: 0, expectedYieldTonnesPerHa: 0, fields: [], sensorsOnline: 0, lastSatellitePass: "No satellite data", verifiedStatus: "unverified", trustScore: 0 };

const VIEW_ALIASES: Record<string, string> = {
  landing: "landing", dashboard: "dashboard", home: "home", farms: "farms", farmer: "farmer", farmers: "farmers",
  "farm-twin": "farm-twin", farm_twin: "farm_twin", precision: "precision", precision_ag: "precision_ag",
  "crop-doctor": "crop-doctor", crop_doctor: "crop_doctor", marketplace: "marketplace", finance: "finance",
  logistics: "logistics", climate: "climate", trade: "trade", government: "government", cooperative: "cooperative",
  agribusiness: "agribusiness", consent: "consent", admin: "admin",
};

const getViewFromLocation = () => {
  if (typeof window === "undefined") return "landing";
  return VIEW_ALIASES[window.location.hash.replace(/^#\/?/, "").toLowerCase()] || "landing";
};

const readPersistedSyncQueue = (): SyncQueueItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const value = window.localStorage.getItem("cultx-sync-queue");
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
};


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
  addNotification: (notif: Omit<NotificationItem, "id"> | NotificationItem) => void;

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

  // Biometric Sovereign Security
  isBiometricModalOpen: boolean;
  setIsBiometricModalOpen: (open: boolean) => void;
  isSensitiveDataLocked: boolean;
  setIsSensitiveDataLocked: (locked: boolean) => void;
  toggleSensitiveDataLock: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode; initialRole?: UserRole }> = ({ children, initialRole = "farmer" }) => {
  const [currentView, setCurrentViewState] = useState<string>(getViewFromLocation);
  // The role originates from the authenticated server session. UI controls never grant access.
  const [userRole, setUserRole] = useState<UserRole>(initialRole);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("simple");
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(AFRICAN_COUNTRIES[0]); // South Africa

  const [farms, setFarms] = useState<Farm[]>([]);
  const [currentFarm, setCurrentFarm] = useState<Farm>(EMPTY_FARM);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);

  const [commodityPrices, setCommodityPrices] = useState<CommodityPrice[]>([]);
  const [marketListings, setMarketListings] = useState<MarketListing[]>([]);
  const [purchaseContracts, setPurchaseContracts] = useState<PurchaseContract[]>([]);

  // Digital Document Repository State
  const [farmerDocuments, setFarmerDocuments] = useState<FarmerDocument[]>([]);

  // Soil Sensor Telemetry State
  const [soilSensorNodes, setSoilSensorNodes] = useState<SoilSensorNode[]>([]);
  const [soilAlerts, setSoilAlerts] = useState<SensorTelemetryAlert[]>([]);

  const [financingProducts] = useState<FinancingProduct[]>([]);
  const [logisticsRoutes] = useState<LogisticsRoute[]>([]);
  const [warehouses] = useState<Warehouse[]>([]);

  const [isOffline, setIsOffline] = useState<boolean>(() => typeof navigator !== "undefined" && !navigator.onLine);
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(readPersistedSyncQueue);

  // Persist only the client-side offline queue; server mutations still require authorization on reconnect.
  useEffect(() => {
    try {
      window.localStorage.setItem("cultx-sync-queue", JSON.stringify(syncQueue));
    } catch {
      // Storage may be unavailable in private browsing; the in-memory queue remains usable.
    }
  }, [syncQueue]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [workspaceReady, setWorkspaceReady] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.getWorkspace().then((workspace) => {
      if (!active || !workspace) return;
      const data = workspace as Partial<{ farms: Farm[]; recommendations: AIRecommendation[]; commodityPrices: CommodityPrice[]; marketListings: MarketListing[]; purchaseContracts: PurchaseContract[]; farmerDocuments: FarmerDocument[]; soilSensorNodes: SoilSensorNode[]; soilAlerts: SensorTelemetryAlert[]; notifications: NotificationItem[] }>;
      if (data.farms) { setFarms(data.farms); setCurrentFarm(data.farms[0] || EMPTY_FARM); }
      if (data.recommendations) setRecommendations(data.recommendations);
      if (data.commodityPrices) setCommodityPrices(data.commodityPrices);
      if (data.marketListings) setMarketListings(data.marketListings);
      if (data.purchaseContracts) setPurchaseContracts(data.purchaseContracts);
      if (data.farmerDocuments) setFarmerDocuments(data.farmerDocuments);
      if (data.soilSensorNodes) setSoilSensorNodes(data.soilSensorNodes);
      if (data.soilAlerts) setSoilAlerts(data.soilAlerts);
      if (data.notifications) setNotifications(data.notifications);
    }).finally(() => active && setWorkspaceReady(true));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!workspaceReady) return;
    const save = window.setTimeout(() => {
      supabase.saveWorkspace({ farms, recommendations, commodityPrices, marketListings, purchaseContracts, farmerDocuments, soilSensorNodes, soilAlerts, notifications }).catch((error) => console.error("Workspace sync failed", error));
    }, 500);
    return () => window.clearTimeout(save);
  }, [workspaceReady, farms, recommendations, commodityPrices, marketListings, purchaseContracts, farmerDocuments, soilSensorNodes, soilAlerts, notifications]);

  useEffect(() => {
    const userId = supabase.getSession()?.user.id;
    if (!userId) return;
    return supabase.subscribeToNotifications(userId, (record) => {
      const notification = record as { id: string; type: NotificationItem["type"]; title: string; message: string; action_label?: string; target_view?: string; read: boolean; created_at: string };
      setNotifications((previous) => [{ id: notification.id, type: notification.type, title: notification.title, message: notification.message, actionLabel: notification.action_label, targetView: notification.target_view, read: notification.read, timestamp: new Date(notification.created_at).toLocaleTimeString() }, ...previous]);
    });
  }, []);

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

  // Keep views addressable and make browser history match in-product navigation.
  const setCurrentView = (view: string) => {
    const nextView = VIEW_ALIASES[view] || "dashboard";
    setCurrentViewState(nextView);
    if (typeof window !== "undefined" && window.location.hash !== `#${nextView}`) {
      window.history.pushState({ view: nextView }, "", `#${nextView}`);
    }
  };

  useEffect(() => {
    const handleHistoryNavigation = () => setCurrentViewState(getViewFromLocation());
    window.addEventListener("popstate", handleHistoryNavigation);
    window.addEventListener("hashchange", handleHistoryNavigation);
    return () => {
      window.removeEventListener("popstate", handleHistoryNavigation);
      window.removeEventListener("hashchange", handleHistoryNavigation);
    };
  }, []);


  // Biometric Sovereign Security
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState<boolean>(false);
  const [isSensitiveDataLocked, setIsSensitiveDataLocked] = useState<boolean>(false);
  const toggleSensitiveDataLock = () => setIsSensitiveDataLocked((prev) => !prev);

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
    if (isOffline || typeof navigator !== "undefined" && !navigator.onLine) return;
    setSyncQueue((queue) => queue.map((item) => ({ ...item, status: "syncing" })));
    setTimeout(() => {
      // Local state mutations are already applied. This marks their durable client
      // queue as reconciled until a remote mutation service is configured.
      setSyncQueue((queue) => queue.map((item) => ({ ...item, status: "synced" })));
      setTimeout(() => setSyncQueue([]), 600);
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

  const addNotification = (notif: Omit<NotificationItem, "id"> | NotificationItem) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: "id" in notif ? notif.id : `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setNotifications((prev) => [newNotif, ...prev]);
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
        addNotification,
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
        isBiometricModalOpen,
        setIsBiometricModalOpen,
        isSensitiveDataLocked,
        setIsSensitiveDataLocked,
        toggleSensitiveDataLock,
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
