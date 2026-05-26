import { useState } from "react";

export default function InventoryManager() {
  // Thay vì mảng string phẳng, chúng ta quản lý danh mục kho theo cấu trúc Object chuẩn hóa từ DB
  const categories = [
    { id: "all", name: "Tất cả" },
    { id: 1, name: "Thịt tươi" },
    { id: 2, name: "Bánh mì & Bột" },
    { id: 3, name: "Rau củ" },
    { id: 4, name: "Gia vị & Sốt" },
    { id: 5, name: "Đóng gói" },
  ];

  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      code: "NVL-001",
      name: "Thịt bò và vụn bò băm",
      category: { id: 1, name: "Thịt tươi" }, // Dữ liệu dạng lồng nhau sau chuẩn hóa
      stock: 4.5,
      minStock: 10,
      unit: "kg",
      lastUpdated: "10:30 - 24/05",
    },
    {
      id: 2,
      code: "NVL-012",
      name: "Vỏ bánh mì Burger mè",
      category: { id: 2, name: "Bánh mì & Bột" },
      stock: 150,
      minStock: 50,
      unit: "cái",
      lastUpdated: "08:15 - 24/05",
    },
    {
      id: 3,
      code: "NVL-045",
      name: "Phô mai Cheddar lát",
      category: { id: 5, name: "Đóng gói" },
      stock: 24,
      minStock: 30,
      unit: "lát",
      lastUpdated: "21:00 - 23/05",
    },
    {
      id: 4,
      code: "NVL-019",
      name: "Khoai tây cọng đông lạnh",
      category: { id: 5, name: "Đóng gói" },
      stock: 45,
      minStock: 20,
      unit: "kg",
      lastUpdated: "15:45 - 23/05",
    },
    {
      id: 5,
      code: "NVL-008",
      name: "Sốt Mayo đặc chế",
      category: { id: 4, name: "Gia vị & Sốt" },
      stock: 0,
      minStock: 5,
      unit: "lít",
      lastUpdated: "19:30 - 23/05",
    },
    {
      id: 6,
      code: "NVL-031",
      name: "Xà lách lolo xanh",
      category: { id: 3, name: "Rau củ" },
      stock: 3.2,
      minStock: 3,
      unit: "kg",
      lastUpdated: "06:00 - 24/05",
    },
  ]);

  const mockHistoryLog = {
    1: [
      {
        id: 101,
        date: "24/05/2026 10:30",
        type: "XUẤT",
        qty: -1.5,
        note: "Xuất kho chế biến ca sáng",
      },
      {
        id: 102,
        date: "23/05/2026 14:00",
        type: "NHẬP",
        qty: 6.0,
        note: "Nhà cung cấp giao hàng đợt 1",
      },
    ],
    2: [
      {
        id: 201,
        date: "24/05/2026 08:15",
        type: "NHẬP",
        qty: 100,
        note: "Nhập bánh tươi đầu ngày",
      },
    ],
  };

  // State Bộ lọc & Tìm kiếm
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // State điều khiển UI Modals ('adjust', 'history', 'add', hoặc null)
  const [activeModal, setActiveModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // State phục vụ form nhập dữ liệu (Nhập/Kiểm)
  const [formQty, setFormQty] = useState("");
  const [formNote, setFormNote] = useState("Nhập hàng bổ sung");
  const [actionType, setActionType] = useState("NHẬP");

  // State phục vụ form THÊM MỚI nguyên liệu
  const [newItem, setNewItem] = useState({
    name: "",
    categoryId: 1, // Mặc định chọn danh mục đầu tiên (không tính 'Tất cả')
    stock: "",
    minStock: "",
    unit: "kg",
  });

  const generateNextCode = () => {
    const maxId =
      inventoryItems.length > 0
        ? Math.max(...inventoryItems.map((item) => item.id))
        : 0;
    const nextNumber = maxId + 1;
    // Trả về định dạng NVL-00X (đảm bảo 3 chữ số)
    return `NVL-${String(nextNumber).padStart(3, "0")}`;
  };

  // Hàm helper xác định trạng thái tồn kho
  const getStockStatus = (item) => {
    if (item.stock === 0)
      return {
        label: "Hết hàng",
        color: "text-rose-600 bg-rose-50 border-rose-200",
        type: "out",
      };
    if (item.stock <= item.minStock)
      return {
        label: "Sắp hết (Cần nhập)",
        color: "text-amber-600 bg-amber-50 border-amber-200",
        type: "low",
      };
    return {
      label: "An toàn",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      type: "safe",
    };
  };

  // Logic lọc dữ liệu bảng áp dụng cấu trúc lồng nhau `.category.name`
  const filteredItems = inventoryItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "Tất cả" || item.category.name === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getStockStatus(item);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "low" && status.type === "low") ||
      (statusFilter === "out" && status.type === "out");
    return matchesCategory && matchesSearch && matchesStatus;
  });

  // Xử lý mở Form Nhập/Kiểm hàng
  const handleOpenAdjust = (type, item = null) => {
    setActionType(type);
    setSelectedItem(item || inventoryItems[0]);
    setFormQty("");
    setActiveModal("adjust");
  };

  // Xử lý lưu form thay đổi số lượng kho
  const handleSaveAdjustment = (e) => {
    e.preventDefault();
    const numQty = parseFloat(formQty);
    if (isNaN(numQty) || numQty < 0)
      return alert("Vui lòng nhập số lượng hợp lệ!");

    setInventoryItems((prev) =>
      prev.map((item) => {
        if (item.id === selectedItem.id) {
          let newStock = item.stock;
          if (actionType === "NHẬP") {
            newStock = item.stock + numQty;
          } else if (actionType === "KIỂM_KHO") {
            newStock = numQty;
          }
          return {
            ...item,
            stock: newStock,
            lastUpdated: `Vừa xong`,
          };
        }
        return item;
      }),
    );
    setActiveModal(null);
  };

  // Xử lý THÊM MỚI nguyên vật liệu
  const handleAddItem = (e) => {
    e.preventDefault();

    const selectedCatObj = categories.find(
      (c) => c.id === parseInt(newItem.categoryId),
    );
    const nextId =
      inventoryItems.length > 0
        ? Math.max(...inventoryItems.map((item) => item.id)) + 1
        : 1;
    const autoGeneratedCode = `NVL-${String(nextId).padStart(3, "0")}`;

    const itemToAdd = {
      id: nextId,
      code: autoGeneratedCode, // Mã tự động gán ở đây
      name: newItem.name,
      category: {
        id: selectedCatObj.id,
        name: selectedCatObj.name,
      },
      stock: parseFloat(newItem.stock) || 0,
      minStock: parseFloat(newItem.minStock) || 0,
      unit: newItem.unit,
      lastUpdated: "Vừa tạo",
    };

    setInventoryItems((prev) => [itemToAdd, ...prev]);
    setActiveModal(null);
    setNewItem({
      name: "",
      categoryId: 1,
      stock: "",
      minStock: "",
      unit: "kg",
    });
  };

  // Xử lý XÓA nguyên vật liệu
  const handleDeleteItem = (id, name) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa nguyên liệu "${name}" ra khỏi danh mục kho không?\nHành động này không thể hoàn tác.`,
      )
    ) {
      setInventoryItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl w-full mx-auto relative text-slate-700">
      {/* KHU VỰC TIÊU ĐỀ & NÚT THAO TÁC TỔNG */}
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
            onClick={() => setActiveModal("add")}
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-xl transition-all text-sm shadow-md shadow-blue-600/10"
          >
            <span>➕</span> Thêm nguyên liệu
          </button>
          <button
            onClick={() => handleOpenAdjust("KIỂM_KHO")}
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-3 rounded-xl transition-all text-sm"
          >
            <span>📋</span> Kiểm nhanh kho
          </button>
          <button
            onClick={() => handleOpenAdjust("NHẬP")}
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all text-sm shadow-md shadow-amber-500/10"
          >
            <span>📥</span> Nhập thêm hàng
          </button>
        </div>
      </div>

      {/* THANH BỘ LỌC TÌM KIẾM */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Tìm nguyên liệu bằng tên hoặc mã NVL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm bg-white transition-colors cursor-pointer text-slate-700 font-medium"
          >
            <option value="all">Tất cả tình trạng tồn kho</option>
            <option value="low">⚠️ Nguyên liệu sắp hết</option>
            <option value="out">🚨 Nguyên liệu đã hết hàng</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat.name
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* BẢNG SỐ LIỆU TỒN KHO */}
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
                          {item.category.name} {/* Đọc từ Object lồng nhau */}
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
                          {item.stock}
                        </span>{" "}
                        <span className="text-xs text-slate-400 font-normal">
                          {item.unit}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-slate-400 font-medium">
                        {item.minStock} {item.unit}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-md border ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center text-xs text-slate-400">
                        {item.lastUpdated}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => handleOpenAdjust("NHẬP", item)}
                            className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors text-base"
                            title="Nhập / Sửa nhanh"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setActiveModal("history");
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors text-base"
                            title="Xem thẻ kho chi tiết"
                          >
                            📊
                          </button>
                          {/* Nút XÓA mới được tích hợp */}
                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
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

      {/* NEW MODAL: FORM THÊM MỚI NGUYÊN VẬT LIỆU */}
      {activeModal === "add" && (
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
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              {/* Mã NVL chuyển thành thanh hiển thị Read-Only */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Mã Vật Tư Dự Kiến:
                </span>
                <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-sm font-mono font-bold tracking-wide shadow-inner">
                  {generateNextCode()}
                </span>
              </div>

              {/* Tên vật tư chiếm trọn dòng đầu */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Tên Nguyên Vật Liệu
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Tương ớt Chinsu, Hành tây Đà Lạt..."
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Nhóm Vật Tư Kho (Chuẩn hóa)
                </label>
                <select
                  value={newItem.categoryId}
                  onChange={(e) =>
                    setNewItem({ ...newItem, categoryId: e.target.value })
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
                    value={newItem.stock}
                    onChange={(e) =>
                      setNewItem({ ...newItem, stock: e.target.value })
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
                    value={newItem.minStock}
                    onChange={(e) =>
                      setNewItem({ ...newItem, minStock: e.target.value })
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
                    value={newItem.unit}
                    onChange={(e) =>
                      setNewItem({ ...newItem, unit: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
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
      )}

      {/* MODAL ADJUST: PHIẾU NHẬP HÀNG / KIỂM KHO */}
      {activeModal === "adjust" && selectedItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {actionType === "NHẬP"
                    ? "📥 Tạo Phiếu Nhập Thêm"
                    : "📋 Cập Nhật Biên Bản Kiểm Kho"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mã thao tác nội bộ: {selectedItem.code}
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Chọn Nguyên Vật Liệu
                </label>
                <select
                  value={selectedItem.id}
                  onChange={(e) =>
                    setSelectedItem(
                      inventoryItems.find(
                        (i) => i.id === parseInt(e.target.value),
                      ),
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 bg-white"
                >
                  {inventoryItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between text-xs font-semibold text-slate-600">
                <span>
                  Số tồn hiện tại:{" "}
                  <b className="text-slate-900">
                    {selectedItem.stock} {selectedItem.unit}
                  </b>
                </span>
                <span>
                  Mức tối thiểu:{" "}
                  <b>
                    {selectedItem.minStock} {selectedItem.unit}
                  </b>
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  {actionType === "NHẬP"
                    ? `Số lượng cộng thêm (${selectedItem.unit})`
                    : `Số lượng thực tế đếm được (${selectedItem.unit})`}
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="Nhập số..."
                  value={formQty}
                  onChange={(e) => setFormQty(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 font-bold text-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Ghi chú thẻ kho
                </label>
                <input
                  type="text"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-sm shadow-md shadow-amber-500/10 transition-colors"
                >
                  Xác nhận lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HISTORY: XEM LỊCH SỬ THÈ KHO */}
      {activeModal === "history" && selectedItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  📊 Nhật Ký Biến Động Thẻ Kho
                </h3>
                <p className="text-xs text-amber-600 font-semibold mt-0.5">
                  {selectedItem.name} ({selectedItem.code})
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 max-h-[400px] overflow-y-auto">
              {mockHistoryLog[selectedItem.id] ? (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-100 font-bold uppercase">
                      <th className="pb-3">Thời gian</th>
                      <th className="pb-3 text-center">Hình Thức</th>
                      <th className="pb-3 text-right">Biến động</th>
                      <th className="pb-3 pl-4">Ghi chú vận hành</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {mockHistoryLog[selectedItem.id].map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/40">
                        <td className="py-3 font-medium text-slate-500">
                          {log.date}
                        </td>
                        <td className="py-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.type === "NHẬP" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
                          >
                            {log.type}
                          </span>
                        </td>
                        <td
                          className={`py-3 text-right font-bold ${log.type === "NHẬP" ? "text-emerald-600" : "text-rose-600"}`}
                        >
                          {log.qty > 0 ? `+${log.qty}` : log.qty}{" "}
                          {selectedItem.unit}
                        </td>
                        <td className="py-3 pl-4 text-slate-700 font-medium">
                          {log.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-8 text-center text-slate-400">
                  <p className="text-base">📭 Không có bản ghi nào gần đây</p>
                  <p className="text-xs mt-1">
                    Hệ thống chỉ lưu vết biến động phát sinh trong vòng 30 ngày.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
