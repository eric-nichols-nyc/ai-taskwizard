import React, { useState } from 'react';
import { Task } from '@turbo-with-tailwind-v4/database/types';

export const AddTaskForm: React.FC<{ columnId: string; onClose: () => void, addTask: (task: Partial<Task>) => void }> = ({ columnId, onClose, addTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (title.trim()) {
      addTask({
        column_id: columnId,
        title: title,
        description: description,
      });
      setTitle('');
      setDescription('');
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 text-black">
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyPress={handleKeyPress}
        className="w-full p-2 mb-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoFocus
      />
      <textarea
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 mb-2 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={2}
      />
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Add Task
        </button>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};