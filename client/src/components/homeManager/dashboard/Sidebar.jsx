import { NavLink } from "react-router-dom";

export default function Sidebar({ userName }) {
  const menuItems = [
    { path: "dashboard", label: "📊 Tổng quan & Báo cáo" },
    { path: "menu", label: "📋 Quản lý Thực đơn" },
    { path: "inventory", label: "🧱 Kho & Định lượng" },
    { path: "staff", label: "👥 Quản lý Nhân sự" },
    { path: "history", label: "📜 Lịch sử hóa đơn" },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col shadow-lg">
      <div className="p-5 border-b border-slate-800 text-center">
        <h1 className="text-xl font-black text-amber-500 uppercase tracking-wider flex items-center justify-center gap-2">
          <span>🍔</span> FastFood Manager
        </h1>
        <p className="text-xs text-slate-400 mt-1">Hệ thống quản lý tối ưu</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={`/manager/${item.path}`}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "hover:bg-slate-800 text-slate-300"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center font-bold text-slate-950">
          QL
        </div>
        <div>
          <h4 className="text-sm font-bold">{userName || "Quản lý"}</h4>
          <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Quản lý
          </span>
        </div>
      </div>
    </aside>
  );
}
