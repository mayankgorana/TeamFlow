import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../firebase/firebase";
import "../styles/App.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>TeamFlow</h2>
        <ul>
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Tasks</a></li>
          <li><a href="#">Team Chat</a></li>
          <li><a href="#">Notifications</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Welcome, {user ? user.displayName || user.email : "Guest"}!</h1>
        <button className="logout-button" onClick={() => { logout(); navigate("/"); }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
