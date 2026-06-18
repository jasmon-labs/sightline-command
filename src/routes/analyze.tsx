import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Panel, PageHeader } from "@/components/ui-bits";
import {
  CloudUpload, FileImage, Loader2, ShieldAlert, ShieldCheck, X,
  Camera, ScanLine, Brain, FileCheck2, Radio, CheckCircle2, ArrowRight,
} from "lucide-react";
import { MAEP_CAMERAS, VIOLATIONS } from "@/lib/mockData";

export const Route = createFileRoute("/analyze")({
  head: () => ({ meta: [{ title: "Analyze — DRISHTI" }] }),
  component: Analyze,
});

type Detection = {
  vehicle: string; violation: string | null; confidence: number; plate: string; ts: string; evidenceId: string; action: string;
};

const SAMPLE_DETECTIONS: Detection[] = [
  { vehicle: "Two-Wheeler", violation: "No Helmet", confidence: 96.4, plate: "KA03MJ1234", ts: "14:08:22", evidenceId: "DRSH-10248", action: "Issue E-Challan" },
  { vehicle: "Two-Wheeler", violation: "Triple Riding", confidence: 91.2, plate: "KA05AB7890", ts: "14:08:22", evidenceId: "DRSH-10249", action: "Issue E-Challan" },
  { vehicle: "Sedan",        violation: null,           confidence: 99.1, plate: "KA09AB1029", ts: "14:08:22", evidenceId: "DRSH-10250", action: "No Action" },
  { vehicle: "Auto Rickshaw",violation: "Wrong Side",   confidence: 88.7, plate: "KA01XY6789", ts: "14:08:22", evidenceId: "DRSH-10251", action: "Field Officer Review" },
  { vehicle: "Delivery Van", violation: null,           confidence: 97.5, plate: "KA53FK8821", ts: "14:08:22", evidenceId: "DRSH-10252", action: "No Action" },
];

const PIPELINE = [
  { label: "Frame Ingest",          icon: FileImage,   ms: 4  },
  { label: "YOLO Detection",        icon: ScanLine,    ms: 22 },
  { label: "License Plate OCR",     icon: Camera,      ms: 14 },
  { label: "Violation Classifier",  icon: Brain,       ms: 8  },
  { label: "Evidence Generation",   icon: FileCheck2,  ms: 6  },
  { label: "Command Intelligence",  icon: Radio,       ms: 3  },
];

