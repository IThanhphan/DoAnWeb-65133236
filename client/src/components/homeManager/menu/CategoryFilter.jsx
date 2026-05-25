export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
      <button
        onClick={() => onSelectCategory("Tất cả")}
        className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
          selectedCategory === "Tất cả"
            ? "bg-slate-900 text-white shadow-sm"
            : "bg-slate-50 text-slate-600 hover:bg-slate-200"
        }`}
      >
        TẤT CẢ
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id.toString())}
          className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
            selectedCategory === cat.id.toString()
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-slate-50 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {cat.name.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
