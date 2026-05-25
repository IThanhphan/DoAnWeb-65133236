import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import CategoryFilter from "./CategoryFilter";
import SearchBar from "./SearchBar";
import MenuItemCard from "./MenuItemCard";
import MenuModal from "./MenuModal";
import { createAxiosJWT } from "../../../callAPI/createInstance";
import { login } from "../../../redux/userSlice";
import { getListCategory } from "../../../callAPI/categoriesAPI";
import {
  getListProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../../callAPI/productsAPI";

export default function MenuManager() {
  const userLogin = useSelector((state) => state.user?.currentUser);
  const dispatch = useDispatch();
  const axiosJWT = createAxiosJWT(userLogin, dispatch, login);

  const [categoriesData, setCategoriesData] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingItemId, setEditingItemId] = useState(null);

  const [formValues, setFormValues] = useState({
    categoryId: 1,
    name: "",
    price: "",
    imageUrl: "",
    isAvailable: true,
  });

  const loadProducts = async () => {
    try {
      const resPro = await getListProduct(userLogin?.accessToken, axiosJWT);
      if (resPro) {
        setMenuItems(resPro);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách sản phẩm:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resCate = await getListCategory(userLogin?.accessToken, axiosJWT);
        if (resCate) setCategoriesData(resCate);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    if (userLogin?.accessToken) fetchCategories();
  }, []);

  useEffect(() => {
    (async () => {
      if (userLogin?.accessToken) {
        await loadProducts();
      }
    })();
  }, []);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "Tất cả" ||
      item.categoryId === Number(selectedCategory);
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAvailability = async (id) => {
    const currentItem = menuItems.find((item) => item.id === id);
    if (!currentItem) return;

    try {
      const productPayload = {
        categoryId: Number(currentItem.categoryId),
        name: currentItem.name,
        price: Number(currentItem.price),
        imageUrl: currentItem.imageUrl,
        isAvailable: !currentItem.isAvailable,
      };

      await updateProduct(userLogin.accessToken, axiosJWT, id, productPayload);
      await loadProducts();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái món ăn:", error);
      alert(
        "Không thể cập nhật trạng thái món ăn. Vui lòng kiểm tra lại kết nối hoặc phân quyền!",
      );
    }
  };

  const handleDeleteItem = async (id) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa món ăn này khỏi thực đơn không?",
      )
    ) {
      try {
        await deleteProduct(userLogin.accessToken, axiosJWT, id);
        await loadProducts();

        alert("Xóa món ăn thành công! ✨");
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        alert(
          "Xóa món ăn thất bại, vui lòng kiểm tra lại hệ thống hoặc quyền truy cập.",
        );
      }
    }
  };

  const handleOpenAddModal = () => {
    setModalMode("add");
    setEditingItemId(null);
    setFormValues({
      categoryId: categoriesData[0].id,
      name: "",
      price: "",
      imageUrl: "",
      isAvailable: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setModalMode("edit");
    setEditingItemId(item.id);
    setFormValues({
      categoryId: item.categoryId,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable,
    });
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();

    if (!formValues.name || !formValues.price) {
      alert("Vui lòng điền đầy đủ các trường thông tin bắt buộc!");
      return;
    }

    const productPayload = {
      categoryId: Number(formValues.categoryId),
      name: formValues.name,
      price: Number(formValues.price),
      imageUrl:
        formValues.imageUrl || "https://placehold.co/500x500?text=No+Image",
      isAvailable: formValues.isAvailable,
    };

    if (modalMode === "add") {
      await createProduct(userLogin.accessToken, axiosJWT, productPayload);
      await loadProducts();
    } else {
      await updateProduct(
        userLogin.accessToken,
        axiosJWT,
        editingItemId,
        productPayload,
      );

      await loadProducts();
    }

    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl w-full mx-auto relative">
      {/* Tiêu đề & Nút Thêm Món */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản Lý Thực Đơn
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Cập nhật danh sách món ăn, giá bán và danh mục đồng bộ với hệ thống.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all shadow-md shadow-amber-500/10 active:scale-95"
        >
          <span>➕</span> Thêm món mới
        </button>
      </div>

      {/* Thanh công cụ: Tìm kiếm & Lọc danh mục */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-4">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <CategoryFilter
          categories={categoriesData}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Grid danh sách món ăn */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const categoryObj = categoriesData.find(
              (c) => c.id === item.categoryId,
            );
            return (
              <MenuItemCard
                key={item.id}
                item={item}
                categoryName={categoryObj ? categoryObj.name : "Nút Khác"}
                onToggleAvailability={toggleAvailability}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteItem}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <span className="text-4xl block mb-3">🍽️</span>
          <h3 className="text-base font-bold text-slate-700">
            Không tìm thấy món ăn phù hợp
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Vui lòng thử lại với từ khóa hoặc danh mục khác.
          </p>
        </div>
      )}

      {/* MODAL COMPONENT */}
      <MenuModal
        isOpen={isModalOpen}
        mode={modalMode}
        categories={categoriesData}
        formValues={formValues}
        setFormValues={setFormValues}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
      />
    </div>
  );
}
