import React, { useEffect, useState } from "react";
import CustomerList from "../components/CustomerList";
import { Link } from "react-router-dom";
import { exportToCSV } from "../utils/csv";

// ✅ Corrected API Base URL
const API_BASE = "https://loan-management-tcl0.onrender.com/api/customers";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch customers from backend
  const fetchCustomers = async () => {
    try {
      const response = await fetch(API_BASE);
      const customers = await response.json();
      setData(customers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });
      setData((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting customer");
    }
  };

  // ✅ Stats calculation
  const stats = {
    total: data.length,
    active: data.filter((d) => d.status === "active").length,
    closed: data.filter((d) => d.status === "closed").length,
    totalLoan: data.reduce((sum, c) => sum + Number(c.loan?.amount || 0), 0),
  };

  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          paddingTop: "80px",
          fontSize: "18px",
          color: "#475569",
        }}
      >
        ⏳ Loading customers...
      </div>
    );

  return (
    <div className="dashboard">
      {/* 🔹 Customer List Section */}
      <section className="card-section">
        <h2 className="section-title">👥 Customers</h2>
        <CustomerList data={data} onDelete={handleDelete} />
      </section>

      {/* 🔹 Quick Actions */}
      <section className="card-section">
        <h3 className="section-title">⚡ Quick Actions</h3>
        <div className="button-group">
          <Link to="/add" style={btnPrimary}>
            ➕ Add New Customer
          </Link>
          <button style={btnGhost} onClick={() => exportToCSV(data)}>
            📤 Export CSV
          </button>
        </div>
      </section>

      {/* 🔹 Statistics */}
      <section className="card-section">
        <h3 className="section-title">📊 Statistics</h3>
        <Stat label="Total Customers" value={stats.total} color="#1d4ed8" />
        <Stat label="Active Loans" value={stats.active} color="#16a34a" />
        <Stat label="Closed Loans" value={stats.closed} color="#dc2626" />
        <Stat
          label="Total Loan Amount"
          value={`₹${stats.totalLoan.toLocaleString()}`}
          color="#9333ea"
        />
      </section>
    </div>
  );
};

const Stat = ({ label, value, color }) => (
  <div className="stat-row">
    <span>{label}</span>
    <strong style={{ color }}>{value}</strong>
  </div>
);

const btnPrimary = {
  background: "#2563eb",
  color: "#fff",
  textAlign: "center",
  padding: "10px 16px",
  borderRadius: "10px",
  textDecoration: "none",
  fontSize: "15px",
  fontWeight: "500",
  border: "none",
  cursor: "pointer",
  transition: "0.2s",
};

const btnGhost = {
  background: "#f1f5f9",
  color: "#1e293b",
  border: "1px solid #cbd5e1",
  padding: "10px 16px",
  borderRadius: "10px",
  fontSize: "15px",
  cursor: "pointer",
  fontWeight: "500",
};

export default Dashboard;
