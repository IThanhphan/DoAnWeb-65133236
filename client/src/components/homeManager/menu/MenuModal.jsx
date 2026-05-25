import { useRef } from "react";

export default function MenuModal({
  isOpen,
  mode,
  categories,
  formValues,
  setFormValues,
  onClose,
  onSave,
}) {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localImageUrl = URL.createObjectURL(file);
      setFormValues({ ...formValues, imageUrl: localImageUrl });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 z-10 overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {mode === "add" ? "✨ Thêm Món Ăn Mới" : "✏️ Chỉnh Sửa Món Ăn"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Điền các thông số để đồng bộ trực tiếp vào cơ sở dữ liệu
              `products`.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Form Content */}
        <form
          onSubmit={onSave}
          className="p-6 space-y-4 overflow-y-auto flex-1"
        >
          {/* Vùng tải ảnh lên */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Hình ảnh sản phẩm <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-4 items-center">
              <div className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0 relative group">
                {formValues.imageUrl ? (
                  <>
                    <img
                      src={formValues.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs pointer-events-none">
                      Thay đổi
                    </div>
                  </>
                ) : (
                  <span className="text-2xl text-slate-300">🖼️</span>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                >
                  Chọn file ảnh từ máy tính
                </button>
                <p className="text-[11px] text-slate-400">
                  Hỗ trợ định dạng JPG, PNG, WEBP. Ảnh nên là tỷ lệ vuông (1:1).
                </p>
              </div>
            </div>
          </div>

          {/* Phân nhóm danh mục */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Phân nhóm danh mục (`category_id`)
            </label>
            <select
              value={formValues.categoryId}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  categoryId: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 text-slate-800 bg-white font-medium cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tên món ăn */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tên món ăn (`name`) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Burger Tôm Sốt Tartar"
              value={formValues.name}
              onChange={(e) =>
                setFormValues({ ...formValues, name: e.target.value })
              }
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 text-slate-800 font-medium"
            />
          </div>

          {/* Giá bán */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Giá bán lẻ (`price`) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min="0"
                step="1000"
                placeholder="0"
                value={formValues.price}
                onChange={(e) =>
                  setFormValues({ ...formValues, price: e.target.value })
                }
                className="w-full pl-3 pr-12 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 text-slate-800 font-bold"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>
          </div>

          {/* Trạng thái mở bán */}
          <div className="flex items-center justify-between p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
            <div>
              <p className="text-sm font-bold text-slate-800">
                Cấu hình trạng thái
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Hiển thị trực tiếp trên danh mục thực đơn của nhân viên.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formValues.isAvailable}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      isAvailable: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
              <span
                className={`text-xs font-bold w-16 text-right ${formValues.isAvailable ? "text-emerald-600" : "text-slate-400"}`}
              >
                {formValues.isAvailable ? "Sẵn sàng" : "Tạm ngắt"}
              </span>
            </div>
          </div>

          {/* Chân Form Hành động */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-bold transition-all shadow-md shadow-amber-500/10 active:scale-95"
            >
              {mode === "add" ? "Thêm món mới" : "Cập nhật thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
