
'use client';

import { useEffect } from 'react';
import { useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { CTASection } from "@/components/landing/cta-section";
import { MobileHomeView } from "@/components/home/mobile-home-view";

export default function Home() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  useEffect(() => {
    if (user && db) {
      // Sync user data to Firestore using the non-blocking pattern
      const userRef = doc(db, 'users', user.uid);
      setDocumentNonBlocking(userRef, {
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        profilePictureUrl: user.photoURL,
        lastLoginAt: serverTimestamp(),
        // merge: true ensures we don't overwrite isAdmin or createdAt if they exist
      }, { merge: true });
    }
  }, [user, db]);

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (user) {
    return <MobileHomeView />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <section id="solutions" className="py-24 border-t bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-primary mb-12 font-headline">Built for every industry</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {['Healthcare', 'Finance', 'Education', 'Technology'].map((item) => (
                <div key={item} className="p-8 rounded-xl bg-white shadow-sm border hover:border-accent transition-colors">
                  <span className="font-semibold text-primary">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <CTASection />
      </main>
      <footer className="border-t py-12 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-xl font-bold text-primary font-headline">LaunchPad Link</span>
            <p className="text-sm text-muted-foreground">© 2025 LaunchPad Link Inc. All rights reserved.</p>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">Cookie Settings</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
