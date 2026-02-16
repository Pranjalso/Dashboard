"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Generate 15-min time slots from 8:00 AM to 6:00 PM
const generateTimeSlots = () => {
  const slots = [];
  const fmt = (h, m) => {
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
  };
  for (let totalMins = 8 * 60; totalMins < 18 * 60; totalMins += 15) {
    const h1 = Math.floor(totalMins / 60);
    const m1 = totalMins % 60;
    const h2 = Math.floor((totalMins + 15) / 60);
    const m2 = (totalMins + 15) % 60;
    slots.push(`${fmt(h1, m1)} - ${fmt(h2, m2)}`);
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

const defaultDoctors = [
  { id: "#DOC-8821", name: "Dr. Sarah Jenkins" },
  { id: "#DOC-7742", name: "Dr. Michael Chen" },
  { id: "#DOC-4412", name: "Dr. Jessica Wu" },
  { id: "#DOC-4413", name: "Dr. Robert King" },
];

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

function AppointmentsPageContent() {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [showModal, setShowModal] = useState(false);
  const [editApt, setEditApt] = useState(null);
  const [deleteApt, setDeleteApt] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [doctorsList, setDoctorsList] = useState(defaultDoctors);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("crm_doctors");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTimeout(() => {
            setDoctorsList(parsed.map((d) => ({ id: d.id, name: d.name })));
          }, 0);
        }
      }
    } catch {
      // use defaultDoctors
    }
  }, [searchParams]);

  useEffect(() => {
    const action = searchParams?.get("action");
    if (action === "new") {
      setTimeout(() => setShowModal(true), 0);
    }
  }, [searchParams]);

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
    date: "",
    timeSlot: "",
    source: "STAFF ENTRY",
  });
  const [editForm, setEditForm] = useState({
    id: "",
    patient: "",
    phone: "",
    doctor: "",
    date: "",
    timeSlot: "",
    source: "STAFF ENTRY",
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDateCategory = (dateStr) => {
    if (!dateStr) return "upcoming";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "upcoming";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === today.getTime()) return "today";
    return d < today ? "past" : "upcoming";
  };

  const buildTimeString = (dateStr, timeSlot) => {
    if (!dateStr || !timeSlot) return "";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return timeSlot;
    const dateLabel = d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    return `${dateLabel} ${timeSlot}`;
  };

  const splitDateAndTime = (value) => {
    if (!value) return { date: "", time: "" };
    const match = value.match(/^(.+?\d{4})(?:,)?\s+(.*)$/);
    if (!match) return { date: value, time: "" };
    return { date: match[1], time: match[2] };
  };

  const getDatePart = (value) => splitDateAndTime(value).date;
  const getTimePart = (value) => splitDateAndTime(value).time;

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
    const timeStr = buildTimeString(form.date, form.timeSlot);
    const category = getDateCategory(form.date);
    const newApt = {
      id: createAptId(),
      patient: form.patient,
      phone: form.phone,
      doctor: form.doctor,
      issue: "",
      time: timeStr,
      source: form.source,
      status: "Pending",
      dateCategory: category,
    };
    setAppointments((prev) => [newApt, ...prev]);
    try {
      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem("crm_latest_appointments");
        const existing = raw ? JSON.parse(raw) : {};
        const updated = {
          ...(existing && typeof existing === "object" ? existing : {}),
          [newApt.patient]: { time: newApt.time, createdAt: new Date().toISOString() },
        };
        window.localStorage.setItem("crm_latest_appointments", JSON.stringify(updated));
      }
    } catch {
      // ignore
    }
    setShowModal(false);
    setForm({
      patientId: "",
      patient: "",
      phone: "",
      doctor: "",
      date: "",
      timeSlot: "",
      source: "STAFF ENTRY",
    });
  };

  const handleConfirm = (apt) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === apt.id && a.status === "Pending" ? { ...a, status: "Confirmed" } : a))
    );
  };
  
  const parseTimeToDateAndSlot = (timeStr) => {
    const { date: datePart, time: slotPart } = splitDateAndTime(timeStr);
    if (!datePart) return { date: "", timeSlot: "" };
    const d = new Date(datePart);
    const date = Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
    const timeSlot = slotPart && TIME_SLOTS.includes(slotPart) ? slotPart : slotPart || "";
    return { date, timeSlot };
  };

  const openEdit = (apt) => {
    const { date, timeSlot } = parseTimeToDateAndSlot(apt.time);
    setEditApt(apt);
    setEditForm({
      id: apt.id,
      patient: apt.patient,
      phone: apt.phone,
      doctor: apt.doctor,
      date,
      timeSlot: timeSlot || apt.time?.match(/\d{1,2}:\d{2}\s*[AP]M\s*[-–]\s*\d{1,2}:\d{2}\s*[AP]M/i)?.[0] || "",
      source: apt.source,
    });
  };

  const saveEdit = (e) => {
    e.preventDefault();
    const slot = editForm.timeSlot || getTimePart(editApt.time);
    const timeStr = buildTimeString(editForm.date, slot) || editApt.time;
    const category = getDateCategory(editForm.date);
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === editForm.id
          ? {
              ...a,
              patient: editForm.patient,
              phone: editForm.phone,
              doctor: editForm.doctor,
              time: timeStr,
              source: editForm.source,
              dateCategory: category,
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
      if (filter === "all") return true;
      const category = getDateCategory(getDatePart(apt.time));
      if (filter === "today") return category === "today";
      if (filter === "upcoming") return category === "upcoming";
      if (filter === "past") return category === "past";
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

      {/* Filters - Order: Today's Appointments, All Appointments, Upcoming, Past History */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setFilter("today"); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === "today" ? "bg-[#0F766E] text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Today&apos;s Appointments
          </button>
          <button
            onClick={() => { setFilter("all"); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === "all" ? "bg-[#0F766E] text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            All Appointments
          </button>
          <button
            onClick={() => { setFilter("upcoming"); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === "upcoming" ? "bg-[#0F766E] text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => { setFilter("past"); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === "past" ? "bg-[#0F766E] text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Past History
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
              {paginatedAppointments.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-sm text-gray-600">
                    {filter === "today" && "No appointments for today"}
                    {filter === "upcoming" && "No upcoming appointments"}
                    {filter === "past" && "No past history"}
                    {filter === "all" && "No appointments found"}
                  </td>
                </tr>
              )}
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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      apt.source === "WHATSAPP"
                        ? "bg-green-100 text-green-800"
                        : apt.source === "STAFF ENTRY"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {apt.source === "WHATSAPP" ? "WhatsApp" : apt.source === "STAFF ENTRY" ? "Staff Entry" : apt.source}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {apt.status === "Pending" && (
                        <button
                          className="p-2 rounded-lg hover:bg-green-50 text-green-700"
                          onClick={() => handleConfirm(apt)}
                          aria-label="Confirm"
                          title="Mark as Confirmed"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
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
          {paginatedAppointments.length === 0 && (
            <p className="text-sm text-gray-600 text-center py-8">
              {filter === "today" && "No appointments for today"}
              {filter === "upcoming" && "No upcoming appointments"}
              {filter === "past" && "No past history"}
              {filter === "all" && "No appointments found"}
            </p>
          )}
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
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    apt.source === "WHATSAPP"
                      ? "bg-green-100 text-green-800"
                      : apt.source === "STAFF ENTRY"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {apt.source === "WHATSAPP" ? "WhatsApp" : apt.source === "STAFF ENTRY" ? "Staff Entry" : apt.source}
                  </span>
                  <div className="flex items-center gap-2">
                    {apt.status === "Pending" && (
                      <button
                        className="p-2 rounded-lg hover:bg-green-50 text-green-700"
                        onClick={() => handleConfirm(apt)}
                        aria-label="Confirm"
                        title="Mark as Confirmed"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
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
                  <select
                    value={form.doctor}
                    onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select doctor</option>
                    {doctorsList.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Time Slot</label>
                  <select
                    value={form.timeSlot}
                    onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select time slot</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
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
                  <select
                    value={editForm.doctor}
                    onChange={(e) => setEditForm({ ...editForm, doctor: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select doctor</option>
                    {doctorsList.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-1">Current Time Slot</label>
                  <p className="text-sm text-gray-600 py-2">{editForm.timeSlot || "—"}</p>
                  <label className="block text-sm text-gray-700 mb-1 mt-2">Select New Time Slot (optional)</label>
                  <select
                    value={editForm.timeSlot}
                    onChange={(e) => setEditForm({ ...editForm, timeSlot: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Keep current</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
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

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-600">Loading appointments…</div>}>
      <AppointmentsPageContent />
    </Suspense>
  );
}