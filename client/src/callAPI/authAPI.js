import axios from "axios";
import { apiName } from "../config/APIname";
import { login, logout } from "../redux/userSlice";
import { jwtDecode } from "jwt-decode";

export const loginUser = async (user, dispatch, navigate) => {
  const res = await axios.post(`${apiName}/auth/login`, user, {
    withCredentials: true,
  });
  const decodeToken = jwtDecode(res.data.result.accessToken);
  const currentUser = {
    ...res.data.result,
    role: decodeToken.role,
  };
  dispatch(login(currentUser));

  if (decodeToken.role === "manager") navigate("/manager");
  else navigate("/staff");
};

export const logoutUser = async (accessToken, dispatch, axiosJWT) => {
  try {
    await axiosJWT.post(
      `${apiName}/auth/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      },
    );
    dispatch(logout());
  } catch (error) {
    console.error("Lỗi tại API logoutUser:", error);
  }
};
