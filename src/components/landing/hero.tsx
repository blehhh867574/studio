
"use client";

import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === "hero-image");
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
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="slide-up space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-primary font-headline">
                Accelerate Your Workflow with <span className="text-accent">LaunchPad Link</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                The unified platform for modern teams to bridge communication, 
                streamline projects, and launch products faster than ever.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary text-primary-foreground px-8 font-semibold" onClick={handleLogin}>
                Start for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
                Watch Demo
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span>Google Integration</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span>Enterprise Ready</span>
              </div>
            </div>
          </div>

          <div className="fade-in relative hidden lg:block">
            <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl border-8 border-white">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={1200}
                  height={800}
                  className="object-cover"
                  priority
                  data-ai-hint={heroImage.imageHint}
                />
              )}
            </div>
            {/* Decorative background element */}
            <div className="absolute -right-12 -top-12 -z-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 -z-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
