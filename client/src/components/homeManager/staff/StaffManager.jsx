import { useState } from "react";
import StaffHeader from "./StaffHeader";
import StaffStats from "./StaffStats";
import StaffFilters from "./StaffFilters";
import StaffTable from "./StaffTable";
import StaffModal from "./StaffModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "Phục vụ",
    code: "",
    phone: "",
    email: "",
  });

  const filteredStaff = staffList.filter((staff) => {
    const matchesRole =
      selectedRole === "Tất cả" || staff.role === selectedRole;
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingStaff(null);
    setFormData({
      name: "",
      role: "Phục vụ",
      code: `NV-${String(staffList.length + 1).padStart(3, "0")}`,
      phone: "",
      email: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (staff) => {
    setEditingStaff(staff);
    setFormData({ ...staff });
    setIsModalOpen(true);
  };

  const handleDeleteStaff = (id, name) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa nhân viên ${name} ra khỏi hệ thống không?`,
      )
    ) {
      setStaffList(staffList.filter((staff) => staff.id !== id));
    }
  };

  const handleSaveStaff = (e) => {
    e.preventDefault();
    if (editingStaff) {
      setStaffList(
        staffList.map((s) => (s.id === editingStaff.id ? { ...formData } : s)),
      );
    } else {
      const newStaff = { ...formData, id: Date.now() };
      setStaffList([...staffList, newStaff]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">
      <StaffHeader onOpenAddModal={handleOpenAddModal} />

      <StaffStats totalStaff={staffList.length} />

      <StaffFilters
        roles={roles}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <StaffTable
        filteredStaff={filteredStaff}
        onOpenEditModal={handleOpenEditModal}
        onDeleteStaff={handleDeleteStaff}
      />

      <StaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingStaff={editingStaff}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveStaff}
      />
    </div>
  );
}
