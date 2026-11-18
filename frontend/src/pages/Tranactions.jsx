import { useState, useEffect } from "react";
import { API } from "../api";

function Transactions() {
  const [books, setBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({ book_id: "", type: "add", quantity: "" });
  const [message, setMessage] = useState({ text: "", isError: false });

  function loadData() {
    fetch(`${API}/books`)
      .then((res) => res.json())
      .then((data) => setBooks(data));

    fetch(`${API}/transactions`)
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (form.book_id === "") {
      setMessage({ text: "Please choose a book", isError: true });
      return;
    }
    if (Number(form.quantity) <= 0) {
      setMessage({ text: "Quantity must be more than 0", isError: true });
      return;
    }

    fetch(`${API}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        book_id: Number(form.book_id),
        type: form.type,
        quantity: Number(form.quantity),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage({ text: data.error, isError: true });
        } else {
          setMessage({
            text: `Done! New stock: ${data.newStock}`,
            isError: false,
          });
          setForm({ ...form, quantity: "" });
          loadData();
        }
      });
  }

  return (
    <div>
      <h1>Transactions</h1>

      {message.text !== "" && (
        <p className={message.isError ? "message error" : "message"}>
          {message.text}
        </p>
      )}

      <div className="card section">
        <h2>Add or borrow stock</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label>Book</label>
              <select name="book_id" value={form.book_id} onChange={handleChange}>
                <option value="">Select a book</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} (stock: {book.quantity})
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="add">Add stock (new books arrived)</option>
                <option value="borrow">Borrow (deduct stock)</option>
              </select>
            </div>

            <div className="field">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn" type="submit">
              Record transaction
            </button>
          </div>
        </form>
      </div>

      <div className="card table-wrap">
        <h2>History</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Book</th>
              <th>Type</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            {history.map((t) => (
              <tr key={t.id}>
                <td>{new Date(t.created_at).toLocaleString()}</td>
                <td>{t.title}</td>
                <td>
                  <span
                    className={t.type === "add" ? "badge badge-ok" : "badge badge-low"}
                  >
                    {t.type}
                  </span>
                </td>
                <td>{t.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;