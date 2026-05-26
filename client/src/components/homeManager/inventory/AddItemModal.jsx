export default function AddItemModal({
  categories,
  formValues,
  setFormValues,
  onSave,
  onClose,
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              ➕ Thêm Mới Nguyên Vật Liệu
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Khai báo cấu trúc danh mục kho chuẩn hóa.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Gọi trực tiếp hàm onSave truyền từ cha khi submit form */}
        <form onSubmit={onSave} className="p-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Mã Vật Tư Dự Kiến:
            </span>
            <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-sm font-mono font-bold tracking-wide shadow-inner">
              {formValues.code || "Đang tạo..."}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Tên Nguyên Vật Liệu
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Tương ớt Chinsu, Hành tây Đà Lạt..."
              value={formValues.name}
              onChange={(e) =>
                setFormValues({ ...formValues, name: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Nhóm Vật Tư Kho (Chuẩn hóa)
            </label>
            <select
              value={formValues.ingredientCategoryId}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  ingredientCategoryId: e.target.value,
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 bg-white cursor-pointer font-medium"
            >
              {categories
                .filter((c) => c.id !== "all")
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Số Tồn Đầu
              </label>
              <input
                type="number"
                step="any"
                placeholder="0"
                value={formValues.stockQuantity}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    stockQuantity: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Mức Tối Thiểu
              </label>
              <input
                type="number"
                step="any"
                placeholder="0"
                value={formValues.minRequiredQuantity}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    minRequiredQuantity: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Đơn vị
              </label>
              <input
                type="text"
                required
                placeholder="kg, cái..."
                value={formValues.unit}
                onChange={(e) =>
                  setFormValues({ ...formValues, unit: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-sm shadow-md shadow-blue-600/10 transition-colors"
            >
              Tạo vật tư kho
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
