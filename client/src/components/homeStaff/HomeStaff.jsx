import { useState } from "react";

export default function HomeStaff() {
  // State quản lý danh mục món ăn đang chọn
  const [currentCategory, setCurrentCategory] = useState("Burger");

  // State giả lập giỏ hàng hiện tại khi click chọn món tại bàn
  const [cart] = useState([
    { name: "Burger Bò Phô Mai", price: 65000, quantity: 2 },
    { name: "Coca Cola Pepsi Size M", price: 20000, quantity: 2 },
  ]);

  // 1. Dữ liệu danh mục & món ăn sinh động (Ứng với nghiệp vụ Bán hàng)
  const categories = ["Burger", "Gà rán", "Đồ uống", "Món phụ"];

  const menuItems = {
    Burger: [
      {
        id: "B1",
        name: "Burger Bò Phô Mai",
        price: 65000,
        image: "🍔",
        tag: "Bán chạy",
      },
      { id: "B2", name: "Burger Gà Giòn Cay", price: 59000, image: "🍗🍔" },
      { id: "B3", name: "Burger Tôm Hoàng Gia", price: 75000, image: "🍤🍔" },
    ],
    "Gà rán": [
      {
        id: "G1",
        name: "Gà Rán Sốt Cay (1 Miếng)",
        price: 45000,
        image: "🍗",
        tag: "Hot",
      },
      { id: "G2", name: "Gà Rán Truyền Thống", price: 42000, image: "🍖" },
    ],
    "Đồ uống": [
      { id: "D1", name: "Coca Cola Pepsi Size M", price: 20000, image: "🥤" },
      { id: "D2", name: "Trà Đào Đốt Sả", price: 35000, image: "🍹" },
    ],
  };

  // 2. Dữ liệu Trạng thái bàn trực quan
  const tables = [
    { id: 1, name: "Bàn 01", status: "occupied", total: "170,000 đ" },
    { id: 2, name: "Bàn 02", status: "empty", total: "Trống" },
    { id: 3, name: "Bàn 03", status: "occupied", total: "85,000 đ" },
    { id: 4, name: "Bàn 04", status: "empty", total: "Trống" },
    { id: 5, name: "Bàn 05", status: "empty", total: "Trống" },
  ];

  // 3. Dữ liệu Đơn hàng chờ chế biến (Hàng đợi nhà bếp)
  const [kitchenOrders, setKitchenOrders] = useState([
    {
      id: "ĐH-8812",
      table: "Bàn 01",
      items: "2x Burger Bò, 2x Coca",
      time: "10 phút trước",
    },
    {
      id: "ĐH-8813",
      table: "Bàn 03",
      items: "1x Gà Rán Sốt Cay, 1x Trà Đào",
      time: "5 phút trước",
    },
    {
      id: "ĐH-8814",
      table: "Mang về",
      items: "3x Burger Gà Giòn Cay",
      time: "Vừa xong",
    },
  ]);

  // Hàm xử lý khi bấm nút "Đã hoàn thành" để giải phóng hàng đợi
  const handleCompleteOrder = (id) => {
    setKitchenOrders(kitchenOrders.filter((order) => order.id !== id));
  };

  // Tính toán tiền hóa đơn tạm tính
  const subTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subTotal * 0.08; // Thuế 8%
  const finalTotal = subTotal + tax;

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
      {/* CỘT 1: KHU VỰC BÁN HÀNG & TRẠNG THÁI BÀN (Chiếm 2/3 màn hình) */}
      <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
        {/* Header Nhân viên */}
        <header className="flex justify-between items-center bg-slate-800 p-4 rounded-2xl border border-slate-700/50 shadow-md">
          <div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              Ca làm việc: Nhân viên
            </span>
            <h1 className="text-xl font-bold mt-1">Màn hình order & Gọi món</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold">Nguyễn Văn A</p>
              <p className="text-xs text-slate-400">Quầy thu ngân chính</p>
            </div>
            <button className="bg-slate-700 hover:bg-rose-600 text-white p-2.5 rounded-xl transition-colors">
              🚪
            </button>
          </div>
        </header>

        {/* 1.1 Theo dõi trực quan trạng thái các bàn */}
        <section className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/40">
          <h2 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">
            📍 Sơ đồ bàn trực quan
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {tables.map((table) => (
              <div
                key={table.id}
                className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all active:scale-95 ${
                  table.status === "occupied"
                    ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                    : "bg-slate-800 border-slate-700 hover:border-slate-500 text-slate-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">{table.name}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${table.status === "occupied" ? "bg-amber-400" : "bg-slate-500"}`}
                  ></span>
                </div>
                <div className="text-xs font-semibold mt-2 text-right">
                  {table.total}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 1.2 Danh mục món ăn & Menu hình ảnh sinh động */}
        <section className="flex-1 flex flex-col min-h-0">
          {/* Thanh chuyển danh mục */}
          <div className="flex gap-2 overflow-x-auto pb-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCurrentCategory(cat)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  currentCategory === cat
                    ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Lưới hiển thị danh sách món ăn kèm hình ảnh icon sinh động */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-1 flex-1">
            {(menuItems[currentCategory] || []).map((item) => (
              <div
                key={item.id}
                className="bg-slate-800 border border-slate-700/60 p-4 rounded-2xl flex flex-col justify-between hover:border-amber-500/50 transition-all cursor-pointer relative group"
              >
                {item.tag && (
                  <span className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wide">
                    {item.tag}
                  </span>
                )}
                <div className="text-4xl my-2 bg-slate-900/50 w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  {item.image}
                </div>
                <div className="mt-2">
                  <h4 className="font-bold text-sm text-slate-200">
                    {item.name}
                  </h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-black text-amber-400 text-base">
                      {item.price.toLocaleString("vi-VN")} đ
                    </span>
                    <button className="bg-slate-700 hover:bg-amber-500 hover:text-slate-950 w-8 h-8 rounded-lg font-bold text-lg flex items-center justify-center transition-colors">
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CỘT 2: QUẢN LÝ ĐƠN HÀNG CHỜ CHẾ BIẾN & THANH TOÁN (Chiếm 1/3 màn hình) */}
      <div className="w-96 bg-slate-800 border-l border-slate-700/80 flex flex-col h-full shadow-2xl">
        {/* Phần 2.1: Hàng đợi bếp - Đơn hàng đang chờ xử lý */}
        <div className="p-4 border-b border-slate-700/80 flex-1 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              ⏳ Đơn hàng chờ chế biến
              <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
                {kitchenOrders.length}
              </span>
            </h3>
          </div>

          {/* Danh sách các đơn đợi nhà bếp */}
          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            {kitchenOrders.length === 0 ? (
              <div className="text-center text-slate-500 text-sm py-8">
                Hàng đợi trống. Tất cả đã giao!
              </div>
            ) : (
              kitchenOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-3 bg-slate-900 rounded-xl border border-slate-700/50 flex flex-col gap-1.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {order.id}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {order.time}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-200">
                    {order.table}
                  </div>
                  <div className="text-xs text-slate-400 line-clamp-2">
                    {order.items}
                  </div>
                  <button
                    onClick={() => handleCompleteOrder(order.id)}
                    className="w-full mt-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-1.5 rounded-lg transition-colors"
                  >
                    ✓ Đã hoàn thành (Giao đồ)
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Phần 2.2: Khung Hóa đơn & Tính tiền Thanh toán tại quầy */}
        <div className="p-5 bg-slate-900 border-t border-slate-700/60 space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            🧾 Tính toán thanh toán
          </h3>

          {/* List sản phẩm được gọi trong hóa đơn hiện tại */}
          <div className="max-h-28 overflow-y-auto space-y-2 pr-1 text-xs text-slate-300">
            {cart.map((c, i) => (
              <div key={i} className="flex justify-between">
                <span>
                  {c.quantity}x {c.name}
                </span>
                <span className="font-semibold">
                  {(c.price * c.quantity).toLocaleString("vi-VN")} đ
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-slate-700 pt-3 space-y-1.5 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{subTotal.toLocaleString("vi-VN")} đ</span>
            </div>
            <div className="flex justify-between">
              <span>Thuế GTGT (8%):</span>
              <span>{tax.toLocaleString("vi-VN")} đ</span>
            </div>
            <div className="flex justify-between text-base font-black text-white pt-1">
              <span>Tổng cộng:</span>
              <span className="text-amber-400">
                {finalTotal.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>

          {/* Chọn phương thức thanh toán */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold py-2.5 rounded-xl transition-all">
              💵 Tiền mặt
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold py-2.5 rounded-xl transition-all">
              💳 Chuyển khoản
            </button>
          </div>

          {/* Nút thanh toán chốt đơn */}
          <button className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm py-3 rounded-xl transition-colors shadow-lg shadow-amber-500/10">
            XÁC NHẬN IN HÓA ĐƠN
          </button>
        </div>
      </div>
    </div>
  );
}
