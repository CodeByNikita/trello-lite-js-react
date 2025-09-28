
import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import api from '../api';
import CardModal from './CardModal.jsx';

export default function List({ list, boardId, refresh }) {
  const [cardTitle, setCardTitle] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  const addCard = async () => {
    if (!cardTitle.trim()) return;
    await api.post(`/boards/${boardId}/lists/${list.id}/cards`, { title: cardTitle });
    setCardTitle('');
    setAdding(false);
    refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{list.title}</h3>
        <span className="text-xs text-slate-500">{list.cards.length}</span>
      </div>

      <div className="flex flex-col gap-2">
        {list.cards.map((card, idx) => (
          <Draggable draggableId={card.id} index={idx} key={card.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="bg-white rounded-xl p-3 border border-slate-200 shadow-soft cursor-pointer"
                onClick={() => setEditingCard(card)}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{card.title}</div>
                </div>
                {card.labels?.length > 0 && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {card.labels.map((l) => (
                      <span key={l} className="badge">{l}</span>
                    ))}
                  </div>
                )}
                {card.dueDate && (
                  <div className="mt-2 text-xs text-slate-500">
                    Due: {new Date(card.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            )}
          </Draggable>
        ))}
      </div>

      <div className="mt-3">
        {adding ? (
          <div className="bg-white rounded-xl p-2 border">
            <input
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              placeholder="Card title"
              className="w-full px-2 py-1.5 rounded-lg border mb-2"
            />
            <div className="flex gap-2">
              <button onClick={addCard} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm">Add card</button>
              <button onClick={() => setAdding(false)} className="px-3 py-1.5 rounded-lg bg-white border text-sm">Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} className="px-3 py-1.5 rounded-lg bg-white border text-sm mt-1">+ Add a card</button>
        )}
      </div>

      {editingCard && (
        <CardModal
          boardId={boardId}
          listId={list.id}
          card={editingCard}
          onClose={() => setEditingCard(null)}
          onSaved={refresh}
          onDeleted={refresh}
        />
      )}
    </div>
  );
}
