export default function ScheduleTable() {
  return (
    <section className="bg-white border border-[#E5E7EB] rounded-xl p-5">
      <h2 className="font-semibold mb-4 text-gray-900">Today’s Schedule</h2>

      <table className="w-full text-sm">
        <thead className="text-xs uppercase tracking-wide text-[#64748B] border-b border-[#E5E7EB] bg-gray-50">
          <tr>
            <th className="text-left py-3 px-4 font-semibold">Patient</th>
            <th className="text-left py-3 px-4 font-semibold">Time</th>
            <th className="text-left py-3 px-4 font-semibold">Doctor</th>
            <th className="text-right py-3 px-4 font-semibold">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#E5E7EB]">
          <tr className="hover:bg-gray-50">
            <td className="py-3 px-4">
              <div className="font-medium text-gray-900">John Doe</div>
            </td>
            <td className="py-3 px-4">
              <div className="font-semibold text-gray-900">09:30 AM</div>
            </td>
            <td className="py-3 px-4">
              <div className="text-gray-900">Dr. Emily Smith</div>
            </td>
            <td className="py-3 px-4 text-right">
              <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-[#16A34A]">
                Arrived
              </span>
            </td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="py-3 px-4">
              <div className="font-medium text-gray-900">Sarah Williams</div>
            </td>
            <td className="py-3 px-4">
              <div className="font-semibold text-gray-900">10:15 AM</div>
            </td>
            <td className="py-3 px-4">
              <div className="text-gray-900">Dr. Mark Adams</div>
            </td>
            <td className="py-3 px-4 text-right">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-[#2563EB]">
                Via WhatsApp
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
