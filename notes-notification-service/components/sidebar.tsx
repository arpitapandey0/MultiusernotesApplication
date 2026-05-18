"use client";

import { Button } from "@/components/ui/button";
import { FileText, Users } from "lucide-react";

interface SidebarProps {
  activeTab: "my-notes" | "shared";
  setActiveTab: (tab: "my-notes" | "shared") => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r min-h-screen p-4">
      <nav className="space-y-2">
        <Button
          variant={activeTab === "my-notes" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("my-notes")}
        >
          <FileText className="h-4 w-4 mr-2" />
          My Notes
        </Button>
        <Button
          variant={activeTab === "shared" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("shared")}
        >
          <Users className="h-4 w-4 mr-2" />
          Shared with Me
        </Button>
      </nav>
    </aside>
  );
}
