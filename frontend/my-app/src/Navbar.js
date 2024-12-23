import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">TransactionApp</div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        {!token && <Link to="/signup">Signup</Link>}
        {!token && <Link to="/login">Login</Link>}
        {token && <Link to="/dashboard">Dashboard</Link>}
        {token && <button className="logout-button" onClick={handleLogout}>Logout</button>}
      </div>
    </nav>
  );
}

export default Navbar;