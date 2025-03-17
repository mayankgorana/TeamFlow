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
          <li ><a href="#" className="dashboardStyle" onClick={() => setActivePage("dashboard")}><DashboardIcon/><span>Dashboard</span> </a></li>
          <li ><a href="#" className="dashboardStyle" onClick={() => setActivePage("tasks")}><AssignmentIcon/><span>Tasks</span> </a></li>
          <li ><a href="#" className="dashboardStyle"  onClick={() => setActivePage("team-chat")}><GroupsIcon/> <span>Team Chat</span></a></li>
        </ul>

        <button className="logout-button" onClick={() => { logout(); navigate("/"); }}>
        <div className="logout-content">
        <LogoutIcon/><span>Logout</span>  
        </div>
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
