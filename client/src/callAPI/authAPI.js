import axios from "axios"
import { apiName } from "../config/APIname"
import { login } from "../redux/userSlice"
import { jwtDecode } from "jwt-decode";

export const loginUser = async(user, dispatch, navigate) => {
  try {
    const res = await axios.post(`${apiName}/auth/login`, user, {
      withCredentials: true
    })
    dispatch(login(res.data.result))

    const decodeToken = jwtDecode(res.data.result.accessToken)

    if (decodeToken.role === "manager")
      navigate("/manager")
    else
      navigate("/staff")
  } catch (error) {
    console.log(error)
  }
}