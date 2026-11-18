const express = require("express");
const router = express.Router();
const db = require("../db");

// READ: get all books
router.get("/", (req, res) => {
  db.query("SELECT * FROM books", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// CREATE: add a new book
router.post("/", (req, res) => {
  const { title, author, genre, isbn, quantity, cover_url } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  if (!author) {
    return res.status(400).json({ error: "Author is required" });
  }

  const sql =
    "INSERT INTO books (title, author, genre, isbn, quantity, cover_url) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [title, author, genre, isbn, quantity, cover_url];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, message: "Book added" });
  });
});

// UPDATE: change a book
router.put("/:id", (req, res) => {
  const { title, author, genre, isbn, quantity, cover_url } = req.body;

  const sql =
    "UPDATE books SET title = ?, author = ?, genre = ?, isbn = ?, quantity = ?, cover_url = ? WHERE id = ?";
  const values = [title, author, genre, isbn, quantity, cover_url, req.params.id];

  db.query(sql, values, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Book updated" });
  });
});

// DELETE: remove a book
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM books WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Book deleted" });
  });
});

module.exports = router;