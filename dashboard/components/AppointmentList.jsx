export default function AppointmentList() {
  return (
    <section className="bg-blue-50 border border-[#E5E7EB] rounded-xl p-5">
      <header className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-900">Recent Appointment Bookings</h2>
        <button className="btn-secondary text-xs md:text-sm">View</button>
      </header>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 border border-blue-100 shadow-sm">
          <span className="font-medium text-gray-800">Alice Moore</span>
          <button className="badge-info">New</button>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 border border-blue-100 shadow-sm">
          <span className="font-medium text-gray-800">Robert Brown</span>
          <button className="badge-success">Confirmed</button>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 border border-blue-100 shadow-sm">
          <span className="font-medium text-gray-800">Catherine Hall</span>
          <button className="badge-info">New</button>
        </div>
      </div>
    </section>
  );
}
