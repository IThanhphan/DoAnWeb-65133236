import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { apiName } from "../config/APIname";

const getAccessToken = async () => {
  try {
    const res = await axios.post(
      `${apiName}/auth/refresh`,
      {},
      {
        withCredentials: true,
      },
    );

    return res.data.result;
  } catch (error) {
    console.log(error);
  }
};

export const createAxiosJWT = (user, dispatch, stateSuccess) => {
  const newInstant = axios.create();
  newInstant.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodeToken = jwtDecode(user?.accessToken);
      if (decodeToken.exp < date.getTime() / 1000) {
        const data = await getAccessToken();
        const refreshUser = {
          ...user,
          accessToken: data.accessToken,
        };
        dispatch(stateSuccess(refreshUser));
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    },
  );
  return newInstant;
};
