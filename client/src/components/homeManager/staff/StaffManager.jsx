import { useState } from "react";

export default function StaffManager() {
  const roles = [
    "Tất cả",
    "Quản lý",
    "Đầu bếp",
    "Thu ngân",
    "Phục vụ",
    "Pha chế",
  ];

  const [staffList, setStaffList] = useState([
    {
      id: 1,
      name: "Nguyễn Văn Hùng",
      role: "Đầu bếp",
      code: "NV-001",
      phone: "0905.123.456",
      email: "hungnv@fastfood.com",
    },
    {
      id: 2,
      name: "Trần Thị Linh",
      role: "Thu ngân",
      code: "NV-002",
      phone: "0914.987.654",
      email: "linhtt@fastfood.com",
    },
    {
      id: 3,
      name: "Phan Si Thanh",
      role: "Quản lý",
      code: "NV-003",
      phone: "0935.555.777",
      email: "thanhps@fastfood.com",
    },
    {
      id: 4,
      name: "Lê Hoàng Nam",
      role: "Phục vụ",
      code: "NV-008",
      phone: "0988.222.111",
      email: "namlh@fastfood.com",
    },
    {
      id: 5,
      name: "Hoàng Minh Thư",
      role: "Pha chế",
      code: "NV-012",
      phone: "0977.444.333",
      email: "thuhm@fastfood.com",
    },
  ]);

  const [selectedRole, setSelectedRole] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  // --- QUẢN LÝ TRẠNG THÁI MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null); // null = Thêm mới, có object = Sửa

  const [formData, setFormData] = useState({
    name: "",
    role: "Phục vụ",
    code: "",
    phone: "",
    email: "",
  });

  // Chỉ hiển thị tổng số nhân viên
  const totalStaff = staffList.length;

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

  const filteredStaff = staffList.filter((staff) => {
    const matchesRole =
      selectedRole === "Tất cả" || staff.role === selectedRole;
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Mở modal thêm mới
  const handleOpenAddModal = () => {
    setEditingStaff(null);
    setFormData({
      name: "",
      role: "Phục vụ",
      code: `NV-${String(staffList.length + 1).padStart(3, "0")}`, // Tự động gợi ý mã NV
      phone: "",
      email: "",
    });
    setIsModalOpen(true);
  };

  // Mở modal chỉnh sửa
  const handleOpenEditModal = (staff) => {
    setEditingStaff(staff);
    setFormData({ ...staff });
    setIsModalOpen(true);
  };

  // Hàm xóa nhân viên khỏi danh sách
  const handleDeleteStaff = (id, name) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa nhân viên ${name} ra khỏi hệ thống không?`,
      )
    ) {
      setStaffList(staffList.filter((staff) => staff.id !== id));
    }
  };

  // Lưu dữ liệu từ Form (Cả Thêm lẫn Sửa)
  const handleSaveStaff = (e) => {
    e.preventDefault();
    if (editingStaff) {
      // Logic Chỉnh sửa
      setStaffList(
        staffList.map((s) => (s.id === editingStaff.id ? { ...formData } : s)),
      );
    } else {
      // Logic Thêm mới
      const newStaff = {
        ...formData,
        id: Date.now(), // Tạo ID duy nhất tạm thời
      };
      setStaffList([...staffList, newStaff]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">
      {/* Tiêu đề & Hành động */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản Lý Nhân Sự</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý hồ sơ thông tin nhân viên, phân phối danh mục vị trí công
            việc nội bộ.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all text-sm shadow-md shadow-amber-500/10"
        >
          <span>👤➕</span> Tiếp nhận nhân viên mới
        </button>
      </div>

      {/* Widget thống kê nhanh (Chỉ hiện tổng số nhân viên) */}
      <div className="max-w-xs w-full">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tổng nhân viên hệ thống
            </p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">
              {totalStaff} người
            </h3>
          </div>
          <span className="text-2xl bg-slate-100 p-3 rounded-xl">👥</span>
        </div>
      </div>

      {/* Thanh bộ lọc */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Tìm nhân viên theo tên hoặc mã nhân viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === role
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Bảng danh sách nhân sự */}
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
                          onClick={() => handleOpenEditModal(staff)}
                          className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Sửa thông tin hồ sơ"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteStaff(staff.id, staff.name)
                          }
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

      {/* --- POPUP MODAL: THÊM / SỬA NHÂN VIÊN --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full overflow-hidden transform transition-all scale-100">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">
                {editingStaff
                  ? "Cập Nhật Hồ Sơ Nhân Viên"
                  : "Tiếp Nhận Nhân Viên Mới"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-medium"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="p-6 space-y-4">
              {/* Hàng 1: Mã Nhân Viên (Dùng làm Username) & Mật khẩu */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Mã Nhân Viên (Username) *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingStaff} /* Khóa username khi cập nhật */
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

              {/* Hàng 2: Họ và Tên */}
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

              {/* Hàng 3: Quyền Hệ Thống & Chức Vụ Thực Tế */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Quyền Hệ Thống (Role) *
                  </label>
                  <select
                    value={formData.role_id || 2}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role_id: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value={1}>manager (Quản lý)</option>
                    <option value={2}>staff (Nhân viên)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Vị Trí Làm Việc (Sub-role) *
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
                    {/* Ánh xạ trực tiếp ID từ bảng sub_roles trong DB */}
                    <option value={1}>Quản lý</option>
                    <option value={2}>Đầu bếp</option>
                    <option value={3}>Thu ngân</option>
                    <option value={4}>Phục vụ</option>
                    <option value={5}>Pha chế</option>
                  </select>
                </div>
              </div>

              {/* Hàng 4: Số Điện Thoại & Email */}
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

              {/* Hàng 5: Trạng thái tài khoản (is_active) - Chỉ hiện khi sửa hồ sơ */}
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
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active !== false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.checked,
                        })
                      }
                      className="w-5 h-5 accent-amber-500 cursor-pointer"
                    />
                  </label>
                </div>
              )}

              {/* Hàng Footer: Thao tác */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
      )}
    </div>
  );
}
