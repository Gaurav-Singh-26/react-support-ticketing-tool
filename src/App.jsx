import { useEffect, useMemo, useState } from "react";
import "./App.css";

const INITIAL_TICKETS = [
  {
    id: "TKT-1001",
    title: "Unable to reset my password",
    description:
      "I requested a password reset link but have not received the email yet. Please help me regain access to my account.",
    requester: "Aarav Sharma",
    category: "Account",
    priority: "High",
    status: "Open",
    createdAt: "2026-10-26",
  },
  {
    id: "TKT-1002",
    title: "Payment was deducted twice",
    description:
      "My payment appears to have been deducted twice for the same order. Please check the transaction.",
    requester: "Priya Verma",
    category: "Billing",
    priority: "Urgent",
    status: "In Progress",
    createdAt: "2026-10-25",
  },
  {
    id: "TKT-1003",
    title: "Dashboard is loading slowly",
    description:
      "The dashboard takes a long time to load when I open the reports section.",
    requester: "Rahul Gupta",
    category: "Technical",
    priority: "Medium",
    status: "Resolved",
    createdAt: "2026-10-24",
  },
  {
    id: "TKT-1004",
    title: "Request to update profile details",
    description:
      "I need assistance updating the contact details on my profile.",
    requester: "Neha Singh",
    category: "General",
    priority: "Low",
    status: "Open",
    createdAt: "2026-10-23",
  },
];

const STATUSES = ["Open", "In Progress", "Resolved"];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];
const CATEGORIES = ["Account", "Billing", "Technical", "General"];

function loadTickets() {
  try {
    const saved = localStorage.getItem("support-tickets");
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  } catch {
    return INITIAL_TICKETS;
  }
}

