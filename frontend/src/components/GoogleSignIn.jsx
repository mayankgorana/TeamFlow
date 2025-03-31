import React from "react";
import { useNavigate } from "react-router-dom";
import { googleSignIn } from "../firebase/firebase";
import Swal from "sweetalert2";

const GoogleSignIn = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Logged in with Google!",
      });
      navigate("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed!",
        text: error.message,
      });
    }
  };

  return <button onClick={handleGoogleLogin} className="google-btn">Sign in with Google</button>;
};

export default GoogleSignIn;
