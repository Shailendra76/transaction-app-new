import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Homepage from "./Homepage";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
         <Navbar />
      <Routes>
        
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Homepage />} />
      </Routes>
    </Router>
  );
}

export default App;

// Signup.js


// Login.js


// Dashboard.js

