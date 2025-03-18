import React, { useState } from "react";
import { resetPassword } from "../firebase/firebase";
import { toast } from "react-toastify";

const ResetPassword = ({ setAuthType }) => {
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Enter your email to reset password!");
      return;
    }
    try {
      await resetPassword(email);
      toast.success("Password reset email sent!");
      setAuthType("login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="auth-content">
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">Send Reset Link</button>
      </form>
      <p onClick={() => setAuthType("login")} className="toggle-auth">Back to Login</p>
    </div>
  );
};

export default ResetPassword;
