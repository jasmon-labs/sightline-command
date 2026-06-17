import { createFileRoute } from "@tanstack/react-router";
import { Panel, PageHeader } from "@/components/ui-bits";
import { SYSTEM_STATUS } from "@/lib/mockData";
import { CheckCircle2, AlertTriangle, XCircle, Cpu } from "lucide-react";

export const Route = createFileRoute("/system")({
  head: () => ({ meta: [{ title: "System Status — DRISHTI" }] }),
  component: System,
});

function System() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        eyebrow="MODULE · SY-07"
        title="System Status"
        description="Infrastructure health, model performance and edge connectivity."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {SYSTEM_STATUS.map((s) => {
          const ok = s.status === "healthy";
          const degraded = s.status === "degraded";
          const Icon = ok ? CheckCircle2 : degraded ? AlertTriangle : XCircle;
          const tone = ok ? "success" : degraded ? "warning" : "destructive";
          return (
            <div key={s.name} className="panel relative overflow-hidden p-4">
              <div className={`absolute inset-x-0 top-0 h-px bg-${tone}`} />
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{s.name}</div>
                  <div className="mt-2 mono text-xl font-semibold text-foreground">{s.value}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{s.detail}</div>
                </div>
                <Icon className={`h-5 w-5 text-${tone}`} />
              </div>
              <div className={`mt-3 inline-flex items-center gap-1.5 chip border-${tone}/30 text-${tone}`}>
                <span className={`status-dot bg-${tone} ${ok ? "animate-blink" : ""}`} />
                {s.status.toUpperCase()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel title="Camera Connectivity" subtitle="312/340 nodes online · 28 offline" code="CAM-NET" className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-10 gap-1.5 p-4 md:grid-cols-20">
            {Array.from({ length: 340 }).map((_, i) => {
              const off = i % 12 === 5 || i % 17 === 3;
              return (
                <div key={i} className={`aspect-square rounded-sm ${off ? "bg-destructive/70" : "bg-success/70"}`} title={`CAM-${(i + 1).toString().padStart(3, "0")}`} />
              );
            })}
          </div>
        </Panel>

        <Panel title="Inference Pipeline" code="ML-PIPE" className="col-span-12 lg:col-span-4">
          <div className="space-y-3 p-4">
            {[
              { stage: "Ingest", ms: 4, max: 10 },
              { stage: "Decode", ms: 8, max: 20 },
              { stage: "YOLOv8n", ms: 22, max: 50 },
              { stage: "OCR (PaddleOCR)", ms: 14, max: 40 },
              { stage: "Persist", ms: 6, max: 20 },
            ].map((p) => (
              <div key={p.stage}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground flex items-center gap-1.5"><Cpu className="h-3 w-3" />{p.stage}</span>
                  <span className="mono text-foreground">{p.ms} ms</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-border/40 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-success" style={{ width: `${(p.ms / p.max) * 100}%` }} />
                </div>
              </div>
            ))}
            <div className="border-t border-border pt-3 mono text-[11px] flex justify-between">
              <span className="text-muted-foreground">total · p95</span><span className="text-success font-semibold">54 ms</span>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
