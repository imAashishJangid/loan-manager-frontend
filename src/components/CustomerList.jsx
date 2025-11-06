import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const CustomerList = ({ data, onDelete }) => {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [confirmData, setConfirmData] = useState(null); // 🔹 for popup
  const pageSize = 8;

  const filtered = useMemo(() => {
    let arr = [...data];
    if (q) {
      const s = q.toLowerCase();
      arr = arr.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          (c.phone || "").includes(s) ||
          (c.email || "").toLowerCase().includes(s)
      );
    }
    if (filter === "active") arr = arr.filter((c) => c.status === "active");
    if (filter === "closed") arr = arr.filter((c) => c.status === "closed");
    if (sort === "amount_desc") arr.sort((a, b) => b.loan.amount - a.loan.amount);
    if (sort === "amount_asc") arr.sort((a, b) => a.loan.amount - b.loan.amount);
    if (sort === "recent") arr.sort((a, b) => b.createdAt - a.createdAt);
    return arr;
  }, [data, q, filter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  // ✅ Confirm delete function
  const handleConfirmDelete = (id) => {
    setConfirmData(id);
  };

  const confirmYes = () => {
    onDelete(confirmData);
    setConfirmData(null);
  };

  const confirmNo = () => {
    setConfirmData(null);
  };

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Customers</h3>
        <div className="small">{data.length} total</div>
      </div>

      <div className="search">
        <input
          className="input"
          placeholder="Search name / phone / email"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
        <select className="input" value={filter} onChange={(e) => {
          setFilter(e.target.value);
          setPage(1);
        }}>
          <option value="all">All</option>
          <option value="active">Active loan</option>
          <option value="closed">Closed</option>
        </select>
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="recent">Most recent</option>
          <option value="amount_desc">Amount: High → Low</option>
          <option value="amount_asc">Amount: Low → High</option>
        </select>
      </div>

      <div>
        {pageItems.length === 0 && <div className="small">No customers found.</div>}
        {pageItems.map((c) => (
          <div key={c._id || c.id} className="customer-item">
            <div>
              <div style={{ fontWeight: 600 }}>
                {c.name} <span className="small">({c.phone || "—"})</span>
              </div>
              <div className="small">
                Loan ₹{Number(c.loan.amount).toLocaleString()} • {c.loan.termMonths}m • {c.status}
              </div>
            </div>
            <div className="actions">
              <Link to={`/customer/${c._id || c.id}`} className="btn ghost">Open</Link>
              <Link to={`/edit/${c._id || c.id}`} className="btn ghost">Edit</Link>
              <button className="btn danger" onClick={() => handleConfirmDelete(c._id || c.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <div className="small">
          Showing {start + 1} - {Math.min(start + pageSize, filtered.length)} of {filtered.length}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn ghost" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Prev
          </button>
          <div className="small" style={{ alignSelf: "center" }}>
            Page {page}/{totalPages}
          </div>
          <button className="btn ghost" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            Next
          </button>
        </div>
      </div>

      {/* 🔹 Custom Confirm Popup */}
      {confirmData && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this customer?</p>
            <div className="popup-actions">
              <button className="btn danger" onClick={confirmYes}>Yes, Delete</button>
              <button className="btn ghost" onClick={confirmNo}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
