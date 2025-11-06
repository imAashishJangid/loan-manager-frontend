import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const defaultForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  status: "active",
  loan: {
    amount: "",
    rate: "",
    termMonths: "",
  },
};

const CustomerForm = ({ editMode }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);

  const handleChange = (path, value) => {
    if (path.startsWith("loan.")) {
      const key = path.split(".")[1];
      setForm((f) => ({ ...f, loan: { ...f.loan, [key]: value } }));
    } else {
      setForm((f) => ({ ...f, [path]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Enter name");
      return;
    }

    try {
      const response = await fetch(
        "https://loan-management-tcl0.onrender.com/api/customers",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            loan: {
              amount: Number(form.loan.amount),
              rate: Number(form.loan.rate),
              termMonths: Number(form.loan.termMonths),
            },
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("✅ Customer added successfully!");
        setForm(defaultForm);
        navigate("/");
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error, please try again later.");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2 className="form-title">
          {editMode ? "✏️ Edit Customer" : "➕ Add New Customer"}
        </h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-row">
            <input
              className="input"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <input
              className="input"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <div className="form-row">
            <input
              className="input"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <select
              className="input"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <textarea
            className="input textarea"
            placeholder="Full Address"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />

          <h4 className="loan-title">💰 Loan Details</h4>

          <div className="form-row">
            <input
              className="input"
              type="number"
              placeholder="Loan Amount (₹)"
              value={form.loan.amount}
              onChange={(e) => handleChange("loan.amount", e.target.value)}
            />
            <input
              className="input"
              type="number"
              step="0.01"
              placeholder="Interest Rate (%)"
              value={form.loan.rate}
              onChange={(e) => handleChange("loan.rate", e.target.value)}
            />
            <input
              className="input"
              type="number"
              placeholder="Term (Months)"
              value={form.loan.termMonths}
              onChange={(e) => handleChange("loan.termMonths", e.target.value)}
            />
          </div>

          <div className="btn-row">
            <button type="submit" className="btn-primary">
              {editMode ? "💾 Save Changes" : "✅ Add Customer"}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
