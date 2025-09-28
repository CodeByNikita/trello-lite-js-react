
# Trello-Lite (JS + React + Express)

A clean, graduate-friendly Trello-style project board. Frontend is **React (Vite)** with **TailwindCSS** and drag-and-drop using **@hello-pangea/dnd**. Backend is **Node/Express** with a simple JSON file store.

## ✨ Features
- Boards → Lists → Cards hierarchy
- Create new boards (Navbar → + New Board)
- Drag & drop cards between lists
- Create lists & cards
- Edit/Delete cards via modal (title, description, labels, due date)
- Polished UI with Tailwind (rounded corners, soft shadows)
- Simple JSON persistence (no DB setup required)
- Ready to extend: labels filter, search, auth, realtime

---

## 🧰 Tech
- Frontend: React 18, Vite, TailwindCSS, @hello-pangea/dnd, Axios
- Backend: Node 18+, Express, CORS, uuid

---

## 🚀 Quick Start

### 1) Backend
```bash
cd backend
npm install
npm run start
# API on http://localhost:4000
```

### 2) Frontend
```bash
cd frontend
cp .env.example .env   # (optional) customize API URL
npm install
npm run dev
# App on http://localhost:5173
```

> The frontend expects `VITE_API_URL` to point at your backend (defaults to `http://localhost:4000`).

---

## 🗂 API Endpoints (excerpt)
- `GET /boards` → list boards
- `POST /boards` → create board `{ title }`
- `POST /boards/:boardId/lists` → create list `{ title }`
- `POST /boards/:boardId/lists/:listId/cards` → create card `{ title, description?, labels?, dueDate? }`
- `POST /boards/:boardId/move-card` → move card `{ sourceListId, destListId, sourceIndex, destIndex }`
- `PATCH /boards/:boardId/lists/:listId/cards/:cardId` → update a card
- `DELETE /boards/:boardId/lists/:listId/cards/:cardId` → delete a card

---

## 🧪 Ideas to Extend
- Card details modal: attachments, checklist, activity
- Labels & filters
- Board sharing & auth (JWT)
- Realtime (Socket.io) presence + updates
- Switch to Postgres + Prisma or MongoDB
- CI/CD with GitHub Actions + deployment (Vercel + Render)

---

## 📸 UI Notes
- Minimal, modern look: soft shadows, rounded 2xl, subtle borders, airy spacing
- Keyboard focus states on inputs/buttons
- Horizontal scrolling for many lists
- Favicon included (`public/favicon.png`)
