"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Share2, 
  MoreHorizontal, 
  Trash2, 
  Edit3,
  Check,
  X,
  Users
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ShareNoteDialog from "@/components/share-note-dialog";
import { toast } from "sonner";

interface NoteHeaderProps {
  note: any;
  noteId: string;
}

export default function NoteHeader({ note, noteId }: NoteHeaderProps) {
  const { user } = useUser();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note?.title || "");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const userEmail = user?.emailAddresses[0]?.emailAddress?.toLowerCase();
  const isOwner = (userEmail === note?.ownerEmail) || (user?.id === note?.ownerId);
  const canEdit = isOwner || (userEmail && note?.collaborators?.[userEmail] === "editor");

  const handleSaveTitle = async () => {
    if (!title.trim()) return;

    try {
      await updateDoc(doc(db, "notes", noteId), {
        title: title.trim(),
        updatedAt: serverTimestamp(),
      });
      setIsEditing(false);
      toast.success("Title updated");
    } catch (error) {
      console.error("Error updating title:", error);
      toast.error("Failed to update title");
    }
  };

  const handleDeleteNote = async () => {
    if (!isOwner) return;

    if (!confirm("Are you sure you want to delete this note? This action cannot be undone.")) return;

    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "notes", noteId));
      toast.success("Note deleted");
      router.push("/");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
      setIsDeleting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setTitle(note?.title || "");
      setIsEditing(false);
    }
  };

  const collaboratorCount = note?.collaboratorEmails?.length || 1;

  return (
    <>
      <header className="border-b bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              {/* Title */}
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="text-xl font-semibold"
                      autoFocus
                    />
                    <Button size="sm" onClick={handleSaveTitle}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        setTitle(note?.title || "");
                        setIsEditing(false);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                      {note?.title || "Untitled"}
                    </h1>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {/* Collaborator Count */}
                    {collaboratorCount > 1 && (
                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>{collaboratorCount} collaborators</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Share Button */}
              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowShareDialog(true)}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}

              {/* More Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canEdit && (
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                  )}
                  {isOwner && (
                    <>
                      <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Note
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleDeleteNote}
                        disabled={isDeleting}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {isDeleting ? "Deleting..." : "Delete"}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <ShareNoteDialog
        noteId={noteId}
        noteTitle={note?.title || "Untitled"}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />
    </>
  );
}