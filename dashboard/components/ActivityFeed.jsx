import Link from "next/link";

export default function ActivityFeed() {
  return (
    <section className="bg-white border border-[#E5E7EB] rounded-xl p-5">
      <header className="flex justify-between mb-4">
        <h2 className="font-semibold">Recent Patient Activity</h2>
        <Link
          href="/activity-logs"
          className="text-sm text-[#0F766E] hover:underline font-medium"
        >
          Activity Log
        </Link>
      </header>

      <ul className="space-y-4 text-sm text-[#64748B]">
        <li>John Doe joined follow-up flow</li>
        <li>Jane Smith confirmed appointment</li>
        <li>New medical record uploaded</li>
      </ul>
    </section>
  );
}
