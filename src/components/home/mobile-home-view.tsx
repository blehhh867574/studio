
'use client';

import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon, ShieldAlert } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
  const { data: configData } = useDoc(configDocRef);
  
  const isAdmin = userData?.isAdmin === true;
  const displayImage = configData?.mobileImageUrl || "https://picsum.photos/seed/full-screen-bg/1080/1920";

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col overflow-hidden">
      {/* Background Image - Optimized for Full Screen Mobile UI */}
      <div className="absolute inset-0 z-0">
        <Image
          src={displayImage}
          alt="Dashboard Background"
          fill
          className="object-cover transition-opacity duration-700"
          priority
          unoptimized={displayImage.includes('ik.imagekit.io')}
        />
        {/* Subtle overlay to ensure header readability */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent z-10" />
      </div>

      {/* Header Overlay - Minimalist floating header */}
      <header className="relative z-50 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white overflow-hidden shadow-xl">
            {user?.photoURL ? (
              <Image 
                src={user.photoURL} 
                alt="Avatar" 
                width={40} 
                height={40} 
                className="rounded-full object-cover"
              />
            ) : (
              <UserIcon size={20} className="text-white" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-none text-white drop-shadow-lg">
              {user?.displayName?.split(' ')[0]}
            </span>
            {isAdmin && (
              <span className="text-[10px] text-accent font-bold flex items-center gap-1 drop-shadow-md">
                <ShieldAlert className="h-2 w-2" />
                ADMIN
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isUserDataLoading && isAdmin && (
            <Link href="/admin">
              <Button variant="default" size="sm" className="h-8 text-xs bg-primary/80 hover:bg-primary backdrop-blur-sm border border-white/10 shadow-lg">
                <ShieldAlert className="h-3 w-3 mr-1.5" />
                Panel
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 w-8 p-0 rounded-full text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content Area - Empty to showcase the background image */}
      <main className="relative z-10 flex-1" />
    </div>
  );
}
