import { apiName } from "../config/APIname";

export const createIngredientTransaction = async (
  accessToken,
  transactionData,
  axiosJWT,
) => {
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
