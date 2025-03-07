import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../firebase/firebase";
import Tasks from "./Tasks"; // Import Tasks component
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>TeamFlow</h2>
        <ul>
          <li><a href="#" onClick={() => setActivePage("dashboard")}>Dashboard</a></li>
          <li><a href="#" onClick={() => setActivePage("tasks")}>Tasks</a></li>
          <li><a href="#">Team Chat</a></li>
          <li><a href="#">Notifications</a></li>
        </ul>

        <button className="logout-button" onClick={() => { logout(); navigate("/"); }}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activePage === "dashboard" && <h1>Welcome, {user ? user.displayName || user.email : "Guest"}!</h1>}
        {activePage === "tasks" && <Tasks />} {/* Load Tasks Component */}
      </div>
    </div>
  );
};

export default Dashboard;
