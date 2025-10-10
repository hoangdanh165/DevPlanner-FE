import { useEffect } from "react";
import { axiosPrivate } from "@/services/axios";
import useRefreshToken from "@/hooks/useRefreshToken";
import useAuth from "@/hooks/useAuth";
import type {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  sent?: boolean;
}

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    // 🧩 Request interceptor
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        if (!config.headers?.Authorization) {
          const token = auth?.accessToken;
          if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // 🧩 Response interceptor
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const prevRequest = error?.config as CustomAxiosRequestConfig;

        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await refresh();
            console.log("🔄 NEW ACCESS TOKEN:", newAccessToken);

            prevRequest.headers = prevRequest.headers ?? {};
            prevRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            console.error("❌ CAN NOT REFRESH TOKEN:", refreshError);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
