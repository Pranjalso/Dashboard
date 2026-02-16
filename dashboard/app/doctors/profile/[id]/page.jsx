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
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const doctorId = rawId ? decodeURIComponent(rawId) : null;

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
  const [availStatus, setAvailStatus] = useState("On Duty");
  const [availForm, setAvailForm] = useState({
    from: "",
    to: "",
    days: [],
    doctor: "",
    leaveFrom: "",
    leaveTo: "",
  });

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
      setTimeout(() => {
        setDoctors(parsed);
      }, 0);
    } catch {
      setTimeout(() => {
        setDoctors(fallbackDoctors);
      }, 0);
    }
  }, [doctorId]);

  const doctor = useMemo(() => {
    if (!doctors || !doctorId) return null;
    return doctors.find((d) => d.id === doctorId) || null;
  }, [doctors, doctorId]);

  useEffect(() => {
    if (!doctor) return;
    setTimeout(() => {
      setForm({
        name: doctor.name || "",
        specialization: doctor.specialization || "",
        schedule: doctor.schedule || "",
        phone: doctor.phone || "",
        status: doctor.status || "Active",
      });
    }, 0);
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Doctor Details</h2>
          {isEditing ? (
            <form
              onSubmit={handleSave}
              className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-base"
            >
              <div>
                <label className="block text-xs text-gray-600 mb-1">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Specialization</label>
                <input
                  value={form.specialization}
                  onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-xs text-gray-600 mb-1">Schedule</label>
                <input
                  value={form.schedule}
                  onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>In Surgery</option>
                </select>
              </div>
              <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-base">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Name</p>
                <p className="font-semibold text-gray-900">{doctor.name}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Specialization</p>
                <p className="font-semibold text-gray-900">{doctor.specialization}</p>
              </div>
              <div className="sm:col-span-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Schedule</p>
                <p className="font-semibold text-gray-900">{timeRange || doctor.schedule}</p>
                {days && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {days
                      .split(/[,\u2013-]/)
                      .map((d) => d.trim())
                      .filter(Boolean)
                      .map((d) => {
                        const map = {
                          Mon: "bg-teal-50 text-teal-700 border-teal-200",
                          Tue: "bg-indigo-50 text-indigo-700 border-indigo-200",
                          Wed: "bg-purple-50 text-purple-700 border-purple-200",
                          Thu: "bg-amber-50 text-amber-700 border-amber-200",
                          Fri: "bg-sky-50 text-sky-700 border-sky-200",
                          Sat: "bg-rose-50 text-rose-700 border-rose-200",
                          Sun: "bg-red-50 text-red-700 border-red-200",
                        };
                        const cls = map[d] || "bg-gray-50 text-gray-700 border-gray-200";
                        return (
                          <span
                            key={d}
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${cls}`}
                          >
                            {d}
                          </span>
                        );
                      })}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Phone</p>
                <p className="font-semibold text-gray-900">{doctor.phone}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Status</p>
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-700">
                  {doctor.status}
                </span>
              </div>
            </div>
          )}
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-5 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Availability</h2>
            <div className="flex gap-2">
              <button className="px-3 py-2 rounded-lg border border-gray-300 text-sm">Update Dr. Availability</button>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex gap-2">
              {["On Duty", "On Leave", "Emergency"].map((s) => (
                <button
                  key={s}
                  onClick={() => setAvailStatus(s)}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    availStatus === s ? "bg-[#0F766E] text-white border-[#0F766E]" : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {availStatus === "On Duty" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Time From</label>
                    <input
                      type="time"
                      value={availForm.from}
                      onChange={(e) => setAvailForm({ ...availForm, from: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Time To</label>
                    <input
                      type="time"
                      value={availForm.to}
                      onChange={(e) => setAvailForm({ ...availForm, to: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Days</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => {
                      const active = availForm.days.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => {
                            const has = availForm.days.includes(d);
                            setAvailForm({
                              ...availForm,
                              days: has ? availForm.days.filter(x => x !== d) : [...availForm.days, d],
                            });
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                            active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-600 border-gray-200"
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Select Doctor</label>
                  <input
                    value={availForm.doctor}
                    onChange={(e) => setAvailForm({ ...availForm, doctor: e.target.value })}
                    placeholder="Doctor name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    className="btn-primary text-sm"
                    onClick={() => {
                      const tFrom = availForm.from || "09:00";
                      const tTo = availForm.to || "17:00";
                      const fmt = (t) => {
                        const [hh, mm] = t.split(":");
                        const h = parseInt(hh, 10);
                        const am = h < 12;
                        const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
                        return `${h12}:${mm} ${am ? "AM" : "PM"}`;
                      };
                      const newSchedule = `${fmt(tFrom)} - ${fmt(tTo)} ${availForm.days.join(", ") || "Mon - Fri"}`;
                      const updated = { ...doctor, schedule: newSchedule, status: "Active" };
                      const updatedList = doctors.map((d) => (d.id === doctor.id ? updated : d));
                      setDoctors(updatedList);
                      try {
                        if (typeof window !== "undefined") {
                          window.localStorage.setItem("crm_doctors", JSON.stringify(updatedList));
                        }
                      } catch {}
                    }}
                  >
                    Save as appointment booking time
                  </button>
                </div>
              </div>
            )}

            {availStatus === "On Leave" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Date From</label>
                    <input
                      type="date"
                      value={availForm.leaveFrom}
                      onChange={(e) => setAvailForm({ ...availForm, leaveFrom: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Date To</label>
                    <input
                      type="date"
                      value={availForm.leaveTo}
                      onChange={(e) => setAvailForm({ ...availForm, leaveTo: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className="btn-primary text-sm"
                    onClick={() => {
                      const updated = { ...doctor, status: "On Leave", schedule: "Off-Duty Scheduled Leave" };
                      const updatedList = doctors.map((d) => (d.id === doctor.id ? updated : d));
                      setDoctors(updatedList);
                      try {
                        if (typeof window !== "undefined") {
                          window.localStorage.setItem("crm_doctors", JSON.stringify(updatedList));
                        }
                      } catch {}
                    }}
                  >
                    Save Leave
                  </button>
                </div>
              </div>
            )}

            {availStatus === "Emergency" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  No specific time. When you are back on duty, please change your status.
                </p>
                <div className="flex justify-end">
                  <button
                    className="btn-primary text-sm"
                    onClick={() => {
                      const updated = { ...doctor, status: "Emergency" };
                      const updatedList = doctors.map((d) => (d.id === doctor.id ? updated : d));
                      setDoctors(updatedList);
                      try {
                        if (typeof window !== "undefined") {
                          window.localStorage.setItem("crm_doctors", JSON.stringify(updatedList));
                        }
                      } catch {}
                    }}
                  >
                    Save Status
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 border-t pt-3">
              <div>
                <p className="text-gray-600">Current Time</p>
                <p className="font-medium text-gray-900">{timeRange || "Not configured"}</p>
              </div>
              {days && (
                <div className="mt-2">
                  <p className="text-gray-600 mb-1">Days</p>
                  <div className="flex flex-wrap gap-1">
                    {days
                      .split(/[,\u2013-]/)
                      .map((d) => d.trim())
                      .filter(Boolean)
                      .map((d) => {
                        const map = {
                          Mon: "bg-teal-50 text-teal-700 border-teal-200",
                          Tue: "bg-indigo-50 text-indigo-700 border-indigo-200",
                          Wed: "bg-purple-50 text-purple-700 border-purple-200",
                          Thu: "bg-amber-50 text-amber-700 border-amber-200",
                          Fri: "bg-sky-50 text-sky-700 border-sky-200",
                          Sat: "bg-rose-50 text-rose-700 border-rose-200",
                          Sun: "bg-red-50 text-red-700 border-red-200",
                        };
                        const cls = map[d] || "bg-gray-50 text-gray-700 border-gray-200";
                        return (
                          <span
                            key={d}
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${cls}`}
                          >
                            {d}
                          </span>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

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

      <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Your Today’s Appointment</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2">Appointment ID</th>
                <th className="text-left px-4 py-2">Patient ID</th>
                <th className="text-left px-4 py-2">Patient Name</th>
                <th className="text-left px-4 py-2">Date of Appointment</th>
                <th className="text-left px-4 py-2">Time Slot</th>
                <th className="text-left px-4 py-2">Age</th>
                <th className="text-left px-4 py-2">Phone Number</th>
                <th className="text-left px-4 py-2">Disease</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-sm text-gray-600">
                  No appointments for today
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

