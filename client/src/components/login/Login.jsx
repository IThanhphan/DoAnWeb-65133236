import { useState } from "react";
import { loginUser } from "../../callAPI/authAPI";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    if (!formData.username || !formData.password) {
      setErrorMessage("Vui lòng nhập đầy đủ Tài khoản và Mật khẩu!");
      setIsLoading(false);
      return;
    }

    try {
      loginUser(formData, dispatch, navigate);
    } catch (error) {
      console.log(error);
      setErrorMessage("Mất kết nối tới máy chủ hệ thống!");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans select-none">
      {/* ─── CỘT TRÁI: BANNER THƯƠNG HIỆU & VISUAL (Ẩn trên mobile để tối ưu) ─── */}
      <div className="hidden lg:flex lg:w-[55%] bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 p-12 relative flex-col justify-between overflow-hidden">
        {/* Hiệu ứng tia sáng nghệ thuật phía sau */}
        <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[100px]" />

        {/* Logo Góc Trên */}
        <div className="flex items-center gap-3 relative z-10">
          <span className="text-3xl bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 backdrop-blur-md">
            🍔
          </span>
          <span className="text-xl font-black tracking-wider text-white uppercase">
            FastFood <span className="text-amber-500">Hub</span>
          </span>
        </div>

        {/* Khối Slogan & Thống kê Giữa màn hình */}
        <div className="space-y-6 max-w-xl relative z-10 my-auto">
          <div className="space-y-3">
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-widest">
              Hệ thống POS V2.5
            </span>
            <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight">
              Vận hành tốc độ,
              <br />
              Tối ưu từng <span className="text-amber-500">đơn hàng.</span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Nền tảng quản lý bán hàng chuẩn hóa chuỗi cửa hàng thức ăn nhanh.
            Giúp tối ưu hóa tốc độ gọi món, kết nối nhà bếp tức thời và báo cáo
            doanh thu minh bạch.
          </p>

          {/* Widget Kính mờ (Glassmorphism) tạo điểm nhấn */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl backdrop-blur-md">
              <p className="text-2xl font-black text-amber-500">{"< 1.5s"}</p>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Đồng bộ dữ liệu bếp
              </p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl backdrop-blur-md">
              <p className="text-2xl font-black text-white">100%</p>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Chính xác tài chính
              </p>
            </div>
          </div>
        </div>

        {/* Bản quyền dưới chân trang */}
        <p className="text-xs text-slate-500 relative z-10 font-medium">
          Độc quyền vận hành nội bộ © 2026 FastFood Corp.
        </p>
      </div>

      {/* ─── CỘT PHẢI: FORM ĐĂNG NHẬP NỀN TRẮNG SANG TRỌNG ─── */}
      <div className="w-full lg:w-[45%] bg-white flex items-center justify-center p-6 sm:p-12 md:p-20 relative">
        {/* Đốm màu nhẹ nền sau ở mobile */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Header Chào mừng */}
          <div className="space-y-2">
            <div className="lg:hidden text-4xl mb-4 inline-block bg-amber-50 w-14 h-14 leading-[56px] text-center rounded-xl border border-amber-200">
              🍔
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              Xin chào ca làm việc! 👋
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              Vui lòng nhập thông tin xác thực để truy cập hệ thống.
            </p>
          </div>

          {/* Khung báo lỗi sắc nét */}
          {errorMessage && (
            <div className="p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-xs font-bold rounded-r-xl flex items-center gap-2 animate-shake">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Tài khoản */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Tài khoản nhân viên
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors text-sm">
                  👤
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="username (VD: ithanh)..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 pl-11 pr-4 py-4 rounded-2xl text-sm focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all font-medium"
                />
              </div>
            </div>

            {/* Input Mật khẩu */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Mật khẩu bảo mật
                </label>
              </div>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors text-sm">
                  🔒
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 pl-11 pr-4 py-4 rounded-2xl text-sm focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all font-medium"
                />
              </div>
            </div>

            {/* Button Đăng nhập Hiệu ứng Shadow đẹp */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-amber-500 hover:text-slate-950 active:scale-[0.99] disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-black text-sm py-4 rounded-2xl transition-all shadow-xl shadow-slate-900/10 hover:shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>VÀO CA LÀM VIỆC</span>
                  <span className="text-xs">➔</span>
                </>
              )}
            </button>
          </form>

          {/* Footer nhỏ gọn ở Mobile */}
          <div className="lg:hidden text-center pt-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 tracking-wide font-bold uppercase">
              Hệ thống bảo mật nội bộ © 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
