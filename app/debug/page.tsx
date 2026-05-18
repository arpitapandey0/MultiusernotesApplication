"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DebugPage() {
  const { user } = useUser();
  const [allNotes, setAllNotes] = useState<any[]>([]);
  const [myNotes, setMyNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      
      try {
        // Get ALL notes
        const allSnapshot = await getDocs(collection(db, "notes"));
        const all = allSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAllNotes(all);

        // Get my notes by ownerId
        const mySnapshot = await getDocs(
          query(collection(db, "notes"), where("ownerId", "==", user.id))
        );
        const my = mySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMyNotes(my);

        console.log("All notes:", all);
        console.log("My notes:", my);
        console.log("User ID:", user.id);
        console.log("User Email:", user.emailAddresses[0]?.emailAddress);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  if (!user) return <div className="p-8">Please sign in</div>;

  return (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Debug Info</h1>
      
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
        <h2 className="font-bold mb-2 text-black dark:text-white">User Info:</h2>
        <p className="text-black dark:text-white">ID: {user.id}</p>
        <p className="text-black dark:text-white">Email: {user.emailAddresses[0]?.emailAddress}</p>
      </div>

      <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded">
        <h2 className="font-bold mb-2 text-black dark:text-white">All Notes in Database: {allNotes.length}</h2>
        {allNotes.map(note => (
          <div key={note.id} className="mb-2 p-2 bg-white dark:bg-gray-800 rounded text-sm">
            <p className="text-black dark:text-white"><strong>Title:</strong> {note.title}</p>
            <p className="text-black dark:text-white"><strong>Owner ID:</strong> {note.ownerId}</p>
            <p className="text-black dark:text-white"><strong>Owner Email:</strong> {note.ownerEmail}</p>
            <p className="text-black dark:text-white"><strong>Match:</strong> {note.ownerId === user.id ? "✅ YES" : "❌ NO"}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 rounded">
        <h2 className="font-bold mb-2 text-black dark:text-white">My Notes (Query Result): {myNotes.length}</h2>
        {myNotes.map(note => (
          <div key={note.id} className="mb-2 p-2 bg-white dark:bg-gray-800 rounded text-sm">
            <p className="text-black dark:text-white"><strong>Title:</strong> {note.title}</p>
            <p className="text-black dark:text-white"><strong>Owner ID:</strong> {note.ownerId}</p>
          </div>
        ))}
      </div>

      <a href="/" className="text-blue-600 underline">Back to Dashboard</a>
    </div>
  );
}
