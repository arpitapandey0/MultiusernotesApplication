"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Header from "@/components/Header";
import Sidebar from "@/components/sidebar";
import NotesList from "@/components/notes-list";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"my-notes" | "shared">("my-notes");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user's notes using ownerEmail only
  const userEmail = user?.emailAddresses[0]?.emailAddress?.toLowerCase();
  
  const [myNotes, loadingMyNotes] = useCollection(
    userEmail
      ? query(
          collection(db, "notes"),
          where("ownerEmail", "==", userEmail)
        )
      : null
  );

  // Fetch shared notes - using email for better persistence
  const [sharedNotes, loadingSharedNotes] = useCollection(
    userEmail
      ? query(
          collection(db, "notes"),
          where("collaboratorEmails", "array-contains", userEmail)
        )
      : null
  );

  // Filter out notes owned by the current user from shared notes
  const actualSharedNotes = sharedNotes?.docs.filter(doc => {
    const noteData = doc.data();
    return noteData.ownerEmail !== userEmail && noteData.ownerId !== user?.id;
  }) || [];

  // Filter notes based on search query
  const filterNotes = (notes: any[]) => {
    if (!searchQuery) return notes;
    return notes.filter(doc => {
      const note = doc.data();
      return (
        note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  const filteredMyNotes = filterNotes(myNotes?.docs || []).sort((a, b) => {
    const aTime = a.data().updatedAt?.toMillis() || 0;
    const bTime = b.data().updatedAt?.toMillis() || 0;
    return bTime - aTime;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {activeTab === "my-notes" ? "My Notes" : "Shared with Me"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {activeTab === "my-notes" 
                    ? "Create and manage your personal notes"
                    : "Notes shared by your collaborators"
                  }
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                
                {/* Create Note Button */}
                {activeTab === "my-notes" && (
                  <Link href="/create">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                      <Plus className="h-4 w-4 mr-2" />
                      New Note
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Stats Cards - Only show when not loading */}
            {!loadingMyNotes && !loadingSharedNotes && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Notes</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {(myNotes?.docs.length || 0) + actualSharedNotes.length}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">My Notes</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {myNotes?.docs.length || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Shared Notes</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {actualSharedNotes.length}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes Grid */}
            {activeTab === "my-notes" ? (
              <NotesList 
                notes={filteredMyNotes} 
                loading={loadingMyNotes}
                emptyMessage="No notes yet. Create your first note to get started!"
                emptyIcon={<FileText className="h-16 w-16 text-gray-400" />}
                searchQuery={searchQuery}
              />
            ) : (
              <NotesList 
                notes={filterNotes(actualSharedNotes)} 
                loading={loadingSharedNotes}
                emptyMessage="No shared notes yet. Ask someone to share a note with you!"
                emptyIcon={<Users className="h-16 w-16 text-gray-400" />}
                searchQuery={searchQuery}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}