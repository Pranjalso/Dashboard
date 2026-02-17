 "use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthPage = pathname === "/login" || pathname === "/register";

  const getPageTitle = () => {
    if (pathname.includes("/appointments")) return "Appointment Directory";
    if (pathname.startsWith("/patients/")) return "Patients/Patient Details";
    if (pathname.startsWith("/doctors/profile/")) return "Doctors/Doctor Details";
    if (pathname.includes("/patients")) return "Patient Management";
    if (pathname.includes("/doctors")) return "Doctor Management";
    if (pathname.includes("/dashboard")) return "Dashboard Overview";
    return "Clinic CRM";
  };

  const getPageDescription = () => {
    if (pathname.includes("/appointments")) return "Managing 1,284 scheduled appointments";
    if (pathname.includes("/patients")) return "Manage all patient records and information";
    if (pathname.includes("/doctors")) return "Manage doctors and their schedules";
    if (pathname.includes("/dashboard")) return "Welcome back, Admin. Here's what's happening today.";
    return "Healthcare management system";
  };

  const [dynamicDescription, setDynamicDescription] = useState("");
  const [dynamicTitle, setDynamicTitle] = useState("");

  useEffect(() => {
    try {
      if (pathname.startsWith("/patients/")) {
        const id = decodeURIComponent(pathname.split("/")[2] || "");
        if (id && typeof window !== "undefined") {
          const raw = window.localStorage.getItem("crm_patients");
          const list = raw ? JSON.parse(raw) : [];
          const match = Array.isArray(list) ? list.find((p) => p.id === id) : null;
          setTimeout(() => {
            setDynamicTitle(match?.name || "");
            setDynamicDescription("Patients/Patient Details");
          }, 0);
        } else {
          setTimeout(() => {
            setDynamicTitle("");
            setDynamicDescription("");
          }, 0);
        }
        return;
      }
      if (pathname.startsWith("/doctors/profile/")) {
        const id = decodeURIComponent(pathname.split("/")[3] || "");
        if (id && typeof window !== "undefined") {
          const raw = window.localStorage.getItem("crm_doctors");
          const list = raw ? JSON.parse(raw) : [];
          const match = Array.isArray(list) ? list.find((d) => d.id === id) : null;
          const desc = match ? `Doctors/Doctor Details\n${match.specialization} • ${match.id}` : "Doctors/Doctor Details";
          setTimeout(() => {
            setDynamicTitle(match?.name || "");
            setDynamicDescription(desc);
          }, 0);
        } else {
          setTimeout(() => {
            setDynamicTitle("");
            setDynamicDescription("");
          }, 0);
        }
        return;
      }
      setTimeout(() => {
        setDynamicTitle("");
        setDynamicDescription("");
      }, 0);
    } catch {
      setTimeout(() => {
        setDynamicTitle("");
        setDynamicDescription("");
      }, 0);
    }
  }, [pathname]);

  if (isAuthPage) {
    return children;
  }

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 overflow-auto">
          <Navbar
            title={dynamicTitle || getPageTitle()}
            description={dynamicDescription || getPageDescription()}
            onMenuClick={() => setMobileOpen(true)}
          />
          {children}
        </main>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar mobile onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
