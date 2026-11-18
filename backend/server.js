const express = require("express");
const cors = require("cors");
const db = require("./db");

const booksRoutes = require("./routes/books");
const transactionsRoutes = require("./routes/transactions");
const usersRoutes = require("./routes/users");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/books", booksRoutes);
app.use("/transactions", transactionsRoutes);
app.use("/users", usersRoutes);

app.get("/", (req, res) => {
  res.send("Library API is running!");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});