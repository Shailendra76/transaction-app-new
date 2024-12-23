// Homepage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <h1>Welcome to Transaction Management</h1>
      <div className="homepage-buttons">
        <button className="icon-button" onClick={() => navigate("/signup")}>Signup</button>
        <button className="icon-button" onClick={() => navigate("/login")}>Login</button>
        <button className="icon-button" onClick={() => navigate("/dashboard")}>Dashboard</button>
      </div>
    </div>
  );
}

export default Homepage;

