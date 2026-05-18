"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { History, Clock } from "lucide-react";

interface Version {
  id: string;
  content: string;
  updatedAt: any;
  updatedBy: string;
}

interface NoteVersionHistoryProps {
  noteId: string;
}

export default function NoteVersionHistory({ noteId }: NoteVersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "notes", noteId, "versions"),
      orderBy("updatedAt", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const versionsData: Version[] = [];
      snapshot.forEach((doc) => {
        versionsData.push({ id: doc.id, ...doc.data() } as Version);
      });
      setVersions(versionsData);
    });

    return () => unsubscribe();
  }, [noteId]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4">
      <div className="flex items-center space-x-2 mb-4">
        <History className="h-5 w-5 text-purple-600" />
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Version History
        </h3>
      </div>

      <ScrollArea className="h-48">
        <div className="space-y-2">
          {versions.map((version, index) => (
            <div
              key={version.id}
              className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {version.updatedAt?.toDate().toLocaleString()}
                  </span>
                </div>
                {index === 0 && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    Current
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Updated by {version.updatedBy}
              </p>
            </div>
          ))}
          {versions.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">
              No version history yet
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
