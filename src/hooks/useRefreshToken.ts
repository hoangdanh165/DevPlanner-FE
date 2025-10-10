import useAuth from "@/hooks/useAuth";
import axios from "@/services/axios";

const REFRESH_URL = "/api/v1/users/refresh/";

interface RefreshResponse {
  role: string;
  accessToken: string;
  avatar?: string;
  status?: number;
  fullName?: string;
  email?: string;
  address?: string;
  phone?: string;
  userId: string;
}

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async (): Promise<string> => {
    try {
      const response = await axios.post<RefreshResponse>(
        REFRESH_URL,
        {},
        { withCredentials: true }
      );

      setAuth((prev) => ({
        ...prev,
        role: response.data.role,
        accessToken: response.data.accessToken,
        avatar: response.data.avatar,
        status: response.data.status,
        fullName: response.data.fullName,
        email: response.data.email,
        address: response.data.address,
        phone: response.data.phone,
        userId: response.data.userId,
      }));

      return response.data.accessToken;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("isSignedIn");
      }
      throw error;
    }
  };

  return refresh;
};

export default useRefreshToken;
