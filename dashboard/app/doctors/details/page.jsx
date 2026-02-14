"use client";
import Link from "next/link";
import { useState } from "react";

const mockDoctor = {
  id: "#DOC-8821",
  name: "Dr. Sarah Jenkins",
  specialization: "Cardiologist",
  phone: "+1 (555) 012-3456",
  email: "sarah.jenkins@example.com",
  department: "Cardiology",
  experienceYears: 12,
};

const mockDoctorStats = {
  activePatients: 1248,
  monthlyVisits: 186,
  avgSatisfaction: "4.8 / 5",
  avgWaitTime: "09 min",
};

const mockSchedule = [
  { day: "Mon", time: "09:00 AM - 05:00 PM", location: "Main Clinic" },
  { day: "Tue", time: "09:00 AM - 05:00 PM", location: "Main Clinic" },
  { day: "Wed", time: "09:00 AM - 05:00 PM", location: "Cardiology Ward" },
  { day: "Fri", time: "09:00 AM - 03:00 PM", location: "Main Clinic" },
];

const mockPerformance = [
  { label: "Clinical quality", score: 94 },
  { label: "Patient satisfaction", score: 96 },
  { label: "Care coordination", score: 88 },
];

export default function DoctorDetailsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      {/* Header / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <nav className="text-xs text-gray-500 mb-1">
            <span className="hover:text-gray-700">
              <Link href="/doctors">Doctors</Link>
            </span>
            <span className="mx-1">/</span>
            <span className="text-gray-900">Doctor Details</span>
          </nav>
          <h1 className="text-2xl font-semibold text-gray-900">{mockDoctor.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {mockDoctor.specialization} • {mockDoctor.department}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="btn-secondary text-sm">Export Profile</button>
          <button className="btn-primary text-sm">Book Appointment</button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Active Patients</p>
          <p className="text-xl font-semibold text-gray-900">{mockDoctorStats.activePatients}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Monthly Visits</p>
          <p className="text-xl font-semibold text-gray-900">{mockDoctorStats.monthlyVisits}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Avg. Satisfaction</p>
          <p className="text-xl font-semibold text-emerald-700">{mockDoctorStats.avgSatisfaction}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Avg. Wait Time</p>
          <p className="text-xl font-semibold text-gray-900">{mockDoctorStats.avgWaitTime}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="flex flex-wrap border-b border-gray-200 px-4">
          {[
            { id: "profile", label: "Profile" },
            { id: "schedule", label: "Schedule" },
            { id: "performance", label: "Performance" },
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
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <section className="lg:col-span-2 bg-slate-50 border border-slate-100 rounded-xl p-4 md:p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Professional Summary</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Doctor ID</p>
                    <p className="font-medium text-gray-900">{mockDoctor.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Experience</p>
                    <p className="font-medium text-gray-900">
                      {mockDoctor.experienceYears} years clinical experience
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{mockDoctor.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium text-gray-900 break-all">{mockDoctor.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Department</p>
                    <p className="font-medium text-gray-900">{mockDoctor.department}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Primary Specialty</p>
                    <p className="font-medium text-gray-900">{mockDoctor.specialization}</p>
                  </div>
                </div>
              </section>

              <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Care Focus</h2>
                <ul className="text-xs text-gray-700 space-y-2">
                  <li>• Complex hypertension and lipid disorders</li>
                  <li>• Preventive cardiology and lifestyle counseling</li>
                  <li>• Heart failure clinic and post-discharge follow-up</li>
                </ul>
              </section>
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Weekly schedule across locations. All times are local to the primary clinic.
              </p>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                      <tr>
                        <th className="text-left px-4 py-3">Day</th>
                        <th className="text-left px-4 py-3">Available Time</th>
                        <th className="text-left px-4 py-3">Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockSchedule.map((slot) => (
                        <tr key={slot.day} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{slot.day}</td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-gray-900">{slot.time}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">{slot.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden p-4 space-y-3">
                  {mockSchedule.map((slot) => (
                    <div key={slot.day} className="border border-gray-200 rounded-xl p-3 text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-900">{slot.day}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{slot.time}</p>
                      <p className="text-xs text-gray-600">{slot.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Quality Metrics</h2>
                <div className="space-y-3 text-sm">
                  {mockPerformance.map((metric) => (
                    <div key={metric.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700">{metric.label}</span>
                        <span className="font-semibold text-emerald-700">{metric.score}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-emerald-600 h-2 rounded-full"
                          style={{ width: `${metric.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-slate-50 border border-slate-100 rounded-xl p-4 md:p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Panel Insights</h2>
                <ul className="space-y-2 text-xs text-gray-700">
                  <li>• High control rates for hypertension and diabetes cohorts</li>
                  <li>• Above-average patient engagement with digital follow-up flows</li>
                  <li>• Strong adherence to clinical pathways and documentation standards</li>
                </ul>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

