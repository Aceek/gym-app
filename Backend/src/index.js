// src/index.js

const express = require("express");
const app = express();
const db = require("./db");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
