import { useState, useRef } from "react";

export default function MenuManager() {
  // Danh sách danh mục món ăn đồng bộ chuẩn theo MySQL (chứa ID để ánh xạ dữ liệu)
  const categoriesData = [
    { id: 1, name: "Burger" },
    { id: 2, name: "Gà rán" },
    { id: 3, name: "Món phụ" },
    { id: 4, name: "Đồ uống" },
    { id: 5, name: "Tráng miệng" },
  ];

  // Giả lập dữ liệu danh sách sản phẩm đồng bộ chính xác với bảng `products` của MySQL
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      categoryId: 1,
      name: "Burger Bò Phô Mai Double",
      price: 65000,
      isAvailable: true,
      imageUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: 2,
      categoryId: 2,
      name: "Gà Rán Sốt Cay Thượng Hạng",
      price: 45000,
      isAvailable: true,
      imageUrl:
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: 3,
      categoryId: 3,
      name: "Khoai Tây Chiên Lắc Phô Mai",
      price: 30000,
      isAvailable: true,
      imageUrl:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: 4,
      categoryId: 4,
      name: "Trà Sữa Trân Châu Size L",
      price: 35000,
      isAvailable: false,
      imageUrl:
        "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=500&auto=format&fit=crop&q=60",
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  // --- STATE QUẢN LÝ MODAL FORM ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" hoặc "edit"
  const [editingItemId, setEditingItemId] = useState(null);

  // File Input Ref để kích hoạt sự kiện click chọn file ẩn
  const fileInputRef = useRef(null);

  // State lưu trữ dữ liệu tạm thời trên Form khớp chuẩn Model DB
  const [formValues, setFormValues] = useState({
    categoryId: 1,
    name: "",
    price: "",
    imageUrl: "",
    isAvailable: true,
  });

  // --- LOGIC XỬ LÝ DỮ LIỆU ---
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "Tất cả" ||
      item.categoryId === Number(selectedCategory);
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
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
      categoryId: categoriesData[0].id,
      name: "",
      price: "",
      imageUrl: "",
      isAvailable: true,
    });
    setIsModalOpen(true);
  };

  // Mở modal để CHỈNH SỬA
  const handleOpenEditModal = (item) => {
    setModalMode("edit");
    setEditingItemId(item.id);
    setFormValues({
      categoryId: item.categoryId,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable,
    });
    setIsModalOpen(true);
  };

  // Xử lý đọc file ảnh cục bộ khi người dùng đăng tải lên
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Giả lập lưu trữ tạm thời bằng Blob URL hiển thị cục bộ trên UI
      // Sau này tích hợp API backend bạn sẽ upload file này lên Server/Cloudinary để lấy Link URL chuẩn
      const localImageUrl = URL.createObjectURL(file);
      setFormValues({ ...formValues, imageUrl: localImageUrl });
    }
  };

  // Xử lý submit lưu dữ liệu (Cả Add và Edit)
  const handleSaveItem = (e) => {
    e.preventDefault();

    if (!formValues.name || !formValues.price) {
      alert("Vui lòng điền đầy đủ các trường thông tin bắt buộc!");
      return;
    }

    if (modalMode === "add") {
      const newItem = {
        id: Date.now(), // DB tự tăng, ở client tạo tạm bằng timestamp
        categoryId: Number(formValues.categoryId),
        name: formValues.name,
        price: Number(formValues.price),
        imageUrl:
          formValues.imageUrl || "https://placehold.co/500x500?text=No+Image",
        isAvailable: formValues.isAvailable,
      };
      setMenuItems([newItem, ...menuItems]);
    } else {
      setMenuItems(
        menuItems.map((item) =>
          item.id === editingItemId
            ? {
                ...item,
                categoryId: Number(formValues.categoryId),
                name: formValues.name,
                price: Number(formValues.price),
                imageUrl: formValues.imageUrl,
                isAvailable: formValues.isAvailable,
              }
            : item,
        ),
      );
    }

    setIsModalOpen(false);
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
            Cập nhật danh sách món ăn, giá bán và danh mục đồng bộ với hệ thống.
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
            placeholder="Tìm theo tên món ăn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 text-sm transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setSelectedCategory("Tất cả")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              selectedCategory === "Tất cả"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-50 text-slate-600 hover:bg-slate-200"
            }`}
          >
            TẤT CẢ
          </button>
          {categoriesData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id.toString())}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                selectedCategory === cat.id.toString()
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid danh sách món ăn */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const categoryObj = categoriesData.find(
              (c) => c.id === item.categoryId,
            );
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                  item.isAvailable
                    ? "border-slate-100 shadow-sm hover:shadow-md"
                    : "border-slate-200 opacity-75 bg-slate-50/50"
                }`}
              >
                <div className="p-5 flex gap-4">
                  {/* Thay đổi từ Emoji sang hiển thị ảnh thật từ imageUrl */}
                  <img
                    src={
                      item.imageUrl ||
                      "https://placehold.co/150x150?text=No+Image"
                    }
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0 shadow-inner border border-slate-100"
                  />

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">
                        {categoryObj ? categoryObj.name : "Nút Khác"}
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
            );
          })}
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
      {/* MODAL COMPONENT */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 z-10 overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {modalMode === "add"
                    ? "✨ Thêm Món Ăn Mới"
                    : "✏️ Chỉnh Sửa Món Ăn"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Điền các thông số để đồng bộ trực tiếp vào cơ sở dữ liệu
                  `products`.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSaveItem}
              className="p-6 space-y-4 overflow-y-auto flex-1"
            >
              {/* Vùng tải ảnh lên (Thay thế hoàn toàn cho khu vực Mã Món & Emoji cũ) */}
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
                      Hỗ trợ định dạng JPG, PNG, WEBP. Ảnh nên là tỷ lệ vuông
                      (1:1).
                    </p>
                  </div>
                </div>
              </div>

              {/* Tên món ăn & Chọn danh mục liên kết khóa ngoại (categoryId) */}
              <div className="grid grid-cols-1 gap-4">
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
                    {categoriesData.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

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
              </div>

              {/* Giá bán sản phẩm */}
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

              {/* Trạng thái mở bán (`is_available`) */}
              <div className="flex items-center justify-between p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Cấu hình trạng thái (`is_available`)
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

              {/* Chân Form */}
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
                  {modalMode === "add" ? "Lưu vào MySQL" : "Cập nhật thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
