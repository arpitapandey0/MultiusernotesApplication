"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Bell, Check, X } from 'lucide-react';
import { handleShareAccept } from '@/lib/shareAcceptHandler';
import { toast } from 'sonner';

interface Notification {
  id: number;
  recipientEmail: string;
  senderEmail: string;
  noteId: string;
  noteTitle: string;
  type: string;
  status: string;
  createdAt: string;
}

export default function NotificationBar() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!user?.emailAddresses[0]?.emailAddress) return;
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const email = user?.emailAddresses[0]?.emailAddress;
      const response = await fetch(`http://localhost:8081/api/notifications/user/${email}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleAccept = async (notification: Notification) => {
    try {
      // First update Firebase to add collaborator
      await handleShareAccept(notification.noteId, notification.recipientEmail);
      
      // Then update notification status
      await fetch(`http://localhost:8081/api/notifications/${notification.id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: user?.emailAddresses[0]?.emailAddress })
      });
      
      toast.success('Share request accepted!');
      fetchNotifications();
    } catch (error) {
      console.error('Failed to accept notification:', error);
      toast.error('Failed to accept share request');
    }
  };

  const handleReject = async (notification: Notification) => {
    try {
      await fetch(`http://localhost:8081/api/notifications/${notification.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: user?.emailAddresses[0]?.emailAddress })
      });
      
      toast.success('Share request rejected');
      fetchNotifications();
    } catch (error) {
      console.error('Failed to reject notification:', error);
      toast.error('Failed to reject share request');
    }
  };

  const pendingNotifications = notifications.filter(n => n.status === 'PENDING' && n.type === 'SHARE_REQUEST');

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="relative"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Bell className="h-4 w-4" />
        {pendingNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {pendingNotifications.length}
          </span>
        )}
      </Button>
      
      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Notifications</h3>
            {pendingNotifications.length === 0 ? (
              <p className="text-sm text-gray-500">No new notifications</p>
            ) : (
              pendingNotifications.map(notification => (
                <div key={notification.id} className="border-b pb-3 mb-3 last:border-b-0">
                  <p className="text-sm">
                    <strong>{notification.senderEmail}</strong> wants to share 
                    <strong> "{notification.noteTitle}"</strong> with you
                  </p>
                  <div className="flex space-x-2 mt-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleAccept(notification)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleReject(notification)}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}