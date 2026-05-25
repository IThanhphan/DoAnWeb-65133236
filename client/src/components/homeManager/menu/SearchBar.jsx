export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative max-w-md w-full">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        🔍
      </span>
      <input
        type="text"
        placeholder="Tìm theo tên món ăn..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 text-sm transition-colors"
      />
    </div>
  );
}
