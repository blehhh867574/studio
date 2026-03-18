
'use client';

import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function MobileHomeView() {
  const { user } = useUser();
  const auth = useAuth();
  
  // Use a placeholder that fits a "mobile" context or just a vertical seed
  const mobilePlaceholder = {
    imageUrl: "https://picsum.photos/seed/mobile-app-placeholder/400/800",
    description: "Mobile interface placeholder",
    imageHint: "mobile app"
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      {/* Mini Header */}
      <header className="p-4 border-b bg-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
            {user?.photoURL ? (
              <Image 
                src={user.photoURL} 
                alt="Avatar" 
                width={32} 
                height={32} 
                className="rounded-full"
              />
            ) : (
              <UserIcon size={16} />
            )}
          </div>
          <span className="font-semibold text-sm hidden sm:block">Welcome, {user?.displayName?.split(' ')[0]}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </header>

      {/* Main Content: Full Screen Mobile Image */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[400px] aspect-[9/18] bg-white rounded-[3rem] shadow-2xl border-[12px] border-slate-900 overflow-hidden">
          <Image
            src={mobilePlaceholder.imageUrl}
            alt={mobilePlaceholder.description}
            fill
            className="object-cover opacity-80"
            data-ai-hint={mobilePlaceholder.imageHint}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/40">
            <h2 className="text-white text-2xl font-bold font-headline mb-4">Your Mobile Dashboard</h2>
            <p className="text-white/80 text-sm">
              This space is currently ready for your custom app content.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
