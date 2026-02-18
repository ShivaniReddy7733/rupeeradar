import { useEffect, useState, useMemo } from "react";
import "./App.css";

const API_URL = "https://rupeeradar-backend.onrender.com";


function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  // 🔥 NEW: Name handling
  const [userName, setUserName] = useState(
    localStorage.getItem("rupeeradar_name") || ""
  );
  const [tempName, setTempName] = useState("");

  // ================= FETCH =================
  const fetchExpenses = async () => {
    const res = await fetch(`${API_URL}/expenses?sort=date_desc`);
    const data = await res.json();
    setExpenses(data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ================= SAVE NAME =================
  const handleSaveName = () => {
    if (!tempName.trim()) return;

    localStorage.setItem("rupeeradar_name", tempName.trim());
    setUserName(tempName.trim());
  };

  // ================= ADD =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = Number(form.amount);

    if (!numericAmount || numericAmount <= 0) {
      alert("Enter valid amount");
      return;
    }

    if (!form.category.trim() || !form.date) {
      alert("Category and Date required");
      return;
    }

    await fetch(`${API_URL}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Math.round(numericAmount * 100),
        category: form.category.trim(),
        description: form.description.trim(),
        date: form.date,
      }),
    });

    setForm({ amount: "", category: "", description: "", date: "" });
    fetchExpenses();
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    await fetch(`${API_URL}/expenses/${id}`, {
      method: "DELETE",
    });

    fetchExpenses();
  };

  // ================= EDIT =================
  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setEditForm({
      amount: expense.amount / 100,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    });
  };

  const handleUpdate = async (id) => {
    const numericAmount = Number(editForm.amount);
    if (!numericAmount || numericAmount <= 0) {
      alert("Enter valid amount");
      return;
    }

    await fetch(`${API_URL}/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Math.round(numericAmount * 100),
        category: editForm.category.trim(),
        description: editForm.description.trim(),
        date: editForm.date,
      }),
    });

    setEditingId(null);
    fetchExpenses();
  };

  // ================= TOTAL =================
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // ================= CATEGORY BREAKDOWN =================
  const categoryBreakdown = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      if (!map[e.category]) map[e.category] = 0;
      map[e.category] += e.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  // 🔥 If name not set, show name screen
  if (!userName) {
    return (
      <div className="container">
        <div className="header">
          <h1>RupeeRadar</h1>
          <p className="quote">Track smart. Spend wiser.</p>
        </div>

        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <h3>What should we call you?</h3>
          <input
            style={{ padding: "10px", marginTop: "10px" }}
            placeholder="Enter your name"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
          />
          <br />
          <button
            style={{ marginTop: "15px" }}
            className="edit-btn"
            onClick={handleSaveName}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <h1>RupeeRadar</h1>
        <p className="quote">
          Hello {userName} 👋 <br />
          Track smart. Spend wiser.
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <button type="submit">Add Expense</button>
      </form>

      {expenses.length === 0 && (
        <div className="empty">
          <h3>No expenses yet</h3>
          <p>Start by adding your first expense 👆</p>
        </div>
      )}

      {expenses.length > 0 && (
        <>
          <div className="summary">
            <div className="summary-box">
              <h3>Total</h3>
              <p>₹{(total / 100).toFixed(2)}</p>
            </div>
            <div className="summary-box">
              <h3>Entries</h3>
              <p>{expenses.length}</p>
            </div>
          </div>

          <div className="category-breakdown">
            <h3>Category Breakdown</h3>

            {categoryBreakdown.map(([cat, amt]) => {
              const percent = total > 0 ? (amt / total) * 100 : 0;

              return (
                <div key={cat} className="category-row">
                  <div className="category-label">
                    <span>{cat}</span>
                    <span>₹{(amt / 100).toFixed(2)}</span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <table className="expense-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Category</th>
                <th>Description</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>₹{(expense.amount / 100).toFixed(2)}</td>
                  <td>
                    <span className="category-badge">
                      {expense.category}
                    </span>
                  </td>
                  <td>{expense.description}</td>
                  <td>
                    {new Date(expense.date).toLocaleDateString("en-IN")}
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(expense.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
