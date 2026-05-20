import { useState } from "react";

export default function HomeManager() {
  // State giả lập để chuyển đổi nhanh các tab chức năng trong tương lai
  const [activeTab, setActiveTab] = useState("dashboard");

  // Dữ liệu giả lập (Mock data) hiển thị báo cáo nhanh
  const stats = [
    {
      id: 1,
      name: "Doanh thu hôm nay",
      value: "4,850,000 đ",
      icon: "💰",
      change: "+12%",
      changeType: "increase",
    },
    {
      id: 2,
      name: "Đơn hàng đã bán",
      value: "128 đơn",
      icon: "📦",
      change: "+8%",
      changeType: "increase",
    },
    {
      id: 3,
      name: "Nguyên liệu sắp hết",
      value: "3 mục",
      icon: "⚠️",
      change: "Cần nhập gấp",
      changeType: "decrease",
    },
    {
      id: 4,
      name: "Nhân viên đang làm",
      value: "5 người",
      icon: "👥",
      change: "Ổn định",
      changeType: "normal",
    },
  ];

  const bestSellers = [
    {
      name: "Burger Bò Phô Mai Double",
      category: "Burger",
      sold: 45,
      revenue: "2,925,000 đ",
      image: "🍔",
    },
    {
      name: "Gà Rán Sốt Cay Thượng Hạng",
      category: "Gà rán",
      sold: 38,
      revenue: "1,710,000 đ",
      image: "🍗",
    },
    {
      name: "Khoai Tây Chiên Lắc Phô Mai",
      category: "Món phụ",
      sold: 32,
      revenue: "960,000 đ",
      image: "🍟",
    },
    {
      name: "Trà Sữa Trân Châu Size L",
      category: "Đồ uống",
      sold: 29,
      revenue: "870,000 đ",
      image: "🥤",
    },
  ];

  const recentTransactions = [
    {
      id: "HD-0024",
      time: "20:15 - 20/05",
      total: "185,000 đ",
      method: "Chuyển khoản",
      status: "Thành công",
    },
    {
      id: "HD-0023",
      time: "19:42 - 20/05",
      total: "320,000 đ",
      method: "Tiền mặt",
      status: "Thành công",
    },
    {
      id: "HD-0022",
      time: "19:30 - 20/05",
      total: "75,000 đ",
      method: "Tiền mặt",
      status: "Thành công",
    },
  ];

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 font-sans">
      {/* 1. SIDEBAR - THANH ĐIỀU HƯỚNG BÊN TRÁI */}
      <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col shadow-lg">
        <div className="p-5 border-b border-slate-800 text-center">
          <h1 className="text-xl font-black text-amber-500 uppercase tracking-wider flex items-center justify-center gap-2">
            <span>🍔</span> FastFood Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">Hệ thống quản lý tối ưu</p>
        </div>

        {/* Menu Điều Hướng ứng với chức năng đề tài */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "dashboard" ? "bg-amber-500 text-slate-950 font-bold" : "hover:bg-slate-800 text-slate-300"}`}
          >
            📊 Tổng quan & Báo cáo
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            📋 Quản lý Thực đơn
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            🧱 Kho & Định lượng
          </button>
          <button
            onClick={() => setActiveTab("staff")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            👥 Quản lý Nhân sự
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            📜 Lịch sử hóa đơn
          </button>
        </nav>

        {/* Thông tin tài khoản đăng nhập */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center font-bold text-slate-950">
            QL
          </div>
          <div>
            <h4 className="text-sm font-bold">Thanh Phan</h4>
            <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Quản lý
            </span>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT - KHU VỰC HIỂN THỊ NỘI DUNG CHÍNH */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header trên cùng */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Bảng điều khiển trung tâm
            </h2>
            <p className="text-sm text-slate-500">
              Xin chào, Quản lý ngày hôm nay diễn ra thế nào?
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 font-medium">
              📅 Ngày 20 tháng 05, 2026
            </span>
            <button className="bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-sm">
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Khung nội dung Dashboard */}
        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* HÀNG 1: BIỂU THỊ SỐ LIỆU TỔNG QUAN (Stats Grid) */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between"
              >
                <div className="space-y-1">
                  <span className="text-sm font-medium text-slate-500">
                    {stat.name}
                  </span>
                  <div className="text-2xl font-black text-slate-900">
                    {stat.value}
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-sm ${
                      stat.changeType === "increase"
                        ? "bg-emerald-100 text-emerald-700"
                        : stat.changeType === "decrease"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <div className="text-3xl bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-2xs">
                  {stat.icon}
                </div>
              </div>
            ))}
          </section>

          {/* HÀNG 2: MÓN BEST-SELLER VÀ LỊCH SỬ GIAO DỊCH CHI TIẾT */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cột Trái & Giữa: Danh sách Best-seller để tối ưu nhập hàng */}
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

            {/* Cột Phải: Đối soát lịch sử giao dịch (Nhân viên không thể xóa) */}
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
                      <span className="font-black text-slate-900">
                        {tx.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-2.5 rounded-xl transition-colors border border-slate-200">
                Xem toàn bộ lịch sử hóa đơn
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
