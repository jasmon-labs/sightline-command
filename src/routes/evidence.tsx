import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Panel, PageHeader, RiskBadge } from "@/components/ui-bits";
import { VIOLATIONS, formatTime, type Violation } from "@/lib/mockData";
import { Download, Eye, Filter, Search, ShieldCheck, X, MapPin, Clock, Hash, Camera } from "lucide-react";

export const Route = createFileRoute("/evidence")({
  head: () => ({ meta: [{ title: "Evidence Log — DRISHTI" }] }),
  component: EvidenceLog,
});

function EvidenceLog() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Violation | null>(null);

  const rows = VIOLATIONS.filter((v) =>
    [v.id, v.type, v.location, v.plate].some((s) => s.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        eyebrow="MODULE · EV-03"
        title="Evidence Log"
        description="Investigation console · tamper-evident registry · cryptographically signed."
        actions={
          <div className="flex items-center gap-2">
            <button className="chip"><Filter className="h-3 w-3" /> Filter</button>
            <button className="chip border-primary/40 text-primary"><Download className="h-3 w-3" /> Export CSV</button>
          </div>
        }
      />

      <Panel title="Investigation Filters" subtitle="Narrow registry by violation type, junction, confidence, date range" code="INV-FLT">
        <div className="grid gap-3 p-4 md:grid-cols-4">
          <FilterGroup label="Violation Type" options={["All", "Helmet", "Red Light", "Wrong Side", "Triple Riding"]} active="All" />
          <FilterGroup label="Junction" options={["All", "Whitefield", "KR Puram", "Silk Board", "Hebbal", "Indiranagar"]} active="All" />
          <FilterGroup label="Confidence" options={["≥ 80%", "≥ 90%", "≥ 95%"]} active="≥ 90%" />
          <FilterGroup label="Date Range" options={["24h", "7d", "30d", "Custom"]} active="24h" />
        </div>
      </Panel>

      <Panel
        title="Registry"
        subtitle={`${rows.length} records · last sync 04s ago`}
        code="EVD-DB"
        action={
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search by ID, plate, junction…"
              className="w-72 rounded-md border border-border bg-background/60 py-1.5 pl-7 pr-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
        }
      >
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-surface/95 text-left text-[10px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
              <tr className="border-b border-border">
                <th className="px-4 py-2.5">Evidence ID</th>
                <th className="px-4 py-2.5">Timestamp</th>
                <th className="px-4 py-2.5">Violation</th>
                <th className="px-4 py-2.5">Plate</th>
                <th className="px-4 py-2.5">Location</th>
                <th className="px-4 py-2.5">Confidence</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => (
                <tr key={v.id} className="border-b border-border/50 transition hover:bg-accent/30">
                  <td className="px-4 py-2.5 mono text-primary">{v.id}</td>
                  <td className="px-4 py-2.5 mono text-muted-foreground">{new Date(v.timestamp).toLocaleString("en-IN", { hour12: false })}</td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded border border-destructive/40 bg-destructive/15 px-1.5 py-0.5 text-[11px] font-semibold text-destructive">{v.type}</span>
                  </td>
                  <td className="px-4 py-2.5 mono text-foreground">{v.plate}</td>
                  <td className="px-4 py-2.5 text-foreground">{v.location}</td>
                  <td className="px-4 py-2.5 mono text-foreground">{v.confidence}%</td>
                  <td className="px-4 py-2.5">
                    <StatusPill status={v.status} />
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setSelected(v)} className="inline-flex items-center gap-1 rounded border border-border bg-surface px-2 py-1 text-[11px] hover:border-primary hover:text-primary">
                        <Eye className="h-3 w-3" /> View
                      </button>
                      <button className="inline-flex items-center gap-1 rounded border border-border bg-surface px-2 py-1 text-[11px] hover:border-primary hover:text-primary">
                        <Download className="h-3 w-3" /> JSON
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {selected && <EvidenceModal v={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function StatusPill({ status }: { status: Violation["status"] }) {
  const map = {
    Verified: "text-success border-success/30 bg-success/10",
    Pending: "text-warning border-warning/30 bg-warning/10",
    Disputed: "text-destructive border-destructive/30 bg-destructive/10",
  } as const;
  return <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${map[status]}`}><span className="status-dot bg-current" />{status}</span>;
}

function FilterGroup({ label, options, active }: { label: string; options: string[]; active: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button key={o} className={`chip ${o === active ? "border-primary/50 text-primary bg-primary/10" : "hover:text-foreground"}`}>{o}</button>
        ))}
      </div>
    </div>
  );
}


function EvidenceModal({ v, onClose }: { v: Violation; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-6 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="panel relative w-full max-w-4xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-primary">Evidence Brief</div>
            <div className="mono text-lg font-semibold text-foreground">{v.id}</div>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md border border-border hover:text-destructive hover:border-destructive"><X className="h-4 w-4" /></button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-md border border-border bg-background/60">
            <div className="flex items-center justify-between border-b border-border/60 px-3 py-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>Annotated Frame</span>
              <span className="mono text-primary">CAM-{(parseInt(v.id.slice(-3)) % 24 + 1).toString().padStart(3, "0")}</span>
            </div>
            <div className="relative aspect-video grid-bg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-destructive/15" />
              <div className="absolute" style={{ left: "30%", top: "22%", width: "40%", height: "55%", border: "1.5px solid #ef4444", boxShadow: "0 0 18px #ef444466" }}>
                <div className="absolute -top-5 left-0 rounded px-1.5 py-0.5 mono text-[10px] font-semibold" style={{ background: "#ef4444", color: "#0a0f1a" }}>{v.type} · {v.confidence}%</div>
              </div>
              <div className="absolute bottom-2 left-2 chip"><Camera className="h-3 w-3" /> {v.location}</div>
              <div className="absolute bottom-2 right-2 chip mono">{formatTime(v.timestamp)}</div>
            </div>
          </div>

          <div className="space-y-3">
            <Meta icon={Hash} label="Plate (OCR)" value={v.plate} confidence="99.1%" />
            <Meta icon={MapPin} label="Junction" value={v.location} />
            <Meta icon={Clock} label="Timestamp" value={new Date(v.timestamp).toLocaleString("en-IN", { hour12: false })} />
            <Meta icon={ShieldCheck} label="Verification" value={v.status} />

            <div className="rounded-md border border-border bg-background/60 p-3">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Detection Stack</div>
              <ul className="mt-2 space-y-1 mono text-[11px]">
                <li className="flex justify-between"><span className="text-muted-foreground">model</span><span className="text-foreground">YOLOv8n · v3.2.1</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">conf</span><span className="text-success">{v.confidence}%</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">ocr</span><span className="text-foreground">PaddleOCR · 99.1%</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">latency</span><span className="text-foreground">42 ms</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">sha256</span><span className="text-muted-foreground">8f2…c41a</span></li>
              </ul>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Approve & Issue Challan</button>
              <button className="rounded-md border border-border bg-surface px-3 py-2 text-sm hover:border-destructive hover:text-destructive">Dispute</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta({ icon: Icon, label, value, confidence }: { icon: any; label: string; value: string; confidence?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-background/40 p-3">
      <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="mono text-sm text-foreground truncate">{value}</div>
      </div>
      {confidence && <span className="mono text-[11px] text-success">{confidence}</span>}
    </div>
  );
}
