import { database } from './firebase';
import { ref, set, onValue, off, push, remove, update } from 'firebase/database';
import { BoardData, Note, ActionItem } from './types';
import { formatDate } from './utils';

export class FirebaseStorage {
  private listeners: Set<(data: BoardData) => void> = new Set();
  private sessionId: string;
  private sessionRef: any;
  private unsubscribe: (() => void) | null = null;

  constructor(sessionId?: string) {
    // Generate or use provided session ID
    this.sessionId = sessionId || this.generateSessionId();
    this.sessionRef = ref(database, `sessions/${this.sessionId}`);
    this.initializeSession();
  }

  private generateSessionId(): string {
    // Generate a random 6-character session ID
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private async initializeSession() {
    // Set up real-time listener
    this.unsubscribe = onValue(this.sessionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.notifyListeners(data);
      } else {
        // Initialize with default data if session doesn't exist
        this.setData(this.getDefaultData());
      }
    });
  }

  private getDefaultData(): BoardData {
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

  private notifyListeners(data: BoardData) {
    this.listeners.forEach(listener => listener(data));
  }

  subscribe(listener: (data: BoardData) => void) {
    this.listeners.add(listener);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  async getData(): Promise<BoardData> {
    return new Promise((resolve) => {
      onValue(this.sessionRef, (snapshot) => {
        const data = snapshot.val();
        resolve(data || this.getDefaultData());
      }, { onlyOnce: true });
    });
  }

  async setData(data: BoardData) {
    try {
      await set(this.sessionRef, data);
    } catch (error) {
      console.error('Error writing to Firebase:', error);
    }
  }

  async updateNote(columnId: string, note: Note) {
    const data = await this.getData();
    const column = data.columns[columnId as keyof typeof data.columns];
    const existingIndex = column.findIndex(n => n.id === note.id);
    
    if (existingIndex >= 0) {
      column[existingIndex] = note;
    } else {
      column.push(note);
    }
    
    await this.setData(data);
  }

  async deleteNote(noteId: string) {
    const data = await this.getData();
    
    Object.keys(data.columns).forEach(columnId => {
      const column = data.columns[columnId as keyof typeof data.columns];
      const index = column.findIndex(n => n.id === noteId);
      if (index >= 0) {
        column.splice(index, 1);
      }
    });
    
    await this.setData(data);
  }

  async updateActionItem(item: ActionItem) {
    const data = await this.getData();
    const existingIndex = data.actionItems.findIndex(i => i.id === item.id);
    
    if (existingIndex >= 0) {
      data.actionItems[existingIndex] = item;
    } else {
      data.actionItems.push(item);
    }
    
    await this.setData(data);
  }

  async deleteActionItem(itemId: string) {
    const data = await this.getData();
    data.actionItems = data.actionItems.filter(i => i.id !== itemId);
    await this.setData(data);
  }

  async updateSprintInfo(sprint: string, date: string) {
    const data = await this.getData();
    data.sprint = sprint;
    data.date = date;
    await this.setData(data);
  }

  async clearBoard() {
    const data = await this.getData();
    data.columns = {
      liked: [],
      learned: [],
      lacked: [],
      longedFor: []
    };
    data.actionItems = [];
    await this.setData(data);
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getSessionUrl(): string {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?session=${this.sessionId}`;
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

// Export function to create storage instance
export const createFirebaseStorage = (sessionId?: string) => {
  return new FirebaseStorage(sessionId);
};