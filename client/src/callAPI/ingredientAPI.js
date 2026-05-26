import { apiName } from "../config/APIname";

export const getListIngredient = async (accessToken, axiosJWT) => {
  try {
    const res = await axiosJWT.get(`${apiName}/ingredients`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return res.data.result;
  } catch (error) {
    console.error("Lỗi tại API getListIngredient:", error);
  }
};

export const createIngredient = async (
  accessToken,
  ingredientData,
  axiosJWT,
) => {
  try {
    const res = await axiosJWT.post(`${apiName}/ingredients`, ingredientData, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data.result;
  } catch (error) {
    console.error("Lỗi tại API createIngredient:", error);
    throw error;
  }
};