function Analyze() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [stage, setStage] = useState<"idle" | "processing" | "done">("idle");
  const [pipelineStep, setPipelineStep] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStage("processing");
    setPipelineStep(0);
    PIPELINE.forEach((_, i) => setTimeout(() => setPipelineStep(i + 1), (i + 1) * 320));
    setTimeout(() => setStage("done"), (PIPELINE.length + 1) * 320);
  }

  function reset() {
    setFile(null); setPreview(null); setStage("idle"); setPipelineStep(0);
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        eyebrow="MODULE · AN-02"
        title="Analyze"
        description="Forensic inference pipeline · YOLOv8n + PaddleOCR + Violation Classifier."
        actions={
          file && (
            <button onClick={reset} className="chip hover:text-destructive"><X className="h-3 w-3" /> Clear evidence</button>
          )
        }
      />

      {stage === "idle" && <UploadZone onFile={handleFile} inputRef={inputRef} />}

      {stage !== "idle" && file && (
        <>
          <PipelinePanel step={pipelineStep} done={stage === "done"} />

          <Panel
            title={stage === "done" ? "Inference Result" : "Inference In Progress"}
            subtitle={`${file.name} · ${(file.size / 1024).toFixed(1)} KB`}
            icon={FileImage} code="INF-001"
          >
            <div className="grid gap-3 p-3 md:grid-cols-2">
              <Frame label="Original" url={preview!} processing={false} />
              <Frame label="Annotated · YOLOv8n" url={preview!} processing={stage === "processing"} annotated={stage === "done"} />
            </div>
          </Panel>

          {stage === "done" && (
            <>
              <div className="grid grid-cols-12 gap-4">
                <Panel title="AI Violation Summary" subtitle="Primary detection · high-confidence" code="AI-SUM" className="col-span-12 lg:col-span-7">
                  <div className="grid gap-3 p-4 md:grid-cols-3">
                    <SumCard label="Violation" value="Helmet Non-Compliance" tone="destructive" big />
                    <SumCard label="Confidence" value="96.4%" tone="success" big />
                    <SumCard label="Plate (OCR)" value="KA03MJ1234" tone="primary" mono big />
                    <SumCard label="Location" value="Silk Board Junction" />
                    <SumCard label="Camera" value="CAM-114 · PTZ" />
                    <SumCard label="Recommended Action" value="Issue E-Challan ₹1,000" tone="warning" />
                  </div>
                </Panel>

                <Panel title="Processing Metadata" subtitle="Inference telemetry" code="META-INF" className="col-span-12 lg:col-span-5">
                  <ul className="divide-y divide-border/60">
                    {[
                      ["Model Version",       "YOLOv8n · v3.2.1"],
                      ["Inference Time",      "42 ms"],
                      ["OCR Confidence",      "99.1%"],
                      ["Evidence Confidence", "97.0%"],
                      ["Pipeline p95",        "54 ms"],
                      ["SHA-256",             "8f2c…41a9"],
                    ].map(([k, v]) => (
                      <li key={k} className="flex items-center justify-between px-4 py-2.5 text-[12px]">
                        <span className="text-muted-foreground uppercase tracking-wider text-[10px]">{k}</span>
                        <span className="mono text-foreground">{v}</span>
                      </li>
                    ))}
                  </ul>
                </Panel>
              </div>

              <MAEPPanel preview={preview!} />

              <Panel title="Detection Intelligence" subtitle="Per-object classification · OCR · enforcement action" code="DET-INT">
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      <tr className="border-b border-border">
                        <th className="px-4 py-2.5">Vehicle</th>
                        <th className="px-4 py-2.5">Violation</th>
                        <th className="px-4 py-2.5">Confidence</th>
                        <th className="px-4 py-2.5">Plate</th>
                        <th className="px-4 py-2.5">Evidence ID</th>
                        <th className="px-4 py-2.5">Recommended Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SAMPLE_DETECTIONS.map((d, i) => {
                        const isViolation = !!d.violation;
                        return (
                          <tr key={i} className={`border-b border-border/60 transition hover:bg-accent/30 ${isViolation ? "bg-destructive/5" : "bg-success/5"}`}>
                            <td className="px-4 py-3 text-foreground">{d.vehicle}</td>
                            <td className="px-4 py-3">
                              {isViolation ? (
                                <span className="inline-flex items-center gap-1.5 rounded border border-destructive/40 bg-destructive/15 px-2 py-0.5 text-[11px] font-semibold text-destructive"><ShieldAlert className="h-3 w-3" />{d.violation}</span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded border border-success/40 bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success"><ShieldCheck className="h-3 w-3" />Clean</span>
                              )}
                            </td>
                            <td className="px-4 py-3 mono text-foreground">{d.confidence}%</td>
                            <td className="px-4 py-3 mono text-foreground">{d.plate}</td>
                            <td className="px-4 py-3 mono text-primary">{d.evidenceId}</td>
                            <td className="px-4 py-3 text-[12px] text-muted-foreground">{d.action}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Panel>

              <div className="text-[11px] text-muted-foreground">
                Inference completed in <span className="mono text-foreground">42 ms</span> · evidence ID <span className="mono text-primary">{VIOLATIONS[0].id}</span> queued to log.
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

/* ---------- States & subcomponents ---------- */

function UploadZone({ onFile, inputRef }: { onFile: (f: File) => void; inputRef: React.RefObject<HTMLInputElement | null> }) {
  return (
    <Panel className="min-h-[440px]" code="DROP-Z">
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
        className="relative m-3 flex h-[420px] cursor-pointer flex-col items-center justify-center gap-5 overflow-hidden rounded-lg border-2 border-dashed border-primary/40 bg-[#070b14] transition hover:border-primary hover:bg-primary/5"
      >
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(59,130,246,0.18),transparent_60%)]" />
        {/* corner brackets */}
        {["top-3 left-3","top-3 right-3","bottom-3 left-3","bottom-3 right-3"].map((p, i) => (
          <span key={i} className={`absolute ${p} h-6 w-6 border-primary/70`} style={{
            borderTopWidth: p.includes("top") ? 2 : 0,
            borderBottomWidth: p.includes("bottom") ? 2 : 0,
            borderLeftWidth: p.includes("left") ? 2 : 0,
            borderRightWidth: p.includes("right") ? 2 : 0,
          }} />
        ))}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-b from-primary/70 to-transparent animate-scan" style={{ height: "30%" }} />

        <input ref={inputRef} type="file" accept="image/*,video/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />

        <div className="relative grid h-20 w-20 place-items-center rounded-2xl bg-primary/15 ring-1 ring-primary/40">
          <CloudUpload className="h-10 w-10 text-primary" />
          <span className="absolute inset-0 -m-2 rounded-2xl ring-1 ring-primary/30 animate-pulse-ring" />
        </div>
        <div className="relative text-center">
          <div className="text-lg font-semibold text-foreground tracking-wide">Drop Traffic Evidence</div>
          <div className="mt-1 text-xs text-muted-foreground">Images · Video · Camera Frames · up to 250 MB</div>
        </div>
        <div className="relative flex items-center gap-2 text-[10px]">
          <span className="chip border-primary/40 text-primary">YOLOv8n</span>
          <span className="chip">PaddleOCR</span>
          <span className="chip">Violation Classifier</span>
          <span className="chip">MAEP</span>
        </div>
        <div className="relative mono text-[10px] text-muted-foreground">SECURE · CHAIN-OF-CUSTODY · TAMPER-EVIDENT</div>
      </label>
    </Panel>
  );
}

function PipelinePanel({ step, done }: { step: number; done: boolean }) {
  return (
    <Panel title="Frame Analysis Pipeline" subtitle={done ? "Pipeline complete · evidence ready" : "Processing through edge inference stack"} icon={Brain} code="PIPE-EX">
      <div className="grid grid-cols-2 gap-2 p-4 md:grid-cols-6">
        {PIPELINE.map((p, i) => {
          const active = step === i + 1 && !done;
          const completed = step > i || done;
          const Icon = p.icon;
          const tone = completed ? "success" : active ? "primary" : "muted";
          return (
            <div key={p.label} className="relative flex flex-col items-center text-center">
              <div className={`relative grid h-12 w-12 place-items-center rounded-md border ${
                completed ? "border-success/40 bg-success/10 text-success" :
                active ? "border-primary/50 bg-primary/10 text-primary" :
                "border-border bg-surface/50 text-muted-foreground"
              }`}>
                {active ? <Loader2 className="h-5 w-5 animate-spin" /> :
                  completed ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                {active && <span className="absolute inset-0 -m-1 rounded-md ring-1 ring-primary/40 animate-pulse-ring" />}
              </div>
              <div className={`mt-2 text-[11px] font-semibold ${tone === "muted" ? "text-muted-foreground" : "text-foreground"}`}>{p.label}</div>
              <div className="mono text-[10px] text-muted-foreground">{p.ms} ms</div>
              {i < PIPELINE.length - 1 && (
                <ArrowRight className="absolute -right-2 top-3 hidden h-3 w-3 text-border md:block" />
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function MAEPPanel({ preview }: { preview: string }) {
  return (
    <Panel
      title="Multi-Angle Evidence Package (MAEP)"
      subtitle="Synchronized capture · cryptographically signed · legally verifiable"
      icon={Camera} code="MAEP-01"
      action={
        <div className="flex items-center gap-2">
          <span className="chip text-success border-success/30"><CheckCircle2 className="h-3 w-3" /> Legally Verifiable</span>
          <span className="chip text-primary border-primary/40">Evidence Conf 97%</span>
        </div>
      }
    >
      <div className="grid gap-3 p-3 md:grid-cols-2">
        {MAEP_CAMERAS.map((c, i) => (
          <div key={c.id} className="relative overflow-hidden rounded-md border border-border bg-background/60">
            <div className="flex items-center justify-between border-b border-border/60 px-3 py-2 text-[10px] uppercase tracking-widest">
              <span className="mono text-primary">{c.id}</span>
              <span className="text-muted-foreground">{c.angle}</span>
            </div>
            <div className="relative aspect-video">
              <img src={preview} alt={c.id} className="h-full w-full object-cover opacity-90" style={{ filter: i === 1 ? "hue-rotate(15deg)" : i === 2 ? "hue-rotate(-15deg) brightness(0.85)" : i === 3 ? "brightness(0.7) contrast(1.1)" : "none" }} />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_60%,rgba(0,0,0,0.6)_100%)]" />
              <BBox x="32%" y="22%" w="34%" h="48%" />
              <div className="absolute left-2 top-2 chip mono text-[9px]"><span className="status-dot bg-destructive animate-blink" /> REC</div>
              <div className="absolute bottom-2 left-2 mono text-[10px] text-foreground/90">2026-06-17 14:08:22.{(i * 7 + 12).toString().padStart(3, "0")}</div>
              <div className="absolute bottom-2 right-2 chip mono text-[9px] text-success border-success/30">{c.confidence}%</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-border/60 px-4 py-2.5 text-[11px]">
        <div className="flex items-center gap-3 text-muted-foreground">
          <span>SHA-256: <span className="mono text-foreground">8f2c…41a9</span></span>
          <span>·</span>
          <span>Sync drift: <span className="mono text-foreground">±3 ms</span></span>
          <span>·</span>
          <span>Chain-of-custody: <span className="mono text-success">VERIFIED</span></span>
        </div>
        <span className="mono text-[10px] text-muted-foreground">MAEP-PKG-DRSH-10248</span>
      </div>
    </Panel>
  );
}

function SumCard({ label, value, tone = "primary", mono = false, big = false }: { label: string; value: string; tone?: "primary" | "destructive" | "success" | "warning"; mono?: boolean; big?: boolean }) {
  return (
    <div className={`rounded-md border border-${tone}/30 bg-${tone}/5 p-3`}>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-1 ${mono ? "mono" : ""} ${big ? "text-base" : "text-sm"} font-semibold text-${tone}`}>{value}</div>
    </div>
  );
}

function Frame({ label, url, processing, annotated }: { label: string; url: string; processing: boolean; annotated?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-md border border-border bg-background/60">
      <div className="flex items-center justify-between border-b border-border/70 px-3 py-2">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
        <span className="mono text-[10px] text-muted-foreground">{annotated ? "YOLOv8n · 0.642" : "RAW"}</span>
      </div>
      <div className="relative aspect-video">
        <img src={url} alt={label} className="h-full w-full object-cover" />
        {annotated && (
          <>
            <BBox x="22%" y="18%" w="28%" h="46%" label="Two-Wheeler · No Helmet 96%" tone="destructive" />
            <BBox x="58%" y="34%" w="22%" h="38%" label="Sedan · OK 99%" tone="success" />
            <BBox x="6%" y="58%" w="14%" h="22%" label="Auto · Wrong Side 88%" tone="warning" />
          </>
        )}
        {processing && (
          <div className="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-primary">
              <Loader2 className="h-4 w-4 animate-spin" /> Running inference…
            </div>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-primary/70 animate-scan" style={{ height: "30%" }} />
          </div>
        )}
      </div>
    </div>
  );
}

function BBox({ x, y, w, h, label, tone = "destructive" }: { x: string; y: string; w: string; h: string; label?: string; tone?: "destructive" | "success" | "warning" }) {
  const color = tone === "destructive" ? "#ef4444" : tone === "success" ? "#22c55e" : "#f59e0b";
  return (
    <div className="absolute" style={{ left: x, top: y, width: w, height: h, border: `1.5px solid ${color}`, boxShadow: `0 0 14px ${color}55` }}>
      {label && (
        <div className="absolute -top-5 left-0 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-semibold mono" style={{ background: color, color: "#0a0f1a" }}>
          {label}
        </div>
      )}
    </div>
  );
}
