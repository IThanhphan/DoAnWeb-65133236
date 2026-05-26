import { formatDateTime } from "../../../helper/formatDateTime";

export default function HistoryLogModal({
  selectedItem,
  historyLog,
  isLoading,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-2xl w-full flex flex-col max-h-[85vh] overflow-hidden transform scale-100 transition-all">
        {/* Header Modal */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Lịch Sử Thẻ Kho Chi Tiết
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Vật tư:{" "}
              <span className="font-semibold text-slate-700">
                {selectedItem?.code}
              </span>{" "}
              - {selectedItem?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        {/* Nội dung danh sách lịch sử */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {isLoading ? (
            // Hiển thị trạng thái đang tải dữ liệu
            <div className="py-12 text-center text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-3"></div>
              <p className="text-sm">Đang đồng bộ dữ liệu thẻ kho...</p>
            </div>
          ) : historyLog && historyLog.length > 0 ? (
            <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-100">
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4 text-center">Loại</th>
                    <th className="py-3 px-4 text-right">Số lượng</th>
                    <th className="py-3 px-4">Ghi chú nghiệp vụ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {historyLog.map((log) => {
                    const isNhap = log.transactionType === "NHẬP";
                    return (
                      <tr
                        key={log.id}
                        className="hover:bg-slate-50/40 transition-colors"
                      >
                        {/* Thời gian biến động */}
                        <td className="py-3 px-4 text-xs font-medium text-slate-500 whitespace-nowrap">
                          {formatDateTime(log.createdAt)}
                        </td>

                        {/* Loại giao dịch (NHẬP/XUẤT/KIỂM_KHO) */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <span
                            className={`inline-block text-[10px] font-black px-2 py-0.5 rounded ${
                              isNhap
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                : "bg-rose-50 text-rose-600 border border-rose-200"
                            }`}
                          >
                            {log.transactionType}
                          </span>
                        </td>

                        {/* Số lượng biến động */}
                        <td
                          className={`py-3 px-4 text-right font-bold whitespace-nowrap ${
                            isNhap ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {isNhap ? `+${log.quantity}` : log.quantity}{" "}
                          <span className="text-xs font-normal text-slate-400">
                            {selectedItem?.unit}
                          </span>
                        </td>

                        {/* Ghi chú */}
                        <td
                          className="py-3 px-4 text-xs text-slate-600 max-w-[220px] truncate"
                          title={log.note}
                        >
                          {log.note || "---"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            // Trạng thái trống khi chưa từng có biến động kho
            <div className="py-16 text-center text-slate-400">
              <div className="text-4xl mb-2">📋</div>
              <p className="font-semibold text-slate-600">
                Vật tư chưa có biến động kho
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Lịch sử xuất, nhập hoặc cân kho sẽ hiển thị tại đây.
              </p>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 active:bg-slate-100 transition-colors shadow-sm"
          >
            Đóng màn hình
          </button>
        </div>
      </div>
    </div>
  );
}
