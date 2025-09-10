import React, { useState, useEffect, useCallback } from 'react';
import { storage } from './storage';
import Column from './components/Column';
import ActionItems from './components/ActionItems';
import Timer from './components/Timer';
import { BoardData, Note, ActionItem, ColumnType } from './types';
import { generateId, formatDate, exportToMarkdown, downloadMarkdown, sanitizeInput, formatTimestamp } from './utils';
import { ArrowDownTrayIcon, FolderIcon, TrashIcon } from '@heroicons/react/24/outline';

function App() {
  const [boardData, setBoardData] = useState<BoardData>({
    sprint: '23',
    date: formatDate(new Date()),
    columns: {
      liked: [],
      learned: [],
      lacked: [],
      longedFor: []
    },
    actionItems: [],
    activeUsers: 1
  });
  
  const [currentUser, setCurrentUser] = useState('');
  const [isEditingSprint, setIsEditingSprint] = useState(false);
  const [sprintNumber, setSprintNumber] = useState('23');
  const [showUserModal, setShowUserModal] = useState(true);
  
  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = storage.subscribe((data) => {
      setBoardData(data);
      setSprintNumber(data.sprint);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Save user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('retro-user', currentUser);
    }
  }, [currentUser]);
  
  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('retro-user');
    if (savedUser) {
      setCurrentUser(savedUser);
      setShowUserModal(false);
    }
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'n':
            e.preventDefault();
            // Focus on add note button
            const addButton = document.querySelector('[title="Add note"]') as HTMLElement;
            if (addButton) addButton.click();
            break;
          case 'e':
            e.preventDefault();
            handleExport();
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [boardData]);
  
  const handleAddNote = useCallback((columnId: ColumnType, text: string, author: string, color: string) => {
    const note: Note = {
      id: generateId(),
      text: sanitizeInput(text),
      author: sanitizeInput(author),
      timestamp: formatTimestamp(new Date()),
      color: color as 'yellow' | 'blue' | 'green' | 'pink',
      votes: [],
      columnId
    };
    
    storage.updateNote(columnId, note);
  }, []);
  
  const handleEditNote = useCallback((noteId: string, newText: string) => {
    const data = storage.getData();
    
    Object.entries(data.columns).forEach(([columnId, notes]) => {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        note.text = sanitizeInput(newText);
        storage.updateNote(columnId, note);
      }
    });
  }, []);
  
  const handleDeleteNote = useCallback((noteId: string) => {
    storage.deleteNote(noteId);
  }, []);
  
  const handleVoteNote = useCallback((noteId: string) => {
    if (!currentUser) return;
    
    const data = storage.getData();
    
    Object.entries(data.columns).forEach(([columnId, notes]) => {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        const hasVoted = note.votes.includes(currentUser);
        note.votes = hasVoted
          ? note.votes.filter(v => v !== currentUser)
          : [...note.votes, currentUser];
        
        storage.updateNote(columnId, note);
      }
    });
  }, [currentUser]);
  
  const handleAddActionItem = useCallback((text: string, owner: string) => {
    const item: ActionItem = {
      id: generateId(),
      text: sanitizeInput(text),
      owner: sanitizeInput(owner),
      dateAdded: formatTimestamp(new Date()),
      completed: false
    };
    
    storage.updateActionItem(item);
  }, []);
  
  const handleToggleActionItem = useCallback((id: string) => {
    const data = storage.getData();
    const item = data.actionItems.find(i => i.id === id);
    
    if (item) {
      item.completed = !item.completed;
      storage.updateActionItem(item);
    }
  }, []);
  
  const handleDeleteActionItem = useCallback((id: string) => {
    storage.deleteActionItem(id);
  }, []);
  
  const handleUpdateSprint = () => {
    storage.updateSprintInfo(sprintNumber, formatDate(new Date()));
    setIsEditingSprint(false);
  };
  
  const handleClearBoard = () => {
    if (window.confirm('Are you sure you want to clear the entire board? This action cannot be undone.')) {
      storage.clearBoard();
    }
  };
  
  const handleExport = () => {
    const markdown = exportToMarkdown(boardData);
    downloadMarkdown(markdown, boardData.sprint, boardData.date);
  };
  
  if (showUserModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-walmart-light to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Sprint Retrospective</h2>
          <p className="text-gray-600 mb-6">Please enter your name to continue</p>
          <input
            type="text"
            value={currentUser}
            onChange={(e) => setCurrentUser(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && currentUser.trim()) {
                setShowUserModal(false);
              }
            }}
            placeholder="Your name..."
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue focus:border-transparent"
            autoFocus
          />
          <button
            onClick={() => {
              if (currentUser.trim()) {
                setShowUserModal(false);
              }
            }}
            disabled={!currentUser.trim()}
            className="w-full mt-4 py-3 bg-walmart-blue text-white rounded-lg hover:bg-walmart-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Join Board
          </button>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This board uses local storage. Data is saved in your browser and synchronized across tabs on the same device.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-walmart-light to-white">
      {/* Header */}
      <header className="bg-walmart-blue text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Windows Engineering OS Team - Sprint Retrospective</h1>
              <div className="flex items-center gap-4 mt-2">
                {isEditingSprint ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={sprintNumber}
                      onChange={(e) => setSprintNumber(e.target.value)}
                      className="px-2 py-1 text-black rounded"
                      autoFocus
                    />
                    <button
                      onClick={handleUpdateSprint}
                      className="px-3 py-1 bg-green-500 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingSprint(true)}
                    className="hover:underline"
                  >
                    Sprint {boardData.sprint} - {boardData.date}
                  </button>
                )}
                <div className="flex items-center gap-1">
                  <FolderIcon className="w-5 h-5" />
                  <span>Local Storage Mode</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Timer />
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-walmart-yellow text-walmart-blue rounded-lg hover:bg-yellow-400 transition-colors font-medium"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                Export
              </button>
              <button
                onClick={handleClearBoard}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
                Clear
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Board */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" style={{ minHeight: '500px' }}>
          {(['liked', 'learned', 'lacked', 'longedFor'] as ColumnType[]).map(columnId => (
            <Column
              key={columnId}
              columnId={columnId}
              notes={boardData.columns[columnId]}
              currentUser={currentUser}
              onAddNote={handleAddNote}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
              onVoteNote={handleVoteNote}
            />
          ))}
        </div>
        
        {/* Action Items */}
        <ActionItems
          actionItems={boardData.actionItems}
          onAddActionItem={handleAddActionItem}
          onToggleActionItem={handleToggleActionItem}
          onDeleteActionItem={handleDeleteActionItem}
        />
      </main>
      
      {/* Footer */}
      <footer className="mt-8 py-4 text-center text-gray-500 text-sm">
        <p>Keyboard shortcuts: Ctrl+N (New Note) | Ctrl+E (Export)</p>
        <p className="mt-2">Data is stored locally in your browser and syncs across tabs</p>
        <p className="mt-1">Developed by Joshua Walderbach - September 2025</p>
      </footer>
    </div>
  );
}

export default App;