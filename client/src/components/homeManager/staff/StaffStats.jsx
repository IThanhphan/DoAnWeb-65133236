export default function StaffStats({ totalStaff }) {
  return (
    <div className="max-w-xs w-full">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Tổng nhân viên hệ thống
          </p>
          <h3 className="text-2xl font-black text-slate-800 mt-1">
            {totalStaff} người
          </h3>
        </div>
        <span className="text-2xl bg-slate-100 p-3 rounded-xl">👥</span>
      </div>
    </div>
  );
}
