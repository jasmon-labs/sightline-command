import { createFileRoute } from "@tanstack/react-router";
import { Panel, PageHeader, StatCard, RiskBadge } from "@/components/ui-bits";
import { CityMap } from "@/components/CityMap";
import { FLEET } from "@/lib/mockData";
import { Award, AlertTriangle, TrendingDown, Truck, MapPin } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export const Route = createFileRoute("/fleet")({
  head: () => ({ meta: [{ title: "Fleet Intelligence — DRISHTI" }] }),
  component: Fleet,
});

const trend = Array.from({ length: 14 }, (_, i) => ({
  day: `D-${14 - i}`,
  incidents: Math.round(20 + Math.sin(i / 2) * 8 + Math.random() * 6),
  score: Math.round(82 + Math.cos(i / 3) * 4 + Math.random() * 2),
}));

function Fleet() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        eyebrow="MODULE · FL-05 · FLIPKART OPS"
        title="Fleet Intelligence"
        description="Last-mile rider safety telemetry across Bengaluru delivery network."
        actions={
          <div className="flex items-center gap-2">
            <span className="chip border-primary/40 text-primary">Tenant: Flipkart</span>
            <span className="chip">Region: BLR-South</span>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Fleet Safety Score" value={FLEET.safetyScore} unit="/100" delta="+2.4 pts WoW" deltaTone="success" icon={Award} accent="success" />
        <StatCard label="Active Riders" value={FLEET.activeRiders.toLocaleString()} delta="312 on-shift" deltaTone="success" icon={Truck} accent="primary" />
        <StatCard label="Flagged · 7d" value={FLEET.flaggedThisWeek} delta="9 critical" deltaTone="danger" icon={AlertTriangle} accent="danger" />
        <StatCard label="Incident Decline" value="-14.2" unit="%" delta="vs prior 7d" deltaTone="success" icon={TrendingDown} accent="success" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel title="High-Risk Delivery Zones" subtitle="Whitefield · KR Puram · Indiranagar corridor" icon={MapPin} code="ZONE-MAP" className="col-span-12 lg:col-span-7 h-[420px]">
          <div className="p-3 h-full"><CityMap showPredicted={false} /></div>
        </Panel>

        <Panel title="Top Risk Routes" subtitle="Ranked by 7-day incident rate" code="RTE-RANK" className="col-span-12 lg:col-span-5">
          <ul className="divide-y divide-border/60">
            {FLEET.topRoutes.map((r, i) => (
              <li key={r.route} className="flex items-center gap-3 px-4 py-3">
                <span className="mono text-[10px] text-muted-foreground w-5">#{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-foreground">{r.route}</div>
                  <div className="text-[11px] text-muted-foreground">{r.incidents} incidents · 7d window</div>
                </div>
                <RiskBadge level={r.risk} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Violation Trends · 14 days" code="TRD-14D" className="col-span-12 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 20, right: 20, bottom: 10, left: -10 }}>
              <defs>
                <linearGradient id="f1" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#ef4444" stopOpacity={0.5} /><stop offset="1" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                <linearGradient id="f2" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#22c55e" stopOpacity={0.4} /><stop offset="1" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "rgba(17,24,39,0.95)", border: "1px solid #1f2937", borderRadius: 8, fontSize: 12, color: "#f9fafb" }} />
              <Area type="monotone" dataKey="incidents" stroke="#ef4444" fill="url(#f1)" strokeWidth={2} />
              <Area type="monotone" dataKey="score" stroke="#22c55e" fill="url(#f2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </div>
  );
}
