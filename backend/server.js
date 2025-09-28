
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import url from 'url';

const app = express();
app.use(cors());
app.use(express.json());

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    const seed = { boards: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2));
    return seed;
  }
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}
function writeDB(db) { fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2)); }

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Boards
app.get('/boards', (req, res) => {
  const db = readDB();
  res.json(db.boards);
});
app.post('/boards', (req, res) => {
  const { title } = req.body;
  const db = readDB();
  const newBoard = { id: uuidv4(), title, lists: [] };
  db.boards.push(newBoard);
  writeDB(db);
  res.status(201).json(newBoard);
});

// Lists
app.post('/boards/:boardId/lists', (req, res) => {
  const { title } = req.body;
  const { boardId } = req.params;
  const db = readDB();
  const board = db.boards.find(b => b.id === boardId);
  if (!board) return res.status(404).json({ error: 'Board not found' });
  const newList = { id: uuidv4(), title, cards: [] };
  board.lists.push(newList);
  writeDB(db);
  res.status(201).json(newList);
});

// Cards
app.post('/boards/:boardId/lists/:listId/cards', (req, res) => {
  const { title, description = '', labels = [], dueDate = null } = req.body;
  const { boardId, listId } = req.params;
  const db = readDB();
  const board = db.boards.find(b => b.id === boardId);
  if (!board) return res.status(404).json({ error: 'Board not found' });
  const list = board.lists.find(l => l.id === listId);
  if (!list) return res.status(404).json({ error: 'List not found' });
  const newCard = { id: uuidv4(), title, description, labels, dueDate, createdAt: new Date().toISOString() };
  list.cards.push(newCard);
  writeDB(db);
  res.status(201).json(newCard);
});

// Move card (drag & drop)
app.post('/boards/:boardId/move-card', (req, res) => {
  const { sourceListId, destListId, sourceIndex, destIndex } = req.body;
  const { boardId } = req.params;
  const db = readDB();
  const board = db.boards.find(b => b.id === boardId);
  if (!board) return res.status(404).json({ error: 'Board not found' });
  const source = board.lists.find(l => l.id === sourceListId);
  const dest = board.lists.find(l => l.id === destListId);
  if (!source || !dest) return res.status(400).json({ error: 'Invalid lists' });
  const [moved] = source.cards.splice(sourceIndex, 1);
  dest.cards.splice(destIndex, 0, moved);
  writeDB(db);
  res.json({ ok: true });
});

// Update card
app.patch('/boards/:boardId/lists/:listId/cards/:cardId', (req, res) => {
  const { boardId, listId, cardId } = req.params;
  const updates = req.body;
  const db = readDB();
  const board = db.boards.find(b => b.id === boardId);
  if (!board) return res.status(404).json({ error: 'Board not found' });
  const list = board.lists.find(l => l.id === listId);
  if (!list) return res.status(404).json({ error: 'List not found' });
  const card = list.cards.find(c => c.id === cardId);
  if (!card) return res.status(404).json({ error: 'Card not found' });
  Object.assign(card, updates);
  writeDB(db);
  res.json(card);
});

// Delete card
app.delete('/boards/:boardId/lists/:listId/cards/:cardId', (req, res) => {
  const { boardId, listId, cardId } = req.params;
  const db = readDB();
  const board = db.boards.find(b => b.id === boardId);
  if (!board) return res.status(404).json({ error: 'Board not found' });
  const list = board.lists.find(l => l.id === listId);
  if (!list) return res.status(404).json({ error: 'List not found' });
  const idx = list.cards.findIndex(c => c.id === cardId);
  if (idx === -1) return res.status(404).json({ error: 'Card not found' });
  list.cards.splice(idx, 1);
  writeDB(db);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
