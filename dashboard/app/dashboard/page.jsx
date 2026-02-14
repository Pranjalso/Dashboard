import StatCard from "@/components/StatCard";
import AppointmentList from "@/components/AppointmentList";
import ActivityFeed from "@/components/ActivityFeed";
import ScheduleTable from "@/components/ScheduleTable";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Today's Appointments" 
          value="42" 
          tag="LIVE"
          icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <StatCard 
          title="Pending WhatsApp Flows" 
          value="18" 
          tag="AUTOMATED"
          icon="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
        <StatCard 
          title="New Patients" 
          value="12" 
          tag="NEW"
          icon="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
        />
        <StatCard 
          title="Active Doctors" 
          value="08" 
          tag="DUTY"
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentList />
        <ActivityFeed />
      </div>

      {/* Schedule Table */}
      <ScheduleTable />
    </div>
  );
}
