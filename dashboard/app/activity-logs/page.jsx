"use client";
import { useState, useMemo } from "react";

const mockLogs = [
  {
    id: "LOG-12041",
    eventType: "New Appointment",
    patientName: "John Doe",
    appointmentId: "#APT-2041",
    dateTime: "Oct 24, 2023 10:00 AM",
    timestamp: "2023-10-24 09:12 AM",
    source: "WHATSAPP",
  },
  {
    id: "LOG-12042",
    eventType: "New Patient Added",
    patientName: "Jane Gill",
    appointmentId: null,
    dateTime: null,
    timestamp: "2023-10-24 09:25 AM",
    source: "STAFF ENTRY",
  },
  {
    id: "LOG-12043",
    eventType: "Patient Deleted",
    patientName: "Robert Fox",
    appointmentId: null,
    dateTime: null,
    timestamp: "2023-10-24 09:40 AM",
    source: "STAFF ENTRY",
  },
  {
    id: "LOG-12044",
    eventType: "Patient Canceled Appointment",
    patientName: "Emily Day",
    appointmentId: "#APT-1027",
    dateTime: "Oct 25, 2023 09:00 AM",
    timestamp: "2023-10-24 10:05 AM",
    source: "WHATSAPP",
  },
  {
    id: "LOG-12045",
    eventType: "Patient Rescheduled Appointment",
    patientName: "John Doe",
    appointmentId: "#APT-2041",
    dateTime: "Oct 26, 2023 2:00 PM",
    timestamp: "2023-10-24 11:20 AM",
    source: "STAFF ENTRY",
  },
];

const sourceBadge = (source) => {
  const value = source?.toUpperCase() || "";
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

const getEventDetails = (log) => {
  const parts = [];
  if (log.patientName) parts.push(log.patientName);
  if (log.appointmentId) parts.push(log.appointmentId);
  if (log.dateTime) parts.push(log.dateTime);
  return parts.join(" • ") || "—";
};

export default function ActivityLogsPage() {
  const [eventFilter, setEventFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredLogs = useMemo(() => {
    return mockLogs.filter((log) => {
      if (eventFilter !== "all" && log.eventType.toLowerCase().replace(/\s/g, "-") !== eventFilter) return false;
      if (!search.trim()) return true;
      const term = search.toLowerCase();
      return (
        log.eventType.toLowerCase().includes(term) ||
        log.patientName?.toLowerCase().includes(term) ||
        log.appointmentId?.toLowerCase().includes(term) ||
        log.id.toLowerCase().includes(term)
      );
    });
  }, [eventFilter, search]);

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

      {/* Filters - dark green toggle buttons */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-wrap gap-2 text-xs md:text-sm">
            <button
              onClick={() => setEventFilter("all")}
              className={`px-3 py-2 rounded-lg border text-xs md:text-sm ${
                eventFilter === "all"
                  ? "bg-[#0F766E] text-white border-[#0F766E]"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setEventFilter("new-appointment")}
              className={`px-3 py-2 rounded-lg border text-xs md:text-sm ${
                eventFilter === "new-appointment"
                  ? "bg-[#0F766E] text-white border-[#0F766E]"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              New Appointment
            </button>
            <button
              onClick={() => setEventFilter("new-patient-added")}
              className={`px-3 py-2 rounded-lg border text-xs md:text-sm ${
                eventFilter === "new-patient-added"
                  ? "bg-[#0F766E] text-white border-[#0F766E]"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              New Patient Added
            </button>
            <button
              onClick={() => setEventFilter("patient-deleted")}
              className={`px-3 py-2 rounded-lg border text-xs md:text-sm ${
                eventFilter === "patient-deleted"
                  ? "bg-[#0F766E] text-white border-[#0F766E]"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Patient Deleted
            </button>
            <button
              onClick={() => setEventFilter("patient-canceled-appointment")}
              className={`px-3 py-2 rounded-lg border text-xs md:text-sm ${
                eventFilter === "patient-canceled-appointment"
                  ? "bg-[#0F766E] text-white border-[#0F766E]"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Patient Canceled
            </button>
            <button
              onClick={() => setEventFilter("patient-rescheduled-appointment")}
              className={`px-3 py-2 rounded-lg border text-xs md:text-sm ${
                eventFilter === "patient-rescheduled-appointment"
                  ? "bg-[#0F766E] text-white border-[#0F766E]"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Patient Rescheduled
            </button>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
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

      {/* Logs table - Event, Details, Timestamp, Source (Actor and Severity hidden) */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">Event</th>
                <th className="text-left px-4 py-3">Timestamp</th>
                <th className="text-left px-4 py-3">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{log.eventType}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{getEventDetails(log)}</div>
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
                  <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500">
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
              <div className="font-semibold text-gray-900 mb-1">{log.eventType}</div>
              <p className="text-xs text-gray-600 mb-2">{getEventDetails(log)}</p>
              <p className="text-[11px] text-gray-500 mb-1">
                <span className="font-semibold text-gray-900">{getDatePart(log.timestamp)}</span>{" "}
                {getTimePart(log.timestamp) && (
                  <span className="text-gray-500">• {getTimePart(log.timestamp)}</span>
                )}
              </p>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${sourceBadge(
                  log.source
                )}`}
              >
                {log.source}
              </span>
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

