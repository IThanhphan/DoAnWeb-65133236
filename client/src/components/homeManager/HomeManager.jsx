import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { createAxiosJWT } from "../../callAPI/createInstance";
import { login } from "../../redux/userSlice";
import { logoutUser } from "../../callAPI/authAPI";
import Sidebar from "./dashboard/Sidebar";
import Header from "./dashboard/Header";
import StatsGrid from "./dashboard/StatsGrid";
import DashboardContent from "./dashboard/DashboardContent";
import MenuManager from "./menu/MenuManager";
import InventoryManager from "./inventory/InventoryManager";
import StaffManager from "./staff/StaffManager";
import HistoryManager from "./history/HistoryManager";

export default function HomeManager() {
  const userLogin = useSelector((state) => state.user?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosJWT = createAxiosJWT(userLogin, dispatch, login);

  useEffect(() => {
    if (!userLogin) {
      navigate("/login");
    } 
    else if (userLogin.role !== "manager") {
      navigate("/staff");
    }
  }, [userLogin, navigate]);

  const handleLogout = () => {
    logoutUser(userLogin?.accessToken, dispatch, axiosJWT);
  };

  // Mock data giữ nguyên phục vụ hiển thị
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
      {/* 1. Thanh điều hướng dọc sử dụng Link điều hướng URL */}
      <Sidebar userName={userLogin?.full_name} />

      {/* Khu vực hiển thị nội dung bên phải */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* 2. Thanh đầu trang */}
        <Header onLogout={handleLogout} />

        {/* 3. Phân rã cấu trúc hiển thị thông qua bộ định tuyến lồng nhau (Nested Routes) */}
        <Routes>
          {/* Tự động hướng về dashboard nếu chỉ gõ /manager */}
          <Route path="/" element={<Navigate to="dashboard" replace />} />

          <Route
            path="dashboard"
            element={
              <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
                <StatsGrid stats={stats} />
                <DashboardContent
                  bestSellers={bestSellers}
                  recentTransactions={recentTransactions}
                  onViewAllHistory={() => navigate("/manager/history")}
                />
              </div>
            }
          />

          <Route path="menu" element={<MenuManager></MenuManager>} />
          <Route
            path="inventory"
            element={<InventoryManager></InventoryManager>}
          />
          <Route path="staff" element={<StaffManager></StaffManager>} />
          <Route path="history" element={<HistoryManager></HistoryManager>} />
        </Routes>
      </main>
    </div>
  );
}
