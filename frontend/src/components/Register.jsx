import React, { useState } from "react";
import { signUp } from "../firebase/firebase";
import Swal from "sweetalert2";

const Register = ({ setAuthType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match!",
      });
      return;
    }
    try {
      await signUp(email, password);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Registered successfully! Please login.",
      });
      setAuthType("login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed!",
        text: error.message,
      });
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
