 "use client";
import { useState } from "react";

const initialAppointments = [
  {
    id: "#APT-1024",
    patient: "John Doe",
    phone: "+1 (555) 0123",
    doctor: "Dr. Sarah Smith",
    issue: "Fever",
    time: "Oct 24, 2023 10:00 AM - 10:15 AM",
    source: "WHATSAPP",
    status: "Confirmed",
    dateCategory: "today",
  },
  {
    id: "#APT-1025",
    patient: "Jane Gill",
    phone: "+1 (555) 0456",
    doctor: "Dr. Michael Adams",
    issue: "Cold & Cough",
    time: "Oct 24, 2023 11:30 AM - 11:45 AM",
    source: "STAFF ENTRY",
    status: "Pending",
    dateCategory: "today",
  },
  {
    id: "#APT-1026",
    patient: "Robert Fox",
    phone: "+1 (555) 0890",
    doctor: "Dr. Sarah Smith",
    issue: "Tooth Pain",
    time: "Oct 24, 2023 02:00 PM - 02:15 PM",
    source: "WHATSAPP",
    status: "Cancelled",
    dateCategory: "past",
  },
  {
    id: "#APT-1027",
    patient: "Emily Day",
    phone: "+1 (555) 0333",
    doctor: "Dr. Taylor Swift",
    issue: "Other",
    time: "Oct 25, 2023 09:00 AM - 09:15 AM",
    source: "STAFF ENTRY",
    status: "Confirmed",
    dateCategory: "upcoming",
  },
];

