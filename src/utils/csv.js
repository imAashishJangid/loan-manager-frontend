export const exportToCSV = (data, filename = "loan_data.csv") => {
  if (!data || !data.length) return;
  const keys = Object.keys(data[0]);
  const rows = data.map(row =>
    keys.map(k => {
      let v = row[k];
      if (v === null || v === undefined) return "";
      if (typeof v === "string" && v.includes(",")) v = `"${v.replace(/"/g, '""')}"`;
      return v;
    }).join(",")
  );
  const csv = [keys.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
