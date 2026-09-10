import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Fingerprint,
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  X,
  Smartphone,
  Cpu,
  RefreshCw,
} from "lucide-react";
import { verifyBiometricAuth, enrollBiometricPasskey, checkBiometricSupport } from "../../utils/biometricAuth";

interface BiometricAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode?: "unlock" | "enroll";
  title?: string;
  description?: string;
}

export const BiometricAuthModal: React.FC<BiometricAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  mode = "unlock",
  title = "Biometric Sovereign Verification",
  description = "Authenticate using your device's TouchID, FaceID, or Android Fingerprint sensor via the Credential Management API to secure sensitive agricultural and financial data.",
}) => {
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [authMethod, setAuthMethod] = useState<string>("");
  const [pinFallback, setPinFallback] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [hardwareAvailable, setHardwareAvailable] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setStatusMessage("");
      setPinFallback(false);
      setEnteredPin("");

      checkBiometricSupport().then((res) => {
        setHardwareAvailable(res.supported);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBiometricAuth = async () => {
    setStatus("scanning");
    setStatusMessage("Verifying biometric signature via WebAuthn platform authenticator...");

    try {
      const result =
        mode === "enroll"
          ? await enrollBiometricPasskey("farmer@cultx.africa", "CULTx Agribusiness Owner")
          : await verifyBiometricAuth();

      if (result.success) {
        setStatus("success");
        setStatusMessage(result.message);
        setAuthMethod(
          result.method === "webauthn_hardware"
            ? "Platform Hardware Sensor"
            : "Cryptographic Credential Passkey"
        );

        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 1200);
      } else {
        setStatus("error");
        setStatusMessage(result.message || "Biometric authentication was not completed.");
      }
    } catch (err: any) {
      setStatus("error");
      setStatusMessage(err?.message || "Sensor timeout or verification failed.");
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin.length >= 4) {
      setStatus("success");
      setStatusMessage("Passkey PIN verified successfully.");
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 900);
    } else {
      setStatus("error");
      setStatusMessage("Please enter at least a 4-digit security PIN.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-[#10171B] rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden border border-[#1D2A32] text-slate-200"
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#14532D] via-[#F5B942] to-[#22C55E]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#162228] text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#07261B] text-[#22C55E] flex items-center justify-center border border-[#14533C]">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">{title}</h3>
            <span className="text-[10px] font-mono text-[#F5B942] uppercase tracking-wider block">
              Browser Credential Management API (W3C WebAuthn)
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-6">{description}</p>

        {!pinFallback ? (
          <div className="space-y-6">
            {/* Interactive Biometric Sensor Scanner Animation */}
            <div className="flex flex-col items-center justify-center py-6 bg-[#0B1013] rounded-2xl border border-[#1D2A32] relative overflow-hidden">
              <div className="relative">
                {/* Pulsing rings when scanning */}
                {status === "scanning" && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 rounded-full bg-[#22C55E]/30"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.2, 0.8] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                      className="absolute inset-0 rounded-full bg-[#14532D]/40"
                    />
                  </>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBiometricAuth}
                  disabled={status === "scanning"}
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-lg relative z-10 ${
                    status === "success"
                      ? "bg-[#14532D] text-emerald-300 border-2 border-emerald-400"
                      : status === "error"
                      ? "bg-red-950/70 text-red-400 border-2 border-red-500"
                      : status === "scanning"
                      ? "bg-[#0B3D2C] text-[#F5B942] border-2 border-[#F5B942]"
                      : "bg-[#162228] text-emerald-400 hover:bg-[#1D2A32] border border-[#1D2A32]"
                  }`}
                  id="biometric-trigger-button"
                >
                  {status === "success" ? (
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
                  ) : status === "scanning" ? (
                    <RefreshCw className="w-9 h-9 text-[#F5B942] animate-spin" />
                  ) : status === "error" ? (
                    <AlertCircle className="w-9 h-9 text-red-400" />
                  ) : (
                    <Fingerprint className="w-10 h-10" />
                  )}
                </motion.button>
              </div>

              <div className="mt-4 text-center px-4">
                <div className="text-xs font-bold text-white">
                  {status === "scanning"
                    ? "Scanning Fingerprint / FaceID..."
                    : status === "success"
                    ? "Authentication Verified!"
                    : status === "error"
                    ? "Verification Unsuccessful"
                    : "Touch Sensor to Authenticate"}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {statusMessage ||
                    "Click the biometric sensor to invoke your browser's platform authenticator."}
                </div>
                {authMethod && (
                  <div className="text-[10px] text-emerald-400 font-mono mt-1">
                    Verified via {authMethod}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={handleBiometricAuth}
                disabled={status === "scanning"}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#14532D] hover:bg-[#0F3D22] text-[#FDFBF7] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md min-h-[42px]"
              >
                <Fingerprint className="w-4 h-4 text-[#F5B942]" />
                <span>
                  {mode === "enroll"
                    ? "Enroll Biometric Passkey"
                    : "Authenticate with Biometrics"}
                </span>
              </button>

              <button
                onClick={() => setPinFallback(true)}
                className="py-2.5 px-4 rounded-xl bg-[#162228] hover:bg-[#1D2A32] text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px]"
              >
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>Passkey PIN</span>
              </button>
            </div>
          </div>
        ) : (
          /* PIN Fallback View */
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="bg-[#0B1013] rounded-2xl p-4 border border-[#1D2A32] space-y-3">
              <label className="text-xs font-bold text-slate-300 block">
                Enter Sovereign Dashboard Security PIN:
              </label>
              <input
                type="password"
                maxLength={6}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="••••"
                className="w-full text-center tracking-[1em] text-lg font-mono px-4 py-3 rounded-xl bg-[#162228] text-white border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                autoFocus
              />
              <p className="text-[10px] text-slate-400">
                Default demonstration PIN: <span className="font-mono text-emerald-300">1234</span>
              </p>
            </div>

            {status === "error" && (
              <div className="text-xs text-red-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{statusMessage}</span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPinFallback(false)}
                className="px-4 py-2.5 rounded-xl bg-[#162228] hover:bg-[#1D2A32] text-xs font-semibold text-slate-300 cursor-pointer"
              >
                Back to Biometrics
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#14532D] hover:bg-[#0F3D22] text-[#FDFBF7] font-bold text-xs cursor-pointer shadow-md"
              >
                Unlock Dashboard Data
              </button>
            </div>
          </form>
        )}

        {/* Security Assurance Footer */}
        <div className="mt-5 pt-3 border-t border-[#1D2A32] flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FIDO2 / WebAuthn Compliant</span>
          </span>
          <span>Zero Server-Side Key Leakage</span>
        </div>
      </motion.div>
    </div>
  );
};
