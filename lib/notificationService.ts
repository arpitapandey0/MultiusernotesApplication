// Utility function to send share requests
const NOTIFICATION_SERVICE_URL = process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL || 'http://localhost:8081';

export const shareNote = async (recipientEmail: string, senderEmail: string, noteId: string, noteTitle: string) => {
  try {
    const response = await fetch(`${NOTIFICATION_SERVICE_URL}/api/notifications/share-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientEmail,
        senderEmail,
        noteId,
        noteTitle
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send share request');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sharing note:', error);
    throw error;
  }
};