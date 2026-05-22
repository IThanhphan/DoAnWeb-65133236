import { useState } from "react";
import { loginUser } from "../../callAPI/authAPI";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    if (!formData.username || !formData.password) {
      setErrorMessage("Vui lòng nhập đầy đủ Tài khoản và Mật khẩu!");
      setIsLoading(false);
      return;
    }

    try {
      loginUser(formData, dispatch, navigate)
    } catch (error) {
      console.log(error);
      setErrorMessage("Mất kết nối tới máy chủ hệ thống!");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Các khối vòng tròn màu sắc mờ phía sau làm nền giao diện thêm sinh động */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-rose-500/10 rounded-full blur-3xl"></div>

      {/* KHUNG ĐĂNG NHẬP TRUNG TÂM */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10">
        {/* Phần Logo & Tiêu đề thương hiệu FastFood */}
        <div className="text-center space-y-2 mb-8">
          <div className="text-5xl inline-block bg-amber-500/10 w-20 h-20 leading-[80px] rounded-2xl border border-amber-500/20 animate-bounce">
            🍔
          </div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-white">
            FastFood <span className="text-amber-500">Hệ Thống</span>
          </h1>
          <p className="text-xs text-slate-400">
            Vui lòng đăng nhập để bắt đầu ca làm việc hoặc quản lý
          </p>
        </div>

        {/* Khung hiển thị thông báo lỗi (Nếu có) */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl flex items-center gap-2">
            <span>⚠️</span> {errorMessage}
          </div>
        )}

        {/* FORM ĐĂNG NHẬP */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Ô nhập Tài khoản (Ánh xạ vào cột username trong DB) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Tài khoản (Username)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                👤
              </span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập mã nhân viên hoặc tên tài khoản..."
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Ô nhập Mật khẩu */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mật khẩu (Password)
              </label>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                🔒
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Nút bấm Đăng nhập */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-950 font-black text-sm py-4 rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "ĐĂNG NHẬP VÀO HỆ THỐNG"
            )}
          </button>
        </form>

        {/* Chân trang thông tin bảo mật hệ thống nội bộ */}
        <div className="mt-8 pt-4 border-t border-slate-800/60 text-center">
          <p className="text-[10px] text-slate-600 tracking-wide font-medium uppercase">
            Hệ thống quản lý nội bộ độc quyền © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
