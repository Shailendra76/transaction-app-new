import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";  // Import the CSS file

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/signup", { email, password });
      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      alert("Error signing up: " + err.message);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <input
          className="signup-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="signup-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="signup-btn" type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
