
import React, { useState } from 'react';
import api from '../api';

export default function Navbar({ onRefresh }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const createBoard = async () => {
    if (!title.trim()) return;
    try {
      setSaving(true);
      setError(null);
      await api.post('/boards', { title });
      setTitle('');
      setOpen(false);
      onRefresh && onRefresh();
    } catch (e) {
      setError('Failed to create board');
    } finally {
      setSaving(false);
    }
  };

  return (
    <header className="bg-white shadow-soft">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Trello-Lite</h1>
        <div className="flex gap-3">
          <button className="px-3 py-2 rounded-xl bg-white border text-sm" onClick={() => setOpen(true)}>
            + New Board
          </button>
          <button className="px-3 py-2 rounded-xl bg-slate-900 text-white text-sm" onClick={onRefresh}>
            Refresh
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-soft border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Create Board</h3>
              <button onClick={() => setOpen(false)} className="px-3 py-1.5 rounded-lg bg-white border text-sm">Close</button>
            </div>
            {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Board title"
              className="w-full border rounded-xl px-3 py-2 mb-3"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-3 py-2 rounded-xl bg-white border text-sm">Cancel</button>
              <button onClick={createBoard} className="px-3 py-2 rounded-xl bg-slate-900 text-white text-sm" disabled={saving}>
                {saving ? 'Creating…' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
