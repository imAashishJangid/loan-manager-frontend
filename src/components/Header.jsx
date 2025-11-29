import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";  // ← ADD THIS

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div 
        className="logo-title" 
        style={{ display: "flex", alignItems: "center", gap: "10px" }}
      >
        <img 
          src={logo}
          alt="Logo"
          style={{ height: "40px", width: "40px", objectFit: "contain" }}
        />
        <h1>Had Finance — Loan CRM</h1>
      </div>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <nav className={`nav ${menuOpen ? "open" : ""}`}>
        <NavLink 
          to="/" 
          onClick={handleNavClick} 
          className={({ isActive }) => isActive ? "btn active" : "btn ghost"}
        >
          Dashboard
        </NavLink>

        <NavLink 
          to="/add" 
          onClick={handleNavClick} 
          className={({ isActive }) => isActive ? "btn active" : "btn ghost"}
        >
          Add Customer
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
