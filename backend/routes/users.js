const express = require("express");
const router = express.Router();
const db = require("../db");

// READ: get all users (we never send passwords back)
router.get("/", (req, res) => {
  db.query("SELECT id, name, membership_id, role FROM users", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// CREATE: add a new user
router.post("/", (req, res) => {
  const { name, membership_id, role, password } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (!membership_id) {
    return res.status(400).json({ error: "Membership ID is required" });
  }
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const sql =
    "INSERT INTO users (name, membership_id, role, password) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, membership_id, role, password], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, message: "User added" });
  });
});

// LOGIN: check membership ID and password
router.post("/login", (req, res) => {
  const { membership_id, password } = req.body;

  const sql =
    "SELECT id, name, membership_id, role FROM users WHERE membership_id = ? AND password = ?";

  db.query(sql, [membership_id, password], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (rows.length === 0) {
      return res.status(401).json({ error: "Wrong membership ID or password" });
    }
    res.json(rows[0]);
  });
});

// UPDATE: change a user
router.put("/:id", (req, res) => {
  const { name, membership_id, role } = req.body;

  const sql = "UPDATE users SET name = ?, membership_id = ?, role = ? WHERE id = ?";

  db.query(sql, [name, membership_id, role, req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "User updated" });
  });
});

// DELETE: remove a user
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "User deleted" });
  });
});

module.exports = router;