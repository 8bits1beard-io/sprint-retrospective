export interface Note {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  color: 'yellow' | 'blue' | 'green' | 'pink';
  votes: string[];
  columnId: ColumnType;
  position?: { x: number; y: number };
}

export interface ActionItem {
  id: string;
  text: string;
  owner: string;
  dateAdded: string;
  completed: boolean;
}

export type ColumnType = 'liked' | 'learned' | 'lacked' | 'longedFor';

export interface BoardData {
  sprint: string;
  date: string;
  columns: {
    liked: Note[];
    learned: Note[];
    lacked: Note[];
    longedFor: Note[];
  };
  actionItems: ActionItem[];
  activeUsers: number;
}

export interface User {
  id: string;
  name: string;
  isTyping: boolean;
  lastSeen: string;
}