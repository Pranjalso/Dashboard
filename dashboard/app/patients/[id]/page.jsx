"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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
      setPatients(parsed);
    } catch {
      setPatients(fallbackPatients);
    }
  }, [patientId]);

  const patient = useMemo(() => {
    if (!patients || !patientId) return null;
    return patients.find((p) => p.id === patientId) || null;
  }, [patients, patientId]);

  useEffect(() => {
    if (!patient) return;
    setForm({
      name: patient.name || "",
      dob: patient.dob && patient.dob.length === 10 && patient.dob.includes("-")
        ? patient.dob
        : "",
      gender: patient.gender || "Male",
      phone: patient.phone || "",
      lastVisit: patient.lastVisit || "",
      status: patient.status || "Active",
    });
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
        <div>
          <nav className="text-xs text-gray-500 mb-1">
            <Link href="/patients" className="hover:text-gray-700">
              Patients
            </Link>
            <span className="mx-1">/</span>
            <span className="text-gray-900">Patient Details</span>
          </nav>
          <h1 className="text-2xl font-semibold text-gray-900">{patient.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            ID {patient.id} •{" "}
            {patient.age ? `${patient.age} yrs` : "Age not available"} • {patient.gender}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
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

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demographics & contact */}
        <section className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4 md:p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Demographics & Contact
          </h2>
          {isEditing ? (
            <form
              onSubmit={handleSave}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm"
            >
              <div>
                <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Last Visit</label>
                <input
                  value={form.lastVisit}
                  onChange={(e) => setForm({ ...form, lastVisit: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">{patient.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Date of Birth</p>
                <p className="font-medium text-gray-900">
                  {patient.dob || "Not recorded"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Gender</p>
                <p className="font-medium text-gray-900">{patient.gender}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{patient.phone}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Visit</p>
                <p className="font-medium text-gray-900">
                  {patient.lastVisit || "Not recorded"}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

