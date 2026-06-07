export default function StaffHeader({ onOpenAddModal }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quản Lý Nhân Sự</h1>
        <p className="text-sm text-slate-500 mt-1">
          Quản lý hồ sơ thông tin nhân viên, phân phối danh mục vị trí công việc
          nội bộ.
        </p>
      </div>
      <button
        onClick={onOpenAddModal}
        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all text-sm shadow-md shadow-amber-500/10"
      >
        <span>👤➕</span> Tiếp nhận nhân viên mới
      </button>
    </div>
  );
}
