
'use client';

import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon, ShieldAlert, Loader2, Info } from 'lucide-react';
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
  const displayImage = configData?.mobileImageUrl || "https://picsum.photos/seed/full-screen-bg/1920/1080";

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={displayImage}
          alt="Dashboard Background"
          fill
          className="object-cover opacity-90 transition-opacity duration-700"
          priority
          unoptimized={displayImage.includes('ik.imagekit.io')}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Header Overlay */}
      <header className="relative z-50 p-4 bg-white/10 backdrop-blur-md border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center text-white overflow-hidden shadow-lg border border-white/20">
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
            <span className="font-bold text-sm leading-none text-white drop-shadow-sm">
              Hello, {user?.displayName?.split(' ')[0]}
            </span>
            {isUserDataLoading ? (
              <span className="text-[10px] text-white/50 animate-pulse">Checking access...</span>
            ) : isAdmin ? (
              <span className="text-[10px] text-accent font-bold flex items-center gap-1">
                <ShieldAlert className="h-2 w-2" />
                ADMINISTRATOR
              </span>
            ) : (
              <span className="text-[10px] text-white/60">Verified User</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isUserDataLoading && isAdmin && (
            <Link href="/admin">
              <Button variant="default" size="sm" className="h-8 text-xs bg-primary hover:bg-primary/90 shadow-md">
                <ShieldAlert className="h-3 w-3 mr-1.5" />
                Admin Panel
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 text-xs text-white/80 hover:text-white hover:bg-white/10">
            <LogOut className="h-3 w-3 mr-1.5" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content Overlay */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 pointer-events-none">
        {!configData?.mobileImageUrl && (
          <div className="max-w-md p-8 text-center bg-black/30 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl slide-up pointer-events-auto">
            <h2 className="text-white text-3xl font-bold font-headline mb-4 drop-shadow-md">
              Welcome to Your Dashboard
            </h2>
            <p className="text-white/80 text-sm mb-8 leading-relaxed">
              Admins can customize this background image via the Admin Panel. 
              Upload an ImageKit or Unsplash link to transform this view.
            </p>
            
            {!isAdmin && !isUserDataLoading && (
              <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center justify-center gap-2 text-white/90 font-medium text-xs mb-3">
                  <Info className="h-3 w-3 text-accent" />
                  Admin Verification Needed
                </div>
                <p className="text-[11px] text-white/50 mb-3 leading-tight">
                  To access admin tools, ensure your document exists at <code className="bg-black/40 px-1 py-0.5 rounded text-accent">users/[UID]</code> with <code className="text-white font-bold">isAdmin: true</code>
                </p>
                <div className="text-[10px] bg-black/60 p-2 rounded text-white/40 break-all select-all font-mono border border-white/5">
                  {user?.uid}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
