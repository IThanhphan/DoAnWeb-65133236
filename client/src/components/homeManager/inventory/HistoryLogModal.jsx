export default function HistoryLogModal({
  selectedItem,
  mockHistoryLog,
  onClose,
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              📊 Nhật Ký Biến Động Thẻ Kho
            </h3>
            <p className="text-xs text-amber-600 font-semibold mt-0.5">
              {selectedItem.name} ({selectedItem.code})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 max-h-[400px] overflow-y-auto">
          {mockHistoryLog[selectedItem.id] ? (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-bold uppercase">
                  <th className="pb-3">Thời gian</th>
                  <th className="pb-3 text-center">Hình Thức</th>
                  <th className="pb-3 text-right">Biến động</th>
                  <th className="pb-3 pl-4">Ghi chú vận hành</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {mockHistoryLog[selectedItem.id].map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/40">
                    <td className="py-3 font-medium text-slate-500">
                      {log.date}
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.type === "NHẬP" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
                      >
                        {log.type}
                      </span>
                    </td>
                    <td
                      className={`py-3 text-right font-bold ${log.type === "NHẬP" ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {log.qty > 0 ? `+${log.qty}` : log.qty}{" "}
                      {selectedItem.unit}
                    </td>
                    <td className="py-3 pl-4 text-slate-700 font-medium">
                      {log.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center text-slate-400">
              <p className="text-base">📭 Không có bản ghi nào gần đây</p>
              <p className="text-xs mt-1">
                Hệ thống chỉ lưu vết biến động phát sinh trong vòng 30 ngày.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  );
}
