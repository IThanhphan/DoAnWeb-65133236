import { apiName } from "../config/APIname";

export const createIngredientTransaction = async (
  accessToken,
  transactionData,
  axiosJWT,
) => {
  console.log(transactionData);
  try {
    const res = await axiosJWT.post(
      `${apiName}/inventory-transactions/import`,
      transactionData,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    return res.data.result;
  } catch (error) {
    console.error("Lỗi tại API createIngredientTransaction:", error);
    throw error;
  }
};

export const getHistoryIngredientTransaction = async (accessToken, ingredientId, axiosJWT) => {
  try {
    const res = await axiosJWT.get(
      `${apiName}/inventory-transactions/ingredient/${ingredientId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return res.data.result;
  } catch (error) {
    console.error("Lỗi tại API getHistoryIngredientTransaction:", error);
    throw error;
  }
};
