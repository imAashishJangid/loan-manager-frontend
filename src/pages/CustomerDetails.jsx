import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { loadData, saveData } from "../utils/storage";
import { calcEmi, totalPayable } from "../utils/calc";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

  // ✅ Fetch data (local + backend fallback)
  useEffect(() => {
    const data = loadData();
    let found = data.find((x) => x.id == id || x._id == id);

    if (found) {
      setCustomer(found);
    } else {
      const fetchCustomer = async () => {
        try {
const res = await fetch(`${import.meta.env.VITE_API_URL}/api/customers/${id}`);
          if (!res.ok) throw new Error("Not found");
          const customerData = await res.json();
          setCustomer(customerData);
        } catch (err) {
          console.error("Error fetching:", err);
          alert("Customer not found");
          navigate("/");
        }
      };
      fetchCustomer();
    }
  }, [id, navigate]);

  if (!customer)
    return (
      <div className="loading-box">
        <p>Loading customer details...</p>
      </div>
    );

  const emi = calcEmi(
    customer.loan.amount,
    customer.loan.rate,
    customer.loan.termMonths
  );
  const total = totalPayable(emi, customer.loan.termMonths);

  const toggleStatus = () => {
    const data = loadData();
    const updated = data.map((d) =>
      d.id === id ? { ...d, status: d.status === "active" ? "closed" : "active" } : d
    );
    saveData(updated);
    setCustomer((prev) => ({
      ...prev,
      status: prev.status === "active" ? "closed" : "active",
    }));
  };

  const handleDelete = () => {
    if (!window.confirm("Delete this customer?")) return;
    const data = loadData().filter((d) => d.id !== id);
    saveData(data);
    navigate("/");
  };

  return (
    <div className="customer-details-container">
      {/* ===== Left: Main Info ===== */}
      <div className="card customer-info">
        <div className="header-section">
          <div>
            <h2 className="title">{customer.name}</h2>
            <p className="meta">
              {customer.phone} • {customer.email}
            </p>
            <p className="meta">
              Added: {new Date(customer.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="action-buttons">
            <Link to={`/edit/${customer._id || customer.id}`} className="btn ghost">
              Edit
            </Link>
            <button className="btn danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>

        <hr />

        <h4 className="section-title">Loan Details</h4>
        <div className="loan-grid">
          <div>Amount</div>
          <strong>₹{Number(customer.loan.amount).toLocaleString()}</strong>

          <div>Rate</div>
          <strong>{customer.loan.rate}% p.a.</strong>

          <div>Term</div>
          <strong>{customer.loan.termMonths} months</strong>

          <div>EMI</div>
          <strong>₹{emi ? emi.toFixed(2) : "—"}</strong>

          <div>Total Payable</div>
          <strong>₹{total ? total.toFixed(2) : "—"}</strong>
        </div>

        <div className="address-section">
          <h4 className="section-title">Address</h4>
          <p>{customer.address || "—"}</p>
        </div>
      </div>

      {/* ===== Right: Sidebar ===== */}
      <aside className="sidebar">
        <div className="card">
          <h4>Status</h4>
          <p className="small">
            Current:{" "}
            <strong
              style={{
                color: customer.status === "active" ? "#2ecc71" : "#e74c3c",
              }}
            >
              {customer.status}
            </strong>
          </p>
         
        </div>

        <div className="card">
          <h4>Quick Actions</h4>
          <div className="quick-actions">
            <Link to="/add" className="btn">
              ➕ Add New Customer
            </Link>
            <Link
              to={`/edit/${customer._id || customer.id}`}
              className="btn ghost"
            >
              ✏️ Edit This
            </Link>
            <button
              className="btn ghost"
              onClick={() => {
                navigator.clipboard.writeText(
                  JSON.stringify(customer, null, 2)
                );
                alert("Copied customer JSON");
              }}
            >
              📋 Copy JSON
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CustomerDetails;
