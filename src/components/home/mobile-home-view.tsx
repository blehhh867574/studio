
'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { ShieldAlert, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'firebase/auth';

export function MobileHomeView() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  
  const userDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const configDocRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'config', 'general');
  }, [db]);

  const { data: userData } = useDoc(userDocRef);
  const { data: configData } = useDoc(configDocRef);
  
  const isAdmin = userData?.isAdmin === true;
  const displayImage = configData?.mobileImageUrl || "https://picsum.photos/seed/full-screen-bg/1080/1920";

  return (
    <div className="flex flex-col w-full h-screen h-[100svh] bg-black overflow-hidden">
      {/* Navigation Header */}
      <header className="relative z-10 w-full pt-6 pb-2 px-6 flex items-center gap-8 bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="flex flex-col items-start gap-1">
          <button className="text-white font-bold text-lg tracking-tight">
            INR Wallet
          </button>
          <div className="h-[3px] w-full bg-blue-600 rounded-full" />
        </div>
        
        <button className="text-gray-400 font-medium text-lg tracking-tight hover:text-white transition-colors">
          Futures Wallet
        </button>

        {/* Admin controls - Only visible to logged-in admins */}
        {user && isAdmin && (
          <div className="ml-auto flex gap-2">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="h-8 text-xs bg-black/40 hover:bg-black/60 text-white border-white/20">
                <ShieldAlert className="h-3 w-3 mr-1.5" />
                Admin
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => signOut(auth)} 
              className="h-8 w-8 p-0 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </header>

      {/* Background Image Container - Adjusted to start below header */}
      <main className="flex-1 relative w-full flex items-center justify-center">
        <Image
          src={displayImage}
          alt="Dashboard Content"
          fill
          className="object-contain transition-opacity duration-700"
          priority
          unoptimized={displayImage.includes('ik.imagekit.io')}
        />
      </main>
    </div>
  );
}
