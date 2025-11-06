import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { loadData, clearData } from "../utils/storage";
import { exportToCSV } from "../utils/csv";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleExport = () => {
    const data = loadData();
    exportToCSV(data);
  };

  const handleClear = () => {
    if (!window.confirm("Are you sure you want to delete all local data?")) return;
    clearData();
    navigate(0);
  };

  // 👉 ye function nav click ke baad menu close karega
  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="logo-title">
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

        <button onClick={() => { handleExport(); handleNavClick(); }} className="btn ghost">
          Export CSV
        </button>

        <button onClick={() => { handleClear(); handleNavClick(); }} className="btn ghost">
          Clear Data
        </button>
      </nav>
    </header>
  );
};

export default Header;
