
"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useAuth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export function CTASection() {
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
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground shadow-2xl">
          <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl font-headline">
              Ready to Launch Your Next Big Idea?
            </h2>
            <p className="text-xl text-primary-foreground/80">
              Join thousands of teams who trust LaunchPad Link for their daily operations. 
              Get started with your Google account in seconds.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-10"
                onClick={handleLogin}
              >
                <LogIn className="mr-2 h-5 w-5" />
                Get Started with Google
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-10">
                Contact Sales
              </Button>
            </div>
          </div>

          {/* Background Decorative Circles */}
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
