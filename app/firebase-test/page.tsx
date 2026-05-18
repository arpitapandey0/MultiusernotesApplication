"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

export default function FirebaseTest() {
  const [status, setStatus] = useState<string>("Not tested");
  const [error, setError] = useState<string>("");

  const testFirebase = async () => {
    setStatus("Testing...");
    setError("");
    
    try {
      const testDoc = await addDoc(collection(db, "test"), {
        message: "Test",
        timestamp: serverTimestamp()
      });
      
      setStatus(`✅ SUCCESS! ID: ${testDoc.id}`);
    } catch (err: any) {
      setStatus("❌ FAILED");
      setError(err.message);
    }
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Firebase Test</h1>

      <div className="mb-6 p-4 bg-gray-100 rounded">
        <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</p>
      </div>

      <Button onClick={testFirebase} className="mb-6">Test Connection</Button>

      <div className="p-4 bg-yellow-50 rounded mb-6">
        <h3 className="font-bold mb-2">Status:</h3>
        <pre>{status}</pre>
        {error && <pre className="text-red-600 mt-2">{error}</pre>}
      </div>

      <div className="p-4 bg-blue-50 rounded">
        <h3 className="font-bold mb-2">Setup Firebase:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Go to console.firebase.google.com</li>
          <li>Create project</li>
          <li>Add web app</li>
          <li>Copy config to .env.local</li>
          <li>Create Firestore Database</li>
          <li>Restart: npm run dev</li>
        </ol>
      </div>
    </div>
  );
}
