export default function DashboardContent({
  bestSellers,
  recentTransactions,
  onViewAllHistory,
}) {
  return (
    <div className="space-y-8 max-w-7xl w-full mx-auto">
      {/* MÓN BEST-SELLER VÀ LỊCH SỬ GIAO DỊCH CHI TIẾT */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột Trái & Giữa: Danh sách Best-seller */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                🔥 Món ăn "Best-Seller"
              </h3>
              <p className="text-xs text-slate-500">
                Giúp tối ưu hóa bài toán nhập nguyên liệu đầu vào
              </p>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Tháng này
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3">Món ăn</th>
                  <th className="pb-3">Danh mục</th>
                  <th className="pb-3 text-center">Đã bán</th>
                  <th className="pb-3 text-right">Doanh thu sản phẩm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {bestSellers.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 font-semibold text-slate-900 flex items-center gap-3">
                      <span className="text-xl bg-slate-100 w-9 h-9 rounded-lg flex items-center justify-center shadow-2xs">
                        {item.image}
                      </span>
                      {item.name}
                    </td>
                    <td className="py-3 text-slate-500">{item.category}</td>
                    <td className="py-3 text-center font-bold text-slate-900">
                      {item.sold}
                    </td>
                    <td className="py-3 text-right font-bold text-emerald-600">
                      {item.revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cột Phải: Đối soát lịch sử giao dịch */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">
              📜 Lịch sử hóa đơn gần đây
            </h3>
            <p className="text-xs text-slate-500">
              Dữ liệu đối soát hệ thống (Chỉ đọc)
            </p>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col gap-2 hover:border-slate-300 transition-all"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {tx.id}
                  </span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm">
                    {tx.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>{tx.time}</span>
                  <span className="bg-slate-200 px-2 py-0.5 rounded font-medium text-slate-700">
                    {tx.method}
                  </span>
                </div>
                <div className="border-t border-dashed border-slate-200 pt-2 flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-400">
                    Tổng thanh toán:
                  </span>
                  <span className="font-black text-slate-900">{tx.total}</span>
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
