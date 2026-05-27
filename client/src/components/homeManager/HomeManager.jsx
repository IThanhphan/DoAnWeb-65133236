import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { createAxiosJWT } from "../../callAPI/createInstance";
import { login } from "../../redux/userSlice";
import { logoutUser } from "../../callAPI/authAPI";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import StatsGrid from "./dashboard/StatsGrid";
import DashboardContent from "./dashboard/DashboardContent";
import MenuManager from "./menu/MenuManager";
import InventoryManager from "./inventory/InventoryManager";
import StaffManager from "./staff/StaffManager";
import HistoryManager from "./history/HistoryManager";
import RecipeManager from "./recipe/RecipeManager";

export default function HomeManager() {
  const userLogin = useSelector((state) => state.user?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosJWT = createAxiosJWT(userLogin, dispatch, login);

  useEffect(() => {
    if (!userLogin) {
      navigate("/login");
    } else if (userLogin.role !== "manager") {
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
      id: 1,
      name: "Burger Bò Phô Mai Double",
      categoryName: "Burger", // Khớp tên danh mục từ bảng categories
      totalSold: 45, // Đổi từ chuỗi sang kiểu số nguyên (INT)
      totalRevenue: 2925000.0, // Đổi từ chuỗi có chữ 'đ' sang số DECIMAL để format tự động
      imageUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500", // Link URL thực tế từ DB
    },
    {
      id: 4,
      name: "Gà Rán Sốt Cay Thượng Hạng",
      categoryName: "Gà rán",
      totalSold: 38,
      totalRevenue: 1710000.0,
      imageUrl:
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500",
    },
    {
      id: 7,
      name: "Khoai Tây Chiên Lắc Phô Mai",
      categoryName: "Món phụ",
      totalSold: 32,
      totalRevenue: 960000.0,
      imageUrl:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500",
    },
    {
      id: 10,
      name: "Coca Cola Tươi Size M",
      categoryName: "Đồ uống",
      totalSold: 29,
      totalRevenue: 435000.0,
      imageUrl:
        "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500",
    },
  ];

  const recentTransactions = [
    {
      id: 24, // ID dạng BIGINT tự tăng thay vì 'HD-0024'
      tableName: "Bàn 03", // Link sang bảng dining_tables lấy table_number
      orderStatus: "completed", // Khớp ENUM ('pending', 'processing', 'completed', 'cancelled')
      paymentMethod: "bank_transfer", // Khớp ENUM ('cash', 'bank_transfer')
      totalAmount: 185000.0, // Kiểu số DECIMAL toán học
      createdAt: "2026-05-20T20:15:00.000Z", // Định dạng TIMESTAMP chuẩn ISO để xử lý thời gian thực
    },
    {
      id: 23,
      tableName: "Bàn 01",
      orderStatus: "completed",
      paymentMethod: "cash",
      totalAmount: 32000.0,
      createdAt: "2026-05-20T19:42:00.000Z",
    },
    {
      id: 22,
      tableName: null, // NULL đại diện cho đơn khách mua mang về (Takeaway) theo đúng thiết kế DB
      orderStatus: "completed",
      paymentMethod: "cash",
      totalAmount: 75000.0,
      createdAt: "2026-05-20T19:30:00.000Z",
    },
  ];

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 font-sans">
      {/* 1. Thanh điều hướng dọc sử dụng Link điều hướng URL */}
      <Sidebar userName={userLogin?.fullName} />

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
          <Route path="recipe" element={<RecipeManager></RecipeManager>} />
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
