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
  const [selectedTable, setSelectedTable] = useState(null); // Lưu thông tin bàn đang chọn (nếu ăn tại chỗ)
  const [isTakeaway, setIsTakeaway] = useState(false); // Flag phân loại đơn hàng (Tại bàn / Mang về)
  const [discountInput, setDiscountInput] = useState(0); // Tiền giảm giá nhập thủ công tại quầy
  const [paymentMethod, setPaymentMethod] = useState("cash"); // Phương thức thanh toán đang chọn

  useEffect(() => {
    if (!userLogin) navigate("/login");
  });

  // Hàm xử lý đăng xuất hệ thống
  const handleLogout = () => {
    logoutUser(userLogin?.accessToken, dispatch, axiosJWT);
  };

  // State Giỏ hàng thực tế tương tác được khi click chọn món
  const [cart, setCart] = useState([
    { id: "B1", name: "Burger Bò Phô Mai", price: 65000, quantity: 2 },
    { id: "D1", name: "Coca Cola Pepsi Size M", price: 20000, quantity: 2 },
  ]);

  // 2. Dữ liệu Danh mục & Món ăn (Ánh xạ chuẩn từ categories & products trong DB)
  const categories = ["Burger", "Gà rán", "Đồ uống"];

  const menuItems = {
    Burger: [
      {
        id: 1,
        name: "Burger Bò Phô Mai",
        price: 65000,
        image: "🍔",
        tag: "Bán chạy",
      },
      { id: 2, name: "Burger Gà Giòn Cay", price: 59000, image: "🍗🍔" },
      { id: 3, name: "Burger Tôm Hoàng Gia", price: 75000, image: "🍤🍔" },
    ],
    "Gà rán": [
      {
        id: 4,
        name: "Gà Rán Sốt Cay (1 Miếng)",
        price: 45000,
        image: "🍗",
        tag: "Hot",
      },
      { id: 5, name: "Gà Rán Truyền Thống", price: 42000, image: "🍖" },
    ],
    "Đồ uống": [
      { id: 6, name: "Coca Cola Pepsi Size M", price: 20000, image: "🥤" },
      { id: 7, name: "Trà Đào Đốt Sả", price: 35000, image: "🍹" },
    ],
  };

  // 3. Dữ liệu Sơ đồ bàn (Ánh xạ từ bảng dining_tables)
  const [tables] = useState([
    { id: 1, table_number: "Bàn 01", status: "occupied", total: 170000 },
    { id: 2, table_number: "Bàn 02", status: "available", total: 0 },
    { id: 3, table_number: "Bàn 03", status: "occupied", total: 85000 },
    { id: 4, table_number: "Bàn 04", status: "available", total: 0 },
    { id: 5, table_number: "Bàn 05", status: "available", total: 0 },
  ]);

  // 4. Hàng đợi nhà bếp (Ánh xạ từ trạng thái order_status = 'pending'/'processing')
  const [kitchenOrders, setKitchenOrders] = useState([
    {
      id: "ĐH-8812",
      table_number: "Bàn 01",
      items: "2x Burger Bò, 2x Coca",
      time: "10 phút trước",
    },
    {
      id: "ĐH-8813",
      table_number: "Bàn 03",
      items: "1x Gà Rán Sốt Cay, 1x Trà Đào",
      time: "5 phút trước",
    },
    {
      id: "ĐH-8814",
      table_number: "Mang về",
      items: "3x Burger Gà Giòn Cay",
      time: "Vừa xong",
    },
  ]);

  // Thêm món vào giỏ hàng
  const handleAddToCart = (product) => {
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

  // Giải phóng hàng đợi nhà bếp khi bấm hoàn thành
  const handleCompleteOrder = (id) => {
    setKitchenOrders(kitchenOrders.filter((order) => order.id !== id));
  };

  // 5. Thuật toán tính toán tài chính hóa đơn (Khớp hoàn toàn các cột cấu trúc bảng orders)
  const subTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const taxAmount = subTotal * 0.08; // Thuế GTGT 8%
  const discountAmount = Number(discountInput) || 0;
  const totalAmount = Math.max(0, subTotal + taxAmount - discountAmount);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* CỘT 1: KHU VỰC BÁN HÀNG & TRẠNG THÁI BÀN (Chiếm 2/3 màn hình) */}
      <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
        {/* Header Nhân viên sáng sủa */}
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
            {/* Nút Đăng xuất thiết kế mới theo yêu cầu */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl transition-all border border-slate-200 hover:border-rose-200"
            >
              <span>Đăng xuất</span>
              <span>🚪</span>
            </button>
          </div>
        </header>

        {/* 1.1 Sơ đồ bàn trực quan */}
        <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
            📍 Trạng thái bàn ăn trực quan
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
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

        {/* 1.2 Danh mục món ăn & Thực đơn */}
        <section className="flex-1 flex flex-col min-h-0 space-y-4">
          {/* Thanh chuyển danh mục */}
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

          {/* Lưới hiển thị danh sách món ăn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-1 flex-1">
            {(menuItems[currentCategory] || []).map((item) => (
              <div
                key={item.id}
                onClick={() => handleAddToCart(item)}
                className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col justify-between hover:border-amber-500 hover:shadow-md transition-all cursor-pointer relative group"
              >
                {item.tag && (
                  <span className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide">
                    {item.tag}
                  </span>
                )}
                <div className="text-4xl my-2 bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform border border-slate-100">
                  {item.image}
                </div>
                <div className="mt-2">
                  <h4 className="font-bold text-sm text-slate-800 group-hover:text-amber-600 transition-colors">
                    {item.name}
                  </h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-black text-slate-900 text-base">
                      {item.price.toLocaleString("vi-VN")} đ
                    </span>
                    <button className="bg-slate-100 text-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 w-8 h-8 rounded-lg font-bold text-lg flex items-center justify-center transition-colors">
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CỘT 2: QUẢN LÝ ĐƠN HÀNG CHỜ CHẾ BIẾN & THANH TOÁN (Nền trắng chia khối) */}
      <div className="w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-lg">
        {/* Phần 2.1: Hàng đợi bếp - Đơn hàng đang chờ xử lý */}
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
                      {order.id}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {order.time}
                    </span>
                  </div>
                  <div className="text-sm font-black text-slate-800">
                    {order.table_number}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-2 bg-slate-50 p-2 rounded-lg">
                    {order.items}
                  </div>
                  <button
                    onClick={() => handleCompleteOrder(order.id)}
                    className="w-full mt-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-lg transition-colors shadow-sm shadow-emerald-600/10"
                  >
                    ✓ Đã xong (Giao đồ cho khách)
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Phần 2.2: Khung Tính tiền Thanh toán tại quầy */}
        <div className="p-5 bg-white border-t border-slate-200 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            🧾 Hóa đơn xuất quầy
          </h3>

          {/* Chọn Loại hình phục vụ để map dining_table_id */}
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

          {/* Danh sách vật phẩm trong hóa đơn hiện hành */}
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

          {/* Khu vực tính toán số liệu tài chính tài chính */}
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
            {/* Input giảm giá cấu trúc khớp trường discount_amount */}
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

          {/* Phương thức thanh toán (Khớp ENUM payment_method) */}
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

          {/* Chốt đơn và Đẩy hóa đơn in */}
          <button className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm py-3 rounded-xl transition-colors shadow-md shadow-amber-500/10">
            XÁC NHẬN IN HÓA ĐƠN
          </button>
        </div>
      </div>
    </div>
  );
}
