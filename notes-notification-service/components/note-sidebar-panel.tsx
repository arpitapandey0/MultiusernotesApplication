"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, History, Users, X } from "lucide-react";
import NoteComments from "./note-comments";
import NoteVersionHistory from "./note-version-history";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface NoteSidebarPanelProps {
  noteId: string;
  collaboratorCount: number;
}

export default function NoteSidebarPanel({ noteId, collaboratorCount }: NoteSidebarPanelProps) {
  const [activeTab, setActiveTab] = useState<"comments" | "history" | "collaborators">("comments");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed right-6 top-24 z-40 flex flex-col space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setActiveTab("comments");
            setIsOpen(true);
          }}
          className="bg-white dark:bg-gray-800 shadow-lg"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setActiveTab("history");
            setIsOpen(true);
          }}
          className="bg-white dark:bg-gray-800 shadow-lg"
        >
          <History className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setActiveTab("collaborators");
            setIsOpen(true);
          }}
          className="bg-white dark:bg-gray-800 shadow-lg"
        >
          <Users className="h-4 w-4" />
          {collaboratorCount > 1 && (
            <span className="ml-1 text-xs">{collaboratorCount}</span>
          )}
        </Button>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-96">
          <SheetHeader>
            <SheetTitle>
              {activeTab === "comments" && "Comments"}
              {activeTab === "history" && "Version History"}
              {activeTab === "collaborators" && "Collaborators"}
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6">
            {activeTab === "comments" && <NoteComments noteId={noteId} />}
            {activeTab === "history" && <NoteVersionHistory noteId={noteId} />}
            {activeTab === "collaborators" && (
              <div className="text-center text-gray-500 py-8">
                {collaboratorCount} collaborator{collaboratorCount !== 1 ? "s" : ""} on this note
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
