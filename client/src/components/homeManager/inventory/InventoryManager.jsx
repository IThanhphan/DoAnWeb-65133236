import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import InventoryHeader from "./InventoryHeader";
import InventoryFilters from "./InventoryFilters";
import InventoryTable from "./InventoryTable";
import AddItemModal from "./AddItemModal";
import AdjustStockModal from "./AdjustStockModal";
import HistoryLogModal from "./HistoryLogModal";
import { createAxiosJWT } from "../../../callAPI/createInstance";
import { login } from "../../../redux/userSlice";
import { getListIngredientCategory } from "../../../callAPI/categoriesAPI";
import {
  getListIngredient,
  createIngredient,
} from "../../../callAPI/ingredientAPI"; // 1. Import hàm API

export default function InventoryManager() {
  const userLogin = useSelector((state) => state.user?.currentUser);
  const dispatch = useDispatch();
  const axiosJWT = createAxiosJWT(userLogin, dispatch, login);

  // State Bộ lọc & Tìm kiếm
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // State điều khiển UI Modals
  const [activeModal, setActiveModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState("NHẬP");

  const [categories, setCategories] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);

  const [formValues, setFormValues] = useState({
    code: "",
    ingredientCategoryId: 1,
    name: "",
    stockQuantity: "",
    unit: "kg",
    minRequiredQuantity: "",
  });

  const mockHistoryLog = {
    1: [
      {
        id: 101,
        date: "24/05/2026 10:30",
        type: "XUẤT",
        qty: -1.5,
        note: "Xuất kho chế biến ca sáng",
      },
      {
        id: 102,
        date: "23/05/2026 14:00",
        type: "NHẬP",
        qty: 6.0,
        note: "Nhà cung cấp giao hàng đợt 1",
      },
    ],
    2: [
      {
        id: 201,
        date: "24/05/2026 08:15",
        type: "NHẬP",
        qty: 100,
        note: "Nhập bánh tươi đầu ngày",
      },
    ],
  };

  const loadIngredients = async () => {
    try {
      const resPro = await getListIngredient(userLogin?.accessToken, axiosJWT);
      if (resPro) {
        setInventoryItems(resPro);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách sản phẩm:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resCate = await getListIngredientCategory(
          userLogin?.accessToken,
          axiosJWT,
        );
        if (resCate) {
          setCategories(resCate);
          if (resCate.length > 0) {
            setFormValues((prev) => ({
              ...prev,
              ingredientCategoryId: resCate[0].id,
            }));
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    if (userLogin?.accessToken) fetchCategories();
  }, []);

  useEffect(() => {
    (async () => {
      if (userLogin?.accessToken) {
        await loadIngredients();
      }
    })();
  }, []);

  // Helper xác định trạng thái tồn kho
  const getStockStatus = (item) => {
    if (item.stockQuantity === 0)
      return {
        label: "Hết hàng",
        color: "text-rose-600 bg-rose-50 border-rose-200",
        type: "out",
      };
    if (item.stockQuantity <= item.minRequiredQuantity)
      return {
        label: "Sắp hết (Cần nhập)",
        color: "text-amber-600 bg-amber-50 border-amber-200",
        type: "low",
      };
    return {
      label: "An toàn",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      type: "safe",
    };
  };

  // Filter Logic
  const filteredItems = inventoryItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "Tất cả" ||
      item.ingredientCategory?.name === selectedCategory;
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code?.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getStockStatus(item);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "low" && status.type === "low") ||
      (statusFilter === "out" && status.type === "out");
    return matchesCategory && matchesSearch && matchesStatus;
  });

  const handleOpenAddModal = () => {
    const maxId =
      inventoryItems.length > 0
        ? Math.max(...inventoryItems.map((item) => item.id || 0))
        : 0;
    const nextCode = `NVL-${String(maxId + 1).padStart(3, "0")}`;
    setFormValues({
      code: nextCode,
      ingredientCategoryId: categories[0]?.id || 1,
      name: "",
      stockQuantity: "",
      unit: "kg",
      minRequiredQuantity: "",
    });
    setActiveModal("add");
  };

  const handleOpenAdjust = (type, item = null) => {
    setActionType(type);
    setSelectedItem(item || inventoryItems[0]);
    setActiveModal("adjust");
  };

  const handleDeleteItem = (id, name) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa nguyên liệu "${name}" ra khỏi danh mục kho không?\nHành động này không thể hoàn tác.`,
      )
    ) {
      setInventoryItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // 3. ĐÂY CHÍNH LÀ HÀM BẠN CẦN: Gọi gán API createIngredient giống hệt handleSaveItem
  const handleSaveIngredient = async (e) => {
    e.preventDefault();

    if (
      !formValues.code ||
      !formValues.name ||
      formValues.stockQuantity === "" ||
      formValues.minRequiredQuantity === ""
    ) {
      alert("Vui lòng điền đầy đủ tất cả các trường thông tin bắt buộc!");
      return;
    }

    // Đóng gói dữ liệu ép kiểu số chuẩn theo Postman JSON của bạn
    const ingredientPayload = {
      code: formValues.code,
      ingredientCategoryId: Number(formValues.ingredientCategoryId),
      name: formValues.name,
      stockQuantity: Number(formValues.stockQuantity),
      unit: formValues.unit,
      minRequiredQuantity: Number(formValues.minRequiredQuantity),
    };

    try {
      await createIngredient(
        userLogin?.accessToken,
        ingredientPayload,
        axiosJWT,
      );

      await loadIngredients();

      alert("Thêm mới nguyên liệu vào kho thành công! 🎉");
      setActiveModal(null);
    } catch (error) {
      console.error("Lỗi khi thêm nguyên liệu:", error);
      alert("Thêm nguyên liệu thất bại, vui lòng kiểm tra lại hệ thống.");
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl w-full mx-auto relative text-slate-700">
      <InventoryHeader
        onOpenAddModal={handleOpenAddModal}
        onOpenAdjustModal={handleOpenAdjust}
      />

      <InventoryFilters
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <InventoryTable
        filteredItems={filteredItems}
        getStockStatus={getStockStatus}
        onOpenAdjust={handleOpenAdjust}
        onOpenHistory={(item) => {
          setSelectedItem(item);
          setActiveModal("history");
        }}
        onDelete={handleDeleteItem}
      />

      {/* 4. Truyền formValues, setFormValues và hàm handleSaveIngredient xuống Modal */}
      {activeModal === "add" && (
        <AddItemModal
          categories={categories}
          formValues={formValues}
          setFormValues={setFormValues}
          onSave={handleSaveIngredient}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "adjust" && selectedItem && (
        <AdjustStockModal
          actionType={actionType}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          inventoryItems={inventoryItems}
          setInventoryItems={setInventoryItems}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "history" && selectedItem && (
        <HistoryLogModal
          selectedItem={selectedItem}
          mockHistoryLog={mockHistoryLog}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
