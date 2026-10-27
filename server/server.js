require("dns").setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const ticketsRouter = require("./tickets");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Support Ticketing API is running",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.use("/api/tickets", ticketsRouter);

async function startServer() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is missing");
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
