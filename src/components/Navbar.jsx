import React from "react";
import "./Navbar.css";
// Change the import path to use the correct logo location
import logo from "../logo.svg"; // Using the existing SVG logo instead of PNG

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="logo" />
        <div className="navbar-title">
          <div className="capstone-title">CAPSTONE PROJECT GROUP 2</div>
          <h2>KNUST Symptom Checker AI Project</h2>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
