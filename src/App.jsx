import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import CustomerForm from "./pages/CustomerForm";
import CustomerDetails from "./pages/CustomerDetails";
import CustomerDetailss from "./pages/CustomerDetails";

const App = () => {
  return (
    <div>
      <Header />
      <main className="app-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<CustomerForm />} />
          <Route path="/edit/:id" element={<CustomerForm editMode={true} />} />
          <Route path="/customer/:id" element={<CustomerDetails />} />
          <Route path="/customer/:id" element={<CustomerDetailss />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
