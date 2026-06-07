export default function StaffFilters({
  roles,
  selectedRole,
  setSelectedRole,
  searchTerm,
  setSearchTerm,
}) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          🔍
        </span>
        <input
          type="text"
          placeholder="Tìm nhân viên theo tên hoặc mã nhân viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm transition-colors"
        />
      </div>

      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedRole === role
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-50 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
}
