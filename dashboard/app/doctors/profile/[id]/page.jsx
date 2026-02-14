"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const fallbackDoctors = [
  {
    id: "#DOC-8821",
    name: "Dr. Sarah Jenkins",
    specialization: "Cardiologist",
    schedule: "09:00 AM - 05:00 PM Mon, Tue, Wed, Fri",
    phone: "+1 (555) 012-3456",
    patients: "1,248",
    growth: "+12%",
    status: "Active",
  },
  {
    id: "#DOC-7742",
    name: "Dr. Michael Chen",
    specialization: "Neurologist",
    schedule: "10:00 AM - 06:00 PM Mon - Sat",
    phone: "+1 (555) 012-9876",
    patients: "856",
    growth: "+5%",
    status: "Active",
  },
];

const parseSchedule = (schedule) => {
  if (!schedule) return { timeRange: "", days: "" };
  const match = schedule.match(
    /^(\d{1,2}:\d{2}\s?[AP]M\s*-\s*\d{1,2}:\d{2}\s?[AP]M)\s+(.*)$/i
  );
  if (!match) {
    return { timeRange: schedule, days: "" };
  }
  return { timeRange: match[1], days: match[2] };
};

export default function DoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [doctors, setDoctors] = useState(null);
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    schedule: "",
    phone: "",
    status: "Active",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!doctorId || typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("crm_doctors");
      let parsed = null;
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data)) parsed = data;
      }
      if (!parsed) {
        parsed = fallbackDoctors;
        window.localStorage.setItem("crm_doctors", JSON.stringify(parsed));
      }
      setDoctors(parsed);
    } catch {
      setDoctors(fallbackDoctors);
    }
  }, [doctorId]);

  const doctor = useMemo(() => {
    if (!doctors || !doctorId) return null;
    return doctors.find((d) => d.id === doctorId) || null;
  }, [doctors, doctorId]);

  useEffect(() => {
    if (!doctor) return;
    setForm({
      name: doctor.name || "",
      specialization: doctor.specialization || "",
      schedule: doctor.schedule || "",
      phone: doctor.phone || "",
      status: doctor.status || "Active",
    });
  }, [doctor]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!doctor || !doctors) return;
    setSaving(true);
    const updated = {
      ...doctor,
      name: form.name.trim(),
      specialization: form.specialization.trim(),
      schedule: form.schedule.trim(),
      phone: form.phone.trim(),
      status: form.status,
    };
    const updatedList = doctors.map((d) => (d.id === doctor.id ? updated : d));
    setDoctors(updatedList);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("crm_doctors", JSON.stringify(updatedList));
      }
    } catch {
      // ignore storage errors
    }
    setSaving(false);
    setIsEditing(false);
  };

  if (!doctorId) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">Missing doctor identifier.</p>
        <button
          onClick={() => router.push("/doctors")}
          className="btn-secondary text-sm"
        >
          Back to doctors
        </button>
      </div>
    );
  }

  if (doctors && !doctor) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-gray-900">Doctor not found</h1>
        <p className="text-sm text-gray-600">
          We couldn&apos;t find a doctor with ID <span className="font-mono">{doctorId}</span>.
        </p>
        <button
          onClick={() => router.push("/doctors")}
          className="btn-secondary text-sm"
        >
          Back to doctors
        </button>
      </div>
    );
  }

  if (!doctor) {
    return <p className="text-sm text-gray-600">Loading doctor details…</p>;
  }

  const { timeRange, days } = parseSchedule(doctor.schedule);

  return (
    <div className="space-y-6">
      {/* Header / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <nav className="text-xs text-gray-500 mb-1">
            <Link href="/doctors" className="hover:text-gray-700">
              Doctors
            </Link>
            <span className="mx-1">/</span>
            <span className="text-gray-900">Doctor Details</span>
          </nav>
          <h1 className="text-2xl font-semibold text-gray-900">{doctor.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {doctor.specialization} • {doctor.id}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="btn-secondary text-sm"
            onClick={() => router.push("/doctors")}
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

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Total Patients</p>
          <p className="text-xl font-semibold text-gray-900">{doctor.patients}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Growth</p>
          <p
            className={`text-xl font-semibold ${
              doctor.growth?.startsWith("+") ? "text-emerald-700" : "text-gray-800"
            }`}
          >
            {doctor.growth}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Status</p>
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-700">
            {doctor.status}
          </span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Phone</p>
          <p className="text-sm font-medium text-gray-900">{doctor.phone}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4 md:p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Profile</h2>
          {isEditing ? (
            <form
              onSubmit={handleSave}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm"
            >
              <div>
                <label className="block text-xs text-gray-500 mb-1">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Specialization</label>
                <input
                  value={form.specialization}
                  onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Schedule</label>
                <input
                  value={form.schedule}
                  onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  required
                />
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
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>In Surgery</option>
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
                <p className="text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{doctor.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Specialization</p>
                <p className="font-medium text-gray-900">{doctor.specialization}</p>
              </div>
              <div>
                <p className="text-gray-500">Schedule</p>
                <p className="font-medium text-gray-900">{doctor.schedule}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{doctor.phone}</p>
              </div>
            </div>
          )}
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Availability</h2>
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-gray-500">Time</p>
              <p className="font-medium text-gray-900">{timeRange || "Not configured"}</p>
            </div>
            {days && (
              <div>
                <p className="text-gray-500 mb-1">Days</p>
                <div className="flex flex-wrap gap-1">
                  {days
                    .split(/[,\u2013-]/)
                    .map((d) => d.trim())
                    .filter(Boolean)
                    .map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700"
                      >
                        {d}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

