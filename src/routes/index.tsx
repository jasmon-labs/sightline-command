import { createFileRoute } from "@tanstack/react-router";
import { Panel, StatCard, RiskBadge, PageHeader } from "@/components/ui-bits";
import { CityMap } from "@/components/CityMap";
import { AI_INSIGHTS, KPI, LIVE_FEED, TOP_JUNCTIONS, formatTime } from "@/lib/mockData";
import {
  AlertTriangle, Camera, Crosshair, Gauge, Brain, ArrowUpRight, MapPin, Clock,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Command Center — DRISHTI" },
      { name: "description", content: "Live traffic violation intelligence for Bengaluru." },
    ],
  }),
  component: CommandCenter,
});

function CommandCenter() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        eyebrow="MODULE · CC-01"
        title="Command Center"
        description="Real-time situational awareness across the Bengaluru camera network."
        actions={
          <div className="flex items-center gap-2">
            <button className="chip border-primary/40 text-primary">Live feed</button>
            <button className="chip">Operator: A. Rao</button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Violations · Today" value={KPI.violationsToday.toLocaleString()} delta="+12.4% vs 7d avg" deltaTone="danger" icon={AlertTriangle} accent="danger" />
        <StatCard label="Active Cameras" value={`${KPI.activeCameras}/${KPI.totalCameras}`} delta={`${KPI.totalCameras - KPI.activeCameras} offline`} deltaTone="warning" icon={Camera} accent="primary" />
        <StatCard label="Prediction Accuracy" value={KPI.predictionAccuracy} unit="%" delta="+1.2 pts MoM" deltaTone="success" icon={Brain} accent="success" />
        <StatCard label="High-Risk Junctions" value={KPI.highRiskJunctions} delta="3 escalated" deltaTone="warning" icon={Crosshair} accent="warning" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel
          title="Bengaluru Operational Map"
          subtitle="Camera coverage · violation heatmap · 30-min predictive overlay"
          icon={MapPin} code="MAP-LIVE"
          className="col-span-12 xl:col-span-8 h-[520px]"
          action={
            <div className="flex items-center gap-1.5 text-[10px]">
              <button className="chip border-primary/40 text-primary">Heatmap</button>
              <button className="chip">Predicted</button>
              <button className="chip">Cameras</button>
            </div>
          }
        >
          <div className="p-3 h-full"><CityMap /></div>
        </Panel>

        <Panel
          title="Live Violation Feed"
          subtitle="Streamed from edge inference nodes"
          icon={Gauge} code="FEED-RT"
          className="col-span-12 xl:col-span-4 h-[520px]"
          action={<span className="chip text-success border-success/30"><span className="status-dot bg-success animate-blink" /> LIVE</span>}
        >
          <div className="h-full overflow-auto divide-y divide-border/60">
            {LIVE_FEED.map((v) => (
              <div key={v.id} className="group flex items-start gap-3 px-4 py-3 transition hover:bg-accent/30">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-destructive/15 text-destructive ring-1 ring-destructive/30">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-foreground truncate">{v.type} Violation</div>
                    <div className="mono text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{formatTime(v.timestamp)}</div>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {v.location}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-[10px]">
                    <span className="chip">{v.vehicle}</span>
                    <span className="mono text-muted-foreground">{v.plate}</span>
                    <span className="ml-auto mono font-semibold text-success">{v.confidence}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel
          title="AI Insights"
          subtitle="Predictive analytics · last refresh 12s ago"
          icon={Brain} code="AI-ML"
          className="col-span-12 lg:col-span-8"
        >
          <div className="grid gap-2.5 p-3 md:grid-cols-2">
            {AI_INSIGHTS.map((i, idx) => {
              const tone = i.severity === "critical" ? "destructive" : i.severity === "warning" ? "warning" : i.severity === "success" ? "success" : "primary";
              return (
                <div key={idx} className={`relative overflow-hidden rounded-md border border-${tone}/30 bg-${tone}/5 p-3`}>
                  <div className="flex items-center gap-2">
                    <span className={`status-dot bg-${tone} animate-blink`} />
                    <span className={`mono text-[10px] uppercase tracking-widest text-${tone}`}>{i.severity}</span>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-foreground">{i.text}</p>
                  <button className={`mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-${tone} hover:underline`}>
                    Deploy action <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel
          title="Top Junctions"
          subtitle="Ranked by violation volume · today"
          icon={Crosshair} code="JCT-RANK"
          className="col-span-12 lg:col-span-4"
        >
          <ul className="divide-y divide-border/60">
            {TOP_JUNCTIONS.slice(0, 6).map((j, i) => (
              <li key={j.junction} className="flex items-center gap-3 px-4 py-2.5">
                <span className="mono text-[10px] text-muted-foreground w-5">#{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 truncate text-sm text-foreground">{j.junction}</span>
                <span className="mono text-xs text-foreground">{j.violations}</span>
                <RiskBadge level={j.risk} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
