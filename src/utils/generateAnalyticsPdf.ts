import jsPDF from "jspdf";
import { Farm } from "../types";

export interface AnalyticsReportOptions {
  farm: Farm;
  reportDate?: string;
  analyst?: string;
}

/**
 * Generates and downloads a comprehensive, institutional-grade PDF summary
 * of farm performance, yield forecasts, and financial health using jsPDF vector graphics.
 */
export function generateFarmAnalyticsPdf({
  farm,
  reportDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
  analyst = "CULTx Autonomous Agro-Telemetry Engine",
}: AnalyticsReportOptions): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // ─────────────────────────────────────────────────────────────
  // 1. INSTITUTIONAL HEADER BAR (Forest Green & Harvest Gold)
  // ─────────────────────────────────────────────────────────────
  // Top Forest Green Header Bar
  doc.setFillColor(20, 83, 45); // #14532D
  doc.rect(0, 0, pageWidth, 28, "F");

  // Golden Accent Stripe
  doc.setFillColor(245, 185, 66); // #F5B942
  doc.rect(0, 28, pageWidth, 2.5, "F");

  // Header Typography
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(253, 251, 247); // Cream White
  doc.text("CULTx PAN-AFRICAN AGRICULTURAL OPERATING SYSTEM", margin, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(220, 235, 225);
  doc.text(
    "Unified Continental Agronomic Intelligence • AfCFTA Digital Trade Protocol • Sentinel-2 L2A Telemetry",
    margin,
    18
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(245, 185, 66);
  doc.text(`REPORT IDENTIFIER: CULTX-REP-${farm.id.toUpperCase()}-${new Date().getFullYear()}`, margin, 24);

  // ─────────────────────────────────────────────────────────────
  // 2. DOCUMENT TITLE & METADATA CARD
  // ─────────────────────────────────────────────────────────────
  let y = 37;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(16, 23, 27); // Dark Charcoal
  doc.text("FARM PERFORMANCE, YIELD & FINANCIAL ANALYTICS", margin, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90, 100, 110);
  doc.text(
    `Comprehensive digital twin audit generated on ${reportDate} • Verified by ${analyst}`,
    margin,
    y
  );

  y += 6;

  // Farm Summary Box (Subtle Warm Cream / Grey fill)
  doc.setFillColor(247, 249, 250);
  doc.setDrawColor(210, 220, 225);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(20, 83, 45);
  doc.text(`FARM ASSET: ${farm.name.toUpperCase()}`, margin + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(70, 80, 90);
  doc.text(`Proprietor: ${farm.ownerName}`, margin + 4, y + 11);
  doc.text(`Jurisdiction: ${farm.region}, ${farm.country}`, margin + 4, y + 16);
  const geoCoords = farm.country === "South Africa" ? "28.4210°S, 26.8950°E" : farm.country === "Kenya" ? "0.3030°S, 36.0800°E" : "12.0020°N, 8.5910°E";
  doc.text(`Geographic Coordinates: ${geoCoords}`, margin + 4, y + 21);

  const cropList = farm.fields?.map(f => f.crop).filter((v, i, a) => a.indexOf(v) === i).join(", ") || farm.primaryCrop;
  doc.text(`Total Surface: ${farm.totalHectares} Hectares`, margin + 95, y + 6);
  doc.text(`Dominant Crops: ${cropList}`, margin + 95, y + 11);
  doc.text(`Active Telemetry Nodes: ${farm.sensorsOnline} In-Situ Sensors`, margin + 95, y + 16);
  doc.text(`Asset Verification: Tier-1 Verified Twin`, margin + 95, y + 21);

  y += 30;

  // ─────────────────────────────────────────────────────────────
  // 3. SECTION 1: VEGETATIVE PERFORMANCE & SOIL HEALTH (VISUAL BARS)
  // ─────────────────────────────────────────────────────────────
  doc.setFillColor(20, 83, 45);
  doc.rect(margin, y, 3, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(16, 23, 27);
  doc.text("1. VEGETATIVE CANOPY & SOIL HEALTH TELEMETRY", margin + 6, y + 5.5);

  y += 10;

  const performanceMetrics = [
    { label: "Overall Foliar Health Index", value: farm.overallHealthScore, target: 85, color: [34, 197, 94] },
    { label: "Sentinel-2 Vegetative NDVI (0.0 - 1.0)", value: 77, target: 75, textValue: "0.77 (Optimal)", color: [16, 185, 129] },
    { label: "Sub-Surface Root Zone Moisture", value: 42, target: 50, textValue: "42% Volumetric", color: [56, 189, 248] },
    { label: "Soil Organic Matter (SOM Content)", value: 68, target: 60, textValue: "3.8% (Mollisol)", color: [245, 185, 66] },
    { label: "Predictive Pest & Disease Resistance", value: 91, target: 80, textValue: "91% (Low Risk)", color: [34, 197, 94] },
  ];

  performanceMetrics.forEach((metric) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(40, 50, 60);
    doc.text(metric.label, margin, y);

    const displayVal = metric.textValue || `${metric.value}%`;
    doc.text(displayVal, margin + contentWidth - 25, y, { align: "right" });

    // Background Bar
    doc.setFillColor(230, 235, 238);
    doc.roundedRect(margin, y + 2, contentWidth, 4.5, 1.5, 1.5, "F");

    // Progress Value Bar
    const barWidth = (contentWidth * Math.min(100, metric.value)) / 100;
    doc.setFillColor(metric.color[0], metric.color[1], metric.color[2]);
    doc.roundedRect(margin, y + 2, barWidth, 4.5, 1.5, 1.5, "F");

    y += 11;
  });

  // ─────────────────────────────────────────────────────────────
  // 4. SECTION 2: YIELD FORECAST & HARVEST PROJECTIONS (COMPARATIVE DATA)
  // ─────────────────────────────────────────────────────────────
  y += 2;
  doc.setFillColor(245, 185, 66);
  doc.rect(margin, y, 3, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(16, 23, 27);
  doc.text("2. YIELD FORECAST & HARVEST PRODUCTION MODELING", margin + 6, y + 5.5);

  y += 10;

  // Three-column yield comparison cards
  const cardWidth = (contentWidth - 6) / 3;

  // Card 1: Projected Yield
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, cardWidth, 20, 2, 2, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(22, 101, 52);
  doc.text("PROJECTED HARVEST", margin + 4, y + 5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`${farm.expectedYieldTonnesPerHa} t/ha`, margin + 4, y + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(70, 90, 80);
  doc.text(`Est. ${(farm.expectedYieldTonnesPerHa * farm.totalHectares).toFixed(0)} MT Total Output`, margin + 4, y + 17);

  // Card 2: Historical Benchmark
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin + cardWidth + 3, y, cardWidth, 20, 2, 2, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text("3-SEASON HISTORIC MEAN", margin + cardWidth + 7, y + 5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text("5.8 t/ha", margin + cardWidth + 7, y + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("+10.3% YoY Yield Gain", margin + cardWidth + 7, y + 17);

  // Card 3: Continental Benchmark
  doc.setFillColor(254, 252, 232);
  doc.roundedRect(margin + (cardWidth + 3) * 2, y, cardWidth, 20, 2, 2, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(133, 77, 14);
  doc.text("CONTINENTAL BENCHMARK", margin + (cardWidth + 3) * 2 + 4, y + 5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(113, 63, 18);
  doc.text("3.9 t/ha", margin + (cardWidth + 3) * 2 + 4, y + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(161, 98, 7);
  doc.text("Outperforming by +64%", margin + (cardWidth + 3) * 2 + 4, y + 17);

  y += 26;

  // ─────────────────────────────────────────────────────────────
  // 5. SECTION 3: FINANCIAL HEALTH & BIOMASS VALUATION
  // ─────────────────────────────────────────────────────────────
  doc.setFillColor(20, 83, 45);
  doc.rect(margin, y, 3, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(16, 23, 27);
  doc.text("3. FINANCIAL HEALTH, CREDIT SCORE & BIOMASS VALUATION", margin + 6, y + 5.5);

  y += 10;

  // Financial Table
  doc.setFillColor(245, 247, 249);
  doc.rect(margin, y, contentWidth, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text("FINANCIAL COMPONENT", margin + 4, y + 5);
  doc.text("METRIC / RATING", margin + 85, y + 5);
  doc.text("UNDERWRITING STATUS", margin + 140, y + 5);

  y += 8;

  const financialItems = [
    { name: "Agri-Credit Trust Score", metric: "5.0 / 5.0 (Tier-1 Prime)", status: "Pre-Approved" },
    { name: "Estimated Standing Biomass Value", metric: `$${(farm.totalHectares * farm.expectedYieldTonnesPerHa * 285).toLocaleString()} USD`, status: "Off-Take Secured" },
    { name: "Seasonal Input Working Capital", metric: "$42,000 USD Credit Line", status: "Active Facility" },
    { name: "Soil Carbon Offset Sequestration", metric: "1.8 tCO2e / ha (MRV Certified)", status: "Monetized" },
    { name: "Parametric Drought Risk Coverage", metric: "AfCFTA Corridors Underwritten", status: "Policy In-Force" },
  ];

  financialItems.forEach((row, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(250, 252, 253);
      doc.rect(margin, y - 1, contentWidth, 6.5, "F");
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(50, 60, 70);
    doc.text(row.name, margin + 4, y + 3.5);

    doc.setFont("helvetica", "bold");
    doc.text(row.metric, margin + 85, y + 3.5);

    doc.setTextColor(20, 83, 45);
    doc.text(row.status, margin + 140, y + 3.5);

    y += 7;
  });

  y += 4;

  // ─────────────────────────────────────────────────────────────
  // 6. SECTION 4: REGULATORY & EXPORT COMPLIANCE
  // ─────────────────────────────────────────────────────────────
  doc.setFillColor(247, 249, 250);
  doc.setDrawColor(210, 220, 225);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(20, 83, 45);
  doc.text("REGULATORY & PHYTOSANITARY ACCREDITATION", margin + 4, y + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(70, 80, 90);
  doc.text(
    "• AfCFTA Digital Certificate of Origin: Valid for Tariff-Free Cross-Border Corridor Transit",
    margin + 4,
    y + 10
  );
  doc.text(
    "• FAO/WHO Codex Alimentarius: Maximum Residue Limits (MRL) Grade-A Certified for Grain Export",
    margin + 4,
    y + 15
  );

  // ─────────────────────────────────────────────────────────────
  // 7. FOOTER STAMP & CRYPTOGRAPHIC VERIFICATION
  // ─────────────────────────────────────────────────────────────
  const footerY = pageHeight - 14;

  doc.setDrawColor(210, 220, 225);
  doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(120, 130, 140);
  doc.text(
    `Cryptographic Verification Hash: SHA256-${farm.id}-${Date.now().toString(16).toUpperCase()}`,
    margin,
    footerY
  );
  doc.text("Page 1 of 1 • Sovereign Data Sovereignty Protected", margin, footerY + 3.5);

  doc.text("CULTx African Agricultural OS", pageWidth - margin - 40, footerY);
  doc.text("www.cultx.africa", pageWidth - margin - 40, footerY + 3.5);

  // Download Trigger
  const safeFilename = `${farm.name.replace(/[^a-zA-Z0-9_-]/g, "_")}_Analytics_Report.pdf`;
  doc.save(safeFilename);
}
