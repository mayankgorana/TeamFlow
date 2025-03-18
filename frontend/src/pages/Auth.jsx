import React, { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import ResetPassword from "../components/ResetPassword";
import GoogleSignIn from "../components/GoogleSignIn";
import "../styles/Auth.css";

const Auth = () => {
  const [authType, setAuthType] = useState("login");

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-box">
          {authType === "login" && <Login setAuthType={setAuthType} />}
          {authType === "register" && <Register setAuthType={setAuthType} />}
          {authType === "reset" && <ResetPassword setAuthType={setAuthType} />}
        </div>
        <GoogleSignIn />
      </div>
    </div>
  );
};

export default Auth;
