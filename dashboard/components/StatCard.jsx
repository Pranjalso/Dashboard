export default function StatCard({ title, value, tag, icon }) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-xs font-bold text-[#0F766E] bg-[#0F766E]/10 px-3 py-1 rounded-full inline-block">
            {tag}
          </div>
          <p className="text-sm text-gray-600 mt-2">{title}</p>
        </div>
        {icon && (
          <div className="w-10 h-10 bg-[#0F766E]/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-[#0F766E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
          </div>
        )}
      </div>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}