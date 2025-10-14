import useAuth from "./useAuth";
import useAxiosPrivate from "./useAxiosPrivate";

const SIGN_OUT_ENDPOINT = "/api/v1/users/sign-out/";

const useSignOut = () => {
  const axiosPrivate = useAxiosPrivate();
  const { setAuth } = useAuth();

  const signOut = async () => {
    localStorage.removeItem("persist");
    localStorage.removeItem("isSignedIn");
    setAuth(null);

    try {
      axiosPrivate.post(
        SIGN_OUT_ENDPOINT,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  return signOut;
};

export default useSignOut;