function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${status.toLowerCase().replace(" ", "-")}`}>
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span className={`priority-badge ${priority.toLowerCase()}`}>
      {priority}
    </span>
  );
}

function StatCard({ label, value, icon, tone, caption }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-caption">{caption}</div>
    </article>
  );
}

export default function App() {
  const [tickets, setTickets] = useState(loadTickets);
  const [selectedId, setSelectedId] = useState("TKT-1001");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    requester: "",
    category: "Technical",
    priority: "Medium",
  });

  useEffect(() => {
    localStorage.setItem("support-tickets", JSON.stringify(tickets));
  }, [tickets]);

  const counts = useMemo(
    () => ({
      total: tickets.length,
      open: tickets.filter((t) => t.status === "Open").length,
      progress: tickets.filter((t) => t.status === "In Progress").length,
      resolved: tickets.filter((t) => t.status === "Resolved").length,
    }),
    [tickets]
  );

  const filteredTickets = useMemo(() => {
    const term = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesSearch = [
        ticket.id,
        ticket.title,
        ticket.requester,
        ticket.description,
      ].some((value) => value.toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "All statuses" || ticket.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All categories" ||
        ticket.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [tickets, search, statusFilter, categoryFilter]);

  const selectedTicket =
    tickets.find((ticket) => ticket.id === selectedId) || null;

  function updateTicket(id, changes) {
    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === id ? { ...ticket, ...changes } : ticket
      )
    );
  }

  function createTicket(event) {
    event.preventDefault();

    const highestId = Math.max(
      1000,
      ...tickets.map((ticket) => Number(ticket.id.replace("TKT-", "")) || 0)
    );

    const newTicket = {
      ...form,
      id: `TKT-${highestId + 1}`,
      status: "Open",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setTickets((current) => [newTicket, ...current]);
    setSelectedId(newTicket.id);
    setSearch("");
    setStatusFilter("All statuses");
    setCategoryFilter("All categories");
    setShowForm(false);

    setForm({
      title: "",
      description: "",
      requester: "",
      category: "Technical",
      priority: "Medium",
    });

    setNotice(`Ticket ${newTicket.id} created successfully.`);
    window.setTimeout(() => setNotice(""), 3500);
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("All statuses");
    setCategoryFilter("All categories");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div>
            <strong>SupportDesk</strong>
            <span>HELP CENTER</span>
          </div>
        </div>

        <p className="nav-label">WORKSPACE</p>

        <button
          className="nav-item active"
          onClick={resetFilters}
          type="button"
        >
          <span>▦</span> Ticket dashboard
        </button>

        <button
          className="nav-item"
          onClick={() => {
            setStatusFilter("Open");
            setCategoryFilter("All categories");
          }}
          type="button"
        >
          <span>◷</span> Open tickets
          <span className="nav-count">{counts.open}</span>
        </button>

        <button
          className="nav-item"
          onClick={() => {
            setStatusFilter("In Progress");
            setCategoryFilter("All categories");
          }}
          type="button"
        >
          <span>↻</span> In progress
        </button>

        <button
          className="nav-item"
          onClick={() => {
            setStatusFilter("Resolved");
            setCategoryFilter("All categories");
          }}
          type="button"
        >
          <span>✓</span> Resolved
        </button>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-symbol">?</div>
            <strong>Need a hand?</strong>
            <p>Keep your customer support organized in one place.</p>
          </div>

          <div className="profile">
            <div className="avatar">GS</div>
            <div className="profile-text">
              <strong>Support Agent</strong>
              <span>Administrator</span>
            </div>
            <span className="profile-dots">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> Tickets
          </div>
          <div className="topbar-right">
            <span className="online-dot" />
            Support team online
            <div className="avatar small-avatar">GS</div>
          </div>
        </header>

        <section className="page-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">OVERVIEW</p>
              <h1>Ticket dashboard</h1>
              <p className="subheading">
                Manage requests and keep every customer moving forward.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => setShowForm(true)}
              type="button"
            >
              <span>＋</span> Create ticket
            </button>
          </div>

          {notice && <div className="notice">✓ {notice}</div>}

          <div className="stats-grid">
            <StatCard
              label="Total tickets"
              value={counts.total}
              icon="▤"
              tone="blue"
              caption="All requests"
            />
            <StatCard
              label="Open tickets"
              value={counts.open}
              icon="◷"
              tone="orange"
              caption="Awaiting action"
            />
            <StatCard
              label="In progress"
              value={counts.progress}
              icon="↻"
              tone="purple"
              caption="Being worked on"
            />
            <StatCard
              label="Resolved"
              value={counts.resolved}
              icon="✓"
              tone="green"
              caption="Successfully closed"
            />
          </div>

          <section className="workspace-card">
            <div className="section-heading">
              <div>
                <h2>Support tickets</h2>
                <p>View and manage all incoming customer requests.</p>
              </div>
              <span className="ticket-total">
                {filteredTickets.length} tickets
              </span>
            </div>

            <div className="filters">
              <div className="search-box">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search tickets, customers..."
                  aria-label="Search tickets"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by status"
              >
                <option>All statuses</option>
                {STATUSES.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                aria-label="Filter by category"
              >
                <option>All categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="ticket-layout">
              <div className="ticket-list">
                {filteredTickets.length === 0 ? (
                  <div className="empty-state">
                    <span>⌕</span>
                    <strong>No tickets found</strong>
                    <p>Try another search or change your filters.</p>
                    <button
                      className="text-button"
                      type="button"
                      onClick={resetFilters}
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  filteredTickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      type="button"
                      className={`ticket-row ${
                        selectedId === ticket.id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedId(ticket.id)}
                    >
                      <div className="ticket-row-top">
                        <span className="ticket-id">{ticket.id}</span>
                        <PriorityBadge priority={ticket.priority} />
                      </div>

                      <strong className="ticket-title">{ticket.title}</strong>
                      <span className="ticket-requester">
                        {ticket.requester}
                      </span>

                      <div className="ticket-row-bottom">
                        <StatusBadge status={ticket.status} />
                        <span className="ticket-date">
                          {formatDate(ticket.createdAt)}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>

              <div className="ticket-detail">
                {selectedTicket ? (
                  <>
                    <div className="detail-topline">
                      <span className="ticket-id">{selectedTicket.id}</span>
                      <span className="detail-date">
                        Created {formatDate(selectedTicket.createdAt)}
                      </span>
                    </div>

                    <h3>{selectedTicket.title}</h3>

                    <div className="detail-tags">
                      <StatusBadge status={selectedTicket.status} />
                      <PriorityBadge priority={selectedTicket.priority} />
                    </div>

                    <div className="detail-divider" />
                    <h4>Description</h4>
                    <p className="description">
                      {selectedTicket.description}
                    </p>

                    <div className="detail-divider" />
                    <h4>Ticket information</h4>

                    <div className="info-grid">
                      <div>
                        <span className="info-label">Requester</span>
                        <strong>{selectedTicket.requester}</strong>
                      </div>
                      <div>
                        <span className="info-label">Category</span>
                        <strong>{selectedTicket.category}</strong>
                      </div>
                    </div>

                    <div className="detail-divider" />
                    <h4>Update ticket</h4>

                    <label className="field-label" htmlFor="ticket-status">
                      Status
                    </label>
                    <select
                      id="ticket-status"
                      value={selectedTicket.status}
                      onChange={(event) =>
                        updateTicket(selectedTicket.id, {
                          status: event.target.value,
                        })
                      }
                    >
                      {STATUSES.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>

                    <label className="field-label" htmlFor="ticket-priority">
                      Priority
                    </label>
                    <select
                      id="ticket-priority"
                      value={selectedTicket.priority}
                      onChange={(event) =>
                        updateTicket(selectedTicket.id, {
                          priority: event.target.value,
                        })
                      }
                    >
                      {PRIORITIES.map((priority) => (
                        <option key={priority}>{priority}</option>
                      ))}
                    </select>

                    <p className="save-hint">
                      Changes are saved automatically.
                    </p>
                  </>
                ) : (
                  <div className="empty-detail">
                    <span>▤</span>
                    <strong>Select a ticket</strong>
                    <p>Choose a ticket from the list to view its details.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <footer className="footer">
            SupportDesk <span>·</span> Simple support, better service.
          </footer>
        </section>
      </main>

      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-heading"
          >
            <div className="modal-heading">
              <div>
                <p className="eyebrow">NEW REQUEST</p>
                <h2 id="create-heading">Create a ticket</h2>
                <p className="subheading">
                  Add the details of the customer request below.
                </p>
              </div>
              <button
                className="close-button"
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={createTicket}>
              <label className="field-label" htmlFor="requester">
                Requester name
              </label>
              <input
                id="requester"
                required
                value={form.requester}
                onChange={(event) =>
                  setForm({ ...form, requester: event.target.value })
                }
                placeholder="e.g. Alex Morgan"
              />

              <label className="field-label" htmlFor="title">
                Ticket title
              </label>
              <input
                id="title"
                required
                maxLength={100}
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                placeholder="Briefly describe the issue"
              />

              <label className="field-label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="Explain the request or issue..."
              />

              <div className="form-row">
                <div>
                  <label className="field-label" htmlFor="category">
                    Category
                  </label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="field-label" htmlFor="priority">
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={form.priority}
                    onChange={(event) =>
                      setForm({ ...form, priority: event.target.value })
                    }
                  >
                    {PRIORITIES.map((priority) => (
                      <option key={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  ＋ Create ticket
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}