import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>TeamFlow</h2>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/tasks">Tasks</Link></li>
        <li><Link to="/chat">Chat</Link></li>
        <li><Link to="/notifications">Notifications</Link></li>
        <li><button onClick={() => auth.signOut()}>Logout</button></li>
      </ul>
    </div>
  );
};

export default Sidebar;
