export default function StaffTable({
  filteredStaff,
  onOpenEditModal,
  onDeleteStaff,
}) {
  const getRoleBadge = (role) => {
    switch (role) {
      case "Quản lý":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Đầu bếp":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Thu ngân":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Pha chế":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-100">
              <th className="py-4 px-6">Mã NV</th>
              <th className="py-4 px-6">Nhân Viên</th>
              <th className="py-4 px-6">Chức Vụ</th>
              <th className="py-4 px-6">Thông Tin Liên Hệ</th>
              <th className="py-4 px-6 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => (
                <tr
                  key={staff.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-4 px-6 font-mono font-bold text-xs text-slate-400">
                    {staff.code}
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        {staff.name}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        ID hệ thống: #{staff.id}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md border ${getRoleBadge(staff.role)}`}
                    >
                      {staff.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs space-y-0.5">
                    <p className="font-semibold text-slate-700">
                      📞 {staff.phone}
                    </p>
                    <p className="text-slate-400">✉️ {staff.email}</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => onOpenEditModal(staff)}
                        className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Sửa thông tin hồ sơ"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDeleteStaff(staff.id, staff.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Xóa nhân viên"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-12 text-center text-slate-400">
                  <div className="text-3xl mb-2">🔍🙍‍♂️</div>
                  <p className="font-semibold text-slate-600">
                    Không tìm thấy nhân viên phù hợp
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
