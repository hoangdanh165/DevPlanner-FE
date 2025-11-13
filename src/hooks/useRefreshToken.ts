import useAuth from "@/hooks/useAuth";
import axios from "@/services/axios";
import type { AuthData } from "@/types/all_types";

const REFRESH_TOKEN_ENDPOINT = "/api/v1/users/refresh/";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async (): Promise<string> => {
    try {
      const response = await axios.post<AuthData>(
        REFRESH_TOKEN_ENDPOINT,
        {},
        { withCredentials: true }
      );
      console.log("NEW AT: ", response.data.accessToken);

      setAuth(
        (prev: AuthData | null): AuthData => ({
          ...prev,
          ...response.data,
        })
      );

      return response.data.accessToken;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("isSignedIn");
        localStorage.removeItem("last_project");
      }
      throw error;
    }
  };

  return refresh;
};

export default useRefreshToken;
