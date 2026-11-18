import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { BookOpen, Users, ArrowLeftRight, TriangleAlert } from "lucide-react";
import { API } from "../api";
import BookCard from "../components/BookCard";

const COLORS = ["#142D3D", "#78917D", "#C5A878", "#A8B9BD", "#4f6f78", "#8f7340"];

function Dashboard({ user }) {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`${API}/books`).then((res) => res.json()),
      fetch(`${API}/users`).then((res) => res.json()),
      fetch(`${API}/transactions`).then((res) => res.json()),
    ])
      .then(([booksData, usersData, transactionsData]) => {
        setBooks(booksData);
        setMembers(usersData);
        setTransactions(transactionsData);
      })
      .catch(() => setError("Could not load data. Is the backend running?"));
  }, []);

  const totalCopies = books.reduce((sum, book) => sum + book.quantity, 0);
  const lowStock = books.filter((book) => book.quantity < 2).length;
  const borrowed = transactions
    .filter((t) => t.type === "borrow")
    .reduce((sum, t) => sum + t.quantity, 0);

  // Count how many books are in each genre, for the doughnut chart
  const counts = {};
  books.forEach((book) => {
    const genre = book.genre ? book.genre : "Other";
    counts[genre] = (counts[genre] ?? 0) + 1;
  });
  const chartData = Object.keys(counts).map((name) => ({
    name: name,
    value: counts[name],
  }));

  const stats = [
    { label: "Total Books", value: totalCopies, icon: <BookOpen size={22} />, color: "navy" },
    { label: "Total Members", value: members.length, icon: <Users size={22} />, color: "sage" },
    { label: "Books Borrowed", value: borrowed, icon: <ArrowLeftRight size={22} />, color: "blue" },
    { label: "Low Stock", value: lowStock, icon: <TriangleAlert size={22} />, color: "gold" },
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Welcome Back, {user.name}</h1>
          <p>Knowledge is the key to a brighter future.</p>
        </div>
      </div>

      {error && <p className="message error">{error}</p>}

      <div className="stats">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <div className={`icon ${s.color}`}>{s.icon}</div>
            <p>{s.label}</p>
            <h2>{s.value}</h2>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="card table-wrap">
          <div className="card-head">
            <h3>Recent Activity</h3>
            <Link to="/transactions">View All</Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Activity</th>
                <th>Qty</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((t) => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td>
                    <span className={t.type === "add" ? "badge badge-ok" : "badge badge-low"}>
                      {t.type === "add" ? "Stock added" : "Borrowed"}
                    </span>
                  </td>
                  <td>{t.quantity}</td>
                  <td>{new Date(t.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && <p className="muted">No activity yet.</p>}
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Popular Categories</h3>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie data={chartData} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={2}>
                {chartData.map((item, index) => (
                  <Cell key={item.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <ul className="legend">
            {chartData.map((item, index) => (
              <li key={item.name}>
                <span className="dot" style={{ background: COLORS[index % COLORS.length] }} />
                {item.name}
                <span className="count">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card-head">
        <h2 style={{ fontSize: 22 }}>Our Book Collection</h2>
        <Link to="/books">View All Books</Link>
      </div>
      <div className="collection">
        {books.slice(0, 8).map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;