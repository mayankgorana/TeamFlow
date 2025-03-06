import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../firebase/firebase";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  return (
    <div className="dashboard">
      <h1>Welcome, {user ? user.displayName || user.email : "Guest"}!</h1>
      <button onClick={() => { logout(); navigate("/"); }}>Logout</button>
    </div>
  );
};

export default Dashboard;
