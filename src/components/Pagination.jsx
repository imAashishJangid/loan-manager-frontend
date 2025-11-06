import React from "react";

const Pagination = ({ page, totalPages, onPage }) => {
  if (totalPages <= 1) return null;
  const prev = () => onPage(Math.max(1, page - 1));
  const next = () => onPage(Math.min(totalPages, page + 1));
  return (
    <div style={{display:"flex",gap:8,alignItems:"center",marginTop:12}}>
      <button className="btn ghost" onClick={prev} disabled={page===1}>Prev</button>
      <div className="small">Page {page} / {totalPages}</div>
      <button className="btn ghost" onClick={next} disabled={page===totalPages}>Next</button>
    </div>
  );
};

export default Pagination;
