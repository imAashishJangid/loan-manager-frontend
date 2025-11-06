import { useEffect, useState } from "react";
import { getCustomers, addCustomer } from "../services/customerService";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    loanAmount: "",
  });

  // 🧠 Data fetch karne ka function
  const fetchData = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  // 🧩 Mount hone pe call karo
  useEffect(() => {
    fetchData();
  }, []);

  // 📝 Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCustomer(formData);
      setFormData({ name: "", loanAmount: "" });
      fetchData(); // Add ke baad list refresh
    } catch (err) {
      console.error("Error adding customer:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Customer List</h1>

      {/* ✅ Add Customer Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Customer Name"
          className="border p-2 rounded w-full"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Loan Amount"
          className="border p-2 rounded w-full"
          value={formData.loanAmount}
          onChange={(e) =>
            setFormData({ ...formData, loanAmount: e.target.value })
          }
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Customer
        </button>
      </form>

      {/* ✅ Customer List */}
      <ul className="space-y-2">
        {customers.length > 0 ? (
          customers.map((c) => (
            <li
              key={c._id}
              className="border rounded p-3 flex justify-between items-center"
            >
              <span>
                {c.name} — ₹{c.loanAmount}
              </span>
            </li>
          ))
        ) : (
          <p>No customers found.</p>
        )}
      </ul>
    </div>
  );
};

export default Customers;
