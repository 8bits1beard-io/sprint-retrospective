import React, { useState } from 'react';
import { Note as NoteType, ColumnType } from '../types';
import Note from './Note';
import { getColumnConfig } from '../utils';
import { PlusIcon } from '@heroicons/react/24/outline';

interface ColumnProps {
  columnId: ColumnType;
  notes: NoteType[];
  currentUser: string;
  onAddNote: (columnId: ColumnType, text: string, author: string, color: string) => void;
  onEditNote: (noteId: string, newText: string) => void;
  onDeleteNote: (noteId: string) => void;
  onVoteNote: (noteId: string) => void;
}

const Column: React.FC<ColumnProps> = ({
  columnId,
  notes,
  currentUser,
  onAddNote,
  onEditNote,
  onDeleteNote,
  onVoteNote
}) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [selectedColor, setSelectedColor] = useState<'yellow' | 'blue' | 'green' | 'pink'>('yellow');
  
  const config = getColumnConfig(columnId);
  
  const handleAddNote = () => {
    if (newNoteText.trim() && currentUser.trim()) {
      onAddNote(columnId, newNoteText.trim(), currentUser, selectedColor);
      setNewNoteText('');
      setIsAddingNote(false);
      setSelectedColor('yellow');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
    if (e.key === 'Escape') {
      setNewNoteText('');
      setIsAddingNote(false);
    }
  };
  
  return (
    <div className={`flex flex-col h-full border-2 rounded-lg ${config.borderColor} ${config.bgColor}`}>
      <div className={`p-4 ${config.headerBg} border-b ${config.borderColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            <div>
              <h3 className="font-bold text-lg text-gray-800">{config.title}</h3>
              <p className="text-sm text-gray-600">{config.subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddingNote(true)}
            className="p-2 bg-white rounded-full shadow hover:shadow-md transition-shadow"
            title="Add note"
          >
            <PlusIcon className="w-5 h-5 text-walmart-blue" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin space-y-3">
        {isAddingNote && (
          <div className="p-3 bg-white rounded-lg shadow-md border-2 border-gray-300">
            <textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value.substring(0, 280))}
              onKeyDown={handleKeyDown}
              placeholder="Enter your note..."
              className="w-full p-2 border border-gray-200 rounded resize-none focus:outline-none focus:ring-2 focus:ring-walmart-blue"
              maxLength={280}
              autoFocus
              rows={3}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-2">
                {(['yellow', 'blue', 'green', 'pink'] as const).map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      color === 'yellow' ? 'bg-yellow-200 border-yellow-400' :
                      color === 'blue' ? 'bg-blue-200 border-blue-400' :
                      color === 'green' ? 'bg-green-200 border-green-400' :
                      'bg-pink-200 border-pink-400'
                    } ${selectedColor === color ? 'ring-2 ring-walmart-blue ring-offset-1' : ''}`}
                    title={`${color} note`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setNewNoteText('');
                    setIsAddingNote(false);
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-3 py-1 text-sm bg-walmart-blue text-white rounded hover:bg-walmart-dark"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        )}
        
        {notes.map(note => (
          <Note
            key={note.id}
            note={note}
            currentUser={currentUser}
            onEdit={onEditNote}
            onDelete={onDeleteNote}
            onVote={onVoteNote}
          />
        ))}
        
        {notes.length === 0 && !isAddingNote && (
          <div className="text-center text-gray-400 py-8">
            <p>No notes yet</p>
            <p className="text-sm mt-1">Click + to add one</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;