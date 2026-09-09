"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Settings, Server, Database, Shield, Route, Plane, BarChart3 } from "lucide-react";
import { DATA_SOURCES, ROUTES, AIRLINES, getCurrentStats } from "@/lib/demo-data";
import Link from "next/link";

const sections = [
  { name: "Sources", href: "/admin/sources", icon: Database, count: DATA_SOURCES.length, description: "Manage data source connectors" },
  { name: "Routes", href: "/routes", icon: Route, count: ROUTES.length, description: "Configure route basket" },
  { name: "Airlines", href: "/airlines", icon: Plane, count: AIRLINES.length, description: "Manage airline definitions" },
  { name: "Observation Rules", href: "/admin", icon: Shield, count: null, description: "Configure booking windows and rules" },
  { name: "Index Configuration", href: "/index-page", icon: BarChart3, count: null, description: "Base period, weights, aggregation" },
  { name: "Data Quality", href: "/data", icon: Shield, count: null, description: "Quality metrics and monitoring" },
  { name: "Model Versions", href: "/forecast", icon: BarChart3, count: null, description: "Forecast model management" },
  { name: "System Logs", href: "/admin", icon: Server, count: null, description: "Execution trace and audit logs" },
];

export default function AdminPage() {
  const stats = getCurrentStats();
  const activeSources = DATA_SOURCES.filter(s => s.status === "Active").length;
  const totalRecords = DATA_SOURCES.reduce((a, b) => a + b.records, 0);

  return (
    <div className="animate-rise">
      <PageHeader
        title="Admin Panel"
        description="System configuration, health monitoring, and management"
        icon={Settings}
      />

      {/* System Health */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-9">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[color:var(--down)]" />
            <span className="kicker">System Status</span>
          </div>
          <p className="text-lg font-semibold text-[color:var(--down)]">Healthy</p>
        </div>
        <div className="card p-5">
          <p className="kicker mb-2">Active Sources</p>
          <p className="num text-lg text-[color:var(--foreground)]">{activeSources}/{DATA_SOURCES.length}</p>
        </div>
        <div className="card p-5">
          <p className="kicker mb-2">Total Records</p>
          <p className="num text-lg text-[color:var(--foreground)]">{totalRecords.toLocaleString("en-IN")}</p>
        </div>
        <div className="card p-5">
          <p className="kicker mb-2">Data Quality</p>
          <p className="num text-lg text-[color:var(--down)]">{stats.dataQuality}%</p>
        </div>
      </div>

      {/* Admin Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-9">
        {sections.map((section) => (
          <Link
            key={section.name}
            href={section.href}
            className="card p-5 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-[0.8rem] bg-[color:var(--accent-soft)] border border-[#ecd9c4]/60 flex items-center justify-center">
                <section.icon className="w-5 h-5 text-[color:var(--accent)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[color:var(--foreground)]">{section.name}</h3>
                {section.count !== null && (
                  <p className="text-xs text-[color:var(--muted)]">{section.count} items</p>
                )}
              </div>
            </div>
            <p className="text-xs text-[color:var(--muted)] leading-relaxed">{section.description}</p>
          </Link>
        ))}
      </div>

      {/* Execution Trace */}
      <div className="card p-6 sm:p-7 mb-9">
        <h3 className="text-xl text-[color:var(--foreground)] mb-5">Last Execution Trace</h3>
        <div className="space-y-3">
          {[
            { time: "10:02:05", step: "Query received", status: "complete" },
            { time: "10:02:05", step: "Source observations loaded (124,580 records)", status: "complete" },
            { time: "10:02:06", step: "Validation complete", status: "complete" },
            { time: "10:02:06", step: "Duplicate check complete (1,420 duplicates found)", status: "complete" },
            { time: "10:02:07", step: "Fare normalized", status: "complete" },
            { time: "10:02:07", step: "Canonical flight matched", status: "complete" },
            { time: "10:02:08", step: "Forecast generated (50 routes)", status: "complete" },
            { time: "10:02:08", step: "Index updated: 127.6 (+0.8%)", status: "complete" },
          ].map((trace, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-[color:var(--muted)] font-mono w-16 flex-shrink-0">{trace.time}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--down)] flex-shrink-0" />
              <span className="text-sm text-[color:var(--foreground)]/85">{trace.step}</span>
              <span className="ml-auto text-xs text-[color:var(--down)] font-semibold">✓</span>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Mode */}
      <div className="bg-[color:var(--peach-soft)]/80 border border-[#ecd9c4] rounded-2xl p-6">
        <h3 className="text-lg text-[color:var(--accent-strong)] mb-2">Demo Mode</h3>
        <p className="text-sm text-[color:var(--accent-strong)]/85 leading-relaxed mb-4">
          The application is currently running in Demo Mode with simulated data.
          All data shown is for demonstration purposes and does not represent live fare observations.
        </p>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[color:var(--accent)] animate-pulse" />
          <span className="text-sm font-semibold text-[color:var(--accent-strong)]">DEMO DATA ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
