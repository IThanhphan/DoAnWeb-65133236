import { useState } from "react";

export default function RecipeManager() {
  // 1. Danh sách Products
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Burger Bò Phô Mai Double",
      categoryName: "Burger",
      hasRecipe: true,
    },
    {
      id: 2,
      name: "Burger Tôm Sốt Tartar",
      categoryName: "Burger",
      hasRecipe: false,
    },
    {
      id: 3,
      name: "Burger Gà Giòn Cay",
      categoryName: "Burger",
      hasRecipe: true,
    },
    {
      id: 4,
      name: "Khoai Tây Chiên Lắc Phô Mai",
      categoryName: "Món phụ",
      hasRecipe: false,
    },
  ]);

  // 2. Danh sách nguyên liệu trong kho
  const availableIngredients = [
    { id: 1, name: "Thịt bò và vụn bò băm", unit: "kg" },
    { id: 2, name: "Vỏ bánh mì Burger mè", unit: "cái" },
    { id: 3, name: "Phô mai Cheddar lát", unit: "lát" },
    { id: 4, name: "Khoai tây cọng đông lạnh", unit: "kg" },
    { id: 5, name: "Sốt Mayo đặc chế", unit: "lít" },
    { id: 6, name: "Xà lách lolo xanh", unit: "kg" },
  ];

  // State quản lý món ăn đang được chọn
  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  // State lưu danh sách công thức hiện tại
  const [recipeItems, setRecipeItems] = useState([
    { ingredientId: 2, quantityRequired: 1 },
    { ingredientId: 3, quantityRequired: 2 },
  ]);

  // State phụ trợ cho form thêm nguyên liệu mới
  const [addingIngredientId, setAddingIngredientId] = useState("");
  const [addingQuantity, setAddingQuantity] = useState("");

  // Hàm xử lý khi chọn một sản phẩm khác
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    if (product.id === 1) {
      setRecipeItems([
        { ingredientId: 2, quantityRequired: 1 },
        { ingredientId: 3, quantityRequired: 2 },
      ]);
    } else {
      setRecipeItems([]);
    }
  };

  // Thêm nguyên liệu vào công thức
  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (!addingIngredientId || !addingQuantity) return;

    const targetId = parseInt(addingIngredientId);

    const isExisted = recipeItems.some(
      (item) => item.ingredientId === targetId,
    );
    if (isExisted) {
      alert(
        "Nguyên liệu này đã có trong công thức! Hãy chỉnh sửa số lượng trực tiếp bên dưới.",
      );
      return;
    }

    setRecipeItems([
      ...recipeItems,
      {
        ingredientId: targetId,
        quantityRequired: parseFloat(addingQuantity),
      },
    ]);

    setAddingIngredientId("");
    setAddingQuantity("");
  };

  // Cập nhật nhanh số lượng tiêu hao
  const handleQuantityChange = (ingredientId, value) => {
    const updated = recipeItems.map((item) => {
      if (item.ingredientId === ingredientId) {
        return {
          ...item,
          quantityRequired: value === "" ? "" : parseFloat(value),
        };
      }
      return item;
    });
    setRecipeItems(updated);
  };

  // Xóa 1 dòng nguyên liệu ra khỏi công thức
  const handleRemoveIngredient = (ingredientId) => {
    setRecipeItems(
      recipeItems.filter((item) => item.ingredientId !== ingredientId),
    );
  };

  // Gửi Payload lưu công thức về Backend
  const handleSaveRecipe = () => {
    const payload = {
      productId: selectedProduct.id,
      ingredients: recipeItems.map((item) => ({
        ingredientId: item.ingredientId,
        quantityRequired: item.quantityRequired,
      })),
    };

    console.log("POST /api/v1/recipes", payload);
    alert(`Đã lưu công thức cho món: ${selectedProduct.name}`);

    setProducts(
      products.map((p) =>
        p.id === selectedProduct.id ? { ...p, hasRecipe: true } : p,
      ),
    );
    // Cập nhật lại state của object đang select để đồng bộ UI
    setSelectedProduct({ ...selectedProduct, hasRecipe: true });
  };

  // --- THÊM MỚI: HÀM XỬ LÝ XÓA TOÀN BỘ CÔNG THỨC ---
  const handleDeleteRecipe = () => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa TOÀN BỘ công thức định lượng của món "${selectedProduct.name}" không? Hành động này không thể hoàn tác.`,
      )
    ) {
      // Thực tế tương đương gửi request: DELETE /api/v1/recipes/product/{id}
      console.log("DELETE /api/v1/recipes/product/" + selectedProduct.id);

      // 1. Xóa sạch dữ liệu nguyên liệu trên màn hình chi tiết
      setRecipeItems([]);

      // 2. Cập nhật lại danh sách sản phẩm (đổi hasRecipe sang false)
      setProducts(
        products.map((p) =>
          p.id === selectedProduct.id ? { ...p, hasRecipe: false } : p,
        ),
      );

      // 3. Cập nhật trạng thái item đang select hiện tại
      setSelectedProduct({ ...selectedProduct, hasRecipe: false });

      alert(`Đã xóa công thức của món: ${selectedProduct.name}`);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản lý Định lượng & Công thức
          </h1>
          <p className="text-sm text-slate-500">
            Thiết lập lượng tiêu hao nguyên vật liệu trong kho khi bán một món
            ăn
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CỘT TRÁI: DANH SÁCH MÓN ĂN TRÊN THỰC ĐƠN */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 h-[calc(100vh-220px)] flex flex-col">
          <h2 className="text-base font-semibold text-slate-800 mb-3">
            1. Chọn món ăn từ thực đơn
          </h2>
          <div className="overflow-y-auto flex-1 space-y-2 pr-1">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                  selectedProduct?.id === product.id
                    ? "border-amber-500 bg-amber-50/50 text-amber-900 font-medium"
                    : "border-slate-100 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div>
                  <p className="text-sm">{product.name}</p>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    {product.categoryName}
                  </span>
                </div>
                {product.hasRecipe ? (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                    Đã có CT
                  </span>
                ) : (
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    Chưa có
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* CỘT PHẢI: CHI TIẾT CÔNG THỨC & ĐỊNH LƯỢNG */}
        <div className="lg:grid-cols-1 lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-[calc(100vh-220px)]">
          <div className="border-b border-slate-100 pb-4 mb-4">
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">
              Món ăn đang chọn
            </span>
            <h2 className="text-xl font-bold text-slate-800 mt-1">
              {selectedProduct?.name}
            </h2>
          </div>

          {/* Form thêm nguyên liệu nhanh */}
          <form
            onSubmit={handleAddIngredient}
            className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 flex flex-wrap md:flex-nowrap gap-3 items-end"
          >
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Chọn nguyên liệu từ kho
              </label>
              <select
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-amber-500"
                value={addingIngredientId}
                onChange={(e) => setAddingIngredientId(e.target.value)}
                required
              >
                <option value="">-- Chọn nguyên liệu --</option>
                {availableIngredients.map((ing) => (
                  <option key={ing.id} value={ing.id}>
                    {ing.name} ({ing.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-40">
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Định lượng tiêu hao
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  placeholder="0.0"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-amber-500 pr-12"
                  value={addingQuantity}
                  onChange={(e) => setAddingQuantity(e.target.value)}
                  required
                />
                <span className="absolute right-3 top-2 text-xs text-slate-400">
                  {availableIngredients.find(
                    (i) => i.id === parseInt(addingIngredientId),
                  )?.unit || "-"}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="bg-slate-800 hover:bg-slate-900 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors h-[38px] whitespace-nowrap"
            >
              + Thêm vào CT
            </button>
          </form>

          {/* Bảng danh sách cấu thành công thức */}
          <div className="flex-1 overflow-y-auto">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">
              Thành phần nguyên liệu chi tiết:
            </h3>

            {recipeItems.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                Món ăn này chưa được thiết lập công thức tiêu hao vật tư.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-medium border-b border-slate-200">
                      <th className="p-3">Tên nguyên vật liệu</th>
                      <th className="p-3 w-44">Định lượng / 1 món</th>
                      <th className="p-3 w-20 text-center">Đơn vị</th>
                      <th className="p-3 w-16 text-center">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {recipeItems.map((item) => {
                      const details =
                        availableIngredients.find(
                          (ing) => ing.id === item.ingredientId,
                        ) || {};

                      return (
                        <tr
                          key={item.ingredientId}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="p-3 font-medium text-slate-900">
                            {details.name || "Không xác định"}
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              step="0.001"
                              className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 focus:outline-none font-semibold text-amber-700 py-0.5"
                              value={item.quantityRequired}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.ingredientId,
                                  e.target.value,
                                )
                              }
                            />
                          </td>
                          <td className="p-3 text-center text-slate-400 font-medium">
                            {details.unit || "-"}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveIngredient(item.ingredientId)
                              }
                              className="text-rose-500 hover:text-rose-700 text-base"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* --- KHU VỰC ĐƯỢC CHỈNH SỬA: NÚT THAO TÁC LUỒNG ĐỒNG BỘ --- */}
          <div className="border-t border-slate-100 pt-4 mt-4 flex justify-end gap-3">
            {/* Nút Xóa công thức chỉ hiển thị khi sản phẩm hiện tại đã có dữ liệu công thức */}
            {selectedProduct?.hasRecipe && (
              <button
                type="button"
                onClick={handleDeleteRecipe}
                className="bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>🗑️</span> Xóa công thức
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveRecipe}
              className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-sm px-6 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Lưu công thức món ăn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
