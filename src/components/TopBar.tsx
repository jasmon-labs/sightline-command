import { useEffect, useState } from "react";
import { Activity, Cpu, Radio, ShieldCheck } from "lucide-react";

export function TopBar() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now ? now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }) : "--:--:--";
  const date = now ? now.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <header className="relative z-20 flex h-14 items-center justify-between border-b border-border bg-background/70 px-5 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="relative grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-primary/30 to-primary/5 ring-1 ring-primary/40">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse-ring" />
          </div>
          <div className="leading-tight">
            <div className="font-mono text-[15px] font-semibold tracking-[0.18em] text-foreground">
              DRISHTI <span className="text-muted-foreground">दृष्टि</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Traffic Intelligence Command Center
            </div>
          </div>
        </div>
        <div className="ml-2 hidden items-center gap-2 chip text-success md:inline-flex">
          <span className="status-dot bg-success animate-blink" />
          OPERATIONAL
        </div>
      </div>

      <div className="hidden items-center gap-6 md:flex">
        <div className="text-center leading-tight">
          <div className="mono text-[20px] font-semibold tabular-nums text-foreground">{time} <span className="ml-1 text-[11px] text-muted-foreground">IST</span></div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{date}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <StatusPill icon={Radio} label="Backend" value="ONLINE" tone="success" />
        <StatusPill icon={Cpu} label="Model" value="YOLOv8n" tone="info" />
        <StatusPill icon={Activity} label="Latency" value="42 ms" tone="info" />
        <StatusPill icon={ShieldCheck} label="Health" value="98%" tone="success" />
      </div>
    </header>
  );
}

function StatusPill({
  icon: Icon, label, value, tone,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; tone: "success" | "info" | "warning" | "danger" }) {
  const toneClass = {
    success: "text-success",
    info: "text-primary",
    warning: "text-warning",
    danger: "text-destructive",
  }[tone];
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-surface/60 px-2.5 py-1.5">
      <Icon className={`h-3.5 w-3.5 ${toneClass}`} />
      <div className="leading-tight">
        <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
        <div className={`mono text-[11px] font-semibold ${toneClass}`}>{value}</div>
      </div>
    </div>
  );
}
