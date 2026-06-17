import { createFileRoute } from "@tanstack/react-router";
import { Panel, PageHeader, StatCard, RiskBadge } from "@/components/ui-bits";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { HOURLY_TREND, TOP_JUNCTIONS, VIOLATION_BREAKDOWN } from "@/lib/mockData";
import { Activity, Gauge, ScanLine, Users } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — DRISHTI" }] }),
  component: Analytics,
});

const tooltipStyle = {
  background: "rgba(17,24,39,0.95)",
  border: "1px solid #1f2937",
  borderRadius: 8,
  fontSize: 12,
  color: "#f9fafb",
};

function Analytics() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        eyebrow="MODULE · AT-04"
        title="Analytics"
        description="Operational performance and detection telemetry · last 24h."
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Violation Rate" value="3.41" unit="/min" delta="+8.2%" deltaTone="danger" icon={Activity} accent="danger" />
        <StatCard label="Detection Precision" value="96.8" unit="%" delta="+0.4 pts" deltaTone="success" icon={ScanLine} accent="success" />
        <StatCard label="Avg OCR Confidence" value="94.2" unit="%" delta="+1.1 pts" deltaTone="success" icon={Gauge} accent="primary" />
        <StatCard label="Repeat Offenders" value="218" delta="14 new" deltaTone="warning" icon={Users} accent="warning" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel title="Violation Trend · 24h" subtitle="Helmet · Red Light · Wrong Side" code="TRD-24H" className="col-span-12 lg:col-span-8 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={HOURLY_TREND} margin={{ top: 20, right: 20, bottom: 10, left: -10 }}>
              <defs>
                <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3b82f6" stopOpacity={0.6} /><stop offset="1" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#ef4444" stopOpacity={0.55} /><stop offset="1" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                <linearGradient id="g3" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#f59e0b" stopOpacity={0.55} /><stop offset="1" stopColor="#f59e0b" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="hour" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#9ca3af" }} />
              <Area type="monotone" dataKey="helmet" stroke="#3b82f6" fill="url(#g1)" strokeWidth={2} />
              <Area type="monotone" dataKey="redLight" stroke="#ef4444" fill="url(#g2)" strokeWidth={2} />
              <Area type="monotone" dataKey="wrongSide" stroke="#f59e0b" fill="url(#g3)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Distribution by Type" code="DIST-TYPE" className="col-span-12 lg:col-span-4 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip contentStyle={tooltipStyle} />
              <Pie data={VIOLATION_BREAKDOWN} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} stroke="#0a0f1a" strokeWidth={2}>
                {VIOLATION_BREAKDOWN.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11, color: "#9ca3af" }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Violation Breakdown · Today" code="BRK-TYPE" className="col-span-12 lg:col-span-7 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={VIOLATION_BREAKDOWN} margin={{ top: 20, right: 20, bottom: 10, left: -10 }}>
              <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#1f2937", opacity: 0.4 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {VIOLATION_BREAKDOWN.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Top Junctions" code="JCT-LDR" className="col-span-12 lg:col-span-5">
          <ul className="divide-y divide-border/60">
            {TOP_JUNCTIONS.map((j, i) => (
              <li key={j.junction} className="grid grid-cols-12 items-center gap-3 px-4 py-2.5">
                <span className="mono text-[10px] text-muted-foreground col-span-1">#{i + 1}</span>
                <span className="col-span-5 truncate text-sm text-foreground">{j.junction}</span>
                <div className="col-span-4 h-1.5 rounded-full bg-border/40 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-destructive" style={{ width: `${Math.min(100, j.violations / 4.5)}%` }} />
                </div>
                <span className="col-span-1 mono text-xs text-right text-foreground">{j.violations}</span>
                <span className="col-span-1 flex justify-end"><RiskBadge level={j.risk} /></span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
