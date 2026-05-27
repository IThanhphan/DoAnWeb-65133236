import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function Sidebar({ userName }) {
  const [isMenuOpen, setIsMenuOpen] = useState(true); // Trạng thái đóng mở menu con của Thực đơn
  const location = useLocation();

  // Kiểm tra xem URL hiện tại có đang nằm trong nhóm quản lý món ăn không để highlight group
  const isMenuGroupActive =
    location.pathname.includes("/manager/menu") ||
    location.pathname.includes("/manager/recipe");

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col shadow-lg">
      <div className="p-5 border-b border-slate-800 text-center">
        <h1 className="text-xl font-black text-amber-500 uppercase tracking-wider flex items-center justify-center gap-2">
          <span>🍔</span> FastFood Manager
        </h1>
        <p className="text-xs text-slate-400 mt-1">Hệ thống quản lý tối ưu</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* 1. Tổng quan */}
        <NavLink
          to="/manager/dashboard"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-amber-500 text-slate-950 font-bold"
                : "hover:bg-slate-800 text-slate-300"
            }`
          }
        >
          📊 Tổng quan & Báo cáo
        </NavLink>

        {/* 2. Cụm Menu thực đơn (Có menu con) */}
        <div className="space-y-1">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isMenuGroupActive
                ? "text-amber-500 font-semibold bg-slate-800/50"
                : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <span>🍔</span> Quản lý Món ăn
            </div>
            <span
              className="text-xs transition-transform duration-200"
              style={{
                transform: isMenuOpen ? "rotate(90deg)" : "rotate(0deg)",
              }}
            >
              ▶
            </span>
          </button>

          {/* Danh sách các Sub-menu hiển thị khi toggle open */}
          {isMenuOpen && (
            <div className="pl-6 space-y-1 border-l-2 border-slate-800 ml-4 my-1">
              <NavLink
                to="/manager/menu"
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-amber-500/20 text-amber-400 font-bold"
                      : "hover:bg-slate-800/60 text-slate-400 hover:text-slate-200"
                  }`
                }
              >
                🔹 Danh mục & Món ăn
              </NavLink>
              <NavLink
                to="/manager/recipe"
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-amber-500/20 text-amber-400 font-bold"
                      : "hover:bg-slate-800/60 text-slate-400 hover:text-slate-200"
                  }`
                }
              >
                🔹 Công thức định lượng
              </NavLink>
            </div>
          )}
        </div>

        {/* 3. Kho hàng */}
        <NavLink
          to="/manager/inventory"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-amber-500 text-slate-950 font-bold"
                : "hover:bg-slate-800 text-slate-300"
            }`
          }
        >
          🧱 Kho nguyên vật liệu
        </NavLink>

        {/* 4. Nhân sự */}
        <NavLink
          to="/manager/staff"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-amber-500 text-slate-950 font-bold"
                : "hover:bg-slate-800 text-slate-300"
            }`
          }
        >
          👥 Quản lý Nhân sự
        </NavLink>

        {/* 5. Lịch sử */}
        <NavLink
          to="/manager/history"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-amber-500 text-slate-950 font-bold"
                : "hover:bg-slate-800 text-slate-300"
            }`
          }
        >
          📜 Lịch sử hóa đơn
        </NavLink>
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
