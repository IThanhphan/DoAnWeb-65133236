import { apiName } from "../config/APIname";

export const getListCategory = async (accessToken, axiosJWT) => {
  try {
    const res = await axiosJWT.get(`${apiName}/categories`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return res.data.result;
  } catch (error) {
    console.error("Lỗi tại API getListCategory:", error);
  }
};

export const getListIngredientCategory = async (accessToken, axiosJWT) => {
  try {
    const res = await axiosJWT.get(`${apiName}/ingredient-categories`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return res.data.result;
  } catch (error) {
    console.error("Lỗi tại API getListIngredientCategory:", error);
  }
};
