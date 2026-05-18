// Utility function to send share requests
export const shareNote = async (recipientEmail: string, senderEmail: string, noteId: string, noteTitle: string) => {
  try {
    const response = await fetch('http://localhost:8081/api/notifications/share-request', {
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