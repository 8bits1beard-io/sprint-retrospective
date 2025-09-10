import React, { useState } from 'react';
import { ActionItem } from '../types';
import { CheckCircleIcon, XCircleIcon, UserIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

interface ActionItemsProps {
  actionItems: ActionItem[];
  onAddActionItem: (text: string, owner: string) => void;
  onToggleActionItem: (id: string) => void;
  onDeleteActionItem: (id: string) => void;
}

const ActionItems: React.FC<ActionItemsProps> = ({
  actionItems,
  onAddActionItem,
  onToggleActionItem,
  onDeleteActionItem
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [newItemOwner, setNewItemOwner] = useState('');
  
  const handleAdd = () => {
    if (newItemText.trim() && newItemOwner.trim()) {
      onAddActionItem(newItemText.trim(), newItemOwner.trim());
      setNewItemText('');
      setNewItemOwner('');
      setIsAdding(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-walmart-blue p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span>📋</span> Action Items
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-walmart-blue text-white rounded hover:bg-walmart-dark transition-colors"
        >
          Add Action Item
        </button>
      </div>
      
      {isAdding && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Action item description..."
            className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-walmart-blue"
            autoFocus
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={newItemOwner}
              onChange={(e) => setNewItemOwner(e.target.value)}
              placeholder="Owner name..."
              className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-walmart-blue"
            />
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewItemText('');
                setNewItemOwner('');
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {actionItems.map(item => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              item.completed 
                ? 'bg-green-50 border-green-300' 
                : 'bg-gray-50 border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleActionItem(item.id)}
                className="text-green-600 hover:text-green-700"
              >
                {item.completed ? (
                  <CheckCircleSolid className="w-6 h-6" />
                ) : (
                  <CheckCircleIcon className="w-6 h-6" />
                )}
              </button>
              <div className={item.completed ? 'line-through text-gray-500' : ''}>
                <p className="font-medium">{item.text}</p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <UserIcon className="w-4 h-4" />
                  {item.owner}
                </p>
              </div>
            </div>
            <button
              onClick={() => onDeleteActionItem(item.id)}
              className="text-red-500 hover:text-red-600"
            >
              <XCircleIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
        
        {actionItems.length === 0 && !isAdding && (
          <p className="text-center text-gray-400 py-4">No action items yet</p>
        )}
      </div>
    </div>
  );
};

export default ActionItems;