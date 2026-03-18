
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, Rocket } from "lucide-react";
import { useAuth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export function Navbar() {
  const auth = useAuth();
  const { toast } = useToast();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Something went wrong during Google sign in.",
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Rocket className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary font-headline">
            LaunchPad Link
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#solutions" className="text-sm font-medium hover:text-primary transition-colors">
            Solutions
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="hidden sm:inline-flex"
            onClick={handleLogin}
          >
            Sign In
          </Button>
          <Button 
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            onClick={handleLogin}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}
