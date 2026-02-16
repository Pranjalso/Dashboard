import Link from "next/link";

export default function ActivityFeed() {
  return (
    <section className="bg-white border border-[#27385c] rounded-xl p-5">
      <header className="flex justify-between mb-4">
        <h2 className="font-semibold">Recent Patient Activity</h2>
        <Link
          href="/activity-logs"
          className="text-sm text-[#0F766E] hover:underline font-medium"
        >
          Activity Log
        </Link>
      </header>
      <div className="rounded-lg overflow-hidden border border-gray-600">
        <ul className="text-sm text-gray-900 divide-y divide-gray-500">
          <li className="px-4 py-3 even:bg-white odd:bg-gray-90">John Doe activity updated</li>
          <li className="px-4 py-3 even:bg-white odd:bg-gray-50">Jane Smith appointment confirmed</li>
          <li className="px-4 py-3 even:bg-white odd:bg-gray-500">New medical record uploaded</li>
        </ul>
      </div>
    </section>
  );
}
