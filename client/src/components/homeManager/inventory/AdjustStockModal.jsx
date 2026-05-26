import { useState } from "react";

export default function AdjustStockModal({
  actionType,
  selectedItem,
  setSelectedItem,
  inventoryItems,
  setInventoryItems,
  onClose,
}) {
  const [formQty, setFormQty] = useState("");
  const [formNote, setFormNote] = useState("Nhập hàng bổ sung");

  const handleSaveAdjustment = (e) => {
    e.preventDefault();
    const numQty = parseFloat(formQty);
    if (isNaN(numQty) || numQty < 0)
      return alert("Vui lòng nhập số lượng hợp lệ!");

    setInventoryItems((prev) =>
      prev.map((item) => {
        if (item.id === selectedItem.id) {
          let newStock = item.stock;
          if (actionType === "NHẬP") {
            newStock = item.stock + numQty;
          } else if (actionType === "KIỂM_KHO") {
            newStock = numQty;
          }
          return { ...item, stock: newStock, lastUpdated: `Vừa xong` };
        }
        return item;
      }),
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {actionType === "NHẬP"
                ? "📥 Tạo Phiếu Nhập Thêm"
                : "📋 Cập Nhật Biên Bản Kiểm Kho"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mã thao tác nội bộ: {selectedItem.code}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSaveAdjustment} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Chọn Nguyên Vật Liệu
            </label>
            <select
              value={selectedItem.id}
              onChange={(e) =>
                setSelectedItem(
                  inventoryItems.find((i) => i.id === parseInt(e.target.value)),
                )
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 bg-white"
            >
              {inventoryItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.code})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between text-xs font-semibold text-slate-600">
            <span>
              Số tồn hiện tại:{" "}
              <b className="text-slate-900">
                {selectedItem.stock} {selectedItem.unit}
              </b>
            </span>
            <span>
              Mức tối thiểu:{" "}
              <b>
                {selectedItem.minStock} {selectedItem.unit}
              </b>
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              {actionType === "NHẬP"
                ? `Số lượng cộng thêm (${selectedItem.unit})`
                : `Số lượng thực tế đếm được (${selectedItem.unit})`}
            </label>
            <input
              type="number"
              step="any"
              required
              placeholder="Nhập số..."
              value={formQty}
              onChange={(e) => setFormQty(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 font-bold text-lg text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Ghi chú thẻ kho
            </label>
            <input
              type="text"
              value={formNote}
              onChange={(e) => setFormNote(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-sm shadow-md shadow-amber-500/10 transition-colors"
            >
              Xác nhận lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
