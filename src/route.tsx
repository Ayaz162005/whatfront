import * as React from "react";

import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmailVerify from "./pages/EmailVerify";
import PhoneVerify from "./pages/PhoneVerify";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "resetPassword",
    element: <ResetPassword />,
  },
  {
    path: "forgotpassword",
    element: <ForgotPassword />,
  },

  {
    path: "email-verify",
    element: <EmailVerify />,
  },
  {
    path: "phone-verify",
    element: <PhoneVerify />,
  },
  {
    path: "about",
    element: <div>About</div>,
  },
]);
