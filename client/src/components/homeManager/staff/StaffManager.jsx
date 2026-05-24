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
      status: "working",
      shift: "Ca Sáng (06:00 - 14:00)",
      avatar: "👨‍🍳",
    },
    {
      id: 2,
      name: "Trần Thị Linh",
      role: "Thu ngân",
      code: "NV-002",
      phone: "0914.987.654",
      email: "linhtt@fastfood.com",
      status: "working",
      shift: "Ca Sáng (06:00 - 14:00)",
      avatar: "👩‍💼",
    },
    {
      id: 3,
      name: "Phan Si Thanh",
      role: "Quản lý",
      code: "NV-003",
      phone: "0935.555.777",
      email: "thanhps@fastfood.com",
      status: "working",
      shift: "Toàn thời gian",
      avatar: "👨‍💻",
    },
    {
      id: 4,
      name: "Lê Hoàng Nam",
      role: "Phục vụ",
      code: "NV-008",
      phone: "0988.222.111",
      email: "namlh@fastfood.com",
      status: "off",
      shift: "Ca Chiều (14:00 - 22:00)",
      avatar: "👦",
    },
    {
      id: 5,
      name: "Hoàng Minh Thư",
      role: "Pha chế",
      code: "NV-012",
      phone: "0977.444.333",
      email: "thuhm@fastfood.com",
      status: "leave",
      shift: "Nghỉ phép có lương",
      avatar: "👩‍🍳",
    },
  ]);

  const [selectedRole, setSelectedRole] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // --- QUẢN LÝ TRẠNG THÁI MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null); // null = Thêm mới, có object = Sửa

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "Phục vụ",
    code: "",
    phone: "",
    email: "",
    status: "working",
    shift: "Ca Sáng (06:00 - 14:00)",
    avatar: "👦",
  });

  // Đếm số liệu tổng quan (Cập nhật tự động dựa trên setStaffList)
  const totalStaff = staffList.length;
  const activeStaff = staffList.filter((s) => s.status === "working").length;
  const leaveStaff = staffList.filter((s) => s.status === "leave").length;

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
    const matchesStatus =
      statusFilter === "all" || staff.status === statusFilter;
    return matchesRole && matchesSearch && matchesStatus;
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
      status: "working",
      shift: "Ca Sáng (06:00 - 14:00)",
      avatar: "👦",
    });
    setIsModalOpen(true);
  };

  // Mở modal chỉnh sửa
  const handleOpenEditModal = (staff) => {
    setEditingStaff(staff);
    setFormData({ ...staff });
    setIsModalOpen(true);
  };

  // Khóa hoặc mở khóa nhanh tài khoản nhân viên
  const handleToggleLock = (id) => {
    setStaffList(
      staffList.map((staff) => {
        if (staff.id === id) {
          const isLocked = staff.status === "locked";
          return {
            ...staff,
            status: isLocked ? "working" : "locked",
            shift: isLocked ? "Ca Sáng (06:00 - 14:00)" : "Tài khoản bị khóa",
          };
        }
        return staff;
      }),
    );
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
            Quản lý hồ sơ nhân viên, phân quyền tài khoản và theo dõi trạng thái
            ca làm việc.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all text-sm shadow-md shadow-amber-500/10"
        >
          <span>👤➕</span> Tiếp nhận nhân viên mới
        </button>
      </div>

      {/* Widget thống kê nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tổng nhân viên
            </p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">
              {totalStaff} người
            </h3>
          </div>
          <span className="text-2xl bg-slate-100 p-3 rounded-xl">👥</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Đang trong ca làm
            </p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              {activeStaff} người
            </h3>
          </div>
          <span className="text-2xl bg-emerald-50 text-emerald-600 p-3 rounded-xl">
            🟢
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Đang nghỉ phép
            </p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">
              {leaveStaff} người
            </h3>
          </div>
          <span className="text-2xl bg-amber-50 text-amber-600 p-3 rounded-xl">
            🟡
          </span>
        </div>
      </div>

      {/* Thanh bộ lọc */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm bg-white text-slate-700 font-medium cursor-pointer"
          >
            <option value="all">Tất cả trạng thái hoạt động</option>
            <option value="working">🟢 Đang làm việc</option>
            <option value="off">⚪ Hết ca làm việc</option>
            <option value="leave">🟡 Đang nghỉ phép</option>
            <option value="locked">🔴 Tài khoản bị khóa</option>
          </select>
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
                <th className="py-4 px-6">Ca/Trạng Thái Đăng Ký</th>
                <th className="py-4 px-6 text-center">Tình Trạng</th>
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
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl shadow-inner shrink-0">
                          {staff.avatar}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">
                            {staff.name}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            ID hệ thống: #{staff.id}
                          </span>
                        </div>
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
                    <td className="py-4 px-6 text-xs font-medium text-slate-500">
                      🕒 {staff.shift}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          staff.status === "working"
                            ? "bg-emerald-50 text-emerald-700"
                            : staff.status === "leave"
                              ? "bg-amber-50 text-amber-700"
                              : staff.status === "locked"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            staff.status === "working"
                              ? "bg-emerald-500"
                              : staff.status === "leave"
                                ? "bg-amber-500"
                                : staff.status === "locked"
                                  ? "bg-rose-500"
                                  : "bg-slate-400"
                          }`}
                        ></span>
                        {staff.status === "working"
                          ? "Trong ca"
                          : staff.status === "leave"
                            ? "Nghỉ phép"
                            : staff.status === "locked"
                              ? "Bị khóa"
                              : "Hết ca"}
                      </span>
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
                          onClick={() => handleToggleLock(staff.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            staff.status === "locked"
                              ? "text-rose-600 bg-rose-50 hover:bg-rose-100"
                              : "text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                          }`}
                          title={
                            staff.status === "locked"
                              ? "Mở khóa tài khoản"
                              : "Khóa tài khoản"
                          }
                        >
                          {staff.status === "locked" ? "🔓" : "🔒"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
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
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Avatar biểu tượng
                  </label>
                  <select
                    value={formData.avatar}
                    onChange={(e) =>
                      setFormData({ ...formData, avatar: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-lg text-center bg-white"
                  >
                    <option value="👦">👦 Nam phục vụ</option>
                    <option value="👩‍💼">👩‍💼 Nữ thu ngân</option>
                    <option value="👨‍🍳">👨‍🍳 Nam đầu bếp</option>
                    <option value="👩‍🍳">👩‍🍳 Nữ pha chế</option>
                    <option value="👨‍💻">👨‍💻 Quản lý</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Mã Nhân Viên
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-mono font-bold text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Họ và Tên
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Chức Vụ
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                  >
                    {roles
                      .filter((r) => r !== "Tất cả")
                      .map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Ca Đăng Ký Hiện Tại
                  </label>
                  <select
                    value={formData.shift}
                    onChange={(e) =>
                      setFormData({ ...formData, shift: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                  >
                    <option value="Ca Sáng (06:00 - 14:00)">
                      Ca Sáng (06:00 - 14:00)
                    </option>
                    <option value="Ca Chiều (14:00 - 22:00)">
                      Ca Chiều (14:00 - 22:00)
                    </option>
                    <option value="Toàn thời gian">Toàn thời gian</option>
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
                    required
                    placeholder="0905.xxx.xxx"
                    value={formData.phone}
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
                    required
                    placeholder="tennv@fastfood.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Tình Trạng Làm Việc
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                >
                  <option value="working">Trong ca làm việc</option>
                  <option value="off">Hết ca làm việc</option>
                  <option value="leave">Nghỉ phép</option>
                </select>
              </div>

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
