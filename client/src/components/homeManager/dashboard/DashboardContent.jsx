export default function DashboardContent({
  bestSellers,
  recentTransactions,
  onViewAllHistory,
}) {
  // 1. Hàm định dạng tiền tệ chuẩn vi-VN từ số thuần trong DB
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // 2. Hàm ánh xạ phương thức thanh toán (ENUM: cash, bank_transfer)
  const renderPaymentMethod = (method) => {
    switch (method) {
      case "cash":
        return "Tiền mặt";
      case "bank_transfer":
        return "Chuyển khoản";
      default:
        return "Khác";
    }
  };

  // 3. Hàm xử lý hiển thị trạng thái đơn hàng (ENUM: pending, processing, completed, cancelled)
  const renderOrderStatus = (status) => {
    const statusConfig = {
      pending: { text: "Chờ xử lý", classes: "bg-amber-100 text-amber-700" },
      processing: { text: "Đang làm", classes: "bg-blue-100 text-blue-700" },
      completed: {
        text: "Thành công",
        classes: "bg-emerald-100 text-emerald-700",
      },
      cancelled: { text: "Đã hủy", classes: "bg-rose-100 text-rose-700" },
    };

    const current = statusConfig[status] || {
      text: status,
      classes: "bg-slate-100 text-slate-700",
    };
    return (
      <span
        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${current.classes}`}
      >
        {current.text}
      </span>
    );
  };

  // 4. Hàm định dạng thời gian từ chuỗi ISO / Timestamp của Database
  const formatTime = (timeString) => {
    if (!timeString) return "---";
    const date = new Date(timeString);

    const time = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const day = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });

    return `${time} - ${day}`;
  };

  return (
    <div className="space-y-8 max-w-7xl w-full mx-auto">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CỘT TRÁI & GIỮA: DANH SÁCH BEST-SELLER */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                🔥 Món ăn "Best-Seller"
              </h3>
              <p className="text-xs text-slate-500">
                Giúp tối ưu hóa bài toán nhập nguyên liệu đầu vào dựa trên lượng
                tiêu thụ thực tế
              </p>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Thống kê tổng quan
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3">Món ăn</th>
                  <th className="pb-3">Danh mục</th>
                  <th className="pb-3 text-center">Số lượng bán</th>
                  <th className="pb-3 text-right">Doanh thu sản phẩm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {bestSellers.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 font-semibold text-slate-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-slate-100 border border-slate-100 shadow-2xs">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = ""; // Xóa link lỗi
                              e.target.parentElement.innerHTML = "🍔"; // Đổi về emoji dự phòng
                            }}
                          />
                        ) : (
                          <span className="text-xl">{item.image || "🍔"}</span>
                        )}
                      </div>
                      <span className="truncate max-w-[200px] md:max-w-xs">
                        {item.name}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">
                      {item.categoryName || item.category}
                    </td>
                    <td className="py-3 text-center font-bold text-slate-900">
                      {item.totalSold || item.sold}
                    </td>
                    <td className="py-3 text-right font-bold text-emerald-600">
                      {formatCurrency(item.totalRevenue || item.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CỘT PHẢI: LỊCH SỬ HÓA ĐƠN GẦN ĐÂY */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">
              📜 Lịch sử hóa đơn gần đây
            </h3>
            <p className="text-xs text-slate-500">
              Dữ liệu đối soát hệ thống thời gian thực
            </p>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-1">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col gap-2 hover:border-slate-300 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      #{tx.id}
                    </span>
                    {tx.tableName ? (
                      <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        {tx.tableName}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                        Mang về
                      </span>
                    )}
                  </div>
                  {renderOrderStatus(tx.orderStatus || tx.status)}
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>{formatTime(tx.createdAt || tx.time)}</span>
                  <span className="bg-slate-200 px-2 py-0.5 rounded font-medium text-slate-700">
                    {renderPaymentMethod(tx.paymentMethod || tx.method)}
                  </span>
                </div>

                <div className="border-t border-dashed border-slate-200 pt-2 flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-400">
                    Tổng thanh toán:
                  </span>
                  <span className="font-black text-slate-900 text-base">
                    {formatCurrency(tx.totalAmount || tx.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onViewAllHistory}
            className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-2.5 rounded-xl transition-colors border border-slate-200"
          >
            Xem toàn bộ lịch sử hóa đơn
          </button>
        </div>
      </section>
    </div>
  );
}
