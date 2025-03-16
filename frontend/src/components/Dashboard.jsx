import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../firebase/firebase";
import Tasks from "./Tasks";
import TeamChat from "./TeamChat";
import LogoutIcon from '@mui/icons-material/Logout';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from '@mui/icons-material/Dashboard';
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
          <li className="dashboardStyle"><DashboardIcon/><a href="#" onClick={() => setActivePage("dashboard")}> Dashboard</a></li>
          <li className="dashboardStyle"><AssignmentIcon/><a href="#" onClick={() => setActivePage("tasks")}> Tasks</a></li>
          <li className="dashboardStyle"><GroupsIcon/><a href="#" onClick={() => setActivePage("team-chat")}> Team Chat</a></li>
        </ul>

        <button className="logout-button" onClick={() => { logout(); navigate("/"); }}>
        <LogoutIcon/>  Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activePage === "dashboard" && <h1>Welcome, {user ? user.displayName || user.email : "Guest"}!</h1>}
        {activePage === "tasks" && <Tasks />} {/* Load Tasks Component */}
        {activePage === "team-chat" && <TeamChat />} {/* Load TeamChat Component */}
      </div>
    </div>
  );
};

export default Dashboard;
