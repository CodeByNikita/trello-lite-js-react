
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Board from './components/Board.jsx';
import api from './api';

export default function App() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/boards');
      setBoards(data);
    } catch (e) {
      setError('Failed to load boards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBoards(); }, []);

  if (loading) return <div className="p-8 text-slate-700">Loading…</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div>
      <Navbar onRefresh={fetchBoards} />
      <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
        {boards.length === 0 && (
          <div className="text-slate-600">No boards yet — click <span className="font-medium">New Board</span> to create one.</div>
        )}
        {boards.map((b) => (
          <Board key={b.id} board={b} refresh={fetchBoards} />
        ))}
      </div>
    </div>
  );
}
