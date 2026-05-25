export default function MenuItemCard({
  item,
  categoryName,
  onToggleAvailability,
  onEdit,
  onDelete,
}) {
  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
        item.isAvailable
          ? "border-slate-100 shadow-sm hover:shadow-md"
          : "border-slate-200 opacity-75 bg-slate-50/50"
      }`}
    >
      <div className="p-5 flex gap-4">
        <img
          src={item.imageUrl || "https://placehold.co/150x150?text=No+Image"}
          alt={item.name}
          className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0 shadow-inner border border-slate-100"
        />

        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">
              {categoryName}
            </span>
          </div>
          <h3
            className="font-bold text-slate-800 text-base truncate"
            title={item.name}
          >
            {item.name}
          </h3>
          <p className="text-lg font-black text-slate-900">
            {item.price.toLocaleString("vi-VN")} đ
          </p>
        </div>
      </div>

      <div className="px-5 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={item.isAvailable}
              onChange={() => onToggleAvailability(item.id)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          </label>
          <span
            className={`text-xs font-bold ${item.isAvailable ? "text-emerald-600" : "text-slate-400"}`}
          >
            {item.isAvailable ? "Đang bán" : "Hết hàng"}
          </span>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Chỉnh sửa món"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Xóa món"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
