"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Settings, Server, Database, Shield, Activity, Route, Plane, BarChart3 } from "lucide-react";
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
    <div>
      <PageHeader
        title="Admin Panel"
        description="System configuration, health monitoring, and management"
        icon={Settings}
      />

      {/* System Health */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-gray-500">System Status</span>
          </div>
          <p className="text-lg font-bold text-green-600">Healthy</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-xs font-medium text-gray-500 mb-1">Active Sources</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{activeSources}/{DATA_SOURCES.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-xs font-medium text-gray-500 mb-1">Total Records</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{totalRecords.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-xs font-medium text-gray-500 mb-1">Data Quality</p>
          <p className="text-lg font-bold text-green-600">{stats.dataQuality}%</p>
        </div>
      </div>

      {/* Admin Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {sections.map((section) => (
          <Link
            key={section.name}
            href={section.href}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                <section.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{section.name}</h3>
                {section.count !== null && (
                  <p className="text-xs text-gray-400">{section.count} items</p>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{section.description}</p>
          </Link>
        ))}
      </div>

      {/* Execution Trace */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Last Execution Trace</h3>
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
              <span className="text-xs text-gray-400 font-mono w-16">{trace.time}</span>
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{trace.step}</span>
              <span className="ml-auto text-xs text-green-600 font-medium">✓</span>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Mode */}
      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">Demo Mode</h3>
        <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
          The application is currently running in Demo Mode with simulated data.
          All data shown is for demonstration purposes and does not represent live fare observations.
        </p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">DEMO DATA ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
