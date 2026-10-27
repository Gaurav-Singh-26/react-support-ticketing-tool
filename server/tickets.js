const express = require("express");
const { randomUUID } = require("crypto");

const router = express.Router();
let tickets = [];

const priorities = ["LOW", "MEDIUM", "HIGH"];
const statuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const categories = ["TECHNICAL", "BILLING", "GENERAL"];

router.post("/", (req, res) => {
  const { title, description, priority, status, category } = req.body || {};

  if (
    typeof title !== "string" || !title.trim() ||
    typeof description !== "string" || !description.trim() ||
    !priorities.includes(priority) ||
    !statuses.includes(status) ||
    !categories.includes(category)
  ) {
    return res.status(400).json({ error: "Invalid ticket fields" });
  }

  const now = new Date().toISOString();
  const ticket = {
    id: randomUUID(),
    title: title.trim(),
    description: description.trim(),
    priority,
    status,
    category,
    createdAt: now,
    updatedAt: now
  };

  tickets.push(ticket);
  res.status(201).json(ticket);
});

router.get("/", (req, res) => {
  res.status(200).json({ count: tickets.length, tickets });
});

router.get("/:id", (req, res) => {
  const ticket = tickets.find(t => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  res.status(200).json(ticket);
});

router.put("/:id", (req, res) => {
  const ticket = tickets.find(t => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });

  const { title, description, priority, status, category } = req.body || {};

  if (
    typeof title !== "string" || !title.trim() ||
    typeof description !== "string" || !description.trim() ||
    !priorities.includes(priority) ||
    !statuses.includes(status) ||
    !categories.includes(category)
  ) {
    return res.status(400).json({ error: "Invalid ticket fields" });
  }

  Object.assign(ticket, {
    title: title.trim(),
    description: description.trim(),
    priority,
    status,
    category,
    updatedAt: new Date().toISOString()
  });

  res.status(200).json(ticket);
});

router.delete("/:id", (req, res) => {
  const index = tickets.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Ticket not found" });

  tickets.splice(index, 1);
  res.status(204).send();
});

module.exports = router;