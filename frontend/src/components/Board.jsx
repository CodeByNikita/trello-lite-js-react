
import React, { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import api from '../api';
import List from './List.jsx';

export default function Board({ board, refresh }) {
  const [title, setTitle] = useState('');
  const [creatingList, setCreatingList] = useState(false);

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    await api.post(`/boards/${board.id}/move-card`, {
      sourceListId: source.droppableId, destListId: destination.droppableId,
      sourceIndex: source.index, destIndex: destination.index
    });
    refresh();
  };

  const createList = async () => {
    if (!title.trim()) return;
    await api.post(`/boards/${board.id}/lists`, { title });
    setTitle('');
    setCreatingList(false);
    refresh();
  };

  return (
    <div className="bg-transparent">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold">{board.title}</h2>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {board.lists.map((list) => (
            <Droppable droppableId={list.id} key={list.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-w-[300px] bg-slate-50 rounded-2xl p-3 border border-slate-200"
                >
                  <List list={list} boardId={board.id} refresh={refresh} />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}

          <div className="min-w-[300px]">
            {creatingList ? (
              <div className="bg-white rounded-2xl p-3 border shadow-soft">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="List title"
                  className="w-full border rounded-xl px-3 py-2 mb-2"
                />
                <div className="flex gap-2">
                  <button onClick={createList} className="px-3 py-2 rounded-xl bg-slate-900 text-white text-sm">Add list</button>
                  <button onClick={() => setCreatingList(false)} className="px-3 py-2 rounded-xl bg-white border text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setCreatingList(true)} className="px-3 py-2 rounded-xl bg-white border text-sm">
                + Add another list
              </button>
            )}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
