export default function InventoryHeader({ onOpenAddModal, onOpenAdjustModal }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Quản Lý Kho & Định Lượng
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Theo dõi số lượng vật tư thực tế, cập nhật thẻ kho tự động.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
        <button
          onClick={onOpenAddModal}
          className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-xl transition-all text-sm shadow-md shadow-blue-600/10"
        >
          <span>➕</span> Thêm nguyên liệu
        </button>
        <button
          onClick={() => onOpenAdjustModal("KIỂM_KHO")}
          className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-3 rounded-xl transition-all text-sm"
        >
          <span>📋</span> Kiểm nhanh kho
        </button>
        <button
          onClick={() => onOpenAdjustModal("NHẬP")}
          className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all text-sm shadow-md shadow-amber-500/10"
        >
          <span>📥</span> Nhập thêm hàng
        </button>
      </div>
    </div>
  );
}
