import { createFileRoute } from "@tanstack/react-router";
import { Panel, PageHeader, RiskBadge } from "@/components/ui-bits";
import { CityMap } from "@/components/CityMap";
import { HOTSPOTS, AI_INSIGHTS } from "@/lib/mockData";
import { Brain, Flame, ShieldAlert, Users, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/hotspots")({
  head: () => ({ meta: [{ title: "Hotspot Prediction — DRISHTI" }] }),
  component: Hotspots,
});

function Hotspots() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        eyebrow="MODULE · HP-06"
        title="Hotspot Prediction"
        description="30–60 minute predictive enforcement targeting · LSTM + spatio-temporal graph model."
        actions={
          <div className="flex items-center gap-2">
            <span className="chip border-primary/40 text-primary"><Brain className="h-3 w-3" /> v3.2.1</span>
            <span className="chip text-success border-success/30"><span className="status-dot bg-success animate-blink" /> INFERENCE LIVE</span>
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-4">
        <Panel title="Predictive Risk Heatmap" subtitle="Current + T+30min + T+60min overlay" icon={Flame} code="HEAT-PRD" className="col-span-12 xl:col-span-8 h-[580px]">
          <div className="p-3 h-full"><CityMap /></div>
        </Panel>

        <Panel title="Predicted Hotspots" subtitle="Sorted by composite risk score" icon={ShieldAlert} code="HTSP-RNK" className="col-span-12 xl:col-span-4 h-[580px]">
          <ul className="h-full overflow-auto divide-y divide-border/60">
            {HOTSPOTS.map((h) => (
              <li key={h.name} className="flex items-center gap-3 px-4 py-3">
                <div className={`relative grid h-10 w-10 place-items-center rounded-md ${h.risk >= 80 ? "bg-destructive/20 text-destructive" : h.risk >= 70 ? "bg-warning/20 text-warning" : "bg-primary/20 text-primary"}`}>
                  <Flame className="h-4 w-4" />
                  <span className="absolute -bottom-1 -right-1 mono text-[9px] font-bold bg-background rounded px-1 border border-border">{h.risk}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-foreground">{h.name}</div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>ETA <span className="mono text-foreground">{h.eta}</span></span>
                    <span>·</span>
                    <span className="text-destructive">{h.delta}</span>
                  </div>
                </div>
                <RiskBadge level={h.risk >= 80 ? "Critical" : h.risk >= 70 ? "High" : "Medium"} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="AI Recommendations" subtitle="Officer deployment suggestions" icon={Users} code="OPS-REC" className="col-span-12">
          <div className="grid gap-3 p-3 md:grid-cols-2 xl:grid-cols-4">
            {AI_INSIGHTS.map((i, idx) => {
              const tone = i.severity === "critical" ? "destructive" : i.severity === "warning" ? "warning" : i.severity === "success" ? "success" : "primary";
              return (
                <div key={idx} className={`relative overflow-hidden rounded-md border border-${tone}/30 bg-${tone}/5 p-4`}>
                  <div className="flex items-center justify-between">
                    <span className={`chip border-${tone}/40 text-${tone}`}><span className={`status-dot bg-${tone} animate-blink`} /> {i.severity.toUpperCase()}</span>
                    <span className="mono text-[10px] text-muted-foreground">REC-{(idx + 41).toString().padStart(3, "0")}</span>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-foreground">{i.text}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="mono text-[10px] text-muted-foreground">conf 92.4% · ETA 12 min</span>
                    <button className={`inline-flex items-center gap-1 text-[11px] font-semibold text-${tone} hover:underline`}>
                      Dispatch <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}
