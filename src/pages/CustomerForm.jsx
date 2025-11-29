import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const defaultForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  status: "active",
  addedDate: new Date().toISOString().split("T")[0],
  loan: {
    amount: "",
    rate: "",
    rateType: "month",
    term: "",
    termType: "months",
  },
};

const CustomerForm = ({ editMode }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(defaultForm);

  // ⭐ Prefill data if in editMode
  useEffect(() => {
    if (editMode && id) {
      fetch(`https://loan-management-tcl0.onrender.com/api/customers/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setForm({
              name: data.name,
              phone: data.phone,
              email: data.email,
              address: data.address,
              status: data.status,
              addedDate: data.addedDate?.split("T")[0] || "",
              loan: {
                amount: data.loan.amount,
                rate: data.loan.rate,
                rateType: data.loan.rateType,
                term: data.loan.term,
                termType: data.loan.termType,
              },
            });
          }
        })
        .catch((err) => console.log("Error loading customer:", err));
    }
  }, [editMode, id]);

  // ⭐ Handle Input
  const handleChange = (path, value) => {
    const parts = path.split(".");
    if (parts[0] === "loan") {
      setForm((f) => ({
        ...f,
        loan: { ...f.loan, [parts[1]]: value },
      }));
    } else {
      setForm((f) => ({ ...f, [path]: value }));
    }
  };

  // ⭐ Submit (POST for add, PUT for update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Enter customer name");
      return;
    }

    try {
      const url = editMode
        ? `https://loan-management-tcl0.onrender.com/api/customers/${id}`
        : "https://loan-management-tcl0.onrender.com/api/customers";

      const response = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          loan: {
            amount: Number(form.loan.amount),
            rate: Number(form.loan.rate),
            rateType: form.loan.rateType,
            term: Number(form.loan.term),
            termType: form.loan.termType,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          editMode
            ? "✏️ Customer updated successfully!"
            : "✅ Customer added successfully!"
        );
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
          {/* Added Date */}
          <div className="form-row">
            <input
              className="input"
              type="date"
              value={form.addedDate}
              onChange={(e) => handleChange("addedDate", e.target.value)}
            />
          </div>

          {/* Name + Phone */}
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

          {/* Email + Status */}
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

          {/* Address */}
          <textarea
            className="input textarea"
            placeholder="Full Address"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />

          <h4 className="loan-title">💰 Loan Details</h4>

          {/* Loan fields */}
          <div className="form-row">
            <input
              className="input"
              type="number"
              placeholder="Loan Amount (₹)"
              value={form.loan.amount}
              onChange={(e) => handleChange("loan.amount", e.target.value)}
            />

            <div className="input" style={{ display: "flex", gap: "8px" }}>
              <input
                type="number"
                placeholder="Term"
                value={form.loan.term}
                onChange={(e) => handleChange("loan.term", e.target.value)}
                style={{ flex: 1 }}
              />
              <select
                value={form.loan.termType}
                onChange={(e) => handleChange("loan.termType", e.target.value)}
              >
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>

            <div className="input" style={{ display: "flex", gap: "8px" }}>
              <input
                type="number"
                placeholder="Rate"
                value={form.loan.rate}
                onChange={(e) => handleChange("loan.rate", e.target.value)}
                style={{ flex: 1 }}
              />
              <select
                value={form.loan.rateType}
                onChange={(e) => handleChange("loan.rateType", e.target.value)}
              >
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
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
