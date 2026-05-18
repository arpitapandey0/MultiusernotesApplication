"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { 
  doc, 
  setDoc, 
  deleteDoc, 
  collection, 
  onSnapshot,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";


interface PresenceIndicatorsProps {
  noteId: string;
}

interface PresenceUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  lastSeen: any;
}

export default function PresenceIndicators({ noteId }: PresenceIndicatorsProps) {
  const { user } = useUser();
  const [activeUsers, setActiveUsers] = useState<PresenceUser[]>([]);

  useEffect(() => {
    if (!user) return;

    // Set user as active
    const userPresenceRef = doc(db, "presence", noteId, "users", user.id);
    setDoc(userPresenceRef, {
      id: user.id,
      name: user.firstName || user.emailAddresses[0]?.emailAddress || "Anonymous",
      email: user.emailAddresses[0]?.emailAddress || "",
      avatar: user.imageUrl,
      lastSeen: serverTimestamp(),
    });

    // Listen to all active users
    const unsubscribe = onSnapshot(
      collection(db, "presence", noteId, "users"),
      (snapshot) => {
        const users: PresenceUser[] = [];
        snapshot.forEach((doc) => {
          const userData = doc.data() as PresenceUser;
          // Only show users active in last 30 seconds
          const lastSeen = userData.lastSeen?.toDate();
          if (lastSeen && Date.now() - lastSeen.getTime() < 30000) {
            users.push(userData);
          }
        });
        setActiveUsers(users);
      }
    );

    // Update presence every 10 seconds
    const interval = setInterval(() => {
      setDoc(userPresenceRef, {
        id: user.id,
        name: user.firstName || user.emailAddresses[0]?.emailAddress || "Anonymous",
        email: user.emailAddresses[0]?.emailAddress || "",
        avatar: user.imageUrl,
        lastSeen: serverTimestamp(),
      });
    }, 10000);

    // Cleanup on unmount
    return () => {
      unsubscribe();
      clearInterval(interval);
      deleteDoc(userPresenceRef);
    };
  }, [user, noteId]);

  if (activeUsers.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Active ({activeUsers.length})
          </span>
          <div className="flex -space-x-2">
            {activeUsers.slice(0, 5).map((activeUser) => (
              <div
                key={activeUser.id}
                className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-medium text-white"
                title={activeUser.name}
              >
                {activeUser.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {activeUsers.length > 5 && (
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white flex items-center justify-center text-xs font-medium">
                +{activeUsers.length - 5}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}