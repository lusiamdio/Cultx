import React, { useEffect, useState } from "react";
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
import { HomeCommandCenter } from "./components/dashboard/HomeCommandCenter";
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
import { WebsiteFooter } from "./components/common/WebsiteFooter";
import { BiometricAuthModal } from "./components/common/BiometricAuthModal";
import { canAccessView } from "./auth/access";

const AppContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isUssdModalOpen,
    setIsUssdModalOpen,
    isMenuHidden,
    isBiometricModalOpen,
    setIsBiometricModalOpen,
    setIsSensitiveDataLocked,
    userRole,
  } = useApp();

  const allowedViews: Record<string, string[]> = {
    government: ["government", "superadmin"], admin: ["superadmin"], cooperative: ["cooperative"], agribusiness: ["agribusiness"],
    finance: ["finance", "agribusiness"], logistics: ["logistics", "agribusiness"], marketplace: ["farmer", "buyer", "agribusiness", "cooperative"],
  };

  const renderActiveView = () => {

      return <section className="rounded-2xl border border-[#1D2A32] bg-[#10171B] p-8 text-center"><h1 className="text-xl font-bold">Unauthorized</h1><p className="mt-2 text-slate-400">Your authenticated role is not allowed to open this workspace.</p></section>;
    }
    switch (currentView) {
      case "landing":
        return <LandingPage />;
      case "dashboard":
      case "home":
        return <HomeCommandCenter />;
      case "farms":
      case "farmer":
      case "farmers":
        return <FarmerDashboard />;
      case "farm_twin":
      case "farm-twin":
        return <FarmTwinView />;
      case "precision_ag":
      case "precision":
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
        return <HomeCommandCenter />;
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
        <BiometricAuthModal
          isOpen={isBiometricModalOpen}
          onClose={() => setIsBiometricModalOpen(false)}
          onSuccess={() => setIsSensitiveDataLocked(false)}
        />
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
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-7 max-w-7xl mx-auto w-full flex flex-col justify-between">
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

          {/* Persistent World-Class Footer */}
          <div className="mt-14 -mx-3 sm:-mx-5 lg:-mx-7">
            <WebsiteFooter />
          </div>
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
      <BiometricAuthModal
        isOpen={isBiometricModalOpen}
        onClose={() => setIsBiometricModalOpen(false)}
        onSuccess={() => setIsSensitiveDataLocked(false)}
      />
    </div>
  );
};

type SessionUser = { email: string; roles: string[] };
const roleToUiRole: Record<string, import("./types").UserRole> = {
  farmer: "farmer", cooperative_admin: "cooperative", buyer: "buyer", government_officer: "government", platform_admin: "superadmin",
};

const SignIn: React.FC<{ onAuthenticated: (user: SessionUser) => void }> = ({ onAuthenticated }) => {

};

export default function App() {
  const [user, setUser] = useState<SessionUser | null>(null); const [checked, setChecked] = useState(false);
  useEffect(() => { fetch("/api/auth/me", { credentials: "same-origin" }).then((response) => response.ok ? response.json() : null).then((data) => setUser(data?.user || null)).finally(() => setChecked(true)); }, []);

  if (!checked) return <main className="min-h-screen bg-[#090D0F] text-slate-300 grid place-items-center">Checking secure session…</main>;
  if (!user) return <SignIn onAuthenticated={setUser} />;
  const initialRole = roleToUiRole[user.roles[0]] || "farmer";
  return (
    <AppProvider initialRole={initialRole}>
      <AppContent />
    </AppProvider>
  );
}
