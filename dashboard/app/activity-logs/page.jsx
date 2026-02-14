"use client";
import { useState, useMemo } from "react";

const mockLogs = [
  {
    id: "LOG-12041",
    type: "Appointment",
    action: "Created appointment #APT-2041 for John Doe",
    actor: "Frontdesk Staff",
    severity: "info",
    timestamp: "2023-10-24 09:12 AM",
    source: "WHATSAPP",
  },
  {
    id: "LOG-12042",
    type: "Clinical",
    action: "Updated medication list for Jane Gill",
    actor: "Dr. Sarah Smith",
    severity: "high",
    timestamp: "2023-10-24 09:25 AM",
    source: "STAFF ENTRY",
  },
  {
    id: "LOG-12043",
    type: "Security",
    action: "New device login detected for admin account",
    actor: "System",
    severity: "critical",
    timestamp: "2023-10-24 09:40 AM",
    source: "STAFF ENTRY",
  },
  {
    id: "LOG-12044",
    type: "Patient",
    action: "Patient portal password reset for Robert Fox",
    actor: "System",
    severity: "info",
    timestamp: "2023-10-24 10:05 AM",
    source: "WHATSAPP",
  },
];

const severityBadge = (level) => {
  const value = level.toLowerCase();
  if (value === "critical") return "bg-red-100 text-red-800";
  if (value === "high") return "bg-amber-100 text-amber-800";
  if (value === "info") return "bg-blue-100 text-blue-800";
  return "bg-slate-100 text-slate-800";
};

const sourceBadge = (source) => {
  const value = source.toUpperCase();
  if (value === "WHATSAPP") return "bg-blue-50 text-blue-800";
  if (value === "STAFF ENTRY") return "bg-gray-100 text-gray-800";
  return "bg-slate-100 text-slate-800";
};

const splitTimestamp = (value) => {
  if (!value) return { date: "", time: "" };
  const [datePart, ...rest] = value.split(" ");
  const timePart = rest.join(" ").trim();
  return { date: datePart, time: timePart };
};

const getDatePart = (value) => splitTimestamp(value).date;
const getTimePart = (value) => splitTimestamp(value).time;

export default function ActivityLogsPage() {
  const [severity, setSeverity] = useState("all");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  const filteredLogs = useMemo(() => {
    return mockLogs.filter((log) => {
      if (severity !== "all" && log.severity.toLowerCase() !== severity) return false;
      if (type !== "all" && log.type.toLowerCase() !== type) return false;
      if (!search.trim()) return true;
      const term = search.toLowerCase();
      return (
        log.action.toLowerCase().includes(term) ||
        log.actor.toLowerCase().includes(term) ||
        log.id.toLowerCase().includes(term)
      );
    });
  }, [severity, search, type]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Activity Logs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete audit trail of user actions, clinical updates, and system events.
          </p>
        </div>
        <button className="btn-secondary text-sm">Export CSV</button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-wrap gap-2 text-xs md:text-sm">
            <button
              onClick={() => setSeverity("all")}
              className={`px-3 py-2 rounded-lg border text-xs md:text-sm ${
                severity === "all"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              All Severities
            </button>
            <button
              onClick={() => setSeverity("info")}
              className={`px-3 py-2 rounded-lg border text-xs md:text-sm ${
                severity === "info"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Info
            </button>
            <button
              onClick={() => setSeverity("high")}
              className={`px-3 py-2 rounded-lg border text-xs md:text-sm ${
                severity === "high"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              High
            </button>
            <button
              onClick={() => setSeverity("critical")}
              className={`px-3 py-2 rounded-lg border text-xs md:text-sm ${
                severity === "critical"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Critical
            </button>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white min-w-[140px]"
            >
              <option value="all">All Types</option>
              <option value="appointment">Appointment</option>
              <option value="clinical">Clinical</option>
              <option value="patient">Patient</option>
              <option value="security">Security</option>
            </select>
            <div className="relative">
              <input
                type="text"
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white w-full md:w-64"
              />
              <svg
                className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M10.5 17a6.5 6.5 0 100-13 6.5 6.5 0 000 13z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Logs table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">Event</th>
                <th className="text-left px-4 py-3">Actor</th>
                <th className="text-left px-4 py-3">Severity</th>
                <th className="text-left px-4 py-3">Timestamp</th>
                <th className="text-left px-4 py-3">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{log.type}</div>
                    <div className="text-xs text-gray-600">{log.action}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">{log.actor}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${severityBadge(
                        log.severity
                      )}`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    <div className="font-semibold text-gray-900">{getDatePart(log.timestamp)}</div>
                    {getTimePart(log.timestamp) && (
                      <div className="text-xs text-gray-500">{getTimePart(log.timestamp)}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${sourceBadge(
                        log.source
                      )}`}
                    >
                      {log.source}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                    No activity logs match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden p-4 space-y-3">
          {filteredLogs.map((log) => (
            <div key={log.id} className="border border-gray-200 rounded-xl p-3 text-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-900">{log.type}</span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${severityBadge(
                    log.severity
                  )}`}
                >
                  {log.severity}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-1">{log.action}</p>
              <p className="text-[11px] text-gray-500 mb-1">
                <span className="font-semibold text-gray-900">{getDatePart(log.timestamp)}</span>{" "}
                {getTimePart(log.timestamp) && (
                  <span className="text-gray-500">• {getTimePart(log.timestamp)}</span>
                )}{" "}
                • {log.actor}
              </p>
              <p className="text-[11px] text-gray-500">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${sourceBadge(
                    log.source
                  )}`}
                >
                  {log.source}
                </span>
              </p>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <p className="text-sm text-gray-500 text-center">
              No activity logs match the selected filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

