import React, { useState } from 'react';
import { ActionItem } from '../types';
import { CheckCircleIcon, XCircleIcon, UserIcon, PlusIcon } from '@heroicons/react/24/outline';
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
    <div className="flex flex-col h-full border-2 rounded-lg border-blue-300 bg-blue-50">
      <div className="p-4 bg-blue-100 border-b border-blue-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <div>
              <h3 className="font-bold text-lg text-gray-800">Action Items</h3>
              <p className="text-sm text-gray-600">Concrete improvements for next sprint</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="p-2 bg-white rounded-full shadow hover:shadow-md transition-shadow"
            title="Add action item"
          >
            <PlusIcon className="w-5 h-5 text-walmart-blue" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin space-y-3">
        {isAdding && (
          <div className="p-3 bg-white rounded-lg shadow-md border-2 border-gray-300">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Action item description..."
              className="w-full p-2 border border-gray-200 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-walmart-blue"
              autoFocus
            />
            <input
              type="text"
              value={newItemOwner}
              onChange={(e) => setNewItemOwner(e.target.value)}
              placeholder="Owner name..."
              className="w-full p-2 border border-gray-200 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-walmart-blue"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-walmart-blue text-white rounded hover:bg-walmart-dark"
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
        
        {actionItems.length === 0 && !isAdding ? (
          <p className="text-gray-500 text-center py-8">No action items yet. Add one to get started!</p>
        ) : (
          <>
            {actionItems.map(item => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-lg border-2 shadow-sm ${
                  item.completed 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-white border-gray-200'
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
          </>
        )}
      </div>
    </div>
  );
};

export default ActionItems;