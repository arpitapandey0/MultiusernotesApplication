"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { 
  FileText, 
  Users, 
  Zap, 
  Shield, 
  Cloud, 
  Smartphone,
  ArrowRight,
  CheckCircle,
  Star,
  Moon,
  Sun,
  Sparkles,
  MessageSquare,
  History
} from "lucide-react";

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  
  const features = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Rich Text Editor",
      description: "Create beautiful notes with formatting, lists, and more",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Real-time Collaboration",
      description: "Work together with your team in real-time",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Comments & Discussions",
      description: "Add comments and discuss ideas with your team",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <History className="h-8 w-8" />,
      title: "Version History",
      description: "Track changes and restore previous versions",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Private",
      description: "Your notes are encrypted and protected",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Auto-Save",
      description: "Never lose your work with automatic saving",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const benefits = [
    "Unlimited notes and folders",
    "Real-time collaboration",
    "Advanced search and filtering",
    "Export to multiple formats",
    "Version history and backups",
    "Team workspace management"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NotesFlow
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mr-2"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <SignInButton mode="modal">
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                Get Started
              </Button>
            </SignUpButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              <Star className="h-4 w-4" />
              <span>Trusted by 10,000+ users</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            Your Ideas, Organized & Collaborative
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            The modern note-taking app with real-time collaboration, comments, version history, and powerful editing tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignUpButton mode="modal">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2 hover:bg-gray-50">
                Sign In
              </Button>
            </SignInButton>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • Free forever plan available
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Everything you need to stay organized
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Powerful features designed to help you capture, organize, and share your ideas effortlessly.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group overflow-hidden">
              <CardContent className="p-8 relative">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
                <div className={`text-transparent bg-gradient-to-r ${feature.color} bg-clip-text mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white relative z-10">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed relative z-10">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white/50 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Why choose NotesFlow?
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Join thousands of professionals who trust NotesFlow to organize their thoughts and collaborate effectively.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
                <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
                <p className="mb-6 opacity-90 text-lg">
                  Join NotesFlow today and experience the future of note-taking.
                </p>
                <SignUpButton mode="modal">
                  <Button variant="secondary" size="lg" className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </SignUpButton>
                <p className="text-sm opacity-75 mt-3 text-center">
                  Setup takes less than 2 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 mb-8">Trusted by teams at</p>
          <div className="flex items-center justify-center space-x-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">Company A</div>
            <div className="text-2xl font-bold text-gray-400">Company B</div>
            <div className="text-2xl font-bold text-gray-400">Company C</div>
            <div className="text-2xl font-bold text-gray-400">Company D</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-6 w-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NotesFlow
            </span>
          </div>
          <p className="text-gray-600">
            © 2024 NotesFlow. All rights reserved. Made with ❤️ for productivity.
          </p>
        </div>
      </footer>
    </div>
  );
}