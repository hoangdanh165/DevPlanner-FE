import useAuth from "./useAuth";
import useAxiosPrivate from "./useAxiosPrivate";
import Cookies from "js-cookie";
const SIGN_OUT_ENDPOINT = "/api/v1/users/sign-out/";

const useSignOut = () => {
  const axiosPrivate = useAxiosPrivate();
  const { setAuth } = useAuth();

  const signOut = async () => {
    localStorage.removeItem("persist");
    localStorage.removeItem("isSignedIn");
    localStorage.removeItem("last_project");

    try {
      await axiosPrivate.post(
        SIGN_OUT_ENDPOINT,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error(err);
    }

    await new Promise<void>((resolve) => {
      Cookies.set("alertShown", "true", { path: "/", expires: 1 });

      setAuth(null);
      requestAnimationFrame(() => resolve());
    });
  };

  return signOut;
};

export default useSignOut;
