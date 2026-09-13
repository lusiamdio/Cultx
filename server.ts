import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { requireAuth, requireFarmAccess, requireOrganizationAccess, requireRole } from "./server/auth";


dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

type ApiErrorBody = { error: { code: string; message: string; requestId: string } };

const createRequestId = () => `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
const requestTimestamps = new Map<string, number[]>();
const API_RATE_LIMIT = 60;
const API_RATE_WINDOW_MS = 60_000;

app.disable("x-powered-by");
app.use((req, res, next) => {
  const requestId = createRequestId();
  res.locals.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

app.use("/api", (req, res, next) => {
  const clientKey = req.ip || "unknown";
  const now = Date.now();
  const timestamps = (requestTimestamps.get(clientKey) || []).filter((timestamp) => now - timestamp < API_RATE_WINDOW_MS);
  if (timestamps.length >= API_RATE_LIMIT) {
    return res.status(429).json({ error: { code: "RATE_LIMITED", message: "Too many requests. Please try again shortly.", requestId: res.locals.requestId } } satisfies ApiErrorBody);
  }
  timestamps.push(now);
  requestTimestamps.set(clientKey, timestamps);
  next();
});

app.use(express.json({ limit: "25mb" }));
app.use((error: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ error: { code: "INVALID_JSON", message: "Request body must be valid JSON.", requestId: res.locals.requestId } } satisfies ApiErrorBody);
  }
  next(error);
});

const readString = (value: unknown, field: string, maxLength = 10_000): string | null => {
  if (typeof value !== "string" || !value.trim()) return null;
  if (value.length > maxLength) return null;
  return value.trim();
};

const badRequest = (res: express.Response, message: string) =>
  res.status(400).json({ error: { code: "INVALID_REQUEST", message, requestId: res.locals.requestId } } satisfies ApiErrorBody);

// Initialize Gemini SDK with User-Agent header as required
let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    try {
      genAI = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (e) {
      console.warn("Failed to initialize Gemini client:", e);
    }
  }
  return genAI;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "AgriIntel Africa / CULTx Backend",
  });
});

app.get("/api/organizations/:organizationId", requireAuth, (req, res, next) => requireOrganizationAccess(req.params.organizationId)(req, res, next), (req, res) => res.json({ organizationId: req.params.organizationId }));
app.get("/api/farms/:farmId", requireAuth, (req, res, next) => requireFarmAccess(req.params.farmId)(req, res, next), (req, res) => res.json({ farmId: req.params.farmId }));

// 1. AI Agricultural Copilot Endpoint
app.post("/api/gemini/copilot", requireAuth, async (req, res) => {
  const query = readString(req.body?.query, "query", 4_000);
  const farmContext = req.body?.farmContext;
  const language = readString(req.body?.language || "English", "language", 80) || "English";
  const ai = getGeminiClient();

  if (!query) {
    return badRequest(res, "A non-empty query of up to 4,000 characters is required.");
  }

  if (ai) {
    try {
      const prompt = `You are AgriIntel Copilot, the authoritative Pan-African Agricultural Operating System AI advisor.
User Language: ${language}
Context:
${farmContext ? JSON.stringify(farmContext, null, 2) : "General Pan-African farming & agribusiness context"}

Farmer/User Query: "${query}"

Provide an actionable, authoritative, concise response formatted in clear markdown. Include:
1. Direct answer with clear agricultural reasoning.
2. Immediate operational actions (with timeframe or quantitative guidelines e.g. liters/ha, days, kg/ha).
3. Risk or opportunity assessment for African smallholders / commercial growers.
If the language is not English, respond in the requested language (${language}) or provide an English answer with regional terminology.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      return res.json({
        success: true,
        answer: response.text || "No response generated.",
        source: "gemini-3.8-flash",
      });
    } catch (err: any) {
      console.error("Gemini Copilot Error:", err);
      // Fall through to domain fallback
    }
  }

  return res.status(503).json({ error: { code: "AI_UNAVAILABLE", message: "The advisory service is unavailable. No generated advisory has been substituted.", requestId: res.locals.requestId } } satisfies ApiErrorBody);
});

