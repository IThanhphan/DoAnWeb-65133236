export default function InventoryTable({
  filteredItems,
  getStockStatus,
  onOpenAdjust,
  onOpenHistory,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-100">
              <th className="py-4 px-6">Mã Vật Tư</th>
              <th className="py-4 px-6">Tên Nguyên Vật Liệu</th>
              <th className="py-4 px-6">Nhóm Khai Báo</th>
              <th className="py-4 px-6 text-right">Lượng Tồn</th>
              <th className="py-4 px-6 text-right">Mức Tối Thiểu</th>
              <th className="py-4 px-6 text-center">Trạng Thái</th>
              <th className="py-4 px-6 text-center">Cập Nhật Cuối</th>
              <th className="py-4 px-6 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const status = getStockStatus(item);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-semibold text-slate-500 text-xs">
                      {item.code}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800">
                      {item.name}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                        {item.ingredientCategory.name}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-black text-slate-900">
                      <span
                        className={
                          status.type === "out"
                            ? "text-rose-600"
                            : status.type === "low"
                              ? "text-amber-600"
                              : "text-slate-900"
                        }
                      >
                        {item.stockQuantity}
                      </span>{" "}
                      <span className="text-xs text-slate-400 font-normal">
                        {item.unit}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-slate-400 font-medium">
                      {item.minRequiredQuantity} {item.unit}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-md border ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-xs text-slate-400">
                      {item.updatedAt}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => onOpenAdjust("NHẬP", item)}
                          className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors text-base"
                          title="Nhập / Sửa nhanh"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => onOpenHistory(item)}
                          className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors text-base"
                          title="Xem thẻ kho chi tiết"
                        >
                          📊
                        </button>
                        <button
                          onClick={() => onDelete(item.id, item.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors text-base"
                          title="Xóa vật tư khỏi danh mục"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-400">
                  <div className="text-3xl mb-2">📦</div>
                  <p className="font-semibold text-slate-600">
                    Không tìm thấy vật tư trùng khớp
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
