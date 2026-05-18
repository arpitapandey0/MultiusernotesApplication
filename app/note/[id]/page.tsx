"use client";

import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { hasNoteAccess } from "@/lib/noteUtils";
import NoteEditor from "@/components/note-editor";
import NoteHeader from "@/components/note-header";
import PresenceIndicators from "@/components/presence-indicators";
import NoteSidebarPanel from "@/components/note-sidebar-panel";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotePage() {
  const params = useParams();
  const { user } = useUser();
  const noteId = params.id as string;

  const [noteDoc, loading, error] = useDocument(doc(db, "notes", noteId));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="border-b bg-white dark:bg-gray-800 p-4">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !noteDoc?.exists()) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Note not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The note you're looking for doesn't exist or you don't have access to it.
          </p>
        </div>
      </div>
    );
  }

  const note = noteDoc.data();
  const userEmail = user?.emailAddresses[0]?.emailAddress?.toLowerCase();
  const hasAccess = user && (
    note?.ownerEmail === userEmail || 
    note?.ownerId === user.id ||
    hasNoteAccess(note, user.id, userEmail || "")
  );

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to view this note.
          </p>
        </div>
      </div>
    );
  }

  const collaboratorCount = note?.collaboratorEmails?.length || 1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NoteHeader note={note} noteId={noteId} />
      <PresenceIndicators noteId={noteId} />
      <NoteSidebarPanel noteId={noteId} collaboratorCount={collaboratorCount} />
      <NoteEditor noteId={noteId} initialContent={note?.content || ""} />
    </div>
  );
}