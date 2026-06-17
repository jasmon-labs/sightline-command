export type Violation = {
  id: string;
  type: "Helmet" | "Red Light" | "Wrong Side" | "Triple Riding" | "No Seatbelt" | "Overspeeding";
  location: string;
  timestamp: string;
  confidence: number;
  vehicle: string;
  plate: string;
  status: "Verified" | "Pending" | "Disputed";
};

const TYPES: Violation["type"][] = [
  "Helmet", "Red Light", "Wrong Side", "Triple Riding", "No Seatbelt", "Overspeeding",
];
const LOCATIONS = [
  "Whitefield Junction", "KR Puram Bridge", "Indiranagar 100ft Rd", "Silk Board",
  "Marathahalli Bridge", "Hebbal Flyover", "Electronic City Phase 1", "Koramangala 80ft",
  "MG Road Signal", "Tin Factory", "Bellandur ORR", "Yeshwanthpur Circle",
];
const VEHICLES = ["Two-Wheeler", "Sedan", "SUV", "Auto Rickshaw", "Delivery Van", "Truck"];

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function pad(n: number, w = 2) { return String(n).padStart(w, "0"); }

let seed = 7;
function srand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
function pick<T>(arr: T[]): T { return arr[Math.floor(srand() * arr.length)]; }

const BASE_TIME = new Date("2026-06-17T14:08:22Z").getTime();

export const VIOLATIONS: Violation[] = Array.from({ length: 48 }, (_, i) => {
  const d = new Date(BASE_TIME - i * 1000 * 60 * (3 + srand() * 25));
  return {
    id: `DRSH-${(10248 - i).toString()}`,
    type: pick(TYPES),
    location: pick(LOCATIONS),
    timestamp: d.toISOString(),
    confidence: Math.round((0.82 + srand() * 0.17) * 1000) / 10,
    vehicle: pick(VEHICLES),
    plate: `KA${pad(Math.floor(srand() * 53) + 1)}${String.fromCharCode(65 + Math.floor(srand() * 26))}${String.fromCharCode(65 + Math.floor(srand() * 26))}${pad(Math.floor(srand() * 9999), 4)}`,
    status: pick(["Verified", "Verified", "Verified", "Pending", "Disputed"] as Violation["status"][]),
  };
});

export const LIVE_FEED = VIOLATIONS.slice(0, 8);

export const KPI = {
  violationsToday: 2847,
  activeCameras: 312,
  totalCameras: 340,
  predictionAccuracy: 94.3,
  highRiskJunctions: 17,
};

export const HOURLY_TREND = Array.from({ length: 24 }, (_, h) => ({
  hour: `${pad(h)}:00`,
  helmet: Math.round(20 + 60 * Math.sin((h - 6) / 6) + srand() * 40),
  redLight: Math.round(15 + 40 * Math.sin((h - 8) / 5) + srand() * 25),
  wrongSide: Math.round(8 + 22 * Math.sin((h - 7) / 6) + srand() * 15),
}));

export const VIOLATION_BREAKDOWN = [
  { name: "Helmet", value: 1247, color: "#3b82f6" },
  { name: "Red Light", value: 642, color: "#ef4444" },
  { name: "Wrong Side", value: 388, color: "#f59e0b" },
  { name: "Triple Riding", value: 271, color: "#22c55e" },
  { name: "No Seatbelt", value: 198, color: "#a855f7" },
  { name: "Overspeeding", value: 101, color: "#06b6d4" },
];

export const TOP_JUNCTIONS = LOCATIONS.slice(0, 8).map((l, i) => ({
  junction: l,
  violations: Math.round(420 - i * 38 + srand() * 30),
  risk: ["Critical", "High", "High", "Medium", "Medium", "Medium", "Low", "Low"][i],
}));

export const CAMERAS = Array.from({ length: 24 }, (_, i) => ({
  id: `CAM-${pad(i + 1, 3)}`,
  // SVG % coords on our schematic map
  x: 8 + srand() * 84,
  y: 8 + srand() * 84,
  status: srand() > 0.08 ? "online" : "offline",
  violations: Math.floor(srand() * 80),
}));

export const HOTSPOTS = [
  { name: "Whitefield Junction", x: 72, y: 38, risk: 92, eta: "Now", delta: "+18%" },
  { name: "KR Puram Bridge", x: 64, y: 30, risk: 86, eta: "45 min", delta: "+12%" },
  { name: "Silk Board", x: 50, y: 78, risk: 81, eta: "30 min", delta: "+9%" },
  { name: "Marathahalli", x: 68, y: 50, risk: 74, eta: "60 min", delta: "+6%" },
  { name: "Hebbal Flyover", x: 42, y: 14, risk: 68, eta: "Now", delta: "+4%" },
  { name: "Tin Factory", x: 60, y: 26, risk: 64, eta: "50 min", delta: "+3%" },
];

export const AI_INSIGHTS = [
  { severity: "critical", text: "Whitefield Junction violation probability increased 18% over baseline. Recommend 2 additional units." },
  { severity: "warning", text: "KR Puram: expected helmet violation spike in next 45 minutes based on shift change patterns." },
  { severity: "info", text: "Silk Board congestion forecast indicates 30-min window for enforcement deployment." },
  { severity: "success", text: "MG Road Signal compliance improved 11% week-over-week after camera reactivation." },
];

export const FLEET = {
  safetyScore: 87.4,
  activeRiders: 1248,
  flaggedThisWeek: 36,
  topRoutes: [
    { route: "Whitefield → Marathahalli", incidents: 14, risk: "High" },
    { route: "KR Puram → Indiranagar", incidents: 9, risk: "High" },
    { route: "Koramangala → HSR", incidents: 6, risk: "Medium" },
    { route: "Bellandur → Sarjapur", incidents: 4, risk: "Medium" },
    { route: "Hebbal → Yeshwanthpur", incidents: 2, risk: "Low" },
  ],
};

export const SYSTEM_STATUS = [
  { name: "Backend API", status: "healthy", value: "200 OK", detail: "uptime 14d 06h" },
  { name: "YOLOv8n Inference", status: "healthy", value: "42 ms", detail: "GPU 38% · queue 0" },
  { name: "OCR Engine", status: "healthy", value: "98.2%", detail: "PaddleOCR v2.7" },
  { name: "Camera Network", status: "degraded", value: "312/340", detail: "28 offline" },
  { name: "Database (Postgres)", status: "healthy", value: "12 ms", detail: "pool 18/50" },
  { name: "Message Queue", status: "healthy", value: "Kafka", detail: "lag 4 ms" },
  { name: "Object Storage", status: "healthy", value: "S3", detail: "12.4 TB used" },
  { name: "Model Registry", status: "healthy", value: "v3.2.1", detail: "released 2026-06-09" },
];

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}
