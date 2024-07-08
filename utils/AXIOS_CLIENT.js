import axios from "axios";
import Cookies from 'js-cookie';
import { deleteCookie } from ".";
import toast from "react-hot-toast";
import { BASE_URL, ACCESS_TOKEN } from "@/constants/ENVIRONMENT_VARIABLES";
import { LOGIN_ENDPOINT } from "@/constants/API_ENDPOINTS";
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
export const AXIOS_CLIENT = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  cancelToken: source.token,
});

AXIOS_CLIENT.interceptors.request.use(
  (config) => {
    const token = Cookies.get(ACCESS_TOKEN);
    if (token) {
      const { access_token } = JSON.parse(token);
      if (access_token) {
        config.headers["Authorization"] = "Bearer " + access_token;
      }
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

AXIOS_CLIENT.interceptors.response.use(
  (response) => {
    if (
      !response.data.status &&
      response.data.message === "401 - Something Went Wrong ...!"
    ) {
      deleteCookie(ACCESS_TOKEN);
      toast.error("Logging out due to session out.");
      window.location = LOGIN_ROUTE;
    }
    return response;
  },
  async (error) => {
    const config = error.config;
    if (error.response && error.response.status === 401 && config) {
      // Handle the case where config is undefined
      const tokenData = Cookies.get(ACCESS_TOKEN);
      // console.log('axios', tokenData, 'err', config)
      if (tokenData) {
        const { refresh_token } = JSON.parse(tokenData);
        if (refresh_token) {
          try {
            const response = await axios.post(`${BASE_URL + LOGIN_ENDPOINT}`, { token: refresh_token })
            const { access_token } = response?.data;
            const updatedTokenData = { ...JSON.parse(tokenData), access_token };
            Cookies.set(ACCESS_TOKEN, JSON.stringify(updatedTokenData));
            AXIOS_CLIENT.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            config.headers['Authorization'] = `Bearer ${access_token}`;
            return AXIOS_CLIENT(config);
          } catch (error) {
            console.error('Token refresh failed:', error);
            deleteCookie(ACCESS_TOKEN);
            return Promise.reject(error);
          }
        }
      }
      console.error("Request configuration is undefined:", error);
      return Promise.reject(error);
    }
    if (axios.isCancel(error)) {
      // Handle canceled request
      console.log("Request canceled:", error.message);
    } else {
      // Handle other response errors
      console.error("API call failed:", error);
    }
    cancelTokens.delete(config.url);
    if (error.response.status === 401) {
      deleteCookie(ACCESS_TOKEN_KEY);
      toast.error(
        error.response.config.url.toUpperCase() + ": UnAuthorized API Call..."
      );

      toast.error("Logging out due to session out.");
      window.location = LOGIN_ROUTE;
    }
    if (error.response.status === 404) {
      toast.error(
        error.response.config.url.toUpperCase() + ": API Not Found..."
      );
    }

    if (error.response.status === 500) {
      toast.error(
        error.response.config.url.toUpperCase() + ": Something went wrong..."
      );
    }
    return error;
  }
);
