"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  FileText, 
  Loader2, 
  Save, 
  X,
  Type,
  AlignLeft
} from "lucide-react";
import Link from "next/link";

export default function CreateNotePage() {
  const { user } = useUser();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user || !title.trim()) {
      toast.error("Please enter a title for your note");
      return;
    }

    setLoading(true);
    try {
      const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase();
      const docRef = await addDoc(collection(db, "notes"), {
        title: title.trim(),
        content: content.trim(),
        ownerId: user.id,
        ownerEmail: userEmail,
        collaborators: {
          [userEmail || user.id]: "owner"
        },
        collaboratorEmails: [userEmail],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success("Note created successfully!");
      router.push(`/note/${docRef.id}`);
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndReturn = async () => {
    if (!user || !title.trim()) {
      toast.error("Please enter a title for your note");
      return;
    }

    setLoading(true);
    try {
      const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase();
      await addDoc(collection(db, "notes"), {
        title: title.trim(),
        content: content.trim(),
        ownerId: user.id,
        ownerEmail: userEmail,
        collaborators: {
          [userEmail || user.id]: "owner"
        },
        collaboratorEmails: [userEmail],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success("Note created successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Create New Note
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleSaveAndReturn}
                disabled={loading || !title.trim()}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <X className="h-4 w-4 mr-2" />
                )}
                Save & Close
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading || !title.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save & Continue
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl">
              Let's create something amazing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Title */}
            <div className="space-y-3">
              <Label htmlFor="title" className="text-base font-medium flex items-center space-x-2">
                <Type className="h-4 w-4 text-blue-600" />
                <span>Note Title</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter a compelling title for your note..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-lg py-3 border-2 focus:border-blue-500 transition-colors"
                autoFocus
              />
            </div>

            {/* Content */}
            <div className="space-y-3">
              <Label htmlFor="content" className="text-base font-medium flex items-center space-x-2">
                <AlignLeft className="h-4 w-4 text-purple-600" />
                <span>Content</span>
              </Label>
              <Textarea
                id="content"
                placeholder="Start writing your note content here... You can add more details and formatting after saving."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={15}
                className="resize-none text-base leading-relaxed border-2 focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Character Count */}
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>{content.length} characters</span>
              <span>Press Ctrl+S to save quickly</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}