 "use client";
import Link from "next/link";
import { useMemo } from "react";
 
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
  if (value === "WHATSAPP") return "bg-green-50 text-green-800";
  if (value === "STAFF ENTRY") return "bg-blue-50 text-blue-800";
  return "bg-slate-100 text-slate-800";
};

const displaySource = (source) => {
  const value = (source || "").toUpperCase();
  if (value === "WHATSAPP") return "WhatsApp";
  if (value === "STAFF ENTRY") return "Staff Entry";
  return source || "";
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
 
export default function ActivityLogPreview() {
  const logs = useMemo(() => mockLogs, []);
 
  return (
    <section className="bg-white border border-gray-300 rounded-xl p-5">
      <header className="flex justify-between mb-4">
        <h2 className="font-semibold">Activity Logs</h2>
        <Link
          href="/activity-logs"
          className="text-sm text-[#0F766E] hover:underline font-medium"
        >
          View All
        </Link>
      </header>
 
      <div className="hidden md:block">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3 w-1/2">Event</th>
              <th className="text-left px-4 py-3 w-1/4">Timestamp</th>
              <th className="text-left px-4 py-3 w-1/4">Source</th>
            </tr>
          </thead>
        </table>
        <div className="max-h-[192px] overflow-y-auto border-t border-gray-300">
          <table className="w-full text-sm table-fixed">
            <tbody className="divide-y divide-gray-300">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 w-1/2">
                    <div className="font-medium text-gray-900">{log.eventType}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{getEventDetails(log)}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 w-1/4">
                    <div className="font-semibold text-gray-900">{getDatePart(log.timestamp)}</div>
                    {getTimePart(log.timestamp) && (
                      <div className="text-xs text-gray-500">{getTimePart(log.timestamp)}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 w-1/4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${sourceBadge(
                        log.source
                      )}`}
                    >
                      {displaySource(log.source)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
 
      <div className="md:hidden space-y-3 max-h-64 overflow-y-auto">
        {logs.map((log) => (
          <div key={log.id} className="border border-gray-400 rounded-xl p-3 text-sm">
            <div className="font-semibold text-gray-900 mb-1">{log.eventType}</div>
            <p className="text-xs text-gray-600 mb-2">{getEventDetails(log)}</p>
            <p className="text-[11px] text-gray-500 mb-1">
              <span className="font-semibold text-gray-900">{getDatePart(log.timestamp)}</span>{" "}
              {getTimePart(log.timestamp) && (
                <span className="text-gray-500">• {getTimePart(log.timestamp)}</span>
              )}
            </p>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap ${sourceBadge(
                log.source
              )}`}
            >
              {displaySource(log.source)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
