"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const fallbackPatients = [
  {
    id: "PID-882910",
    name: "John Doe",
    age: 35,
    gender: "Male",
    phone: "+1 (555) 0123",
    lastVisit: "Oct 24, 2023",
    nextAppointment: "Today, 10:00 AM",
    status: "Active",
    doctor: "Dr. Sarah Smith",
    dob: "1988-10-12",
  },
  {
    id: "PID-882911",
    name: "Jane Gill",
    age: 28,
    gender: "Female",
    phone: "+1 (555) 0456",
    lastVisit: "Oct 23, 2023",
    nextAppointment: "Tomorrow, 2:30 PM",
    status: "Active",
    doctor: "Dr. Michael Adams",
    dob: "1995-03-15",
  },
];

const splitAppointmentDateTime = (value) => {
  if (!value) return { date: "", time: "" };
  const match = value.match(/^(.+?\d{4})(?:,)?\s+(.*)$/);
  if (!match) return { date: value, time: "" };
  return { date: match[1], time: match[2] };
};

const getApptDatePart = (value) => splitAppointmentDateTime(value).date;
const getApptTimePart = (value) => splitAppointmentDateTime(value).time;

const calcAge = (dobStr) => {
  if (!dobStr) return "";
  const now = new Date();
  const dob = new Date(dobStr);
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
};

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [patients, setPatients] = useState(null);
  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "Male",
    phone: "",
    city: "",
    lastVisit: "",
    status: "Active",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!patientId || typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("crm_patients");
      let parsed = null;
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data)) {
          parsed = data;
        }
      }
      if (!parsed) {
        parsed = fallbackPatients;
        window.localStorage.setItem("crm_patients", JSON.stringify(parsed));
      }
      setTimeout(() => {
        setPatients(parsed);
      }, 0);
    } catch {
      setTimeout(() => {
        setPatients(fallbackPatients);
      }, 0);
    }
  }, [patientId]);

  const patient = useMemo(() => {
    if (!patients || !patientId) return null;
    return patients.find((p) => p.id === patientId) || null;
  }, [patients, patientId]);

  useEffect(() => {
    if (!patient) return;
    setTimeout(() => {
      setForm({
        name: patient.name || "",
        dob: patient.dob && patient.dob.length === 10 && patient.dob.includes("-")
          ? patient.dob
          : "",
        gender: patient.gender || "Male",
        phone: patient.phone || "",
        city: patient.city || "",
        lastVisit: patient.lastVisit || "",
        status: patient.status || "Active",
      });
    }, 0);
  }, [patient]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!patient || !patients) return;
    setSaving(true);
    const updated = {
      ...patient,
      name: form.name.trim(),
      dob: form.dob,
      age: calcAge(form.dob),
      gender: form.gender,
      phone: form.phone.trim(),
      city: form.city.trim(),
      lastVisit: form.lastVisit.trim(),
      status: form.status,
    };
    const updatedList = patients.map((p) => (p.id === patient.id ? updated : p));
    setPatients(updatedList);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("crm_patients", JSON.stringify(updatedList));
      }
    } catch {
      // ignore storage errors
    }
    setSaving(false);
    setIsEditing(false);
  };

  if (!patientId) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">Missing patient identifier.</p>
        <button
          onClick={() => router.push("/patients")}
          className="btn-secondary text-sm"
        >
          Back to patients
        </button>
      </div>
    );
  }

  if (patients && !patient) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-gray-900">Patient not found</h1>
        <p className="text-sm text-gray-600">
          We couldn&apos;t find a patient with ID <span className="font-mono">{patientId}</span>.
        </p>
        <button
          onClick={() => router.push("/patients")}
          className="btn-secondary text-sm"
        >
          Back to patients
        </button>
      </div>
    );
  }

  if (!patient) {
    return <p className="text-sm text-gray-600">Loading patient details…</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div />
        <div className="flex flex-wrap gap-3">
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            onClick={() => {
              // placeholder action
            }}
            aria-label="Run Cron"
            title="Run Cron"
          >
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Run Cron
            </span>
          </button>
          <button
            className="btn-secondary text-sm"
            onClick={() => router.push("/patients")}
          >
            Back to list
          </button>
          <button
            className="btn-primary text-sm"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? "Cancel edit" : "Edit details"}
          </button>
        </div>
      </div>

      {/* Top Section */}
      <section className="bg-blue-50 border border-blue-200 rounded-xl p-5 md:p-6">
        {isEditing ? (
          <form
            onSubmit={handleSave}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base"
          >
            <div>
              <label className="block text-xs text-gray-600 mb-1">Full Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Date of Birth</label>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">City</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Last Visit</label>
              <input
                value={form.lastVisit}
                onChange={(e) => setForm({ ...form, lastVisit: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
              <button
                type="button"
                className="btn-secondary text-sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary text-sm"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base">
            <div>
              <p className="text-gray-600">Full Name</p>
              <p className="font-medium text-gray-900">{patient.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Date of Birth</p>
              <p className="font-medium text-gray-900">
                {patient.dob || "Not recorded"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Gender</p>
              <p className="font-medium text-gray-900">{patient.gender}</p>
            </div>
            <div>
              <p className="text-gray-600">City</p>
              <p className="font-medium text-gray-900">{patient.city || "—"}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone</p>
              <p className="font-medium text-gray-900">{patient.phone}</p>
            </div>
            <div>
              <p className="text-gray-600">Last Visit</p>
              <p className="font-medium text-gray-900">
                {patient.lastVisit || "Not recorded"}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Last Visit</p>
          <p className="text-sm font-medium text-gray-900">
            {patient.lastVisit || "Not recorded"}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Next Appointment</p>
          {patient.nextAppointment ? (
            <div className="text-sm">
              <div className="font-semibold text-gray-900">
                {getApptDatePart(patient.nextAppointment)}
              </div>
              {getApptTimePart(patient.nextAppointment) && (
                <div className="text-xs text-gray-500">
                  {getApptTimePart(patient.nextAppointment)}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No upcoming appointment</p>
          )}
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Primary Doctor</p>
          <p className="text-sm font-medium text-gray-900">
            {patient.doctor || "Not assigned"}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Status</p>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              patient.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {patient.status}
          </span>
        </div>
      </div>

      {/* Appointment Details */}
      <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Appointment Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2">Appointment Date</th>
                <th className="text-left px-4 py-2">Doctor</th>
                <th className="text-left px-4 py-2">Time Slot</th>
                <th className="text-left px-4 py-2">Disease</th>
                <th className="text-left px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2">{getApptDatePart(patient.nextAppointment) || "—"}</td>
                <td className="px-4 py-2">{patient.doctor || "—"}</td>
                <td className="px-4 py-2">{getApptTimePart(patient.nextAppointment) || "—"}</td>
                <td className="px-4 py-2">{patient.disease || patient.specialty || "—"}</td>
                <td className="px-4 py-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    patient.status?.toLowerCase() === "active"
                      ? "bg-green-100 text-green-800"
                      : patient.status?.toLowerCase() === "closed"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {patient.status || "Pending"}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Follow-up Details */}
      <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Follow-up Details</h2>
        <ul className="space-y-3">
          <li className="text-sm">
            <span className="font-medium text-gray-900">Post follow-up sent</span>
            <span className="text-gray-500"> • Oct 24, 2023 11:00 AM</span>
          </li>
          <li className="text-sm">
            <span className="font-medium text-gray-900">Appointment reminder sent</span>
            <span className="text-gray-500"> • Oct 23, 2023 05:30 PM</span>
          </li>
          <li className="text-sm">
            <span className="font-medium text-gray-900">WhatsApp confirmation requested</span>
            <span className="text-gray-500"> • Oct 22, 2023 09:15 AM</span>
          </li>
        </ul>
      </section>

      {/* Green Box with Run Cron */}
      {/* <section className="bg-green-50 border border-green-200 rounded-xl p-4 md:p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">Automation utilities</p>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm">
            Run Cron
          </button>
        </div>
      </section> */}
    </div>
  );
}
