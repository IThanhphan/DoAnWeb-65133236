export default function StaffModal({
  isOpen,
  onClose,
  editingStaff,
  formData,
  setFormData,
  onSave,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full overflow-hidden transform transition-all scale-100">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
            {editingStaff
              ? "Cập Nhật Hồ Sơ Nhân Viên"
              : "Tiếp Nhận Nhân Viên Mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-medium"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSave} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Mã Nhân Viên (Username) *
              </label>
              <input
                type="text"
                required
                disabled={!!editingStaff}
                placeholder="NV-001"
                value={formData.code || formData.username || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toLowerCase().replace(/\s/g, ""),
                  })
                }
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-mono font-bold text-sm disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                {editingStaff
                  ? "Mật khẩu mới (Nếu đổi)"
                  : "Mật khẩu khởi tạo *"}
              </label>
              <input
                type="password"
                required={!editingStaff}
                placeholder={editingStaff ? "••••••••" : "Nhập mật khẩu"}
                value={formData.password || ""}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Họ và Tên *
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Nguyễn Văn A"
              value={formData.name || formData.full_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Quyền Hệ Thống *
              </label>
              <select
                value={formData.role_id || 2}
                onChange={(e) =>
                  setFormData({ ...formData, role_id: Number(e.target.value) })
                }
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value={1}>manager (Quản lý)</option>
                <option value={2}>staff (Nhân viên)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Vị Trí Làm Việc *
              </label>
              <select
                value={formData.sub_role_id || 4}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sub_role_id: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value={1}>Quản lý</option>
                <option value={2}>Đầu bếp</option>
                <option value={3}>Thu ngân</option>
                <option value={4}>Phục vụ</option>
                <option value={5}>Pha chế</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Số Điện Thoại
              </label>
              <input
                type="text"
                placeholder="Không bắt buộc"
                value={formData.phone || formData.phone_number || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Không bắt buộc"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>
          </div>

          {editingStaff && (
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <div>
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Trạng thái tài khoản
                </span>
                <span className="text-xs text-slate-400">
                  Cho phép đăng nhập vào hệ thống
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.is_active !== false}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm transition-colors shadow-sm"
            >
              {editingStaff ? "Cập nhật hồ sơ" : "Xác nhận tiếp nhận"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
