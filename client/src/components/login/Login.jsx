import { useState } from "react";

export default function Login() {
  // State quản lý dữ liệu form đăng nhập
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // State quản lý thông báo lỗi nếu đăng nhập thất bại
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý thay đổi dữ liệu trong ô input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý sự kiện Submit Form Đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    // Kiểm tra dữ liệu thô tại client
    if (!formData.username || !formData.password) {
      setErrorMessage("Vui lòng nhập đầy đủ Tài khoản và Mật khẩu!");
      setIsLoading(false);
      return;
    }

    try {
      // 📝 GỢI Ý LOGIC KẾT NỐI API BACKEND SAU NÀY:
      /*
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password // Backend sẽ so sánh với password_hash trong DB
        })
      });
      const data = await response.json();
      
      if (response.ok) {
         // Lưu Token và thông tin User vào localStorage/Context
         localStorage.setItem('token', data.token);
         
         // Điều hướng dựa trên Phân hệ 1 (Roles) trong CSDL của bạn:
         if (data.user.roleName === 'manager') {
            window.location.href = '/manager-dashboard';
         } else if (data.user.roleName === 'staff') {
            window.location.href = '/staff-pos';
         }
      } else {
         setErrorMessage(data.message || 'Tài khoản hoặc mật khẩu không chính xác!');
      }
      */

      // --- GIẢ LẬP ĐỂ TEST GIAO DIỆN TẠI FRONTEND ---
      setTimeout(() => {
        setIsLoading(false);
        if (formData.username === "admin" && formData.password === "123456") {
          alert("Đăng nhập thành công với quyền QUẢN LÝ (manager)!");
          // window.location.href = '/manager'; // Điều hướng giả lập
        } else if (
          formData.username === "nv01" &&
          formData.password === "123456"
        ) {
          alert("Đăng nhập thành công với quyền NHÂN VIÊN (staff)!");
          // window.location.href = '/staff'; // Điều hướng giả lập
        } else {
          setErrorMessage(
            "Tài khoản hoặc mật khẩu không chính xác! (Gợi ý test: admin/123456 hoặc nv01/123456)",
          );
        }
      }, 1000);
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
