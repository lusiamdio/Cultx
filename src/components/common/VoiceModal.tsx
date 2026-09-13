import React, { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, X, Languages, Check, RefreshCw } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { postJson } from "../../utils/apiClient";

export const VoiceModal: React.FC = () => {
  const { isVoiceModalOpen, setIsVoiceModalOpen, currentFarm } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [transcript, setTranscript] = useState("");
  const [aiVoiceResponse, setAiVoiceResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const AFRICAN_LANGUAGES = [
    { code: "en", name: "English", native: "English", voiceTag: "en-US" },
    { code: "sw", name: "Swahili", native: "Kiswahili", voiceTag: "sw-KE" },
    { code: "am", name: "Amharic", native: "አማርኛ", voiceTag: "am-ET" },
    { code: "ha", name: "Hausa", native: "Harshen Hausa", voiceTag: "ha-NG" },
    { code: "yo", name: "Yoruba", native: "Èdè Yorùbá", voiceTag: "yo-NG" },
    { code: "zu", name: "Zulu", native: "isiZulu", voiceTag: "zu-ZA" },
    { code: "fr", name: "French", native: "Français", voiceTag: "fr-FR" },
    { code: "ar", name: "Arabic", native: "العربية", voiceTag: "ar-EG" },
    { code: "pt", name: "Portuguese", native: "Português", voiceTag: "pt-MZ" },
  ];


  // Stop any speech synthesis on unmount or close
  useEffect(() => {
    if (!isVoiceModalOpen && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isVoiceModalOpen]);

  if (!isVoiceModalOpen) return null;

  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[*#_`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSendVoiceQuery = async (queryText: string) => {
    setTranscript(queryText);
    setIsListening(false);
    setIsLoading(true);

    try {
      const data = await postJson<{ answer?: string }>("/api/gemini/copilot", {
        query: queryText,
        farmContext: {
          farmName: currentFarm.name,
          crop: currentFarm.primaryCrop,
          hectares: currentFarm.totalHectares,
          healthScore: currentFarm.overallHealthScore,
          soilMoistureField03: "28% (Critical)",
          rainForecast72h: "32-48mm (78% probability)",
        },
        language: selectedLanguage,
      });
      if (data.answer) {
        setAiVoiceResponse(data.answer);
        speakText(data.answer);
      }
    } catch (err) {
      setAiVoiceResponse("The advisory service is unavailable. No generated advice has been substituted.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    // Try webkitSpeechRecognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          setTranscript("Listening to your voice in the field...");
        };

        recognition.onresult = (event: any) => {
          const spoken = event.results[0][0].transcript;
          handleSendVoiceQuery(spoken);
        };

        recognition.onerror = () => {
          setIsListening(false);
          setTranscript("Microphone access was not available. Type your question below instead.");
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch (e) {
        console.warn("Speech recognition error:", e);
      }
    }

    setTranscript("Voice input is not supported by this browser. Type your question below instead.");
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1013]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#10171B] border border-[#1D2A32] rounded-3xl w-full max-w-lg text-white shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-4 flex items-center justify-between bg-[#07261B]">
          <div className="flex items-center gap-3">
            <img
              src="/cultx_logo.png"
              alt="CULTx"
              className="w-8 h-8 rounded-lg object-contain shadow-xs shrink-0"
            />
            <div>
              <div className="font-bold text-sm tracking-wide text-white">CULTx Voice Interface</div>
              <div className="text-[11px] text-slate-300">Hands-free field advisory for low-literacy environments</div>
            </div>
          </div>
          <button
            onClick={() => {
              stopSpeaking();
              setIsVoiceModalOpen(false);
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-[#162228] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* African Language Selector */}
        <div className="px-4 py-2.5 bg-[#0B1013] border-b border-[#1D2A32] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Languages className="w-3.5 h-3.5 text-emerald-300" />
            <span className="font-medium">Language:</span>
          </div>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-[#162228] border border-[#1D2A32] rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {AFRICAN_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.name}>
                {lang.name} ({lang.native})
              </option>
            ))}
          </select>
        </div>

        {/* Center Microphone Orb & Waveform */}
        <div className="p-6 flex flex-col items-center justify-center text-center space-y-5">
          <div className="relative flex items-center justify-center">
            {/* Animated Pulse Rings when listening or speaking */}
            {(isListening || isSpeaking) && (
              <>
                <div className="absolute w-32 h-32 rounded-full bg-[#0B3D2C]/40 animate-ping" />
                <div className="absolute w-24 h-24 rounded-full bg-[#0B3D2C]/50 animate-pulse" />
              </>
            )}

            <button
              onClick={toggleListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-transform active:scale-95 cursor-pointer ${
                isListening
                  ? "bg-red-500 text-white ring-4 ring-red-400/40"
                  : isSpeaking
                  ? "bg-emerald-400 text-slate-950 ring-4 ring-emerald-400/50"
                  : "bg-[#0B3D2C] hover:bg-[#0E4B37] text-white border border-[#196349]"
              }`}
              id="voice-mic-main-orb"
            >
              {isListening ? (
                <MicOff className="w-8 h-8 animate-bounce" />
              ) : isSpeaking ? (
                <Volume2 className="w-8 h-8 animate-pulse" />
              ) : (
                <Mic className="w-8 h-8 text-emerald-300" />
              )}
            </button>
          </div>

          <div>
            <div className="font-semibold text-sm text-white">
              {isListening
                ? "Listening... Speak naturally"
                : isSpeaking
                ? "Speaking Agricultural Advisory..."
                : isLoading
                ? "Synthesizing Agronomic Guidance..."
                : "Tap the microphone and speak"}
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Context grounded: {currentFarm.name} ({currentFarm.primaryCrop})
            </p>
          </div>

          {/* Transcript / Spoken Text Display */}
          {transcript && (
            <div className="w-full bg-[#0B1013] p-3 rounded-xl border border-[#1D2A32] text-xs text-slate-300 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                You asked:
              </span>
              "{transcript}"
            </div>
          )}

          {/* Advisory Response Display */}
          {aiVoiceResponse && (
            <div className="w-full bg-[#07261B] border border-[#14533C] p-3.5 rounded-xl text-left text-xs text-emerald-200 max-h-48 overflow-y-auto space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-300 uppercase tracking-wider border-b border-[#14533C] pb-1">
                <span>
                  Advisory Response
                </span>
                {isSpeaking ? (
                  <button
                    onClick={stopSpeaking}
                    className="flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <VolumeX className="w-3.5 h-3.5" /> Stop Audio
                  </button>
                ) : (
                  <button
                    onClick={() => speakText(aiVoiceResponse)}
                    className="flex items-center gap-1 text-emerald-300 hover:text-white cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Replay
                  </button>
                )}
              </div>
              <div className="leading-relaxed whitespace-pre-line text-slate-200">
                {aiVoiceResponse}
              </div>
            </div>
          )}

          <div className="w-full text-left pt-2 border-t border-[#19262F]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Or type a question:
            </div>
            <div className="flex gap-2"><input value={transcript} onChange={(event) => setTranscript(event.target.value)} placeholder="Ask about your operation" className="min-w-0 flex-1 rounded-lg border border-[#1D2A32] bg-[#162228] px-3 py-2 text-xs text-white" /><button onClick={() => handleSendVoiceQuery(transcript)} disabled={!transcript.trim() || isLoading} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold disabled:opacity-50">Ask</button></div>
          </div>
        </div>
      </div>
    </div>
  );
};
