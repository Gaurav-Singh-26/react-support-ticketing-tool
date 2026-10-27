
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const priorities = ["LOW", "MEDIUM", "HIGH"];
const statuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const categories = ["TECHNICAL", "BILLING", "GENERAL"];

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    priority: { type: String, enum: priorities, required: true },
    status: { type: String, enum: statuses, required: true },
    category: { type: String, enum: categories, required: true }
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

function validateTicket(body) {
  const { title, description, priority, status, category } = body || {};

  return (
    typeof title === "string" && title.trim() &&
    typeof description === "string" && description.trim() &&
    priorities.includes(priority) &&
    statuses.includes(status) &&
    categories.includes(category)
  );
}

router.post("/", async (req, res) => {
  if (!validateTicket(req.body)) {
    return res.status(400).json({ error: "Invalid ticket fields" });
  }

  try {
    const ticket = await Ticket.create({
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      priority: req.body.priority,
      status: req.body.status,
      category: req.body.category
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json({ count: tickets.length, tickets });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid ticket ID" });
  }

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
});

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid ticket ID" });
  }

  if (!validateTicket(req.body)) {
    return res.status(400).json({ error: "Invalid ticket fields" });
  }

  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title.trim(),
        description: req.body.description.trim(),
        priority: req.body.priority,
        status: req.body.status,
        category: req.body.category
      },
      { new: true, runValidators: true }
    );

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Failed to update ticket" });
  }
});

router.delete("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid ticket ID" });
  }

  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete ticket" });
  }
});

module.exports = router;
