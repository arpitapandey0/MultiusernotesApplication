// Frontend integration for Next.js app
// Add this to your components/notification-bar.tsx

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Bell, Check, X } from 'lucide-react';

export default function NotificationBar() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user?.emailAddresses[0]?.emailAddress) return;

    // Fetch existing notifications
    fetchNotifications();

    // Setup WebSocket connection
    const ws = new WebSocket('ws://localhost:8080/ws-notifications');
    setSocket(ws);

    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotifications(prev => [notification, ...prev]);
    };

    return () => ws.close();
  }, [user]);

  const fetchNotifications = async () => {
    const email = user?.emailAddresses[0]?.emailAddress;
    const response = await fetch(`http://localhost:8080/api/notifications/user/${email}`);
    const data = await response.json();
    setNotifications(data);
  };

  const handleAccept = async (notificationId) => {
    await fetch(`http://localhost:8080/api/notifications/${notificationId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail: user?.emailAddresses[0]?.emailAddress })
    });
    fetchNotifications();
  };

  const handleReject = async (notificationId) => {
    await fetch(`http://localhost:8080/api/notifications/${notificationId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail: user?.emailAddresses[0]?.emailAddress })
    });
    fetchNotifications();
  };

  const shareNote = async (recipientEmail, noteId, noteTitle) => {
    await fetch('http://localhost:8080/api/notifications/share-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientEmail,
        senderEmail: user?.emailAddresses[0]?.emailAddress,
        noteId,
        noteTitle
      })
    });
  };

  const pendingNotifications = notifications.filter(n => n.status === 'PENDING' && n.type === 'SHARE_REQUEST');

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" className="relative">
        <Bell className="h-4 w-4" />
        {pendingNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {pendingNotifications.length}
          </span>
        )}
      </Button>
      
      {pendingNotifications.length > 0 && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Share Requests</h3>
            {pendingNotifications.map(notification => (
              <div key={notification.id} className="border-b pb-3 mb-3 last:border-b-0">
                <p className="text-sm">
                  <strong>{notification.senderEmail}</strong> wants to share 
                  <strong> "{notification.noteTitle}"</strong> with you
                </p>
                <div className="flex space-x-2 mt-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleAccept(notification.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Accept
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleReject(notification.id)}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}