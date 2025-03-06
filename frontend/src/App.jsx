import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./components/Dashboard";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Dashboard /> :<Auth />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Auth/>} />
      </Routes>
    </Router>
  );
};

export default App;
