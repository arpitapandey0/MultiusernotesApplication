import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "NotesFlow - Professional Note Taking",
  description: "A modern, collaborative note-taking application with real-time sync",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  if (!clerkKey) {
    return (
      <html lang="en">
        <body style={{ padding: '20px', background: 'white' }}>
          <h1 style={{ color: 'red' }}>Error: Clerk key missing</h1>
          <p style={{ color: 'black' }}>Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to .env.local</p>
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkKey}>
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen bg-white dark:bg-gray-900">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}