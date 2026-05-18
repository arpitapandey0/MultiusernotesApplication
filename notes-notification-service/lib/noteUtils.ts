import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { shareNote } from "./notificationService";

export interface ShareNoteParams {
  noteId: string;
  email: string;
  role: "editor" | "viewer";
}

export async function shareNoteWithUser({ noteId, email, role }: ShareNoteParams, senderEmail: string) {
  const noteRef = doc(db, "notes", noteId);
  const noteDoc = await getDoc(noteRef);
  
  if (!noteDoc.exists()) {
    throw new Error("Note not found");
  }

  const noteData = noteDoc.data();
  const trimmedEmail = email.trim().toLowerCase();
  
  // Check if email is already shared
  if (noteData.collaboratorEmails?.includes(trimmedEmail)) {
    throw new Error("Note is already shared with this email");
  }

  // Send notification instead of directly sharing
  try {
    await shareNote(trimmedEmail, senderEmail, noteId, noteData.title || 'Untitled Note');
  } catch (error) {
    console.error('Failed to send notification:', error);
    throw new Error('Failed to send share request');
  }

  return { success: true };
}

export function hasNoteAccess(note: any, userId: string, userEmail: string): boolean {
  if (!note || !userId) return false;
  
  const normalizedEmail = userEmail?.toLowerCase();
  
  return (
    note.ownerId === userId ||
    note.collaborators?.[userId] ||
    (normalizedEmail && note.collaboratorEmails?.includes(normalizedEmail)) ||
    (normalizedEmail && note.collaborators?.[normalizedEmail])
  );
}

export function getUserRoleInNote(note: any, userId: string, userEmail: string): string | null {
  if (!note || !userId) return null;
  
  const normalizedEmail = userEmail?.toLowerCase();
  
  if (note.ownerId === userId) return "owner";
  if (note.collaborators?.[userId]) return note.collaborators[userId];
  if (normalizedEmail && note.collaborators?.[normalizedEmail]) {
    return note.collaborators[normalizedEmail];
  }
  
  return null;
}