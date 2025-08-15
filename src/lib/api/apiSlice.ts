import {
  getDecryptedData,
  setEncryptedData,
} from "@/app/(auth)/login/lib/crypto/encryption";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { message } from "antd";
import Cookies from "js-cookie";
import tags from "../tags";
import { BASE_URL } from "@/constant/Defaults";

// const apis = {
//   sefat: "http://192.168.0.108:5000/api",
//   local: "http://localhost:5000/api",
//   live: "https://api.suddha.com.bd/api",
// };

// export const BASE_URL_DEV = BASE_URL;
export const BASE_URL_DEV = BASE_URL;

// Create base query with automatic token inclusion
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL_DEV,
  prepareHeaders: (headers, { getState }) => {
    const token = getDecryptedData("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Add re-authentication handling for 403 errors
const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Check for 401 (Unauthorized) status
  if (result.meta?.response?.status === 401) {
    const token = getDecryptedData("token");
    const sessionId = getDecryptedData("sessionId"); // Ensure you store sessionId securely
    const refreshToken = getDecryptedData("refreshToken"); // Ensure you store sessionId securely

    // Attempt to refresh the token
    const refreshResponse: any = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
        body: { sessionId, refreshToken },
      },
      api,
      extraOptions,
    );

    console.log({
      refreshResponse,
      sessionId,
      refreshToken,
    });

    if (refreshResponse.meta?.response?.status === 200) {
      // Successfully refreshed token, update token and retry request
      const newToken = refreshResponse?.data?.accessToken;

      // Store the new token securely
      setEncryptedData("token", newToken, 1);
      // Cookies.set("refreshToken", refreshResponse.data.refreshToken);

      // Retry the original request with the new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Both access token and refresh token are invalid, logout user
      message.error("Session expired. Please log in again.");
      localStorage.removeItem("userData");
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      Cookies.remove("sessionId");
      // window.location.href = "/login";
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: tags,
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    // Define your endpoints here
  }),
});

export const {} = apiSlice;
