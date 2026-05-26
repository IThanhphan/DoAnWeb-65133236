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
} from "../../../callAPI/ingredientAPI";
import {
  createIngredientTransaction,
  getHistoryIngredientTransaction,
} from "../../../callAPI/inventoryAPI";

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

  const [historyLog, setHistoryLog] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const [formValues, setFormValues] = useState({
    code: "",
    ingredientCategoryId: 1,
    name: "",
    stockQuantity: "",
    unit: "kg",
    minRequiredQuantity: "",
  });

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

  const handleSaveAdjustStock = async (inputQty, note) => {
    const numQty = parseFloat(inputQty);
    if (isNaN(numQty) || numQty < 0) {
      alert("Vui lòng nhập số lượng hợp lệ!");
      return;
    }

    let finalTransactionQty = numQty;

    // Nếu nghiệp vụ là KIỂM_KHO: Tính toán lượng chênh lệch (Delta) để gửi lên API
    if (actionType === "KIỂM_KHO") {
      const currentStock = selectedItem?.stockQuantity || 0;
      finalTransactionQty = numQty - currentStock;

      if (finalTransactionQty === 0) {
        alert(
          "Số lượng thực tế bằng khớp với số tồn hệ thống. Không cần tạo phiếu điều chỉnh!",
        );
        return;
      }
    }

    const transactionPayload = {
      ingredientId: Number(selectedItem.id),
      quantity: Number(finalTransactionQty),
      note:
        note ||
        `${actionType === "NHẬP" ? "Nhập thêm hàng" : "Điều chỉnh sau kiểm kho"} từ giao diện quản lý`,
    };

    try {
      await createIngredientTransaction(
        userLogin?.accessToken,
        transactionPayload,
        axiosJWT,
      );
      await loadIngredients();

      alert("Cập nhật dữ liệu thẻ kho thành công! 🚀");
      setActiveModal(null);
    } catch (error) {
      console.error("Lỗi khi tạo giao dịch kho:", error);
      alert("Thao tác thất bại, vui lòng kiểm tra lại kết nối API hệ thống.");
    }
  };

  const handleOpenHistory = async (item) => {
    setSelectedItem(item);
    setActiveModal("history");
    setIsHistoryLoading(true);
    setHistoryLog([]); 

    try {
      const res = await getHistoryIngredientTransaction(
        userLogin?.accessToken,
        item.id,
        axiosJWT,
      );
      if (res) {
        setHistoryLog(res);
      }
    } catch (error) {
      console.log(error);
      alert("Không thể tải lịch sử giao dịch của vật tư này.");
    } finally {
      setIsHistoryLoading(false);
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
        onOpenHistory={handleOpenHistory}
        onDelete={handleDeleteItem}
      />

      {activeModal === "add" && (
        <AddItemModal
          categories={categories}
          formValues={formValues}
          setFormValues={setFormValues}
          onSave={handleSaveIngredient}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* 3. Truyền hàm xử lý sự kiện qua prop onSave xuống AdjustStockModal */}
      {activeModal === "adjust" && selectedItem && (
        <AdjustStockModal
          actionType={actionType}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          inventoryItems={filteredItems}
          onSave={handleSaveAdjustStock}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "history" && selectedItem && (
        <HistoryLogModal
          selectedItem={selectedItem}
          historyLog={historyLog}
          isLoading={isHistoryLoading}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
