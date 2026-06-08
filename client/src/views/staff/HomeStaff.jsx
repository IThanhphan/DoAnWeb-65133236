import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAxiosJWT } from "../../callAPI/createInstance";
import { login } from "../../redux/userSlice";
import { logoutUser } from "../../callAPI/authAPI";

export default function HomeStaff() {
  const userLogin = useSelector((state) => state.user?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosJWT = createAxiosJWT(userLogin, dispatch, login);

  // 1. Quản lý State Nghiệp vụ & UI
  const [currentCategory, setCurrentCategory] = useState("Burger");
  const [selectedTable, setSelectedTable] = useState(null);
  const [isTakeaway, setIsTakeaway] = useState(true);
  const [discountInput, setDiscountInput] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // Giỏ hàng hiện tại đang thao tác trên màn hình
  const [cart, setCart] = useState([]);

  // ==================== STATE DỮ LIỆU ĐỘNG (ĐÃ KẾT NỐI) ====================

  // BẢNG 1: ingredients (Nguyên liệu trong kho)
  const [ingredients, setIngredients] = useState([
    { id: 101, name: "Vỏ bánh Burger", quantity: 10, unit: "cái" },
    { id: 102, name: "Thịt bò miếng", quantity: 5, unit: "miếng" },
    { id: 103, name: "Phô mai lát", quantity: 12, unit: "lát" },
    { id: 104, name: "Tôm viên", quantity: 20, unit: "viên" },
    { id: 105, name: "Thịt gà phi lê", quantity: 15, unit: "miếng" },
    { id: 106, name: "Bột chiên giòn", quantity: 2000, unit: "g" },
    { id: 107, name: "Syrup trà đào", quantity: 500, unit: "ml" },
    { id: 108, name: "Hạt chia", quantity: 100, unit: "g" },
    { id: 109, name: "Coca cô đặc", quantity: 1000, unit: "ml" },
  ]);

  // BẢNG 2: Sơ đồ bàn ăn (Chuyển thành State để thay đổi được trạng thái)
  const [tables, setTables] = useState([
    {
      id: 1,
      table_number: "Bàn 01",
      status: "occupied",
      subtotal: 160000,
      cart: [
        { id: 1, name: "Burger Bò Phô Mai Double", price: 65000, quantity: 2 },
        { id: 11, name: "Coca Cola Tươi Pepsi", price: 15000, quantity: 2 },
      ],
    },
    {
      id: 2,
      table_number: "Bàn 02",
      status: "available",
      subtotal: 0,
      cart: [],
    },
    {
      id: 3,
      table_number: "Bàn 03",
      status: "occupied",
      subtotal: 74000,
      cart: [
        {
          id: 4,
          name: "Gà Rán Sốt Cay Thượng Hạng",
          price: 45000,
          quantity: 1,
        },
        { id: 12, name: "Trà Đào Đốt Sả Hạt Chia", price: 29000, quantity: 1 },
      ],
    },
    {
      id: 4,
      table_number: "Bàn 04",
      status: "available",
      subtotal: 0,
      cart: [],
    },
  ]);

  // BẢNG 3: Hàng đợi nhà bếp (Động)
  const [kitchenOrders, setKitchenOrders] = useState([
    {
      id: 101,
      table_number: "Bàn 01",
      items: [
        { name: "Burger Bò Phô Mai Double", quantity: 2 },
        { name: "Coca Cola Tươi Pepsi", quantity: 2 },
      ],
      time: "10 phút trước",
    },
  ]);

  // Dữ liệu cấu hình cố định
  const flatRecipes = [
    { id: 1, productId: 1, ingredientId: 101, amount: 1 },
    { id: 2, productId: 1, ingredientId: 102, amount: 2 },
    { id: 3, productId: 1, ingredientId: 103, amount: 2 },
    { id: 4, productId: 2, ingredientId: 101, amount: 1 },
    { id: 5, productId: 2, ingredientId: 104, amount: 4 },
    { id: 6, productId: 3, ingredientId: 101, amount: 1 },
    { id: 7, productId: 3, ingredientId: 105, amount: 1 },
    { id: 8, productId: 3, ingredientId: 106, amount: 50 },
    { id: 9, productId: 4, ingredientId: 105, amount: 1 },
    { id: 10, productId: 4, ingredientId: 106, amount: 80 },
    { id: 11, productId: 11, ingredientId: 109, amount: 30 },
    { id: 12, productId: 12, ingredientId: 107, amount: 40 },
    { id: 13, productId: 12, ingredientId: 108, amount: 5 },
  ];

  const categoriesTable = [
    { id: 1, name: "Burger" },
    { id: 2, name: "Gà rán" },
    { id: 3, name: "Món phụ" },
    { id: 4, name: "Đồ uống" },
    { id: 5, name: "Tráng miệng" },
  ];

  const productsTable = [
    {
      id: 1,
      categoryName: "Burger",
      name: "Burger Bò Phô Mai Double",
      price: 65000,
      image_url:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
      is_available: true,
    },
    {
      id: 2,
      categoryName: "Burger",
      name: "Burger Tôm Sốt Tartar",
      price: 55000,
      image_url:
        "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=500",
      is_available: true,
    },
    {
      id: 3,
      categoryName: "Burger",
      name: "Burger Gà Giòn Cay",
      price: 49000,
      image_url:
        "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500",
      is_available: true,
    },
    {
      id: 4,
      categoryName: "Gà rán",
      name: "Gà Rán Sốt Cay Thượng Hạng",
      price: 45000,
      image_url:
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500",
      is_available: true,
    },
    {
      id: 7,
      categoryName: "Món phụ",
      name: "Khoai Tây Chiên Lắc Phô Mai",
      price: 30000,
      image_url:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500",
      is_available: true,
    },
    {
      id: 11,
      categoryName: "Đồ uống",
      name: "Coca Cola Tươi Pepsi",
      price: 15000,
      image_url:
        "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500",
      is_available: true,
    },
    {
      id: 12,
      categoryName: "Đồ uống",
      name: "Trà Đào Đốt Sả Hạt Chia",
      price: 29000,
      image_url:
        "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500",
      is_available: true,
    },
    {
      id: 13,
      categoryName: "Tráng miệng",
      name: "Kem Tươi Vani Sốt Dâu",
      price: 15000,
      image_url:
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500",
      is_available: true,
    },
  ];

  const recipes = flatRecipes.reduce((acc, curr) => {
    if (!acc[curr.productId]) acc[curr.productId] = [];
    acc[curr.productId].push({
      ingredientId: curr.ingredientId,
      amount: curr.amount,
    });
    return acc;
  }, {});

  const categories = categoriesTable.map((cat) => cat.name);
  const currentMenuItems = productsTable.filter(
    (item) => item.categoryName === currentCategory,
  );

  // Router Guard
  useEffect(() => {
    if (!userLogin) navigate("/login");
    else if (userLogin.role !== "staff") navigate("/manager");
  }, [userLogin, navigate]);

  const handleLogout = () =>
    logoutUser(userLogin?.accessToken, dispatch, axiosJWT);

  // ==================== XỬ LÝ LOGIC ĐỒNG BỘ ĐỘNG ====================

  const calculateMaxAvailable = (productId) => {
    const recipe = recipes[productId];
    if (!recipe) return 99;
    let maxParts = Infinity;

    const cartConsumption = {};
    cart.forEach((cartItem) => {
      const itemRecipe = recipes[cartItem.id];
      if (itemRecipe) {
        itemRecipe.forEach((rec) => {
          cartConsumption[rec.ingredientId] =
            (cartConsumption[rec.ingredientId] || 0) +
            rec.amount * cartItem.quantity;
        });
      }
    });

    recipe.forEach((item) => {
      const ing = ingredients.find((i) => i.id === item.ingredientId);
      if (!ing) {
        maxParts = 0;
        return;
      }
      const currentAvailableInStock =
        ing.quantity - (cartConsumption[item.ingredientId] || 0);
      const possibleQuantity = Math.floor(
        currentAvailableInStock / item.amount,
      );
      if (possibleQuantity < maxParts) maxParts = possibleQuantity;
    });

    return maxParts < 0 ? 0 : maxParts;
  };

  // Chọn bàn ăn tại chỗ
  const handleSelectTable = (table) => {
    setIsTakeaway(false);
    setSelectedTable(table);
    // Đồng bộ giỏ hàng trên màn hình với giỏ hàng thực tế đang lưu tại bàn đó
    setCart(table.cart || []);
  };

  // Thêm món vào giỏ
  const handleAddToCart = (product) => {
    if (!product.is_available) return;
    const maxAvailable = calculateMaxAvailable(product.id);

    if (maxAvailable <= 0) {
      alert(`⚠️ KHO KHÔNG ĐỦ NGUYÊN LIỆU cho món [${product.name}]`);
      return;
    }

    let updatedCart = [];
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    } else {
      updatedCart = [
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    }

    setCart(updatedCart);

    // Nếu đang chọn một bàn cụ thể, cập nhật ngay vào trạng thái bàn đó để tránh mất dữ liệu khi đổi tab
    if (!isTakeaway && selectedTable) {
      setTables(
        tables.map((t) =>
          t.id === selectedTable.id
            ? {
                ...t,
                cart: updatedCart,
                subtotal: updatedCart.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0,
                ),
              }
            : t,
        ),
      );
    }
  };

  // Cập nhật số lượng trong giỏ
  const handleUpdateQuantity = (productId, amount) => {
    if (amount === 1 && calculateMaxAvailable(productId) <= 0) {
      alert("⚠️ Không thể chế biến thêm do thiếu nguyên liệu!");
      return;
    }

    let updatedCart = cart
      .map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + amount }
          : item,
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);

    if (!isTakeaway && selectedTable) {
      setTables(
        tables.map((t) =>
          t.id === selectedTable.id
            ? {
                ...t,
                cart: updatedCart,
                subtotal: updatedCart.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0,
                ),
              }
            : t,
        ),
      );
    }
  };

  // LUỒNG 1: GỬI ĐƠN XUỐNG BẾP (Dành cho ăn tại bàn)
  const handleSaveOrderToKitchen = () => {
    if (cart.length === 0 || isTakeaway || !selectedTable) {
      alert("⚠️ Vui lòng chọn bàn ăn tại chỗ và thêm món trước!");
      return;
    }

    // Tìm thông tin phiên bản mới nhất của bàn này trong danh sách states
    const currentTableState = tables.find((t) => t.id === selectedTable.id);

    let itemsToPrint = []; // Danh sách món thực sự cần gửi xuống bếp

    if (currentTableState && currentTableState.status === "occupied") {
      // KỊCH BẢN 1: KHÁCH GỌI THÊM MÓN (BÀN ĐANG OCCUPIED)
      cart.forEach((cartItem) => {
        // Tìm xem món này đã có trong hóa đơn cũ của bàn chưa
        const oldItem = currentTableState.cart?.find(
          (old) => old.id === cartItem.id,
        );

        if (!oldItem) {
          // Nếu là món hoàn toàn mới, gửi toàn bộ số lượng xuống bếp
          itemsToPrint.push({
            name: cartItem.name,
            quantity: cartItem.quantity,
          });
        } else if (cartItem.quantity > oldItem.quantity) {
          // Nếu là món cũ nhưng gọi thêm, chỉ gửi phần số lượng chênh lệch
          itemsToPrint.push({
            name: cartItem.name,
            quantity: cartItem.quantity - oldItem.quantity,
          });
        }
      });

      if (itemsToPrint.length === 0) {
        alert("⚠️ Không có món mới hoặc số lượng tăng thêm để gửi xuống bếp!");
        return; // Chặn đứng hành động gửi trùng lặp dữ liệu
      }
    } else {
      // KỊCH BẢN 2: BÀN TRỐNG VÀ ĐÂY LÀ ĐƠN ĐẦU TIÊN (MỞ BÀN MỚI)
      itemsToPrint = cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      }));
    }

    // ---- TIẾN HÀNH ĐỒNG BỘ DỮ LIỆU SAU KHI ĐÃ LỌC ----

    // 1. Đẩy các món cần chế biến thực tế vào Hàng đợi nhà bếp
    const newKitchenOrder = {
      id: Math.floor(Math.random() * 900) + 100,
      table_number: selectedTable.table_number,
      items: itemsToPrint,
      time: "Vừa xong",
    };
    setKitchenOrders([...kitchenOrders, newKitchenOrder]);

    // 2. Đồng bộ giỏ hàng mới nhất và tổng tiền mới nhất vào Sơ đồ bàn ăn
    const nextSubtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const updatedTables = tables.map((t) =>
      t.id === selectedTable.id
        ? { ...t, status: "occupied", cart: cart, subtotal: nextSubtotal }
        : t,
    );
    setTables(updatedTables);

    // 3. Cập nhật lại state bàn đang chọn trên UI để hiển thị đúng số tiền
    setSelectedTable({
      ...selectedTable,
      status: "occupied",
      cart: cart,
      subtotal: nextSubtotal,
    });

    alert(
      `🔥 Đã gửi đơn gọi thêm món của [${selectedTable.table_number}] xuống Bếp thành công!`,
    );
  };

  // LUỒNG 2: THANH TOÁN HOÀN TẤT & GIẢI PHÓNG BÀN / TRỪ KHO
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Giỏ hàng hiện tại đang trống!");
      return;
    }

    // 1. Khấu trừ nguyên liệu thực tế trong kho
    const updatedIngredients = [...ingredients];
    cart.forEach((cartItem) => {
      const recipe = recipes[cartItem.id];
      if (recipe) {
        recipe.forEach((rec) => {
          const ing = updatedIngredients.find((i) => i.id === rec.ingredientId);
          if (ing) ing.quantity -= rec.amount * cartItem.quantity;
        });
      }
    });
    setIngredients(updatedIngredients);

    // 2. Nếu là ăn tại bàn -> Giải phóng bàn về trạng thái Trống (Available)
    if (!isTakeaway && selectedTable) {
      setTables(
        tables.map((t) =>
          t.id === selectedTable.id
            ? { ...t, status: "available", subtotal: 0, cart: [] }
            : t,
        ),
      );
    }

    // 3. Reset hoàn toàn màn hình Order về trạng thái ban đầu
    setCart([]);
    setDiscountInput(0);
    setSelectedTable(null);
    setIsTakeaway(true);

    alert(
      `🎉 Thanh toán thành công! Hệ thống đã trừ kho và giải phóng dịch vụ.`,
    );
  };

  const handleCompleteKitchenOrder = (id) => {
    setKitchenOrders(kitchenOrders.filter((order) => order.id !== id));
  };

  // Tính toán hóa đơn
  const subTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const taxAmount = Math.round(subTotal * 0.08);
  const discountAmount = Number(discountInput) || 0;
  const totalAmount = Math.max(0, subTotal + taxAmount - discountAmount);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* CỘT 1: SƠ ĐỒ BÀN & MENU */}
      <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
        <header className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Mã NV: #{userLogin?.username || "STFF01"} - Ca làm việc: Quầy
              chính
            </span>
            <h1 className="text-xl font-black text-slate-900 mt-1">
              Màn hình Order & Bán hàng
            </h1>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right border-r border-slate-200 pr-4">
              <p className="text-sm font-bold text-slate-900">
                {userLogin?.fullName || "Phan Si Thanh"}
              </p>
              <p className="text-xs text-slate-400">Nhân viên phục vụ</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 transition-all"
            >
              Đăng xuất 🚪
            </button>
          </div>
        </header>

        {/* Sơ đồ bàn ăn */}
        <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
            📍 Sơ đồ bàn ăn thực tế
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {tables.map((table) => (
              <div
                key={table.id}
                onClick={() => handleSelectTable(table)}
                className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all active:scale-95 ${selectedTable?.id === table.id && !isTakeaway ? "bg-amber-500/10 border-amber-500 text-amber-700 ring-2 ring-amber-500/20 shadow-md" : table.status === "occupied" ? "bg-amber-50 border-amber-300 text-amber-800 font-medium" : "bg-white border-slate-200 hover:border-slate-400 text-slate-700"}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">
                    {table.table_number}
                  </span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${table.status === "occupied" ? "bg-amber-500 animate-pulse" : "bg-slate-300"}`}
                  ></span>
                </div>
                <div className="text-xs font-black mt-2 text-right">
                  {table.status === "occupied"
                    ? `${table.subtotal.toLocaleString("vi-VN")} đ`
                    : "Sẵn sàng"}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories Menu Tab */}
        <section className="flex-1 flex flex-col min-h-0 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCurrentCategory(cat)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${currentCategory === cat ? "bg-amber-500 text-slate-950 shadow-md" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid Thực Đơn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-1 flex-1">
            {currentMenuItems.map((item) => {
              const maxAvailable = calculateMaxAvailable(item.id);
              const isOutOfStock = maxAvailable <= 0;

              return (
                <div
                  key={item.id}
                  onClick={() =>
                    item.is_available && !isOutOfStock && handleAddToCart(item)
                  }
                  className={`group flex flex-col justify-between overflow-hidden rounded-2xl border transition-all bg-white ${item.is_available && !isOutOfStock ? "border-slate-100 shadow-sm hover:-translate-y-1 hover:border-amber-300 hover:shadow-md cursor-pointer" : "border-slate-200 bg-slate-100/50 cursor-not-allowed"}`}
                >
                  <div className="w-full h-40 bg-slate-100 overflow-hidden relative">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${!item.is_available || isOutOfStock ? "grayscale opacity-40" : ""}`}
                    />
                    {(!item.is_available || isOutOfStock) && (
                      <span className="absolute top-2 right-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        Hết hàng
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex flex-col justify-between flex-1">
                    <h4 className="font-bold text-sm text-slate-800 line-clamp-2 min-h-[40px] leading-tight">
                      {item.name}
                    </h4>
                    {recipes[item.id] && (
                      <p
                        className={`text-[11px] mt-1 font-medium ${isOutOfStock ? "text-rose-600" : "text-emerald-600"}`}
                      >
                        {isOutOfStock
                          ? "⚠️ Hết nguyên liệu"
                          : `✨ Có thể làm: ${maxAvailable} phần`}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-50">
                      <span
                        className={`font-extrabold text-sm ${item.is_available && !isOutOfStock ? "text-slate-900" : "text-slate-400"}`}
                      >
                        {item.price.toLocaleString("vi-VN")} đ
                      </span>
                      {item.is_available && !isOutOfStock && (
                        <span className="bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white w-7 h-7 rounded-lg font-bold flex items-center justify-center transition-all">
                          +
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* CỘT 2: NHÀ BẾP VÀ CHI TIẾT THANH TOÁN */}
      <div className="w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-lg">
        {/* Module Hàng đợi nhà bếp */}
        <div className="p-4 border-b border-slate-200 h-1/3 flex flex-col bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2">
            ⏳ Đơn chờ chế biến (Nhà bếp)
            <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {kitchenOrders.length}
            </span>
          </h3>
          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            {kitchenOrders.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-6">
                Hàng đợi trống. Đã phục vụ hết!
              </div>
            ) : (
              kitchenOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col gap-1.5 shadow-sm"
                >
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-mono font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      Mã đơn #{order.id}
                    </span>
                    <span className="text-slate-400">{order.time}</span>
                  </div>
                  <div className="text-xs font-black text-slate-800">
                    {order.table_number}
                  </div>
                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg space-y-0.5">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>• {it.name}</span>
                        <span className="font-bold text-slate-800">
                          x{it.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleCompleteKitchenOrder(order.id)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-1.5 rounded-lg transition-colors"
                  >
                    ✓ Hoàn thành (Giao đồ)
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Khung Chi tiết Hóa đơn */}
        <div className="p-5 flex-1 flex flex-col justify-between bg-white overflow-hidden">
          <div className="space-y-4 flex-1 flex flex-col min-h-0">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              🧾 Thông tin hóa đơn
            </h3>

            {/* Toggle loại đơn */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => {
                  setIsTakeaway(true);
                  setSelectedTable(null);
                  setCart([]);
                }}
                className={`py-1.5 rounded-lg transition-all ${isTakeaway ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              >
                👜 Mang về (Takeaway)
              </button>
              <button
                onClick={() => {
                  if (tables.some((t) => t.status === "occupied"))
                    alert("Hãy chọn trực tiếp bàn ăn trên sơ đồ!");
                }}
                className={`py-1.5 rounded-lg transition-all ${!isTakeaway ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              >
                🍽️ Tại bàn:{" "}
                {selectedTable ? selectedTable.table_number : "Chưa chọn"}
              </button>
            </div>

            {/* Giỏ hàng */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs border-b border-slate-100 pb-2">
              {cart.length === 0 ? (
                <div className="text-center text-slate-400 py-12">
                  Chưa có món ăn nào trong giỏ hàng
                </div>
              ) : (
                cart.map((c) => (
                  <div
                    key={c.id}
                    className="flex justify-between items-center bg-slate-50 p-2 rounded-xl"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{c.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {c.price.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                        <button
                          onClick={() => handleUpdateQuantity(c.id, -1)}
                          className="px-2 py-0.5 text-slate-500 font-bold hover:bg-slate-100 rounded-l-lg"
                        >
                          -
                        </button>
                        <span className="px-2 font-bold text-slate-800">
                          {c.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(c.id, 1)}
                          className="px-2 py-0.5 text-slate-500 font-bold hover:bg-slate-100 rounded-r-lg"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-black text-slate-900 text-right min-w-[70px]">
                        {(c.price * c.quantity).toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Tiền bạc */}
            <div className="space-y-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span className="font-semibold text-slate-800">
                  {subTotal.toLocaleString("vi-VN")} đ
                </span>
              </div>
              <div className="flex justify-between">
                <span>Thuế VAT (8%):</span>
                <span className="font-semibold text-slate-800">
                  {taxAmount.toLocaleString("vi-VN")} đ
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Giảm giá (đ):</span>
                <input
                  type="number"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  className="w-24 text-right border border-slate-200 rounded px-1.5 py-0.5 font-black text-rose-600 bg-white"
                  placeholder="0"
                />
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-dashed border-slate-200">
                <span>Tổng cộng:</span>
                <span className="text-base text-amber-600">
                  {totalAmount.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>
          </div>

          {/* Buttons chức năng */}
          <div className="space-y-3 mt-4 pt-2 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`text-xs font-bold py-2 rounded-xl border ${paymentMethod === "cash" ? "bg-slate-900 text-white" : "bg-white text-slate-600 border-slate-200"}`}
              >
                💵 Tiền mặt
              </button>
              <button
                onClick={() => setPaymentMethod("bank_transfer")}
                className={`text-xs font-bold py-2 rounded-xl border ${paymentMethod === "bank_transfer" ? "bg-slate-900 text-white" : "bg-white text-slate-600 border-slate-200"}`}
              >
                💳 Chuyển khoản
              </button>
            </div>
            <div className="flex gap-2">
              {!isTakeaway && (
                <button
                  onClick={handleSaveOrderToKitchen}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-3 rounded-xl transition-colors"
                >
                  GỬI BẾP CHẾ BIẾN
                </button>
              )}
              <button
                onClick={handleCheckout}
                className="flex-[2] bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3 rounded-xl transition-colors shadow-md"
              >
                THANH TOÁN & IN HÓA ĐƠN
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
