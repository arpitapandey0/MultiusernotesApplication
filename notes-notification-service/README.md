# Collaborative Notes App

A modern, real-time collaborative note-taking application built with Next.js, Firebase, and Clerk.

## Features

- 📝 Rich text editor with formatting
- 👥 Real-time collaboration
- 💬 Comments system
- 📜 Version history
- 🔐 Secure authentication
- 🌓 Dark mode support
- 📱 Responsive design
- 🔍 Search & filter
- 🚀 Auto-save

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Tech Stack

- **Framework**: Next.js 15
- **Auth**: Clerk
- **Database**: Firebase Firestore
- **Editor**: TipTap
- **Styling**: Tailwind CSS
- **UI**: Radix UI

## Project Structure

```
app/
  ├── create/          # Create note page
  ├── note/[id]/       # Edit note page
  └── page.tsx         # Home/Dashboard
components/
  ├── ui/              # UI components
  ├── dashboard.tsx    # Main dashboard
  ├── note-editor.tsx  # Rich text editor
  └── ...
lib/
  ├── firebase.ts      # Firebase config
  └── noteUtils.ts     # Helper functions
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Features Documentation

See [FEATURES.md](FEATURES.md) for complete feature list.

## License

MIT
