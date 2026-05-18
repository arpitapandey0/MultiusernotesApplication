import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";

export async function handleShareAccept(noteId: string, recipientEmail: string) {
  try {
    const noteRef = doc(db, "notes", noteId);
    
    // Add the user as a collaborator when they accept
    await updateDoc(noteRef, {
      [`collaborators.${recipientEmail}`]: "editor",
      collaboratorEmails: arrayUnion(recipientEmail),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error accepting share:', error);
    throw error;
  }
}