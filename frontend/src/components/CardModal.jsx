
import React, { useEffect, useState } from 'react';
import api from '../api';

export default function CardModal({ boardId, listId, card, onClose, onSaved, onDeleted }) {
  const [title, setTitle] = useState(card?.title || '');
  const [description, setDescription] = useState(card?.description || '');
  const [labelsText, setLabelsText] = useState((card?.labels || []).join(', '));
  const [dueDate, setDueDate] = useState(card?.dueDate ? card.dueDate.split('T')[0] : '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTitle(card?.title || '');
    setDescription(card?.description || '');
    setLabelsText((card?.labels || []).join(', '));
    setDueDate(card?.dueDate ? card.dueDate.split('T')[0] : '');
  }, [card]);

  const onSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const labels = labelsText.split(',').map(s => s.trim()).filter(Boolean);
      const payload = { title, description, labels, dueDate: dueDate ? new Date(dueDate).toISOString() : null };
      await api.patch(`/boards/${boardId}/lists/${listId}/cards/${card.id}`, payload);
      onSaved && onSaved();
      onClose();
    } catch (e) {
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!confirm('Delete this card? This cannot be undone.')) return;
    try {
      setSaving(true);
      setError(null);
      await api.delete(`/boards/${boardId}/lists/${listId}/cards/${card.id}`);
      onDeleted && onDeleted();
      onClose();
    } catch (e) {
      setError('Failed to delete card');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-soft border p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Edit Card</h3>
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg bg-white border text-sm">Close</button>
        </div>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-600">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded-xl px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-xl px-3 py-2 h-28" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-600">Labels (comma-separated)</label>
              <input value={labelsText} onChange={(e) => setLabelsText(e.target.value)} className="w-full border rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="text-sm text-slate-600">Due date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border rounded-xl px-3 py-2" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-5">
          <button onClick={onDelete} className="px-3 py-2 rounded-xl bg-white border border-red-300 text-red-600 text-sm" disabled={saving}>Delete</button>
          <button onClick={onSave} className="px-3 py-2 rounded-xl bg-slate-900 text-white text-sm" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
