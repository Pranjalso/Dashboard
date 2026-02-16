 "use client";
import { useMemo, useState } from "react";

export default function ScheduleTable() {
  const rows = useMemo(
    () => [
      {
        patient: "John Doe",
        time: "09:30 AM",
        doctor: "Dr. Emily Smith",
        source: "Staff Entry",
        status: "Arrived",
      },
      {
        patient: "Sarah Williams",
        time: "10:15 AM",
        doctor: "Dr. Mark Adams",
        source: "WhatsApp",
        status: "Pending",
      },
      {
        patient: "Michael Brown",
        time: "11:00 AM",
        doctor: "Dr. Emily Smith",
        source: "Staff Entry",
        status: "Cancelled",
      },
      {
        patient: "Jessica Davis",
        time: "11:45 AM",
        doctor: "Dr. Mark Adams",
        source: "WhatsApp",
        status: "Rescheduled",
      }
    ],
    []
  );

  const [doctor, setDoctor] = useState("all");
  const doctors = useMemo(
    () => ["all", ...Array.from(new Set(rows.map((r) => r.doctor)))],
    [rows]
  );
  const filtered = useMemo(
    () => (doctor === "all" ? rows : rows.filter((r) => r.doctor === doctor)),
    [rows, doctor]
  );

  const statusClass = (s) => {
    const key = s.toLowerCase();
    if (key === "arrived") return "bg-green-50 text-[#7b68ee]";
    if (key === "cancelled") return "bg-red-50 text-[#DC2626]";
    if (key === "pending") return "bg-yellow-50 text-[#CA8A04]";
    if (key === "rescheduled") return "bg-blue-50 text-[#800080]";
    return "bg-gray-50 text-gray-700";
  };

  return (
    <section className="bg-white border border-[#E5E7EB] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Today’s Schedule</h2>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600">Select Doctor</label>
          <select
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-white"
          >
            {doctors.map((d) => (
              <option key={d} value={d}>
                {d === "all" ? "All Doctors" : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead className="text-xs uppercase tracking-wide text-[#64748B] border-b border-[#E5E7EB] bg-gray-50">
          <tr>
            <th className="text-left py-3 px-4 font-semibold">Patient</th>
            <th className="text-left py-3 px-4 font-semibold">Time</th>
            <th className="text-left py-3 px-4 font-semibold">Doctor</th>
            <th className="text-left py-3 px-4 font-semibold">Source</th>
            <th className="text-right py-3 px-4 font-semibold">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#E5E7EB]">
          {filtered.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="font-medium text-gray-900">{row.patient}</div>
              </td>
              <td className="py-3 px-4">
                <div className="font-semibold text-gray-900">{row.time}</div>
              </td>
              <td className="py-3 px-4">
                <div className="text-gray-900">{row.doctor}</div>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    row.source === "WhatsApp"
                      ? "bg-blue-50 text-[#0a882a]"
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {row.source}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                    row.status
                  )}`}
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
