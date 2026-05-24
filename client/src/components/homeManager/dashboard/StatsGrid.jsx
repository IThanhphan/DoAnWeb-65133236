export default function StatsGrid({ stats }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">
              {stat.name}
            </span>
            <div className="text-2xl font-black text-slate-900">
              {stat.value}
            </div>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-sm ${
                stat.changeType === "increase"
                  ? "bg-emerald-100 text-emerald-700"
                  : stat.changeType === "decrease"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-slate-100 text-slate-600"
              }`}
            >
              {stat.change}
            </span>
          </div>
          <div className="text-3xl bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-2xs">
            {stat.icon}
          </div>
        </div>
      ))}
    </section>
  );
}
