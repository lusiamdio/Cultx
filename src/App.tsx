import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/common/Header";
import { Sidebar } from "./components/common/Sidebar";
import { MobileNav } from "./components/common/MobileNav";
import { GlobalSearchModal } from "./components/common/GlobalSearchModal";
import { VoiceModal } from "./components/common/VoiceModal";
import { UssdSimulatorModal } from "./components/common/UssdSimulatorModal";
import { NotificationDrawer } from "./components/common/NotificationDrawer";
import { OfflineSyncBanner } from "./components/common/OfflineSyncBanner";
import { ProgressiveOnboarding } from "./components/onboarding/ProgressiveOnboarding";
import { LiveMarketTicker } from "./components/common/LiveMarketTicker";

// Feature Views
import { LandingPage } from "./components/landing/LandingPage";
import { FarmerDashboard } from "./components/dashboard/FarmerDashboard";
import { FarmTwinView } from "./components/farms/FarmTwinView";
import { PrecisionAgriView } from "./components/farms/PrecisionAgriView";
import { ClimateDashboard } from "./components/climate/ClimateDashboard";
import { MarketplaceView } from "./components/marketplace/MarketplaceView";
import { FinanceView } from "./components/finance/FinanceView";
import { LogisticsView } from "./components/logistics/LogisticsView";
import { ExportTradeView } from "./components/trade/ExportTradeView";
import { GovernmentView } from "./components/government/GovernmentView";
import { CooperativeView } from "./components/cooperative/CooperativeView";
import { AgribusinessView } from "./components/agribusiness/AgribusinessView";
import { DataConsentView } from "./components/consent/DataConsentView";
import { SuperAdminView } from "./components/admin/SuperAdminView";

// Advisory & Diagnostic Assistants
import { CropDoctorView } from "./components/copilot/CropDoctorView";
import { FloatingAICopilot } from "./components/copilot/FloatingAICopilot";

const AppContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isUssdModalOpen,
    setIsUssdModalOpen,
    isMenuHidden,
  } = useApp();

  const renderActiveView = () => {
    switch (currentView) {
      case "landing":
        return <LandingPage />;
      case "dashboard":
        return <FarmerDashboard />;
      case "farm_twin":
        return <FarmTwinView />;
      case "precision_ag":
        return <PrecisionAgriView />;
      case "crop_doctor":
      case "crop-doctor":
        return <CropDoctorView />;
      case "marketplace":
        return <MarketplaceView />;
      case "finance":
        return <FinanceView />;
      case "logistics":
        return <LogisticsView />;
      case "climate":
        return <ClimateDashboard />;
      case "trade":
        return <ExportTradeView />;
      case "government":
        return <GovernmentView />;
      case "cooperative":
        return <CooperativeView />;
      case "agribusiness":
        return <AgribusinessView />;
      case "consent":
        return <DataConsentView />;
      case "admin":
        return <SuperAdminView />;
      default:
        return <FarmerDashboard />;
    }
  };

  // When on Landing view, render full landing experience without standard app shell
  if (currentView === "landing") {
    return (
      <div className="min-h-screen bg-[#090D0F] text-slate-100 font-sans selection:bg-emerald-600 selection:text-white">
        <OfflineSyncBanner />
        <LandingPage />
        <GlobalSearchModal />
        <VoiceModal />
        <UssdSimulatorModal isOpen={isUssdModalOpen} onClose={() => setIsUssdModalOpen(false)} />
        <FloatingAICopilot />
        <ProgressiveOnboarding />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090D0F] text-slate-100 font-sans flex flex-col selection:bg-emerald-600 selection:text-white pb-16 lg:pb-0">
      {/* Offline Connectivity Banner */}
      <OfflineSyncBanner />

      {/* Global Application Header */}
      <Header />

      {/* Real-Time Commodity & Telemetry Marquee */}
      <LiveMarketTicker />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        {!isMenuHidden && <Sidebar />}

        {/* Primary Operational Viewport with Fluid Motion Transitions */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-7 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{
                duration: 0.28,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* Global Modals & Advisory Assistants */}
      <GlobalSearchModal />
      <VoiceModal />
      <UssdSimulatorModal isOpen={isUssdModalOpen} onClose={() => setIsUssdModalOpen(false)} />
      <FloatingAICopilot />
      <NotificationDrawer />
      <ProgressiveOnboarding />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
