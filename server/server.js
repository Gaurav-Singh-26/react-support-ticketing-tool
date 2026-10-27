const express = require("express");
const cors = require("cors");
const ticketsRouter = require("./tickets");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Support Ticketing API is running" });
});

app.use("/api/tickets", ticketsRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});