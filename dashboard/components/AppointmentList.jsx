 "use client";
import Link from "next/link";

const rows = [
  {
    id: "APT-3001",
    patientName: "Alice Moore",
    doctorName: "Dr. Sarah Jenkins",
    timeSlot: "10:00 AM - 10:30 AM",
    date: "Oct 24, 2023",
    status: "New",
  },
  {
    id: "APT-3002",
    patientName: "Robert Brown",
    doctorName: "Dr. Michael Chen",
    timeSlot: "02:30 PM - 03:00 PM",
    date: "Oct 24, 2023",
    status: "Confirmed",
  },
  {
    id: "APT-3003",
    patientName: "Catherine Hall",
    doctorName: "Dr. Jessica Wu",
    timeSlot: "09:00 AM - 09:30 AM",
    date: "Oct 25, 2023",
    status: "New",
  },
];

const statusBadge = (status) => {
  const v = (status || "").toLowerCase();
  if (v === "confirmed") return "bg-green-100 text-green-800";
  if (v === "new") return "bg-blue-100 text-blue-800";
  if (v === "canceled") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

export default function AppointmentList() {
  return (
    <section className="bg-white border border-gray-300 rounded-xl p-5">
      <header className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-900">Recent Appointments</h2>
        <Link href="/appointments" className="text-sm text-[#0F766E] hover:underline font-medium">
          View Recent
        </Link>
      </header>

      <div className="hidden md:block">
        <div className="max-h-[192px] overflow-auto border-t border-gray-300">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wide sticky top-0 z-10">
              <tr>
                <th className="text-left px-4 py-3 whitespace-nowrap">Patient Name</th>
                <th className="text-left px-4 py-3 whitespace-nowrap">Doctor Name</th>
                <th className="text-left px-4 py-3 whitespace-nowrap">Time Slot</th>
                <th className="text-left px-4 py-3 whitespace-nowrap">Date</th>
                <th className="text-left px-4 py-3 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 whitespace-nowrap">{row.patientName}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    <div className="whitespace-nowrap">{row.doctorName}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    <div className="whitespace-nowrap">{row.timeSlot}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    <div className="whitespace-nowrap">{row.date}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusBadge(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3 max-h-64 overflow-y-auto text-sm">
        {rows.map((row) => (
          <div key={row.id} className="border border-gray-300 rounded-xl p-3">
            <div className="font-semibold text-gray-900">{row.patientName}</div>
            <div className="text-xs text-gray-600 mt-1">{row.doctorName}</div>
            <div className="text-xs text-gray-600">{row.timeSlot}</div>
            <div className="text-xs text-gray-600">{row.date}</div>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium mt-2 ${statusBadge(row.status)}`}>
              {row.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
