import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import {
  CssBaseline,
  Experimental_CssVarsProvider as CssVarsProvider,
} from "@mui/material";
import router from "./routes/router";
import "./index.css";
import { AuthProvider } from "./contexts/AuthProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { RecoilRoot } from "recoil";
import { SocketContextProvider } from "./contexts/SocketContext";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

const rootElement = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <CssVarsProvider>
          <CssBaseline />
          <AuthProvider>
            <SocketContextProvider>
              {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
              <RouterProvider router={router} />
              {/* </LocalizationProvider> */}
            </SocketContextProvider>
          </AuthProvider>
        </CssVarsProvider>
      </GoogleOAuthProvider>
    </RecoilRoot>
  </React.StrictMode>
);
