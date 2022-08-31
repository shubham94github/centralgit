import axios from "axios";
import { base64Encoder } from "@utils/base64Encoder";
import {
  clearSessionStorage,
  getItemFromSessionStorage,
} from "@utils/sessionStorage";
import { getItemFromStorage, setItemToStorage } from "@utils/storage";
import { getItemFromLocalStorage } from "@utils/localStorage";
import FormData from "form-data";
const { SERVER_URL } = process.env;
const { CLIENT_ID } = process.env;
const { CLIENT_SECRET } = process.env;

export const client = axios.create({ baseURL: SERVER_URL });

const authHandler = (config) => {
  const rememberMe =
    getItemFromLocalStorage("rememberMe") ||
    getItemFromSessionStorage("rememberMe");
  const sessionToken = getItemFromStorage("accessToken", rememberMe);

  const newConfig = {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${sessionToken}`,
    },
  };

  return Promise.resolve(newConfig);
};

const respHandler = (res) => res.data;

const respErrorHandler = async (error) => {
  const sessionRefreshToken = getItemFromStorage("refreshToken");

  if (error.response.status === 401 && sessionRefreshToken) {
    const body = new FormData();

    body.set("grant_type", "refresh_token");
    body.set("refresh_token", sessionRefreshToken);

    return axios({
      method: "post",
      url: `${SERVER_URL}/oauth/token`,
      data: body,
      headers: {
        Authorization: `Basic ${base64Encoder(CLIENT_ID, CLIENT_SECRET)}`,
      },
    })
      .then(
        ({
          data: { access_token: accessToken, refresh_token: refreshToken },
        }) => {
          clearSessionStorage();
          setItemToStorage("accessToken", accessToken);
          setItemToStorage("refreshToken", refreshToken);

          error.config.headers.Authorization = `Bearer ${accessToken}`;

          return client.request(error.config);
        }
      )
      .catch((refreshError) => {
        if (refreshError.response.status === 400) clearSessionStorage();

        return Promise.reject(error.response.data);
      });
  }

  return Promise.reject(error.response.data);
};

client.interceptors.request.use(authHandler);
client.interceptors.response.use(respHandler, respErrorHandler);
