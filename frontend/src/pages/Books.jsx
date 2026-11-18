import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { API } from "../api";
import BookForm from "../components/BookForm";
import BookCard from "../components/BookCard";

function Books() {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [message, setMessage] = useState({ text: "", isError: false });

  function loadBooks() {
    fetch(`${API}/books`)
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch(() => setMessage({ text: "Could not load books", isError: true }));
  }

  useEffect(() => {
    loadBooks();
  }, []);

  // When the top search bar is used, update the search box here
  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  function matches(book) {
    const text = search.toLowerCase();
    const inTitle = book.title.toLowerCase().includes(text);
    const inAuthor = book.author.toLowerCase().includes(text);
    const inIsbn = String(book.isbn ?? "").includes(text);

    if (![inTitle, inAuthor, inIsbn].includes(true)) return false;
    if (category !== "all" && book.genre !== category) return false;
    if (status === "available" && book.quantity === 0) return false;
    if (status === "out" && book.quantity > 0) return false;
    return true;
  }

  const shown = books.filter(matches);
  const genres = [...new Set(books.map((book) => book.genre).filter(Boolean))];

  function handleSave(bookData) {
    const isEditing = editingBook !== null;
    const url = isEditing ? `${API}/books/${editingBook.id}` : `${API}/books`;
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage({ text: data.error, isError: true });
        } else {
          setMessage({ text: isEditing ? "Book updated" : "Book added", isError: false });
          setEditingBook(null);
          setShowForm(false);
          loadBooks();
        }
      });
  }

  function handleEdit(book) {
    setEditingBook(book);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancel() {
    setEditingBook(null);
    setShowForm(false);
  }

  function handleDelete(id) {
    if (!window.confirm("Delete this book?")) return;

    fetch(`${API}/books/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage({ text: "Could not delete this book.", isError: true });
        } else {
          setMessage({ text: "Book deleted", isError: false });
          loadBooks();
        }
      });
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Books</h1>
          <p>Browse and manage library books</p>
        </div>
        <button className="btn btn-row" onClick={() => { setEditingBook(null); setShowForm(true); }}>
          <Plus size={16} /> Add Book
        </button>
      </div>

      {message.text !== "" && (
        <p className={message.isError ? "message error" : "message"}>{message.text}</p>
      )}

      {showForm && (
        <div className="card section">
          <h3 style={{ marginBottom: 14 }}>{editingBook ? "Update book" : "Add New Book"}</h3>
          <BookForm initialBook={editingBook} onSubmit={handleSave} onCancel={handleCancel} />
          {!editingBook && (
            <div className="form-actions">
              <button className="btn btn-outline" onClick={handleCancel}>
                Close
              </button>
            </div>
          )}
        </div>
      )}

      <div className="toolbar">
        <div className="search" style={{ flex: 1 }}>
          <Search size={16} />
          <input
            placeholder="Search by title, author or ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="out">Checked Out</option>
        </select>
      </div>

      <div className="book-grid">
        {shown.map((book) => (
          <BookCard key={book.id} book={book} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
      {shown.length === 0 && <p className="muted">No books match your search.</p>}
    </div>
  );
}

export default Books;