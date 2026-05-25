import { apiName } from "../config/APIname";

export const getListProduct = async (accessToken, axiosJWT) => {
  try {
    const res = await axiosJWT.get(`${apiName}/products`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return res.data.result;
  } catch (error) {
    console.error("Lỗi tại API getListProduct:", error);
  }
};

export const createProduct = async (accessToken, axiosJWT, productData) => {
  try {
    const res = await axiosJWT.post(`${apiName}/products`, productData, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data.result;
  } catch (error) {
    console.error("Lỗi tại API createProduct:", error);
  }
};

export const updateProduct = async (accessToken, axiosJWT, id, productData) => {
  try {
    const res = await axiosJWT.put(`${apiName}/products/${id}`, productData, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data.result;
  } catch (error) {
    console.error("Lỗi tại API updateProduct:", error);
  }
};

export const deleteProduct = async (accessToken, axiosJWT, id) => {
  try {
    const res = await axiosJWT.delete(`${apiName}/products/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data.result;
  } catch (error) {
    console.error(`Lỗi tại API deleteProduct (id: ${id}):`, error);
  }
};
