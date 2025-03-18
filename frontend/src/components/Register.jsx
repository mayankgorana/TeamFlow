import React, { useState } from "react";
import { signUp } from "../firebase/firebase";
import { toast } from "react-toastify";

const Register = ({ setAuthType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      await signUp(email, password);
      toast.success("Registered successfully! Please login.");
      setAuthType("login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="auth-content">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
      <p onClick={() => setAuthType("login")} className="toggle-auth">Already have an account? Login</p>
    </div>
  );
};

export default Register;
