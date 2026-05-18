"use client";

import { useState } from "react";
import { shareNoteWithUser } from "@/lib/noteUtils";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, UserPlus, Users, Copy } from "lucide-react";

interface ShareNoteDialogProps {
  noteId: string;
  noteTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShareNoteDialog({ noteId, noteTitle, open, onOpenChange }: ShareNoteDialogProps) {
  const { user } = useUser();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("editor");
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const senderEmail = user?.emailAddresses[0]?.emailAddress;
      if (!senderEmail) {
        throw new Error('User email not found');
      }

      await shareNoteWithUser({
        noteId,
        email: email.trim(),
        role
      }, senderEmail);

      toast.success(`Share request sent to ${email.trim()}`);
      setEmail("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error sharing note:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send share request");
    } finally {
      setLoading(false);
    }
  };

  const copyShareLink = () => {
    const shareLink = `${window.location.origin}/note/${noteId}`;
    navigator.clipboard.writeText(shareLink);
    toast.success("Share link copied to clipboard!");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleShare();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <span>Share Note</span>
              <p className="text-sm font-normal text-gray-600 dark:text-gray-400 mt-1">
                "{noteTitle}"
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          {/* Share via Email */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Invite by Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">
                Permission Level
              </Label>
              <Select value={role} onValueChange={(value: "editor" | "viewer") => setRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">
                    <div className="flex items-center space-x-2">
                      <Badge variant="default" className="text-xs">Editor</Badge>
                      <span className="text-sm">Can edit and share</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="viewer">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">Viewer</Badge>
                      <span className="text-sm">Can only view</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={handleShare}
              disabled={!email.trim() || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium py-3 h-auto"
            >
              <Mail className="h-4 w-4 mr-2" />
              {loading ? "Sharing..." : "Send Invitation"}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Share Link</Label>
            <Button
              variant="outline"
              onClick={copyShareLink}
              className="w-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 font-medium py-3 h-auto border-2"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Share Link
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Anyone with this link can view the note (if they have access)
            </p>
          </div>

          {/* Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              How sharing works:
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
              <li>• <strong>Editors</strong> can modify content and share with others</li>
              <li>• <strong>Viewers</strong> can only read the note</li>
              <li>• Collaborators will see the note in their "Shared with Me" section</li>
              <li>• Real-time changes are visible to all collaborators instantly</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}