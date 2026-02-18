const express = require("express");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");

const router = express.Router();

/**
 * POST /expenses
 */
router.post("/", (req, res) => {
  let { amount, category, description, date } = req.body;

  const numericAmount = Number(amount);

  if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({
      error: "Amount must be a number greater than 0."
    });
  }

  if (!category || !category.trim()) {
    return res.status(400).json({
      error: "Category is required."
    });
  }

  if (!date) {
    return res.status(400).json({
      error: "Date is required."
    });
  }

  const id = uuidv4();
  const createdAt = new Date().toISOString();

  const query = `
    INSERT INTO expenses (id, amount, category, description, date, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      id,
      numericAmount,
      category.trim(),
      description ? description.trim() : "",
      date,
      createdAt
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "Failed to create expense."
        });
      }

      res.status(201).json({
        id,
        amount: numericAmount,
        category: category.trim(),
        description: description ? description.trim() : "",
        date,
        created_at: createdAt
      });
    }
  );
});

/**
 * GET /expenses
 */
router.get("/", (req, res) => {
  const { category, sort } = req.query;

  let query = "SELECT * FROM expenses";
  const params = [];

  if (category) {
    query += " WHERE category = ?";
    params.push(category);
  }

  if (sort === "date_desc") {
    query += " ORDER BY created_at DESC";
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: "Failed to fetch expenses."
      });
    }

    res.json(rows);
  });
});

/**
 * PUT /expenses/:id
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { amount, category, description, date } = req.body;

  const numericAmount = Number(amount);

  if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({
      error: "Amount must be greater than 0."
    });
  }

  if (!category || !category.trim()) {
    return res.status(400).json({
      error: "Category is required."
    });
  }

  if (!date) {
    return res.status(400).json({
      error: "Date is required."
    });
  }

  const query = `
    UPDATE expenses
    SET amount = ?, category = ?, description = ?, date = ?
    WHERE id = ?
  `;

  db.run(
    query,
    [
      numericAmount,
      category.trim(),
      description ? description.trim() : "",
      date,
      id
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "Failed to update expense."
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          error: "Expense not found."
        });
      }

      res.json({ message: "Expense updated successfully." });
    }
  );
});

/**
 * DELETE /expenses/:id
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM expenses WHERE id = ?";

  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({
        error: "Failed to delete expense."
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: "Expense not found."
      });
    }

    res.json({
      message: "Expense deleted successfully."
    });
  });
});

module.exports = router;
