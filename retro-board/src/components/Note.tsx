import React, { useState } from 'react';
import { Note as NoteType } from '../types';
import { getNoteColor, formatDate } from '../utils';
import { PencilIcon, TrashIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolid } from '@heroicons/react/24/solid';

interface NoteProps {
  note: NoteType;
  currentUser: string;
  onEdit: (noteId: string, newText: string) => void;
  onDelete: (noteId: string) => void;
  onVote: (noteId: string) => void;
  isDragging?: boolean;
}

const Note: React.FC<NoteProps> = ({ note, currentUser, onEdit, onDelete, onVote, isDragging }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(note.text);
  const isAuthor = note.author === currentUser;
  const hasVoted = note.votes.includes(currentUser);
  
  const handleEdit = () => {
    if (editText.trim() && editText !== note.text) {
      onEdit(note.id, editText.trim());
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEdit();
    }
    if (e.key === 'Escape') {
      setEditText(note.text);
      setIsEditing(false);
    }
  };
  
  return (
    <div
      className={`relative p-3 rounded-lg shadow-md border-2 ${getNoteColor(note.color)} 
        ${isDragging ? 'opacity-50 rotate-3' : ''} transition-all duration-200 hover:shadow-lg`}
      style={{ minHeight: '120px' }}
    >
      {isEditing ? (
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value.substring(0, 280))}
          onBlur={handleEdit}
          onKeyDown={handleKeyDown}
          className="w-full p-2 bg-white rounded border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-walmart-blue"
          maxLength={280}
          autoFocus
          rows={3}
        />
      ) : (
        <>
          <div className="text-sm text-gray-800 mb-2 whitespace-pre-wrap break-words">
            {note.text}
          </div>
          
          <div className="absolute bottom-2 left-3 right-3">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium">{note.author}</span>
                <span className="text-gray-400">
                  {formatDate(note.timestamp)}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                {isAuthor && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(note.id)}
                      className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors text-red-600"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => onVote(note.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded transition-colors
                    ${hasVoted ? 'bg-walmart-blue text-white' : 'hover:bg-white hover:bg-opacity-50'}`}
                  title={hasVoted ? 'Remove vote' : 'Vote'}
                >
                  {hasVoted ? (
                    <HandThumbUpSolid className="w-4 h-4" />
                  ) : (
                    <HandThumbUpIcon className="w-4 h-4" />
                  )}
                  <span className="font-medium">{note.votes.length}</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Note;