export default function AppointmentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [showModal, setShowModal] = useState(false);
  const [editApt, setEditApt] = useState(null);
  const [deleteApt, setDeleteApt] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const patientsCatalog = [
    { id: "PID-882910", name: "John Doe", phone: "+1 (555) 0123" },
    { id: "PID-882911", name: "Jane Gill", phone: "+1 (555) 0456" },
    { id: "PID-882912", name: "Robert Fox", phone: "+1 (555) 0890" },
    { id: "PID-882913", name: "Emily Day", phone: "+1 (555) 0333" },
  ];

  const [form, setForm] = useState({
    patientId: "",
    patient: "",
    phone: "",
    doctor: "",
    dateTime: "",
    source: "STAFF ENTRY",
    status: "Confirmed",
  });
  const [editForm, setEditForm] = useState({
    id: "",
    patientId: "",
    patient: "",
    phone: "",
    doctor: "",
    dateTime: "",
    source: "WHATSAPP",
    status: "Confirmed",
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDateCategory = (value) => {
    if (!value) return "upcoming";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "upcoming";

    const today = new Date();
    const sameDay =
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();

    if (sameDay) return "today";
    return d < today ? "past" : "upcoming";
  };

  const splitDateAndTime = (value) => {
    if (!value) return { date: "", time: "" };
    const match = value.match(/^(.+?\d{4})(?:,)?\s+(.*)$/);
    if (!match) return { date: value, time: "" };
    return { date: match[1], time: match[2] };
  };

  const getDatePart = (value) => splitDateAndTime(value).date;
  const getTimePart = (value) => splitDateAndTime(value).time;

  const formatDateTime = (value) => {
    if (!value) return "";
    const d = new Date(value);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const createAptId = () => {
    const rnd = Math.floor(1000 + Math.random() * 9000);
    return `#APT-${rnd}`;
  };

  const onSelectPatientId = (pid) => {
    const p = patientsCatalog.find((x) => x.id === pid);
    setForm((prev) => ({
      ...prev,
      patientId: pid,
      patient: p ? p.name : "",
      phone: p ? p.phone : "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const category = getDateCategory(form.dateTime);
    const newApt = {
      id: createAptId(),
      patient: form.patient,
      phone: form.phone,
      doctor: form.doctor,
      issue: "",
      time: formatDateTime(form.dateTime),
      source: form.source,
      status: form.status,
      dateCategory: category,
    };
    setAppointments((prev) => [newApt, ...prev]);
    // Persist latest appointment per patient for Patients page
    try {
      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem("crm_latest_appointments");
        const existing = raw ? JSON.parse(raw) : {};
        const updated = {
          ...(existing && typeof existing === "object" ? existing : {}),
          [newApt.patient]: {
            time: newApt.time,
            createdAt: new Date().toISOString(),
          },
        };
        window.localStorage.setItem("crm_latest_appointments", JSON.stringify(updated));
      }
    } catch {
      // ignore storage errors
    }
    setShowModal(false);
    setForm({
      patientId: "",
      patient: "",
      phone: "",
      doctor: "",
      dateTime: "",
      source: "STAFF ENTRY",
      status: "Confirmed",
    });
  };
  
  const openEdit = (apt) => {
    setEditApt(apt);
    setEditForm({
      id: apt.id,
      patientId: "",
      patient: apt.patient,
      phone: apt.phone,
      doctor: apt.doctor,
      dateTime: "",
      source: apt.source,
      status: apt.status,
    });
  };
  
  const saveEdit = (e) => {
    e.preventDefault();
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === editForm.id
          ? {
              ...a,
              patient: editForm.patient,
              phone: editForm.phone,
              doctor: editForm.doctor,
              time: editForm.dateTime ? formatDateTime(editForm.dateTime) : a.time,
              source: editForm.source,
              status: editForm.status,
            }
          : a
      )
    );
    setEditApt(null);
  };
  
  const confirmDelete = (apt) => setDeleteApt(apt);
  const doDelete = () => {
    setAppointments((prev) => prev.filter((a) => a.id !== deleteApt.id));
    setDeleteApt(null);
  };

  const filteredAppointments = appointments
    .filter((apt) => {
      if (filter === "today") return apt.dateCategory === "today";
      if (filter === "upcoming") return apt.dateCategory === "upcoming";
      if (filter === "past") return apt.dateCategory === "past";
      return true;
    })
    .filter((apt) => {
      if (!search.trim()) return true;
      const term = search.toLowerCase();
      return (
        apt.patient.toLowerCase().includes(term) ||
        apt.id.toLowerCase().includes(term) ||
        apt.doctor.toLowerCase().includes(term) ||
        apt.phone.toLowerCase().includes(term)
      );
    });

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / itemsPerPage));
  const currentSafePage = Math.min(currentPage, totalPages);
  const startIndex = (currentSafePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="bg-white border border-gray-300 rounded-xl p-4 md:p-6">
        <h2 className="text-xl font-semibold">Managing 1,284 scheduled appointments</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setFilter("all");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === "all"
                ? "bg-[#0F766E] text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            All Appointments
          </button>
          <button
            onClick={() => {
              setFilter("past");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === "past"
                ? "bg-[#0F766E] text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Past History
          </button>
          <button
            onClick={() => {
              setFilter("today");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === "today"
                ? "bg-[#0F766E] text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => {
              setFilter("upcoming");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === "upcoming"
                ? "bg-[#0F766E] text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Upcoming
          </button>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search appointments..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm w-full md:w-64"
            />
            <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#0F766E] text-white rounded-lg text-sm"
          >
            + New
          </button>
        </div>
      </div>

      {/* Table - Mobile Cards / Desktop Table */}
      <div className="bg-white border border-gray-300 rounded-xl overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">ID</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">PATIENT NAME</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">PHONE NUMBER</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">DOCTOR</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">DATE/TIME</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">SOURCE</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">STATUS</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAppointments.map((apt) => (
                <tr key={apt.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium">{apt.id}</td>
                  <td className="p-4">
                    <div className="font-medium">{apt.patient}</div>
                  </td>
                  <td className="p-4 text-sm">{apt.phone}</td>
                  <td className="p-4">
                    <div className="font-medium">{apt.doctor}</div>
                    <div className="text-xs text-gray-500">{apt.issue}</div>
                  </td>
                  <td className="p-4 text-sm">
                    <div className="font-semibold text-gray-900">{getDatePart(apt.time)}</div>
                    {getTimePart(apt.time) && (
                      <div className="text-xs text-gray-500">{getTimePart(apt.time)}</div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      apt.source === "WHATSAPP" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {apt.source}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                        onClick={() => openEdit(apt)}
                        aria-label="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                        onClick={() => confirmDelete(apt)}
                        aria-label="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 p-4">
          {paginatedAppointments.map((apt) => (
            <div key={apt.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{apt.patient}</h3>
                  <p className="text-sm text-gray-600">{apt.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                  {apt.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{apt.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{apt.doctor} • {apt.issue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    <span className="font-semibold text-gray-900">
                      {getDatePart(apt.time)}
                    </span>
                    {getTimePart(apt.time) && (
                      <span className="text-gray-500"> • {getTimePart(apt.time)}</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    apt.source === "WHATSAPP" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {apt.source}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                      onClick={() => openEdit(apt)}
                      aria-label="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                      onClick={() => confirmDelete(apt)}
                      aria-label="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-200 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            Showing {filteredAppointments.length === 0 ? 0 : startIndex + 1} to{" "}
            {Math.min(endIndex, filteredAppointments.length)} of {filteredAppointments.length} entries
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentSafePage === 1}
              className={`px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 ${
                currentSafePage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    page === currentSafePage
                      ? "bg-[#0F766E] text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentSafePage === totalPages}
              className={`px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 ${
                currentSafePage === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Create New Appointment</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Close"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Patient ID</label>
                  <select
                    value={form.patientId}
                    onChange={(e) => onSelectPatientId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Select patient</option>
                    {patientsCatalog.map((p) => (
                      <option key={p.id} value={p.id}>{p.id}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Patient Name</label>
                  <input
                    value={form.patient}
                    onChange={(e) => setForm({ ...form, patient: e.target.value })}
                    placeholder="Enter patient name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Phone Number</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Doctor</label>
                  <input
                    value={form.doctor}
                    onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="e.g. Dr. Sarah Smith"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Date/Time</label>
                  <input
                    type="datetime-local"
                    value={form.dateTime}
                    onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option>Confirmed</option>
                    <option>Pending</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {editApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Edit Appointment</h3>
              <button
                onClick={() => setEditApt(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Close"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={saveEdit} className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Patient Name</label>
                  <input
                    value={editForm.patient}
                    onChange={(e) => setEditForm({ ...editForm, patient: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Phone Number</label>
                  <input
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Doctor</label>
                  <input
                    value={editForm.doctor}
                    onChange={(e) => setEditForm({ ...editForm, doctor: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Date/Time</label>
                  <input
                    type="datetime-local"
                    value={editForm.dateTime}
                    onChange={(e) => setEditForm({ ...editForm, dateTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Source</label>
                  <select
                    value={editForm.source}
                    onChange={(e) => setEditForm({ ...editForm, source: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option>WHATSAPP</option>
                    <option>STAFF ENTRY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option>Confirmed</option>
                    <option>Pending</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" className="btn-secondary" onClick={() => setEditApt(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Delete Appointment</h3>
              <p className="text-sm text-gray-600">Are you sure you want to delete {deleteApt.id}?</p>
              <div className="mt-6 flex justify-end gap-3">
                <button className="btn-secondary" onClick={() => setDeleteApt(null)}>
                  Cancel
                </button>
                <button className="btn-primary bg-red-600 hover:bg-red-700" onClick={doDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
