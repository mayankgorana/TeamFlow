import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../firebase/firebase";
import { toast } from "react-toastify";

const Login = ({ setAuthType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="auth-container1">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <p onClick={() => setAuthType("reset")} className="forgot-password">Forgot Password?</p>
      <p onClick={() => setAuthType("register")} className="toggle-auth">Don't have an account? Register</p>
    </div>
  );
};

export default Login;
