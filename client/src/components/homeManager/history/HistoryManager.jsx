import { useState } from "react";

export default function HistoryManager() {
  // Bộ lọc thời gian nhanh
  const timeFilters = [
    { id: "today", label: "Hôm nay" },
    { id: "yesterday", label: "Hôm qua" },
    { id: "7days", label: "7 ngày qua" },
    { id: "all", label: "Tất cả thời gian" },
  ];

  // Giả lập dữ liệu lịch sử hóa đơn (Chuyển thành state để thay đổi trạng thái khi bấm nút)
  const [transactions, setTransactions] = useState([
    {
      id: "HD-0024",
      time: "20:15 - 24/05",
      items: "Burger Bò Phô Mai x2, Trà Sữa x1",
      total: 165000,
      method: "Chuyển khoản",
      status: "success",
      staff: "Trần Thị Linh",
    },
    {
      id: "HD-0023",
      time: "19:42 - 24/05",
      items: "Gà Rán Sốt Cay x3, Khoai Tây Chiên x2",
      total: 195000,
      method: "Tiền mặt",
      status: "success",
      staff: "Nguyễn Văn Hùng",
    },
    {
      id: "HD-0022",
      time: "18:30 - 24/05",
      items: "Combo Gia Đình Tiết Kiệm x1",
      total: 189000,
      method: "Ví điện tử",
      status: "success",
      staff: "Trần Thị Linh",
    },
    {
      id: "HD-0021",
      time: "17:15 - 24/05",
      items: "Burger Bò Phô Mai x1, Pepsi x1",
      total: 80000,
      method: "Tiền mặt",
      status: "cancelled",
      staff: "Lê Hoàng Nam",
    },
    {
      id: "HD-0020",
      time: "15:10 - 23/05",
      items: "Kem Tươi Vani x5",
      total: 75000,
      method: "Chuyển khoản",
      status: "refunded",
      staff: "Trần Thị Linh",
    },
    {
      id: "HD-0019",
      time: "12:05 - 23/05",
      items: "Gà Rán Sốt Cay x2, Trà Sữa x2",
      total: 160000,
      method: "Chuyển khoản",
      status: "success",
      staff: "Nguyễn Văn Hùng",
    },
  ]);

  const [activeTimeFilter, setActiveTimeFilter] = useState("today");
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // State quản lý Modal
  const [selectedTx, setSelectedTx] = useState(null); // Xem chi tiết
  const [isExporting, setIsExporting] = useState(false); // Trạng thái xuất file

  // Tính toán nhanh số liệu tổng hợp từ dữ liệu đang hiển thị công khai
  const totalRevenue = transactions
    .filter((t) => t.status === "success")
    .reduce((sum, t) => sum + t.total, 0);

  const totalOrders = transactions.length;
  const cancelledOrders = transactions.filter(
    (t) => t.status === "cancelled" || t.status === "refunded",
  ).length;

  // Xử lý hoàn tiền / Hoàn trả hóa đơn
  const handleRefund = (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn hoàn tiền cho hóa đơn ${id}?`)) {
      setTransactions(
        transactions.map((t) =>
          t.id === id ? { ...t, status: "refunded" } : t,
        ),
      );
      alert(`Đã thực hiện hoàn tiền thành công cho hóa đơn ${id}`);
    }
  };

  // Giả lập xuất Excel
  const handleExportExcel = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Xuất báo cáo Excel thành công! File đã được tải xuống.");
    }, 1500);
  };

  // Hàm đổ màu trạng thái hóa đơn
  const getStatusBadge = (status) => {
    switch (status) {
      case "success":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "refunded":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "success":
        return "Thành công";
      case "cancelled":
        return "Đã hủy đơn";
      case "refunded":
        return "Hoàn tiền";
      default:
        return "Không rõ";
    }
  };

  // Logic bộ lọc nâng cao thời gian thực
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.items.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.staff.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === "all" || t.method === methodFilter;
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;

    const matchesTime =
      activeTimeFilter === "all" ||
      (activeTimeFilter === "today" && t.time.includes("24/05")) ||
      (activeTimeFilter === "yesterday" && t.time.includes("23/05")) ||
      activeTimeFilter === "7days";

    return matchesSearch && matchesMethod && matchesStatus && matchesTime;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl w-full mx-auto relative">
      {/* Khối Tiêu đề */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lịch Sử Hóa Đơn</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tra cứu danh sách hóa đơn, kiểm tra doanh thu ca trực và thực hiện
            các thao tác hoàn tiền hoàn tất thủ tục.
          </p>
        </div>
        <button
          onClick={handleExportExcel}
          disabled={isExporting}
          className={`flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold px-5 py-3 rounded-xl transition-all text-sm shadow-md`}
        >
          <span>{isExporting ? "⏳" : "📊"}</span>
          {isExporting ? "Đang xuất file..." : "Xuất file Excel báo cáo"}
        </button>
      </div>

      {/* Grid thống kê tiền tệ nhanh cho ca trực */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Doanh thu sạch (Thành công)
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
              {totalOrders} đơn hàng
            </h3>
          </div>
          <span className="text-2xl bg-slate-100 p-3 rounded-xl">🧾</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Hóa đơn lỗi / Hủy bỏ / Hoàn tiền
            </p>
            <h3 className="text-2xl font-black text-rose-600 mt-1">
              {cancelledOrders} đơn
            </h3>
          </div>
          <span className="text-2xl bg-rose-50 text-rose-600 p-3 rounded-xl">
            🚨
          </span>
        </div>
      </div>

      {/* Thanh bộ lọc dữ liệu đa năng */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Tìm theo mã đơn, món ăn, nhân viên lập đơn..."
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
            <option value="all">Tất cả hình thức mua</option>
            <option value="Tiền mặt">💵 Tiền mặt</option>
            <option value="Chuyển khoản">💳 Chuyển khoản</option>
            <option value="Ví điện tử">📱 Ví điện tử</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm bg-white text-slate-700 font-medium cursor-pointer"
          >
            <option value="all">Tất cả trạng thái đơn</option>
            <option value="success">🟢 Thành công</option>
            <option value="cancelled">🔴 Đã hủy đơn</option>
            <option value="refunded">🟡 Hoàn tiền</option>
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

      {/* Bảng Danh sách lịch sử hóa đơn phẳng */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-100">
                <th className="py-4 px-6">Mã Hóa Đơn</th>
                <th className="py-4 px-6">Thời Gian Tạo</th>
                <th className="py-4 px-6">Chi Tiết Món Mua</th>
                <th className="py-4 px-6 text-right">Tổng Tiền</th>
                <th className="py-4 px-6 text-center">Phương Thức</th>
                <th className="py-4 px-6 text-center">Thu Ngân</th>
                <th className="py-4 px-6 text-center">Trạng Thái</th>
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
                      {tx.id}
                    </td>
                    <td className="py-4 px-6 text-xs font-medium text-slate-500 whitespace-nowrap">
                      ⏱️ {tx.time}
                    </td>
                    <td
                      className="py-4 px-6 font-medium text-slate-700 max-w-xs truncate"
                      title={tx.items}
                    >
                      {tx.items}
                    </td>
                    <td className="py-4 px-6 text-right font-black text-slate-900 whitespace-nowrap">
                      {tx.total.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="py-4 px-6 text-center text-xs font-semibold text-slate-600">
                      {tx.method === "Tiền mặt"
                        ? "💵 Tiền mặt"
                        : tx.method === "Chuyển khoản"
                          ? "💳 Bank"
                          : "📱 E-Wallet"}
                    </td>
                    <td className="py-4 px-6 text-center text-xs text-slate-600 font-medium whitespace-nowrap">
                      👤 {tx.staff}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-md border ${getStatusBadge(tx.status)}`}
                      >
                        {getStatusLabel(tx.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Xem hóa đơn chi tiết / In lại bill"
                        >
                          👁️
                        </button>
                        {tx.status === "success" && (
                          <button
                            onClick={() => handleRefund(tx.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Yêu cầu hoàn trả hóa đơn"
                          >
                            🔄
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <div className="text-3xl mb-2">📁📭</div>
                    <p className="font-semibold text-slate-600">
                      Không tìm thấy lịch sử giao dịch nào
                    </p>
                    <p className="text-xs mt-1 text-slate-400">
                      Hãy thử đổi lại điều kiện bộ lọc hoặc mốc thời gian tra
                      cứu.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- POPUP MODAL: XEM CHI TIẾT & IN HÓA ĐƠN --- */}
      {selectedTx && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all scale-100">
            {/* Header Modal */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900">
                Chi Tiết Hóa Đơn {selectedTx.id}
              </h2>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Thân hóa đơn phỏng theo Bill thanh toán thực tế */}
            <div className="p-6 space-y-4 text-xs font-mono text-slate-800">
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold tracking-tight text-slate-900">
                  CỬA HÀNG THỨC ĂN NHANH
                </h3>
                <p className="text-slate-400 font-sans">
                  Đ/C: Toà nhà văn phòng, Việt Nam
                </p>
                <p className="text-slate-400 font-sans">SĐT: 0123.456.789</p>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-3 space-y-1.5 font-sans text-slate-600">
                <div className="flex justify-between">
                  <span>Thời gian:</span>
                  <span className="font-mono text-slate-900">
                    {selectedTx.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Thu ngân:</span>
                  <span className="text-slate-900 font-medium">
                    {selectedTx.staff}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Phương thức:</span>
                  <span className="text-slate-900 font-medium">
                    {selectedTx.method}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Trạng thái:</span>
                  <span
                    className={`font-bold uppercase ${selectedTx.status === "success" ? "text-emerald-600" : "text-rose-500"}`}
                  >
                    {getStatusLabel(selectedTx.status)}
                  </span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-3">
                <p className="font-sans font-bold text-slate-400 mb-2 uppercase tracking-wider text-[10px]">
                  Danh sách món
                </p>
                <div className="bg-slate-50 p-3 rounded-xl font-sans text-slate-700 leading-relaxed">
                  {selectedTx.items}
                </div>
              </div>

              <div className="border-t-2 border-dashed border-slate-300 pt-3 flex justify-between items-center font-sans">
                <span className="text-sm font-bold text-slate-900">
                  THÀNH TIỀN:
                </span>
                <span className="text-lg font-black text-slate-950">
                  {selectedTx.total.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>

            {/* Footer nút hành động */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                🖨️ In Lại Hóa Đơn
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
