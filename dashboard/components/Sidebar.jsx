"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar({ onNavigate, mobile = false }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "Appointments", path: "/appointments", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { name: "Patients", path: "/patients", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0a4 4 0 010 5.197m0 0v1a6 6 0 01-6 6v-1" },
    { name: "Doctors", path: "/doctors", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { name: "Activity Logs", path: "/activity-logs", icon: "M9 17v-6a2 2 0 012-2h8m-6-4v4m0 0H7a2 2 0 00-2 2v8m10-10l4 4" },
  ];

  const widthClass = mobile ? "w-64" : isCollapsed ? "w-20" : "w-64";

  return (
    <aside className={`${widthClass} bg-white border-r border-[#E5E7EB] p-4 md:p-6 flex flex-col transition-all duration-300 shrink-0 ${mobile ? "h-full" : "md:sticky md:top-0 md:h-screen"} overflow-y-auto`}>
      <div className={`flex items-center gap-3 mb-8 min-w-0 ${isCollapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 bg-[#0F766E] rounded-md shrink-0 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        {!isCollapsed && <span className="font-semibold text-lg whitespace-nowrap truncate">Clinic CRM</span>}
        {!mobile && (
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto text-gray-500 hover:text-gray-700"
            aria-label="Collapse sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isCollapsed
                    ? "M13 5l7 7-7 7M4 5l7 7-7 7"
                    : "M11 19l-7-7 7-7m8 14l-7-7 7-7"
                }
              />
            </svg>
          </button>
        )}
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center ${isCollapsed ? "justify-center gap-0 px-0" : "gap-3 px-3"} py-2 rounded-lg text-sm transition-colors ${
                isActive 
                  ? 'bg-[#0F766E] text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => onNavigate && onNavigate()}
            >
              <svg className={`w-5 h-5 shrink-0 ${isCollapsed ? "mx-auto" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <button className={`mt-6 bg-[#0F766E] text-white py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${isCollapsed ? 'px-3' : 'px-4'}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {!isCollapsed && "New Appointment"}
      </button>
    </aside>
  );
}
