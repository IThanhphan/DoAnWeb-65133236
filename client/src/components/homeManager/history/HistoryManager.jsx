import { useState } from "react";

export default function HistoryManager() {
  // Bộ lọc thời gian nhanh
  const timeFilters = [
    { id: "today", label: "Hôm nay" },
    { id: "yesterday", label: "Hôm qua" },
    { id: "7days", label: "7 ngày qua" },
    { id: "all", label: "Tất cả thời gian" },
  ];

  // Dữ liệu mẫu đồng bộ theo Database (Đã lược bỏ order_status)
  const [transactions] = useState([
    {
      id: 24, // BIGINT PRIMARY KEY
      user_id: 2,
      staff: "Trần Thị Linh", // Join từ bảng users (full_name)
      dining_table_id: 3, // Khách ngồi tại bàn
      table_number: "Bàn 03", // Join từ bảng dining_tables
      payment_status: "paid", // ENUM('unpaid', 'paid')
      payment_method: "bank_transfer", // ENUM('cash', 'bank_transfer')
      subtotal: 150000.0,
      tax_amount: 15000.0,
      discount_amount: 0.0,
      total_amount: 165000.0,
      created_at: "2026-05-24T20:15:00Z", // TIMESTAMP
      items: [
        {
          product_name: "Burger Bò Phô Mai Double",
          quantity: 2,
          price: 65000.0,
          note: "Ít tương cà",
        },
        {
          product_name: "Coca Cola Tươi",
          quantity: 1,
          price: 15000.0,
          note: "",
        },
      ],
    },
    {
      id: 23,
      user_id: 3,
      staff: "Nguyễn Văn Hùng",
      dining_table_id: null, // Khách mua mang về (Takeaway)
      table_number: "Mang về",
      payment_status: "paid",
      payment_method: "cash",
      subtotal: 195000.0,
      tax_amount: 0.0,
      discount_amount: 0.0,
      total_amount: 195000.0,
      created_at: "2026-05-24T19:42:00Z",
      items: [
        {
          product_name: "Gà Rán Sốt Cay Thượng Hạng",
          quantity: 3,
          price: 45000.0,
          note: "",
        },
        {
          product_name: "Khoai Tây Chiên Lắc Phô Mai",
          quantity: 2,
          price: 30000.0,
          note: "",
        },
      ],
    },
    {
      id: 21,
      user_id: 4,
      staff: "Lê Hoàng Nam",
      dining_table_id: 1,
      table_number: "Bàn 01",
      payment_status: "paid",
      payment_method: "cash",
      subtotal: 80000.0,
      tax_amount: 0.0,
      discount_amount: 0.0,
      total_amount: 80000.0,
      created_at: "2026-05-24T17:15:00Z",
      items: [
        {
          product_name: "Burger Gà Giòn Cay",
          quantity: 1,
          price: 49000.0,
          note: "Không lấy hành",
        },
      ],
    },
  ]);

  const [activeTimeFilter, setActiveTimeFilter] = useState("today");
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [selectedTx, setSelectedTx] = useState(null);

  // --- LOGIC TÍNH TOÁN THỐNG KÊ ---
  const totalRevenue = transactions.reduce(
    (sum, t) => sum + Number(t.total_amount),
    0,
  );
  const totalOrders = transactions.length;

  // Định dạng hiển thị chuỗi danh sách món nhanh trong Table
  const renderItemsSummary = (items) => {
    return items.map((i) => `${i.product_name} x${i.quantity}`).join(", ");
  };

  // Định dạng hiển thị ngày giờ từ chuỗi ISO TIMESTAMP
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${hours}:${minutes} - ${day}/${month}`;
  };

  // Logic bộ lọc nâng cao thời gian thực
  const filteredTransactions = transactions.filter((t) => {
    const itemsText = renderItemsSummary(t.items);
    const matchesSearch =
      `HD-${t.id}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itemsText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.staff.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMethod =
      methodFilter === "all" || t.payment_method === methodFilter;

    const matchesTime =
      activeTimeFilter === "all" ||
      (activeTimeFilter === "today" && t.created_at.includes("2026-05-24")) ||
      (activeTimeFilter === "yesterday" &&
        t.created_at.includes("2026-05-23")) ||
      activeTimeFilter === "7days";

    return matchesSearch && matchesMethod && matchesTime;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl w-full mx-auto relative">
      {/* Khối Tiêu đề */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">Lịch Sử Hóa Đơn</h1>
        <p className="text-sm text-slate-500 mt-1">
          Hệ thống tra cứu danh sách và chi tiết hóa đơn bán hàng thời gian
          thực.
        </p>
      </div>

      {/* Grid thống kê nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tổng doanh thu thu về
            </p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              {totalRevenue.toLocaleString("vi-VN")} đ
            </h3>
          </div>
          <span className="text-2xl bg-emerald-50 text-emerald-600 p-3 rounded-xl">
            💰
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tổng số lượng hóa đơn
            </p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">
              {totalOrders} hóa đơn
            </h3>
          </div>
          <span className="text-2xl bg-slate-100 p-3 rounded-xl">🧾</span>
        </div>
      </div>

      {/* Thanh bộ lọc dữ liệu đa năng */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Tìm theo HD-ID, tên món ăn, nhân viên lập đơn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm transition-colors"
            />
          </div>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm bg-white text-slate-700 font-medium cursor-pointer"
          >
            <option value="all">Tất cả phương thức</option>
            <option value="cash">💵 Tiền mặt (Cash)</option>
            <option value="bank_transfer">💳 Chuyển khoản (Bank)</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
          {timeFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveTimeFilter(filter.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTimeFilter === filter.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bảng Danh sách hóa đơn phẳng */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-100">
                <th className="py-4 px-6">Mã Hóa Đơn</th>
                <th className="py-4 px-6">Thời Gian</th>
                <th className="py-4 px-6">Vị Trí</th>
                <th className="py-4 px-6">Chi Tiết Món Mua</th>
                <th className="py-4 px-6 text-right">Tổng Tiền</th>
                <th className="py-4 px-6 text-center">Hình Thức Thanh Toán</th>
                <th className="py-4 px-6 text-center">Nhân Viên Lập Đơn</th>
                <th className="py-4 px-6 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-slate-900 text-xs tracking-wider">
                      HD-{tx.id}
                    </td>
                    <td className="py-4 px-6 text-xs font-medium text-slate-500 whitespace-nowrap">
                      ⏱️ {formatDateTime(tx.created_at)}
                    </td>
                    <td className="py-4 px-6 text-xs font-semibold whitespace-nowrap">
                      {tx.dining_table_id ? (
                        <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          {tx.table_number}
                        </span>
                      ) : (
                        <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          Mang về
                        </span>
                      )}
                    </td>
                    <td
                      className="py-4 px-6 font-medium text-slate-700 max-w-xs truncate"
                      title={renderItemsSummary(tx.items)}
                    >
                      {renderItemsSummary(tx.items)}
                    </td>
                    <td className="py-4 px-6 text-right font-black text-slate-900 whitespace-nowrap">
                      {tx.total_amount.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="py-4 px-6 text-center text-xs font-semibold text-slate-600">
                      {tx.payment_method === "cash"
                        ? "💵 Tiền mặt"
                        : "💳 Chuyển khoản"}
                    </td>
                    <td className="py-4 px-6 text-center text-xs text-slate-600 font-medium whitespace-nowrap">
                      👤 {tx.staff}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors mx-auto block"
                        title="Xem hóa đơn chi tiết / In bill"
                      >
                        👁️ Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <div className="text-3xl mb-2">📁📭</div>
                    <p className="font-semibold text-slate-600">
                      Không tìm thấy dữ liệu hóa đơn nào
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- POPUP MODAL XEM CHI TIẾT HÓA ĐƠN --- */}
      {selectedTx && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all scale-100">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900">
                Chi Tiết Hóa Đơn HD-{selectedTx.id}
              </h2>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-mono text-slate-800">
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold tracking-tight text-slate-900">
                  CỬA HÀNG THỨC ĂN NHANH
                </h3>
                <p className="text-slate-400 font-sans">
                  Đ/C: Toà nhà văn phòng, Việt Nam
                </p>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-3 space-y-1.5 font-sans text-slate-600">
                <div className="flex justify-between">
                  <span>Thời gian:</span>
                  <span className="font-mono text-slate-900">
                    {formatDateTime(selectedTx.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Hình thức:</span>
                  <span className="text-slate-900 font-medium">
                    {selectedTx.dining_table_id
                      ? `Ăn tại bàn (${selectedTx.table_number})`
                      : "Mang về (Takeaway)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Thu ngân / Phục vụ:</span>
                  <span className="text-slate-900 font-medium">
                    {selectedTx.staff}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Phương thức:</span>
                  <span className="text-slate-900 font-medium">
                    {selectedTx.payment_method === "cash"
                      ? "Tiền mặt"
                      : "Chuyển khoản"}
                  </span>
                </div>
              </div>

              {/* Danh sách món ăn từ order_items */}
              <div className="border-t border-dashed border-slate-200 pt-3">
                <p className="font-sans font-bold text-slate-400 mb-2 uppercase tracking-wider text-[10px]">
                  Danh sách món ăn
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto font-sans pr-1">
                  {selectedTx.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start bg-slate-50 p-2 rounded-lg text-slate-700"
                    >
                      <div>
                        <p className="font-semibold">{item.product_name}</p>
                        {item.note && (
                          <p className="text-[11px] text-amber-600 italic">
                            *{item.note}
                          </p>
                        )}
                        <p className="text-xs text-slate-400">
                          {item.price.toLocaleString("vi-VN")} đ x{" "}
                          {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-slate-900 text-xs">
                        {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Khu vực kết xuất tài chính đầy đủ từ bảng orders */}
              <div className="border-t border-dashed border-slate-200 pt-3 space-y-1 text-slate-600 font-sans">
                <div className="flex justify-between">
                  <span>Tạm tính (Subtotal):</span>
                  <span>{selectedTx.subtotal.toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Thuế (Tax):</span>
                  <span>{selectedTx.tax_amount.toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Giảm giá (Discount):</span>
                  <span className="text-rose-500">
                    -{selectedTx.discount_amount.toLocaleString("vi-VN")} đ
                  </span>
                </div>
                <div className="border-t-2 border-dashed border-slate-300 pt-2 flex justify-between items-center font-bold">
                  <span className="text-sm text-slate-900">THÀNH TIỀN:</span>
                  <span className="text-lg font-black text-slate-950">
                    {selectedTx.total_amount.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                🖨️ In Hóa Đơn
              </button>
              <button
                onClick={() => setSelectedTx(null)}
                className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs py-2.5 rounded-xl transition-all"
              >
                Đóng Cửa Sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