// 2. AI Crop Doctor (Vision & Diagnostic)
app.post("/api/gemini/crop-doctor", requireAuth, async (req, res) => {
  const imageBase64 = req.body.imageBase64 || req.body.imageData || req.body.image;
  const cropType = readString(req.body?.cropType || "Maize", "cropType", 100) || "Maize";
  const symptomsDescription = readString(req.body?.symptomsDescription || "", "symptomsDescription", 4_000) || "";
  const ai = getGeminiClient();

  if (imageBase64 && (typeof imageBase64 !== "string" || imageBase64.length > 20_000_000)) {
    return badRequest(res, "Image data must be a valid image data URL smaller than 15 MB.");
  }

  if (ai && imageBase64) {
    try {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";

      const prompt = `You are AgriIntel Crop Doctor, an expert agronomist specialized in African crops (Maize, Cassava, Cocoa, Coffee, Wheat, Rice, Sorghum, Cowpeas, Vegetables).
Crop examined: ${cropType}
Additional notes: ${symptomsDescription}

Analyze the crop image carefully and return JSON strictly with this structure:
{
  "diseaseName": "Name of disease, pest, or nutrient deficiency",
  "pathogenType": "Fungal | Bacterial | Viral | Pest | Nutrient Deficiency",
  "confidence": 92,
  "severity": "Low | Moderate | Severe | Critical",
  "symptoms": ["Symptom 1", "Symptom 2", "Symptom 3"],
  "recommendedActions": ["Immediate step", "Chemical/biological treatment", "Field management step"],
  "organicAlternatives": ["Eco-friendly remedy"],
  "preventativeMeasures": ["Future rotation/spacing guide"],
  "professionalDisclaimer": "This AI diagnostic provides advisory intelligence. For certified confirmation, consult your local agricultural extension officer or certified agronomist."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: {
          parts: [
            { inlineData: { mimeType, data: base64Data } },
            { text: prompt },
          ],
        },
        config: {
          responseMimeType: "application/json",
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({ success: true, result: parsed, source: "gemini-3.8-flash" });
      }
    } catch (e: any) {
      console.error("Crop Doctor Gemini failed:", e);
    }
  }

  return res.status(503).json({ error: { code: "AI_UNAVAILABLE", message: "The diagnostic service is unavailable. Upload data was not replaced with a generated result.", requestId: res.locals.requestId } } satisfies ApiErrorBody);
});

// 3. Digital Contract Risk Audit
app.post("/api/gemini/contract-audit", requireAuth, requireRole("farmer", "buyer", "cooperative", "superadmin"), async (req, res) => {
  const contractDetails = req.body?.contractDetails;
  const ai = getGeminiClient();

  if (!contractDetails || typeof contractDetails !== "object" || Array.isArray(contractDetails)) {
    return badRequest(res, "Contract details are required for an audit.");
  }

  if (ai && contractDetails) {
    try {
      const prompt = `You are AgriIntel Legal & Trade AI. Audit this African agricultural purchase contract for financial, logistical, and legal risks:
${JSON.stringify(contractDetails, null, 2)}

Return JSON:
{
  "riskScore": 25,
  "overallVerdict": "Low Risk | Moderate Risk | High Risk",
  "identifiedRisks": [
    { "title": "...", "severity": "High | Medium | Low", "description": "...", "remedy": "..." }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      if (response.text) {
        return res.json({ success: true, audit: JSON.parse(response.text) });
      }
    } catch (err) {
      console.error("Contract audit failed:", err);
    }
  }

  return res.status(503).json({ error: { code: "AI_UNAVAILABLE", message: "The contract audit service is unavailable. No generated audit has been substituted.", requestId: res.locals.requestId } } satisfies ApiErrorBody);
});

// 4. Policy Simulator
app.post("/api/gemini/policy-simulate", requireAuth, requireRole("government", "superadmin"), async (req, res) => {
  const country = readString(req.body?.country || "Kenya", "country", 100) || "Kenya";
  const policyChange = readString(req.body?.policyChange, "policyChange", 4_000);
  const baseline = req.body?.baseline;
  const ai = getGeminiClient();

  if (!policyChange) {
    return badRequest(res, "A policy change description is required.");
  }

  if (ai && policyChange) {
    try {
      const prompt = `You are AgriIntel National Agricultural Policy Simulator for ${country}.
Simulate the economic, yield, and food security impacts of this policy intervention:
"${policyChange}"
Baseline data: ${JSON.stringify(baseline || {})}

Return JSON:
{
  "projectedProductionChange": "+8.4%",
  "farmerIncomeChange": "+6.2%",
  "governmentCostEstimate": "R340 Million / $18.5M USD",
  "foodPriceImpact": "-3.1%",
  "foodSecurityIndexChange": "+4.8 points",
  "regionalBeneficiaries": "420,000 smallholders",
  "unintendedConsequences": ["Soil nutrient imbalance if nitrogen over-subsidized without P&K", "Cross-border smuggling arbitrage"],
  "aiAnalysis": "3-4 sentence comprehensive policy rationale and mitigation strategies."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      if (response.text) {
        return res.json({ success: true, simulation: JSON.parse(response.text) });
      }
    } catch (err) {
      console.error("Policy simulator failed:", err);
    }
  }

  return res.status(503).json({ error: { code: "AI_UNAVAILABLE", message: "The policy service is unavailable. No generated simulation has been substituted.", requestId: res.locals.requestId } } satisfies ApiErrorBody);
});

// 5. Commodity Price Forecast
app.post("/api/gemini/price-forecast", requireAuth, async (req, res) => {
  const commodity = readString(req.body?.commodity || "Maize", "commodity", 100) || "Maize";
  const country = readString(req.body?.country || "South Africa", "country", 100) || "South Africa";
  const currentPrice = readString(req.body?.currentPrice || "R5,420/t", "currentPrice", 100) || "R5,420/t";
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `Analyze 30-day commodity price trajectory for ${commodity} in ${country} (current spot: ${currentPrice}).
Return JSON:
{
  "forecastPercentage": "+6.8%",
  "forecastPrice": "R5,788/t",
  "confidenceScore": 89,
  "trend": "BULLISH | BEARISH | STABLE",
  "primaryDrivers": ["Driver 1", "Driver 2", "Driver 3"],
  "marketAnalysis": "Short paragraph explaining macroeconomic and harvest trends.",
  "recommendedAction": "Hold inventory for 21 days or lock forward contract at R5,750."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      if (response.text) {
        return res.json({ success: true, forecast: JSON.parse(response.text) });
      }
    } catch (e) {
      console.error("Price forecast failed:", e);
    }
  }

  return res.status(503).json({ error: { code: "AI_UNAVAILABLE", message: "The market forecasting service is unavailable. No generated forecast has been substituted.", requestId: res.locals.requestId } } satisfies ApiErrorBody);
});

// 6. Inventory Global Food Security & Regional Export Compliance Assessment
app.post("/api/gemini/inventory-compliance-report", requireAuth, requireRole("government", "superadmin", "cooperative"), async (req, res) => {
  const inventorySummary = req.body?.inventorySummary;
  const projectedQuarters = req.body?.projectedQuarters;
  const regionalBufferThreshold = Number(req.body?.regionalBufferThreshold ?? 15);
  const ai = getGeminiClient();

  if (!inventorySummary || !Array.isArray(projectedQuarters) || !Number.isFinite(regionalBufferThreshold) || regionalBufferThreshold < 0 || regionalBufferThreshold > 100) {
    return badRequest(res, "Inventory summary, quarterly projections, and a buffer threshold from 0 to 100 are required.");
  }

  if (ai) {
    try {
      const prompt = `You are the Chief Food Security Auditor and Agronomic Trade Compliance Specialist for Pan-African Agricultural Systems.
Evaluate current agricultural supply-chain inventory and 3-quarter demand projections against:
1. UN FAO Committee on World Food Security (CFS-RAI Principles)
2. Codex Alimentarius & Chemical Safety (MRL) standards
3. Regional Cross-Border Export Compliance (SADC, COMESA, AfCFTA 15% mandatory strategic buffer reserve)
4. ISTA certified hybrid seed purity & germination protocols

Inventory & Forecast Data:
${JSON.stringify({ inventorySummary, projectedQuarters, regionalBufferThreshold }, null, 2)}

Provide a rigorous, authoritative audit report strictly in JSON:
{
  "reportTitle": "Global Food Security & Regional Export Inventory Compliance Assessment",
  "executiveSummary": "2-3 sentence executive synopsis highlighting food security alignment and buffer vulnerabilities.",
  "complianceScore": 92,
  "auditReadinessTier": "Tier-1 Certified (AfCFTA & Codex SPS Compliant)",
  "regionalExportThresholdMet": false,
  "currentBufferMarginPct": 11.4,
  "mandatoryBufferThresholdPct": 15.0,
  "evaluatedPillars": [
    {
      "pillar": "Codex Alimentarius & Chemical Safety (MRL)",
      "status": "Compliant | Warning | Critical",
      "score": 96,
      "details": "Specific verification of storage segregation, heavy metal assays, and safe handling."
    },
    {
      "pillar": "FAO CFS-RAI Principle 6: Sustainable Nutrient Balance",
      "status": "Compliant | Warning | Critical",
      "score": 78,
      "details": "Evaluation of NPK vs Urea vs DAP ratio to prevent soil degradation."
    },
    {
      "pillar": "Regional Strategic Buffer Reserve (AfCFTA / SADC)",
      "status": "Compliant | Warning | Critical",
      "score": 64,
      "details": "Analysis of predictive stock levels against the mandatory 15% regional export reserve threshold."
    },
    {
      "pillar": "Certified Hybrid Seed Purity & Germination (ISTA)",
      "status": "Compliant | Warning | Critical",
      "score": 98,
      "details": "Analysis of seed stock genetic purity and germination buffer."
    },
    {
      "pillar": "Post-Harvest Moisture & Hermetic Integrity",
      "status": "Compliant | Warning | Critical",
      "score": 91,
      "details": "Assessment of silo storage moisture (< 12.5%) and mycotoxin risk."
    }
  ],
  "criticalVulnerabilities": [
    {
      "item": "Name of input (e.g. Urea 46-0-0)",
      "issue": "Specific deficit or regulatory risk",
      "remedy": "Operational corrective action"
    }
  ],
  "actionableDirectives": [
    "Directive 1",
    "Directive 2",
    "Directive 3"
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      if (response.text) {
        return res.json({ success: true, report: JSON.parse(response.text), source: "gemini-3.8-flash" });
      }
    } catch (err) {
      console.error("Inventory compliance report generation failed:", err);
    }
  }

  return res.status(503).json({ error: { code: "AI_UNAVAILABLE", message: "The compliance service is unavailable. No generated report has been substituted.", requestId: res.locals.requestId } } satisfies ApiErrorBody);
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled API error", { requestId: res.locals.requestId, error });
  if (res.headersSent) return;
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "The request could not be completed. Please try again.",
      requestId: res.locals.requestId,
    },
  } satisfies ApiErrorBody);
});

// Vite Middleware for development vs Static Production Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CULTx / AgriIntel] Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
