import axios from "axios";
import storage from "./storage";
import toast from "react-hot-toast";
import { API_CODE_MESSAGES } from "./constants/messages.constants";
let retry = true;
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BAKEND_API,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const JWT_TOKEN = storage.getAccessToken();
    if (JWT_TOKEN) {
      config.headers.Authorization = `Bearer ${JWT_TOKEN}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log(error);
    const originalConfig = error.config;

    if (!window.navigator.onLine) {
      toast.error(API_CODE_MESSAGES.OFFLINE, {
        toastId: "NO_INTERNET",
      });
    } else if (error.response.status === 401) {
      if (retry) {
        retry = false;
        try {
          const res = await axios.post(
            `${process?.env?.REACT_APP_BACKEND_API}/user/refresh`,
            {
              refresh_token: storage.getRefreshToken(),
            }
          );
          const { access_token, refresh_token } = res.data;
          storage.setAccessToken(access_token);
          storage.setRefreshToken(refresh_token);
          storage.setUserInfo(res?.data);
          return axiosInstance(originalConfig);
        } catch (err) {
          toast.error(API_CODE_MESSAGES[401]);
          storage.userLogoutAction();
          // window.location = `/${ROUTES_PATH.LOGIN}`
          return Promise.reject(err);
        }
      } else {
        storage.userLogoutAction();
        // window.location = `/${ROUTES_PATH.LOGIN}`
      }
    } else if (error.response.status === 400) {
      toast.error(error.response?.data?.message || API_CODE_MESSAGES[400], {
        toastId: "error_400",
      });
    }
    if (error.response.status === 404) {
      toast.error(error.response?.data?.message || API_CODE_MESSAGES[404], {
        toastId: "error_404",
      });
    } else if (error.response.status === 406) {
      toast.error(error.response?.data?.message || API_CODE_MESSAGES[406], {
        toastId: "error_406",
      });
    } else if (error.response.status === 409) {
      toast.error(error.response?.data?.message || API_CODE_MESSAGES[409], {
        toastId: "error_409",
      });
    } else if (error.response.status === 500) {
      toast.error(error.response?.data?.message || API_CODE_MESSAGES[500], {
        toastId: "error_500",
      });
    }
    return Promise.reject(error);
  }
);

export async function get(url, config = {}) {
  return await axiosInstance
    .get(url, { ...config })
    .then((response) => response.data);
}
export async function post(url, data, config = {}) {
  return axiosInstance
    .post(url, { ...data }, { ...config })
    .then((response) => {
      return response.data;
    });
}

export async function put(url, data, config = {}) {
  return axiosInstance
    .put(url, { ...data }, { ...config })
    .then((response) => response.data);
}

export async function patch(url, data, config = {}) {
  return axiosInstance
    .patch(url, { ...data }, { ...config })
    .then((response) => response.data);
}

export async function del(url, config = {}) {
  return await axiosInstance
    .delete(url, { ...config })
    .then((response) => response.data);
}
export default axiosInstance;
