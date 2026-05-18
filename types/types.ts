export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  isPublic?: boolean;
  collaborators?: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Folder {
  id: string;
  name: string;
  userId: string;
  noteIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ShareSettings {
  isPublic: boolean;
  allowedUsers: string[];
  permissions: 'read' | 'write' | 'admin';
}