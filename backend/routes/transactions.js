const express = require("express");
const router = express.Router();
const db = require("../db");

// READ: transaction history (with the book title)
router.get("/", (req, res) => {
  const sql = `
    SELECT transactions.id, transactions.type, transactions.quantity,
           transactions.created_at, books.title
    FROM transactions
    JOIN books ON transactions.book_id = books.id
    ORDER BY transactions.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// CREATE: add stock or borrow a book
router.post("/", (req, res) => {
  const { book_id, type, quantity } = req.body;
  const amount = Number(quantity);

  if (!book_id) {
    return res.status(400).json({ error: "Book is required" });
  }
  if (type !== "add" && type !== "borrow") {
    return res.status(400).json({ error: "Type must be add or borrow" });
  }
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Quantity must be more than 0" });
  }

  // Step A: find the current stock
  db.query("SELECT quantity FROM books WHERE id = ?", [book_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    const stock = rows[0].quantity;

    // Step B: check there is enough to borrow
    if (type === "borrow" && amount > stock) {
      return res.status(400).json({ error: "Not enough stock" });
    }

    // Step C: work out the new stock
    const newStock = type === "add" ? stock + amount : stock - amount;

    // Step D: save the new stock
    db.query("UPDATE books SET quantity = ? WHERE id = ?", [newStock, book_id], (err2) => {
      if (err2) {
        return res.status(500).json({ error: err2.message });
      }

      // Step E: record the transaction in the history
      db.query(
        "INSERT INTO transactions (book_id, type, quantity) VALUES (?, ?, ?)",
        [book_id, type, amount],
        (err3) => {
          if (err3) {
            return res.status(500).json({ error: err3.message });
          }
          res.status(201).json({ message: "Transaction recorded", newStock });
        }
      );
    });
  });
});

module.exports = router;