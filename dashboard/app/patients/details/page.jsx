"use client";
import Link from "next/link";
import { useState } from "react";

const mockPatient = {
  id: "PID-882910",
  name: "John Doe",
  gender: "Male",
  age: 35,
  dob: "Oct 12, 1988",
  phone: "+1 (555) 0123",
  email: "john.doe@example.com",
  bloodGroup: "O+",
  allergies: ["Penicillin"],
  chronicConditions: ["Hypertension"],
  primaryDoctor: "Dr. Sarah Smith",
  primarySpecialty: "Cardiology Specialist",
};

const mockStats = {
  totalVisits: 18,
  lastVisit: "Oct 24, 2023",
  nextAppointment: "Oct 30, 2023 10:00 AM",
  avgVisitDuration: "18 min",
  adherenceScore: "92%",
};

const mockHistory = [
  {
    date: "Oct 24, 2023",
    doctor: "Dr. Sarah Smith",
    type: "Follow-up Consultation",
    summary: "Reviewed blood pressure logs, adjusted medication dosage.",
  },
  {
    date: "Sep 10, 2023",
    doctor: "Dr. Sarah Smith",
    type: "Initial Cardiology Consult",
    summary: "Baseline assessment, ECG and lab work ordered.",
  },
];

const mockAppointments = [
  {
    id: "#APT-2041",
    date: "Oct 30, 2023",
    time: "10:00 AM - 10:20 AM",
    doctor: "Dr. Sarah Smith",
    status: "Confirmed",
  },
  {
    id: "#APT-1999",
    date: "Oct 24, 2023",
    time: "09:30 AM - 09:50 AM",
    doctor: "Dr. Sarah Smith",
    status: "Completed",
  },
];

const statusColor = (status) => {
  const value = status.toLowerCase();
  if (value === "confirmed") return "bg-green-100 text-green-800";
  if (value === "completed") return "bg-gray-100 text-gray-700";
  if (value === "cancelled") return "bg-red-100 text-red-800";
  return "bg-slate-100 text-slate-700";
};

export default function PatientDetailsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Header / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <nav className="text-xs text-gray-500 mb-1">
            <span className="hover:text-gray-700">
              <Link href="/patients">Patients</Link>
            </span>
            <span className="mx-1">/</span>
            <span className="text-gray-900">Patient Details</span>
          </nav>
          <h1 className="text-2xl font-semibold text-gray-900">{mockPatient.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            ID {mockPatient.id} • {mockPatient.age} yrs • {mockPatient.gender}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="btn-secondary text-sm">
            Export Summary
          </button>
          <button className="btn-primary text-sm">
            Schedule Appointment
          </button>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Total Visits</p>
          <p className="text-xl font-semibold text-gray-900">{mockStats.totalVisits}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Last Visit</p>
          <p className="text-sm font-medium text-gray-900">{mockStats.lastVisit}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Next Appointment</p>
          <p className="text-sm font-medium text-gray-900">{mockStats.nextAppointment}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Adherence Score</p>
          <p className="text-xl font-semibold text-emerald-700">{mockStats.adherenceScore}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="flex flex-wrap border-b border-gray-200 px-4">
          {[
            { id: "overview", label: "Overview" },
            { id: "history", label: "Medical History" },
            { id: "appointments", label: "Appointments" },
            { id: "metrics", label: "Statistics" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 mr-4 text-sm border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? "border-emerald-600 text-emerald-700 font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 md:p-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Demographics */}
              <section className="lg:col-span-2 bg-slate-50 rounded-xl p-4 md:p-5 border border-slate-100">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Demographics & Contact</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Date of Birth</p>
                    <p className="font-medium text-gray-900">{mockPatient.dob}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{mockPatient.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium text-gray-900 break-all">{mockPatient.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Primary Physician</p>
                    <p className="font-medium text-gray-900">
                      {mockPatient.primaryDoctor} • {mockPatient.primarySpecialty}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Blood Group</p>
                    <p className="font-medium text-gray-900">{mockPatient.bloodGroup}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Chronic Conditions</p>
                    <p className="font-medium text-gray-900">
                      {mockPatient.chronicConditions.join(", ")}
                    </p>
                  </div>
                </div>
              </section>

              {/* Risk & Alerts */}
              <section className="bg-white rounded-xl p-4 md:p-5 border border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Care Flags</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                      Allergy
                    </span>
                    <span className="text-gray-700">Penicillin - avoid all beta-lactams</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                      Monitoring
                    </span>
                    <span className="text-gray-700">Home BP monitoring every 2 weeks</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4">
              {mockHistory.map((entry) => (
                <div
                  key={entry.date + entry.type}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-3"
                >
                  <div>
                    <p className="text-xs text-gray-500">{entry.date}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{entry.type}</p>
                    <p className="text-xs text-gray-500 mt-1">{entry.doctor}</p>
                    <p className="text-sm text-gray-700 mt-2">{entry.summary}</p>
                  </div>
                  <button className="self-start btn-secondary text-xs">View note</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <p className="text-sm text-gray-600">
                  Tracking {mockAppointments.length} recent appointments for this patient
                </p>
                <div className="flex gap-2 text-xs">
                  <button className="btn-secondary">All</button>
                  <button className="btn-secondary">Upcoming</button>
                  <button className="btn-secondary">Completed</button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                      <tr>
                        <th className="text-left px-4 py-3">Appointment</th>
                        <th className="text-left px-4 py-3">Date / Time</th>
                        <th className="text-left px-4 py-3">Doctor</th>
                        <th className="text-left px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{apt.id}</td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-gray-900">{apt.date}</div>
                            <div className="text-xs text-gray-500">{apt.time}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">{apt.doctor}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusColor(
                                apt.status
                              )}`}
                            >
                              {apt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden p-4 space-y-3">
                  {mockAppointments.map((apt) => (
                    <div key={apt.id} className="border border-gray-200 rounded-xl p-3 text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-900">{apt.id}</span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${statusColor(
                            apt.status
                          )}`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{apt.date}</p>
                      <p className="text-xs text-gray-500 mb-2">{apt.time}</p>
                      <p className="text-xs text-gray-600">{apt.doctor}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "metrics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Utilization</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Clinic visit adherence</span>
                    <span className="font-semibold text-emerald-700">92%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">No-show rate</span>
                    <span className="font-semibold text-amber-700">4%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average wait time</span>
                    <span className="font-semibold text-gray-900">08 min</span>
                  </div>
                </div>
              </section>

              <section className="bg-slate-50 border border-slate-100 rounded-xl p-4 md:p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Risk & Engagement</h2>
                <ul className="space-y-2 text-xs text-gray-700">
                  <li>• Enrolled in chronic disease management program</li>
                  <li>• Completed medication reconciliation in last 6 months</li>
                  <li>• Portal engagement high (3+ logins / month)</li>
                </ul>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}