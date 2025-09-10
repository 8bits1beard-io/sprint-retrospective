import { format } from 'date-fns';
import { BoardData, Note, ActionItem } from './types';

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};

export const formatTimestamp = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, "yyyy-MM-dd'T'HH:mm:ss'Z'");
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, 280);
};

export const exportToMarkdown = (boardData: BoardData): string => {
  const { sprint, date, columns, actionItems } = boardData;
  
  let markdown = `# Windows Engineering OS Team - Sprint Retrospective\n\n`;
  markdown += `**Sprint:** ${sprint}\n`;
  markdown += `**Date:** ${date}\n`;
  markdown += `**Exported:** ${formatDate(new Date())}\n\n`;
  
  markdown += `## Liked (What went well)\n\n`;
  columns.liked.forEach(note => {
    markdown += `- ${note.text} (${note.author}) [${note.votes.length} votes]\n`;
  });
  
  markdown += `\n## Learned (New discoveries)\n\n`;
  columns.learned.forEach(note => {
    markdown += `- ${note.text} (${note.author}) [${note.votes.length} votes]\n`;
  });
  
  markdown += `\n## Lacked (What was missing)\n\n`;
  columns.lacked.forEach(note => {
    markdown += `- ${note.text} (${note.author}) [${note.votes.length} votes]\n`;
  });
  
  markdown += `\n## Longed For (What we wished we had)\n\n`;
  columns.longedFor.forEach(note => {
    markdown += `- ${note.text} (${note.author}) [${note.votes.length} votes]\n`;
  });
  
  if (actionItems.length > 0) {
    markdown += `\n## Action Items\n\n`;
    actionItems.forEach(item => {
      const status = item.completed ? '✅' : '⬜';
      markdown += `- ${status} ${item.text} (Owner: ${item.owner})\n`;
    });
  }
  
  return markdown;
};

export const downloadMarkdown = (content: string, sprint: string, date: string): void => {
  const filename = `Retro_Sprint${sprint}_${date}.md`;
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const getColumnConfig = (columnId: string) => {
  const configs = {
    liked: {
      title: 'Liked',
      subtitle: 'What went well',
      icon: '👍',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      headerBg: 'bg-green-100'
    },
    learned: {
      title: 'Learned',
      subtitle: 'New discoveries',
      icon: '💡',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      headerBg: 'bg-blue-100'
    },
    lacked: {
      title: 'Lacked',
      subtitle: 'What was missing',
      icon: '❌',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      headerBg: 'bg-red-100'
    },
    longedFor: {
      title: 'Longed For',
      subtitle: 'What we wished we had',
      icon: '🌟',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300',
      headerBg: 'bg-yellow-100'
    }
  };
  
  return configs[columnId as keyof typeof configs];
};

export const getNoteColor = (color: string) => {
  const colors = {
    yellow: 'bg-yellow-200 border-yellow-400',
    blue: 'bg-blue-200 border-blue-400',
    green: 'bg-green-200 border-green-400',
    pink: 'bg-pink-200 border-pink-400'
  };
  
  return colors[color as keyof typeof colors] || colors.yellow;
};