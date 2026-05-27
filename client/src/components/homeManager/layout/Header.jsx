export default function Header({ onLogout }) {
  const todayFormatted = new Date().toLocaleDateString("vi-VN", {
    weekday: "long", 
    year: "numeric", 
    month: "long",
    day: "numeric", 
  });

  return (
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
        <span className="text-sm text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
          📅 {todayFormatted}
        </span>
        <button
          className="bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-sm"
          onClick={onLogout}
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
