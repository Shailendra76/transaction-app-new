import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

import "jspdf-autotable"; // Make sure this line is correct

import "./Dashboard.css"; // Ensure styling for the table

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    money: "",
    transactionType: "",
    context: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/transactions", {
          headers: { token },
        });
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };
    fetchTransactions();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/transaction", { ...formData, token });
      alert("Transaction added successfully!");

      // Re-fetch transactions after adding a new one
      const res = await axios.get("http://localhost:5000/transactions", {
        headers: { token },
      });
      setTransactions(res.data);

      // Reset form fields
      setFormData({ name: "", money: "", transactionType: "", context: "" });
    } catch (err) {
      alert("Error adding transaction: " + err.message);
    }
  };

  // Function to download as Excel
  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(transactions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "transactions.xlsx");
  };

  // Function to download as PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Transaction List", 14, 20);
    const tableData = transactions.map(tx => [
      tx.name,
      tx.money,
      tx.transactionType,
      tx.context,
      new Date(tx.date).toLocaleString()
    ]);
  
    doc.autoTable({
      head: [["Name", "Money", "Type", "Context", "Date"]],
      body: tableData,
      startY: 30,
    });
  
    doc.save("transactions.pdf");
  };
  

  return (
    <div className="dashboard">
      <h2>Transaction Dashboard</h2>
      <form className="transaction-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Money"
          value={formData.money}
          onChange={(e) => setFormData({ ...formData, money: e.target.value })}
        />
        <select
          value={formData.transactionType}
          onChange={(e) =>
            setFormData({ ...formData, transactionType: e.target.value })
          }
        >
          <option value="">Select Type</option>
          <option value="give">Give</option>
          <option value="take">Take</option>
        </select>
        <input
          type="text"
          placeholder="Context"
          value={formData.context}
          onChange={(e) => setFormData({ ...formData, context: e.target.value })}
        />
        <button type="submit">Add Transaction</button>
      </form>

      <h3>Transaction List</h3>
      <div className="download-buttons">
        <button onClick={handleDownloadExcel}>Download Excel</button>
        <button onClick={handleDownloadPDF}>Download PDF</button>
      </div>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Money</th>
            <th>Type</th>
            <th>Context</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id}>
              <td>{tx.name}</td>
              <td>{tx.money}</td>
              <td>{tx.transactionType}</td>
              <td>{tx.context}</td>
              <td>{new Date(tx.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
