import { BoardData, Note, ActionItem } from './types';
import { formatDate } from './utils';

const STORAGE_KEY = 'retro-board-data';
const SHARED_STORAGE_KEY = 'retro-board-shared';

export class LocalStorage {
  private listeners: Set<(data: BoardData) => void> = new Set();
  private pollInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Poll for changes every 500ms for cross-tab synchronization
    this.startPolling();
    
    // Listen for storage events from other tabs
    window.addEventListener('storage', this.handleStorageChange);
  }

  private startPolling() {
    this.pollInterval = setInterval(() => {
      this.checkForUpdates();
    }, 500);
  }

  private checkForUpdates() {
    const data = this.getData();
    this.notifyListeners(data);
  }

  private handleStorageChange = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const data = JSON.parse(e.newValue);
        this.notifyListeners(data);
      } catch (error) {
        console.error('Error parsing storage data:', error);
      }
    }
  };

  private notifyListeners(data: BoardData) {
    this.listeners.forEach(listener => listener(data));
  }

  subscribe(listener: (data: BoardData) => void) {
    this.listeners.add(listener);
    // Immediately call with current data
    listener(this.getData());
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  getData(): BoardData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }

    // Return default data
    return {
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
    };
  }

  setData(data: BoardData) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.notifyListeners(data);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  updateNote(columnId: string, note: Note) {
    const data = this.getData();
    const column = data.columns[columnId as keyof typeof data.columns];
    const existingIndex = column.findIndex(n => n.id === note.id);
    
    if (existingIndex >= 0) {
      column[existingIndex] = note;
    } else {
      column.push(note);
    }
    
    this.setData(data);
  }

  deleteNote(noteId: string) {
    const data = this.getData();
    
    Object.keys(data.columns).forEach(columnId => {
      const column = data.columns[columnId as keyof typeof data.columns];
      const index = column.findIndex(n => n.id === noteId);
      if (index >= 0) {
        column.splice(index, 1);
      }
    });
    
    this.setData(data);
  }

  updateActionItem(item: ActionItem) {
    const data = this.getData();
    const existingIndex = data.actionItems.findIndex(i => i.id === item.id);
    
    if (existingIndex >= 0) {
      data.actionItems[existingIndex] = item;
    } else {
      data.actionItems.push(item);
    }
    
    this.setData(data);
  }

  deleteActionItem(itemId: string) {
    const data = this.getData();
    data.actionItems = data.actionItems.filter(i => i.id !== itemId);
    this.setData(data);
  }

  updateSprintInfo(sprint: string, date: string) {
    const data = this.getData();
    data.sprint = sprint;
    data.date = date;
    this.setData(data);
  }

  clearBoard() {
    const data = this.getData();
    data.columns = {
      liked: [],
      learned: [],
      lacked: [],
      longedFor: []
    };
    data.actionItems = [];
    this.setData(data);
  }

  destroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
    window.removeEventListener('storage', this.handleStorageChange);
  }
}

// Singleton instance
export const storage = new LocalStorage();