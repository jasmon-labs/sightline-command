import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Panel, PageHeader } from "@/components/ui-bits";
import { CloudUpload, FileImage, Loader2, ShieldAlert, ShieldCheck, X } from "lucide-react";
import { VIOLATIONS } from "@/lib/mockData";

export const Route = createFileRoute("/analyze")({
  head: () => ({ meta: [{ title: "Analyze — DRISHTI" }] }),
  component: Analyze,
});

type Detection = {
  vehicle: string; violation: string | null; confidence: number; plate: string; ts: string;
};

const SAMPLE_DETECTIONS: Detection[] = [
  { vehicle: "Two-Wheeler", violation: "No Helmet", confidence: 96.4, plate: "KA51MZ4421", ts: "14:08:22" },
  { vehicle: "Two-Wheeler", violation: "Triple Riding", confidence: 91.2, plate: "KA03HN7782", ts: "14:08:22" },
  { vehicle: "Sedan", violation: null, confidence: 99.1, plate: "KA09AB1029", ts: "14:08:22" },
  { vehicle: "Auto Rickshaw", violation: "Wrong Side", confidence: 88.7, plate: "KA01C9988", ts: "14:08:22" },
  { vehicle: "Delivery Van", violation: null, confidence: 97.5, plate: "KA53FK8821", ts: "14:08:22" },
];

function Analyze() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setFile(f);
    setDone(false);
    setProcessing(true);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setTimeout(() => { setProcessing(false); setDone(true); }, 1600);
  }

  function reset() {
    setFile(null); setPreview(null); setDone(false); setProcessing(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        eyebrow="MODULE · AN-02"
        title="Analyze"
        description="Upload an image or video segment for real-time violation inference."
      />

      {!file && (
        <Panel className="min-h-[360px]">
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
            className="m-3 flex h-[340px] cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-border bg-background/40 transition hover:border-primary/60 hover:bg-primary/5"
          >
            <input ref={inputRef} type="file" accept="image/*,video/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            <div className="grid h-16 w-16 place-items-center rounded-xl bg-primary/15 ring-1 ring-primary/40">
              <CloudUpload className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <div className="text-base font-semibold text-foreground">Drop evidence here</div>
              <div className="text-xs text-muted-foreground">JPG · PNG · MP4 · up to 250MB · YOLOv8n + PaddleOCR pipeline</div>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="chip">Image</span>
              <span className="chip">Video</span>
              <span className="chip">Live RTSP</span>
            </div>
          </label>
        </Panel>
      )}

      {file && (
        <>
          <Panel
            title="Inference Result"
            subtitle={`${file.name} · ${(file.size / 1024).toFixed(1)} KB`}
            icon={FileImage} code="INF-001"
            action={<button onClick={reset} className="chip hover:text-destructive"><X className="h-3 w-3" /> Clear</button>}
          >
            <div className="grid gap-3 p-3 md:grid-cols-2">
              <Frame label="Original" url={preview!} processing={false} />
              <Frame label="Annotated · YOLOv8n" url={preview!} processing={processing} annotated />
            </div>
          </Panel>

          <Panel title="Detection Results" subtitle="Per-object classification with OCR plate extraction" code="DET-TBL">
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="px-4 py-2.5">Vehicle</th>
                    <th className="px-4 py-2.5">Violation</th>
                    <th className="px-4 py-2.5">Confidence</th>
                    <th className="px-4 py-2.5">License Plate</th>
                    <th className="px-4 py-2.5">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_DETECTIONS.map((d, i) => {
                    const isViolation = !!d.violation;
                    return (
                      <tr key={i} className={`border-b border-border/60 transition hover:bg-accent/30 ${isViolation ? "bg-destructive/5" : ""}`}>
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
                        <td className="px-4 py-3 mono text-muted-foreground">{d.ts}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </>
      )}

      {done && (
        <div className="text-[11px] text-muted-foreground">
          Inference completed in <span className="mono text-foreground">42 ms</span> · evidence ID <span className="mono text-primary">{VIOLATIONS[0].id}</span> queued to log.
        </div>
      )}
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
        {annotated && !processing && (
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

function BBox({ x, y, w, h, label, tone }: { x: string; y: string; w: string; h: string; label: string; tone: "destructive" | "success" | "warning" }) {
  const color = tone === "destructive" ? "#ef4444" : tone === "success" ? "#22c55e" : "#f59e0b";
  return (
    <div className="absolute" style={{ left: x, top: y, width: w, height: h, border: `1.5px solid ${color}`, boxShadow: `0 0 14px ${color}55` }}>
      <div className="absolute -top-5 left-0 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-semibold mono" style={{ background: color, color: "#0a0f1a" }}>
        {label}
      </div>
    </div>
  );
}
