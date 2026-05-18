import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function handleShareAccept(noteId: string, recipientEmail: string) {
  try {
    const noteRef = doc(db, "notes", noteId);
    const normalizedEmail = recipientEmail.trim().toLowerCase();
    console.log('handleShareAccept: updating note', noteId, 'for', normalizedEmail);

    const noteDoc = await getDoc(noteRef);
    const noteData = noteDoc.data();
    const collaboratorEmails = Array.isArray(noteData?.collaboratorEmails)
      ? noteData.collaboratorEmails
      : [];
    const collaborators = noteData?.collaborators ?? {};

    // Add the user as a collaborator when they accept
    await setDoc(noteRef, {
      collaborators: {
        ...collaborators,
        [normalizedEmail]: "editor",
      },
      collaboratorEmails: Array.from(new Set([...collaboratorEmails, normalizedEmail])),
    }, { merge: true });
    
    return { success: true };
  } catch (error) {
    console.error('Error accepting share:', error);
    throw error;
  }
}