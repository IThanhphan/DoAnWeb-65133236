import { useState } from "react";

export default function MenuManager() {
  // Danh sách danh mục món ăn để lọc và chọn trong form
  const categories = [
    "Tất cả",
    "Burger",
    "Gà rán",
    "Món phụ",
    "Đồ uống",
    "Tráng miệng",
  ];

  // Danh sách các emoji gợi ý cho món ăn trực quan
  const emojiSuggestions = [
    "🍔",
    "🍗",
    "🍟",
    "🥤",
    "📦",
    "🍦",
    "🍕",
    "🍰",
    "🧋",
    "🍩",
  ];

  // Giả lập dữ liệu danh sách món ăn
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Burger Bò Phô Mai Double",
      category: "Burger",
      price: 65000,
      isAvailable: true,
      image: "🍔",
      code: "BG-01",
    },
    {
      id: 2,
      name: "Gà Rán Sốt Cay Thượng Hạng",
      category: "Gà rán",
      price: 45000,
      isAvailable: true,
      image: "🍗",
      code: "GR-02",
    },
    {
      id: 3,
      name: "Khoai Tây Chiên Lắc Phô Mai",
      category: "Món phụ",
      price: 30000,
      isAvailable: true,
      image: "🍟",
      code: "MP-01",
    },
    {
      id: 4,
      name: "Trà Sữa Trân Châu Size L",
      category: "Đồ uống",
      price: 35000,
      isAvailable: false,
      image: "🥤",
      code: "DU-05",
    },
    {
      id: 5,
      name: "Combo Gia Đình Tiết Kiệm",
      category: "Burger",
      price: 189000,
      isAvailable: true,
      image: "📦",
      code: "CB-01",
    },
    {
      id: 6,
      name: "Kem Tươi Vani Sốt Dâu",
      category: "Tráng miệng",
      price: 15000,
      isAvailable: true,
      image: "🍦",
      code: "TM-02",
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  // --- STATE QUẢN LÝ MODAL FORM ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" hoặc "edit"
  const [editingItemId, setEditingItemId] = useState(null);

  // State lưu trữ dữ liệu tạm thời trên Form
  const [formValues, setFormValues] = useState({
    code: "",
    name: "",
    category: "Burger",
    price: "",
    image: "🍔",
    isAvailable: true,
  });

  // --- LOGIC XỬ LÝ DỮ LIỆU ---
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "Tất cả" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAvailability = (id) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item,
      ),
    );
  };

  const handleDeleteItem = (id) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa món ăn này khỏi thực đơn không?",
      )
    ) {
      setMenuItems(menuItems.filter((item) => item.id !== id));
    }
  };

  // Mở modal để THÊM MỚI
  const handleOpenAddModal = () => {
    setModalMode("add");
    setEditingItemId(null);
    setFormValues({
      code: "",
      name: "",
      category: "Burger",
      price: "",
      image: "🍔",
      isAvailable: true,
    });
    setIsModalOpen(true);
  };

  // Mở modal để CHỈNH SỬA (Đổ dữ liệu cũ vào form)
  const handleOpenEditModal = (item) => {
    setModalMode("edit");
    setEditingItemId(item.id);
    setFormValues({
      code: item.code,
      name: item.name,
      category: item.category,
      price: item.price,
      image: item.image,
      isAvailable: item.isAvailable,
    });
    setIsModalOpen(true);
  };

  // Xử lý submit lưu dữ liệu (Cả Add và Edit)
  const handleSaveItem = (e) => {
    e.preventDefault();

    // Validate cơ bản
    if (!formValues.code || !formValues.name || !formValues.price) {
      alert("Vui lòng điền đầy đủ các trường thông tin bắt buộc!");
      return;
    }

    if (modalMode === "add") {
      // Tạo bản ghi mới
      const newItem = {
        id: Date.now(), // Tạo ID ngẫu nhiên bằng timestamp
        code: formValues.code,
        name: formValues.name,
        category: formValues.category,
        price: Number(formValues.price),
        image: formValues.image,
        isAvailable: formValues.isAvailable,
      };
      setMenuItems([newItem, ...menuItems]);
    } else {
      // Cập nhật bản ghi cũ
      setMenuItems(
        menuItems.map((item) =>
          item.id === editingItemId
            ? {
                ...item,
                code: formValues.code,
                name: formValues.name,
                category: formValues.category,
                price: Number(formValues.price),
                image: formValues.image,
                isAvailable: formValues.isAvailable,
              }
            : item,
        ),
      );
    }

    setIsModalOpen(false); // Đóng modal sau khi hoàn tất
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl w-full mx-auto relative">
      {/* Tiêu đề & Nút Thêm Món */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản Lý Thực Đơn
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Cập nhật giá bán, danh mục và trạng thái món ăn trên toàn hệ thống.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all shadow-md shadow-amber-500/10 active:scale-95"
        >
          <span>➕</span> Thêm món mới
        </button>
      </div>

      {/* Thanh công cụ: Tìm kiếm & Lọc danh mục */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-4">
        <div className="relative max-w-md w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên món hoặc mã món (vd: BG-01)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 text-sm transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid danh sách món ăn */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                item.isAvailable
                  ? "border-slate-100 shadow-sm hover:shadow-md"
                  : "border-slate-200 opacity-75 bg-slate-50/50"
              }`}
            >
              <div className="p-5 flex gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                  {item.image}
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">
                      {item.code}
                    </span>
                    <span className="text-xs text-amber-600 font-medium">
                      {item.category}
                    </span>
                  </div>
                  <h3
                    className="font-bold text-slate-800 text-base truncate"
                    title={item.name}
                  >
                    {item.name}
                  </h3>
                  <p className="text-lg font-black text-slate-900">
                    {item.price.toLocaleString("vi-VN")} đ
                  </p>
                </div>
              </div>

              <div className="px-5 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={item.isAvailable}
                      onChange={() => toggleAvailability(item.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                  <span
                    className={`text-xs font-bold ${item.isAvailable ? "text-emerald-600" : "text-slate-400"}`}
                  >
                    {item.isAvailable ? "Đang bán" : "Hết hàng"}
                  </span>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Chỉnh sửa món"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Xóa món"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <span className="text-4xl block mb-3">🍽️</span>
          <h3 className="text-base font-bold text-slate-700">
            Không tìm thấy món ăn phù hợp
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Vui lòng thử lại với từ khóa hoặc danh mục khác.
          </p>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL COMPONENT (Dùng chung cho cả Thêm và Chỉnh sửa) */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Lớp nền mờ phía sau (Backdrop click để đóng) */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Hộp thoại chính */}
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 z-10 overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
            {/* Header của Modal */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {modalMode === "add"
                    ? "✨ Thêm Món Ăn Mới"
                    : "✏️ Chỉnh Sửa Món Ăn"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {modalMode === "add"
                    ? "Nhập thông tin chi tiết để thêm hàng vào thực đơn."
                    : `Cập nhật lại thông tin cho món (Mã hệ thống: ${formValues.code})`}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors font-bold"
              >
                ✕
              </button>
            </div>

            {/* Nội dung Form (Hỗ trợ scroll nếu màn hình dọc nhỏ) */}
            <form
              onSubmit={handleSaveItem}
              className="p-6 space-y-4 overflow-y-auto flex-1"
            >
              {/* Row 1: Mã món và Danh mục */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mã món món <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: BG-03"
                    value={formValues.code}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phân nhóm danh mục
                  </label>
                  <select
                    value={formValues.category}
                    onChange={(e) =>
                      setFormValues({ ...formValues, category: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 text-slate-800 bg-white font-medium cursor-pointer"
                  >
                    {categories
                      .filter((c) => c !== "Tất cả")
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Tên món ăn */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tên món ăn <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Burger Tôm Khoai Tây Nghiền"
                  value={formValues.name}
                  onChange={(e) =>
                    setFormValues({ ...formValues, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 text-slate-800 font-medium"
                />
              </div>

              {/* Row 3: Giá bán sản phẩm */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Giá bán lẻ công khai (đ){" "}
                  <span className="text-rose-500">*</span>
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

              {/* Row 4: Chọn Biểu tượng đại diện (Emoji) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Biểu tượng hiển thị đại diện:{" "}
                  <span className="text-xl ml-1">{formValues.image}</span>
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  {emojiSuggestions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() =>
                        setFormValues({ ...formValues, image: emoji })
                      }
                      className={`w-9 h-9 text-xl rounded-lg flex items-center justify-center transition-transform active:scale-90 ${
                        formValues.image === emoji
                          ? "bg-amber-100 border-2 border-amber-500"
                          : "bg-white border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 5: Switch trạng thái bán hàng ban đầu */}
              <div className="flex items-center justify-between p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Cấu hình trạng thái mở bán
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cho phép nhà bếp nhận lệnh và hiển thị lên máy POS lập đơn
                    ngay lập tức.
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

              {/* Nút bấm ở chân Form */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-bold transition-all shadow-md shadow-amber-500/10 active:scale-95"
                >
                  {modalMode === "add"
                    ? "Thêm vào thực đơn"
                    : "Cập nhật thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
