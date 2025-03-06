import React, { useState } from "react";
import { resetPassword } from "../firebase/firebase";
import { toast } from "react-toastify";

const ResetPassword = ({ setAuthType }) => {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
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
    <div className="auth-container">
      <h2>Reset Password</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button onClick={handleReset}>Send Reset Link</button>
      <p onClick={() => setAuthType("login")} className="toggle-auth">Back to Login</p>
    </div>
  );
};

export default ResetPassword;
