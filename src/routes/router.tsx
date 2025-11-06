import { lazy, Suspense } from "react";
import { Outlet, createBrowserRouter } from "react-router-dom";
import { rootPaths } from "@/routes/paths";
import paths from "@/routes/paths";

const App = lazy(() => import("@/App"));

// Layouts

// Auth pages
const SignIn = lazy(() => import("@/pages/auth/sign-in/SignIn"));
const SignUp = lazy(() => import("@/pages/auth/sign-up/SignUp"));
const ForgotPassword = lazy(
  () => import("@/pages/auth/forgot-password/ForgotPassword")
);

// Error pages
const NotFound = lazy(() => import("@/pages/error/NotFound"));
const Unauthorized = lazy(() => import("@/pages/error/Unauthorized"));
const Banned = lazy(() => import("@/pages/error/Banned"));
const Forbidden = lazy(() => import("@/pages/error/Forbidden"));

// Home pages
import LandingPage from "@/pages/landing/LandingPage";
import HomePage from "@/pages/common/HomePage";
import HistoryPage from "@/pages/common/HistoryPage";
import UserProfilePage from "@/pages/common/UserProfile";

// Other components
import PrivateRoute from "@/components/utils/PrivateRoute";
import IsSignedIn from "@/components/utils/IsSignedIn";
// import PageLoader from "@/components/utils/PageLoader";
import Splash from "@/components/utils/Splash";
import GithubCallback from "@/pages/auth/github/GithubCallback";
const PersistSignin = lazy(() => import("@/components/utils/PersistSignin"));

const createMainLayoutRoutes = () => (
  // <Suspense fallback={<PageLoader />}>
  <Outlet />
  // </Suspense>
);

const createAuthLayoutRoutes = () => (
  // <Suspense fallback={<PageLoader />}>
  <Outlet />
  // </Suspense>
);
const routes = [
  {
    path: "/",
    element: (
      // <Suspense fallback={<Splash />}>
      <App />
      // </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <PersistSignin>
            <LandingPage />
          </PersistSignin>
        ),
      },
      {
        path: rootPaths.root,
        element: <PersistSignin>{createMainLayoutRoutes()}</PersistSignin>,
        children: [
          {
            path: paths.main,
            element: (
              <PrivateRoute allowedRoles={["user", "admin"]}>
                <HomePage />
              </PrivateRoute>
            ),
          },
          {
            path: paths.history,
            element: (
              <PrivateRoute allowedRoles={["user", "admin"]}>
                <HistoryPage />
              </PrivateRoute>
            ),
          },
          {
            path: paths.user_profile,
            element: (
              <PrivateRoute allowedRoles={["user", "admin"]}>
                <UserProfilePage />
              </PrivateRoute>
            ),
          },
        ],
      },

      {
        path: rootPaths.homeRoot,
        children: [
          {
            path: paths.landing_page,
            element: <PersistSignin>{<LandingPage />}</PersistSignin>,
          },
        ],
      },

      {
        path: rootPaths.authRoot,
        element: createAuthLayoutRoutes(),
        children: [
          {
            path: paths.sign_in,
            element: (
              <IsSignedIn>
                <SignIn />
              </IsSignedIn>
            ),
          },
          {
            path: paths.sign_up,
            element: (
              <IsSignedIn>
                <SignUp />
              </IsSignedIn>
            ),
          },
          {
            path: paths.github_callback,
            element: (
              <IsSignedIn>
                <GithubCallback />
              </IsSignedIn>
            ),
          },
          {
            path: paths.forgot_password,
            element: (
              <IsSignedIn>
                <ForgotPassword />
              </IsSignedIn>
            ),
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },

  {
    path: paths.unauthorized,
    element: <Unauthorized />,
  },
  {
    path: paths.forbidden,
    element: <Forbidden />,
  },
  {
    path: paths.banned,
    element: <Banned />,
  },
];

const options = {
  basename: "",
};

const router = createBrowserRouter(routes, options);

export default router;
