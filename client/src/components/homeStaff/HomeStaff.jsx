import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAxiosJWT } from "../../callAPI/createInstance";
import { login } from "../../redux/userSlice";
import { logoutUser } from "../../callAPI/authAPI";

export default function HomeStaff() {
  const userLogin = useSelector((state) => state.user?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosJWT = createAxiosJWT(userLogin, dispatch, login);

  // 1. Quản lý State Nghiệp vụ
  const [currentCategory, setCurrentCategory] = useState("Burger");
  const [selectedTable, setSelectedTable] = useState(null);
  const [isTakeaway, setIsTakeaway] = useState(false);
  const [discountInput, setDiscountInput] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  useEffect(() => {
    if (!userLogin) {
      navigate("/login");
    } else if (userLogin.role !== "staff") {
      navigate("/manager");
    }
  }, [userLogin, navigate]);

  const handleLogout = () => {
    logoutUser(userLogin?.accessToken, dispatch, axiosJWT);
  };

  // [ĐỒNG BỘ] Giỏ hàng ban đầu dùng ID kiểu số (BIGINT) và cấu trúc chuẩn tương tự DB
  const [cart, setCart] = useState([]);

  // [ĐỒNG BỘ] Danh mục ánh xạ từ bảng categories
  const categories = ["Burger", "Gà rán", "Món phụ", "Đồ uống", "Tráng miệng"];

  const menuItems = {
    Burger: [
      {
        id: 1,
        name: "Burger Bò Phô Mai Double",
        price: 65000,
        image_url:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
        is_available: true,
      },
      {
        id: 2,
        name: "Burger Tôm Sốt Tartar",
        price: 55000,
        image_url:
          "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=500",
        is_available: true,
      },
      {
        id: 3,
        name: "Burger Gà Giòn Cay",
        price: 49000,
        image_url:
          "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500",
        is_available: true,
      },
    ],
    "Gà rán": [
      {
        id: 4,
        name: "Gà Rán Sốt Cay Thượng Hạng",
        price: 45000,
        image_url:
          "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500",
        is_available: true,
      },
      {
        id: 5,
        name: "Combo 2 Miếng Gà Giòn Truyền Thống",
        price: 79000,
        image_url:
          "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500",
        is_available: true,
      },
      {
        id: 6,
        name: "Gà Popcorn Lắc Phô Mai",
        price: 39000,
        image_url:
          "https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=500",
        is_available: true,
      },
    ],
    "Món phụ": [
      {
        id: 7,
        name: "Khoai Tây Chiên Lắc Phô Mai",
        price: 30000,
        image_url:
          "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500",
        is_available: true,
      },
      {
        id: 8,
        name: "Khoai Tây Múi Cau Chiên Giòn",
        price: 32000,
        image_url:
          "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500",
        is_available: true,
      },
      {
        id: 9,
        name: "Cá Viên Chiên Sốt Mắm Tỏi",
        price: 25000,
        image_url: "https://placehold.co/500x500?text=Ca+Vien+Chien",
        is_available: true,
      },
    ],
    "Đồ uống": [
      {
        id: 10,
        name: "Trà Sữa Trân Châu Size L",
        price: 35000,
        image_url:
          "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=500",
        is_available: false,
      },
      {
        id: 11,
        name: "Coca Cola Tươi Pepsi",
        price: 15000,
        image_url:
          "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500",
        is_available: true,
      },
      {
        id: 12,
        name: "Trà Đào Đốt Sả Hạt Chia",
        price: 29000,
        image_url:
          "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500",
        is_available: true,
      },
    ],
    "Tráng miệng": [
      {
        id: 13,
        name: "Kem Tươi Vani Sốt Dâu",
        price: 15000,
        image_url:
          "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500",
        is_available: true,
      },
      {
        id: 14,
        name: "Bánh Khoai Môn Chiên Phồng",
        price: 20000,
        image_url: "https://placehold.co/500x500?text=Banh+Khoai+Mon",
        is_available: true,
      },
    ],
  };

  // 3. Sơ đồ bàn (Đã đồng bộ dữ liệu mẫu khớp DB)
  const [tables] = useState([
    { id: 1, table_number: "Bàn 01", status: "occupied", total: 160000 },
    { id: 2, table_number: "Bàn 02", status: "available", total: 0 },
    { id: 3, table_number: "Bàn 03", status: "occupied", total: 74000 },
    { id: 4, table_number: "Bàn 04", status: "available", total: 0 },
  ]);

  // [ĐỒNG BỘ] Trạng thái bếp mô phỏng cấu trúc quan hệ thực tế gồm mảng chi tiết order_items thay vì viết chuỗi dính liền
  const [kitchenOrders, setKitchenOrders] = useState([
    {
      id: 1, // BIGINT
      table_number: "Bàn 01",
      items: [
        { name: "Burger Bò Phô Mai Double", quantity: 2 },
        { name: "Coca Cola Tươi Pepsi", quantity: 2 },
      ],
      time: "10 phút trước",
    },
    {
      id: 2,
      table_number: "Bàn 03",
      items: [
        { name: "Gà Rán Sốt Cay Thượng Hạng", quantity: 1 },
        { name: "Trà Đào Đốt Sả Hạt Chia", quantity: 1 },
      ],
      time: "5 phút trước",
    },
    {
      id: 3,
      table_number: "Mang về",
      items: [{ name: "Burger Gà Giòn Cay", quantity: 3 }],
      time: "Vừa xong",
    },
  ]);

  // Thêm món vào giỏ hàng (Đã sửa logic so sánh kiểu số của product.id)
  const handleAddToCart = (product) => {
    if (!product.is_available) return; // Chặn nếu món ăn hết hàng
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
  };

  const handleCompleteOrder = (id) => {
    setKitchenOrders(kitchenOrders.filter((order) => order.id !== id));
  };

  // Tính toán tài chính
  const subTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const taxAmount = subTotal * 0.08;
  const discountAmount = Number(discountInput) || 0;
  const totalAmount = Math.max(0, subTotal + taxAmount - discountAmount);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* CỘT 1: KHU VỰC BÁN HÀNG & TRẠNG THÁI BÀN */}
      <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
        <header className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Ca làm việc: Nhân viên quầy
            </span>
            <h1 className="text-xl font-black text-slate-900 mt-1">
              Màn hình Order & Bán hàng
            </h1>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right border-r border-slate-200 pr-4">
              <p className="text-sm font-bold text-slate-900">
                {userLogin?.full_name || "Nguyễn Văn A"}
              </p>
              <p className="text-xs text-slate-400">Thu ngân chính</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl transition-all border border-slate-200 hover:border-rose-200"
            >
              <span>Đăng xuất</span>
              <span>🚪</span>
            </button>
          </div>
        </header>

        {/* Sơ đồ bàn */}
        <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
            📍 Trạng thái bàn ăn trực quan
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {tables.map((table) => (
              <div
                key={table.id}
                onClick={() => {
                  setSelectedTable(table);
                  setIsTakeaway(false);
                }}
                className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all active:scale-95 ${
                  selectedTable?.id === table.id && !isTakeaway
                    ? "bg-amber-500/10 border-amber-500 text-amber-700 ring-2 ring-amber-500/20"
                    : table.status === "occupied"
                      ? "bg-amber-50/60 border-amber-200 text-amber-600"
                      : "bg-white border-slate-200 hover:border-slate-400 text-slate-700"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">
                    {table.table_number}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${table.status === "occupied" ? "bg-amber-500" : "bg-slate-300"}`}
                  ></span>
                </div>
                <div className="text-xs font-black mt-2 text-right">
                  {table.status === "occupied"
                    ? `${table.total.toLocaleString("vi-VN")} đ`
                    : "Trống"}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Danh mục món ăn & Thực đơn */}
        <section className="flex-1 flex flex-col min-h-0 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCurrentCategory(cat)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  currentCategory === cat
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Danh sách món */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-1 flex-1">
            {(menuItems[currentCategory] || []).map((item) => (
              <div
                key={item.id}
                onClick={() => item.is_available && handleAddToCart(item)}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 bg-white
    ${
      item.is_available
        ? "border-slate-100 shadow-sm hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl cursor-pointer"
        : "border-slate-200 bg-slate-50/50 cursor-not-allowed"
    }`}
              >
                {/* Nhãn trạng thái: Hết hàng hoặc Ưu đãi (nếu có) */}
                {!item.is_available ? (
                  <span className="absolute top-3 right-3 z-10 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Hết hàng
                  </span>
                ) : (
                  /* Bạn có thể thêm badge "Bán chạy" hoặc "New" ở đây để tăng tính sinh động */
                  item.is_popular && (
                    <span className="absolute top-3 right-3 z-10 bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wide shadow-sm animate-pulse">
                      Popular
                    </span>
                  )
                )}

                {/* KHU VỰC HÌNH ẢNH */}
                <div className="w-full h-44 bg-slate-100 overflow-hidden relative">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105
        ${!item.is_available ? "grayscale opacity-50" : ""}`}
                  />
                  {/* Lớp overlay mờ nhẹ khi hover giúp ảnh có chiều sâu hơn */}
                  {item.is_available && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </div>

                {/* KHU VỰC THÔNG TIN */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="font-semibold text-base text-slate-800 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2 min-h-[48px] leading-snug">
                      {item.name}
                    </h4>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-2 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span
                        className={`font-extrabold text-lg ${item.is_available ? "text-slate-900" : "text-slate-400 line-through text-sm"}`}
                      >
                        {item.price.toLocaleString("vi-VN")}{" "}
                        <span className="text-xs font-medium">đ</span>
                      </span>
                    </div>

                    {item.is_available && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn sự kiện click bị trùng với click của cả Card
                          handleAddToCart(item);
                        }}
                        className="bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white w-9 h-9 rounded-xl font-bold text-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CỘT 2: QUẢN LÝ HÀNG ĐỢI BẾP & THANH TOÁN */}
      <div className="w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-lg">
        {/* Hàng đợi nhà bếp */}
        <div className="p-4 border-b border-slate-200 flex-1 flex flex-col min-h-0 bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-3">
            ⏳ Đơn chờ chế biến (Bếp)
            <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {kitchenOrders.length}
            </span>
          </h3>

          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            {kitchenOrders.length === 0 ? (
              <div className="text-center text-slate-400 text-sm py-8 font-medium">
                Hàng đợi trống. Tất cả đã phục vụ!
              </div>
            ) : (
              kitchenOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col gap-1.5 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      ĐH #{order.id}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {order.time}
                    </span>
                  </div>
                  <div className="text-sm font-black text-slate-800">
                    {order.table_number}
                  </div>

                  {/* [ĐỒNG BỘ] Vòng lặp map xuất mảng danh sách món ăn từ API chuẩn cấu trúc */}
                  <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg space-y-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>• {it.name}</span>
                        <span className="font-bold text-slate-800">
                          x{it.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleCompleteOrder(order.id)}
                    className="w-full mt-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-lg transition-colors shadow-sm"
                  >
                    ✓ Đã xong (Giao đồ)
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Khung Hóa đơn & Thanh toán */}
        <div className="p-5 bg-white border-t border-slate-200 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            🧾 Hóa đơn xuất quầy
          </h3>

          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setIsTakeaway(false)}
              className={`py-1.5 rounded-lg transition-all ${!isTakeaway ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
            >
              Tại bàn:{" "}
              {selectedTable ? selectedTable.table_number : "Chưa chọn"}
            </button>
            <button
              onClick={() => {
                setIsTakeaway(true);
                setSelectedTable(null);
              }}
              className={`py-1.5 rounded-lg transition-all ${isTakeaway ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
            >
              Mang về (Takeaway)
            </button>
          </div>

          <div className="max-h-24 overflow-y-auto space-y-2 pr-1 text-xs text-slate-600 border-b border-slate-100 pb-2">
            {cart.map((c, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="font-medium text-slate-800">
                  {c.quantity}x {c.name}
                </span>
                <span className="font-bold text-slate-900">
                  {(c.price * c.quantity).toLocaleString("vi-VN")} đ
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>Tạm tính (Subtotal):</span>
              <span className="font-semibold text-slate-800">
                {subTotal.toLocaleString("vi-VN")} đ
              </span>
            </div>
            <div className="flex justify-between">
              <span>Thuế GTGT (Tax 8%):</span>
              <span className="font-semibold text-slate-800">
                {taxAmount.toLocaleString("vi-VN")} đ
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Giảm giá (đ):</span>
              <input
                type="number"
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
                className="w-24 text-right border border-slate-200 rounded px-1.5 py-0.5 text-xs focus:outline-none focus:border-amber-500 font-bold text-rose-600 bg-slate-50"
                placeholder="0"
              />
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-dashed border-slate-200">
              <span>Tổng cộng:</span>
              <span className="text-xl text-amber-600">
                {totalAmount.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setPaymentMethod("cash")}
              className={`text-xs font-bold py-2.5 rounded-xl transition-all border ${
                paymentMethod === "cash"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              💵 Tiền mặt
            </button>
            <button
              onClick={() => setPaymentMethod("bank_transfer")}
              className={`text-xs font-bold py-2.5 rounded-xl transition-all border ${
                paymentMethod === "bank_transfer"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              💳 Chuyển khoản
            </button>
          </div>

          <button className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm py-3 rounded-xl transition-colors shadow-md shadow-amber-500/10">
            XÁC NHẬN IN HÓA ĐƠN
          </button>
        </div>
      </div>
    </div>
  );
}
