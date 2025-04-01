import React from "react";
import { useNavigate } from "react-router-dom";
import { googleSignIn } from "../firebase/firebase";
import { toast } from "react-toastify";

const GoogleSignIn = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
      toast.success("Logged in with Google!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return <button onClick={handleGoogleLogin} className="google-btn">Sign in with Google</button>;
};

export default GoogleSignIn;
