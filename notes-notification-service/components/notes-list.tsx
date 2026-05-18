"use client";

import { useState } from "react";
import { DocumentData, QueryDocumentSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ShareNoteDialog from "@/components/share-note-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  Users, 
  Lock, 
  Edit3, 
  Trash2, 
  Share2,
  Calendar,
  Eye,
  FileText
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

// Simple date formatting function
const formatDistanceToNow = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
};

interface NotesListProps {
  notes: QueryDocumentSnapshot<DocumentData>[];
  loading: boolean;
  emptyMessage: string;
  emptyIcon: React.ReactNode;
  searchQuery?: string;
}

// Faster loading skeleton
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
          <div className="space-y-2 mb-6">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div className="flex -space-x-1">
              <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function NotesList({ notes, loading, emptyMessage, emptyIcon, searchQuery }: NotesListProps) {
  const { user } = useUser();
  const [deletingNotes, setDeletingNotes] = useState<Set<string>>(new Set());
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<{id: string, title: string} | null>(null);

  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this note?")) return;
    
    setDeletingNotes(prev => new Set(prev).add(noteId));
    
    try {
      await deleteDoc(doc(db, "notes", noteId));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    } finally {
      setDeletingNotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(noteId);
        return newSet;
      });
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
            {emptyIcon}
          </div>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
          {searchQuery ? "No notes found" : "No notes yet"}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-lg leading-relaxed mb-8">
          {searchQuery 
            ? `No notes match "${searchQuery}". Try a different search term.`
            : emptyMessage
          }
        </p>
        {!searchQuery && (
          <Link href="/create">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
              <FileText className="h-4 w-4 mr-2" />
              Create Your First Note
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {notes.map((doc) => {
        const note = doc.data();
        const noteId = doc.id;
        const userEmail = user?.emailAddresses[0]?.emailAddress?.toLowerCase();
        const isOwner = (userEmail === note.ownerEmail) || (user?.id === note.ownerId);
        const isDeleting = deletingNotes.has(noteId);
        
        return (
          <Card key={noteId} className="group hover:shadow-xl transition-all duration-300 card-hover border-0 shadow-md bg-white dark:bg-gray-800 overflow-hidden">
            <Link href={`/note/${noteId}`} className="block">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate text-lg mb-1">
                      {note.title || "Untitled"}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDistanceToNow(note.updatedAt?.toDate() || new Date())}</span>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 opacity-60 hover:opacity-100 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 shadow-sm"
                        disabled={isDeleting}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href={`/note/${noteId}`} className="flex items-center">
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Note
                        </Link>
                      </DropdownMenuItem>
                      {isOwner && (
                        <>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedNote({id: noteId, title: note.title || "Untitled"});
                              setShareDialogOpen(true);
                            }}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share Note
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => handleDeleteNote(noteId, e)}
                            disabled={isDeleting}
                            className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {isDeleting ? "Deleting..." : "Delete Note"}
                          </DropdownMenuItem>
                        </>
                      )}
                      {!isOwner && (
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Only
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                  {note.content ? 
                    note.content.replace(/<[^>]*>/g, '').substring(0, 120) + (note.content.length > 120 ? '...' : '') : 
                    'No content yet...'
                  }
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {note.collaboratorEmails && note.collaboratorEmails.length > 1 ? (
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        <Users className="h-3 w-3 mr-1" />
                        Shared
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        <Lock className="h-3 w-3 mr-1" />
                        Private
                      </Badge>
                    )}
                    
                    {isOwner && (
                      <Badge variant="default" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Owner
                      </Badge>
                    )}
                  </div>
                  
                  {note.collaboratorEmails && note.collaboratorEmails.length > 1 && (
                    <div className="flex -space-x-2">
                      {note.collaboratorEmails.slice(0, 3).map((email: string, index: number) => (
                        <div
                          key={email}
                          className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-white font-medium"
                          title={email}
                        >
                          {email.charAt(0).toUpperCase()}
                        </div>
                      ))}
                      {note.collaboratorEmails.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-gray-400 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-white font-medium">
                          +{note.collaboratorEmails.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Link>
          </Card>
        );
      })}
      
      {/* Share Dialog */}
      {selectedNote && (
        <ShareNoteDialog
          noteId={selectedNote.id}
          noteTitle={selectedNote.title}
          open={shareDialogOpen}
          onOpenChange={(open) => {
            setShareDialogOpen(open);
            if (!open) setSelectedNote(null);
          }}
        />
      )}
    </div>
  );
}