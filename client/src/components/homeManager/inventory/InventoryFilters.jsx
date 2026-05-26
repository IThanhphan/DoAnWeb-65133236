export default function InventoryFilters({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Tìm nguyên liệu bằng tên hoặc mã NVL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm bg-white transition-colors cursor-pointer text-slate-700 font-medium"
        >
          <option value="all">Tất cả tình trạng tồn kho</option>
          <option value="low">⚠️ Nguyên liệu sắp hết</option>
          <option value="out">🚨 Nguyên liệu đã hết hàng</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
        <button
          onClick={() => setSelectedCategory("Tất cả")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedCategory === "Tất cả"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          Tất cả
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === cat.name
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-50 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
