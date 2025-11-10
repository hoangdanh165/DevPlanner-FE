import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material";
import router from "@/routes/router";
import "./index.css";
import { AuthProvider } from "@/contexts/AuthProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { RecoilRoot } from "recoil";
import { SocketProvider } from "@/contexts/SocketContext";
import { ThemeProvider, useThemeContext } from "@/themes/theme";
import { ToastProvider } from "@/contexts/ToastProvider";
import { GenerationProvider } from "@/contexts/GenerationContext";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

function AppWithTheme() {
  const { theme } = useThemeContext();
  const muiTheme = createTheme(theme);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <ToastProvider>
        {/* <CssVarsProvider> */}
        <CssBaseline />
        <AuthProvider>
          <GenerationProvider>
            <SocketProvider>
              {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
              <RouterProvider router={router} />
              {/* </LocalizationProvider> */}
            </SocketProvider>
          </GenerationProvider>
        </AuthProvider>
        {/* </CssVarsProvider> */}
      </ToastProvider>
    </MuiThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <RecoilRoot>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <ThemeProvider>
        <AppWithTheme />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </RecoilRoot>
  // </React.StrictMode>
);
