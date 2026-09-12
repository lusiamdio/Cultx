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
    if (allowedViews[currentView] && !allowedViews[currentView].includes(userRole)) {
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
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [organizationName, setOrganizationName] = useState(""); const [countryCode, setCountryCode] = useState("ZA"); const [role, setRole] = useState("farmer"); const [signup, setSignup] = useState(false); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setBusy(true); setError(""); try { const path = signup ? "/api/auth/register" : "/api/auth/sign-in"; const body = signup ? { email, password, organizationName, countryCode, role } : { email, password }; const response = await fetch(path, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error?.message || "Request failed."); if (signup) { setSignup(false); setError("Account created. Sign in to continue."); } else onAuthenticated(data.user); } catch (reason) { setError(reason instanceof Error ? reason.message : "Request failed."); } finally { setBusy(false); } };
  return <main className="min-h-screen bg-[#090D0F] text-white grid place-items-center p-6"><form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-[#1D2A32] bg-[#10171B] p-7 space-y-5"><div><p className="text-emerald-400 text-sm font-bold">CULTx secure access</p><h1 className="text-2xl font-bold mt-1">{signup ? "Create your organization workspace" : "Sign in to your organization"}</h1><p className="text-sm text-slate-400 mt-2">Roles determine visible tools; the server verifies every permission.</p></div>{signup && <><label className="block text-sm">Organization name<input required value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} className="mt-1 w-full rounded-lg bg-[#090D0F] border border-[#1D2A32] p-3" /></label><div className="grid grid-cols-2 gap-3"><label className="block text-sm">Country code<input required maxLength={2} value={countryCode} onChange={(e) => setCountryCode(e.target.value.toUpperCase())} className="mt-1 w-full rounded-lg bg-[#090D0F] border border-[#1D2A32] p-3" /></label><label className="block text-sm">Workspace role<select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full rounded-lg bg-[#090D0F] border border-[#1D2A32] p-3"><option value="farmer">Farmer</option><option value="buyer">Buyer</option><option value="cooperative_admin">Cooperative admin</option></select></label></div></>}<label className="block text-sm">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg bg-[#090D0F] border border-[#1D2A32] p-3" /></label><label className="block text-sm">Password<input required minLength={12} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg bg-[#090D0F] border border-[#1D2A32] p-3" /></label>{error && <p role="alert" className="text-red-300 text-sm">{error}</p>}<button disabled={busy} className="w-full rounded-lg bg-emerald-600 p-3 font-bold disabled:opacity-50">{busy ? "Working…" : signup ? "Create account" : "Sign in"}</button><button type="button" onClick={() => { setSignup(!signup); setError(""); }} className="w-full text-sm text-emerald-300">{signup ? "Already have an account? Sign in" : "Create a new workspace"}</button></form></main>;
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
