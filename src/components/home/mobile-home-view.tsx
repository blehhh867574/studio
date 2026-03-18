
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
  const displayImage = configData?.mobileImageUrl || "https://picsum.photos/seed/mobile-app-placeholder/400/800";

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      {/* Header */}
      <header className="p-4 border-b bg-white flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden shadow-sm border border-primary/20">
            {user?.photoURL ? (
              <Image 
                src={user.photoURL} 
                alt="Avatar" 
                width={40} 
                height={40} 
                className="rounded-full object-cover"
              />
            ) : (
              <UserIcon size={20} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-none">Welcome, {user?.displayName?.split(' ')[0]}</span>
            {isUserDataLoading ? (
              <span className="text-[10px] text-muted-foreground animate-pulse">Checking role...</span>
            ) : isAdmin ? (
              <span className="text-[10px] text-primary font-medium flex items-center gap-1">
                <ShieldAlert className="h-2 w-2" />
                Administrator
              </span>
            ) : (
              <span className="text-[10px] text-muted-foreground">Standard User</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isUserDataLoading && isAdmin && (
            <Link href="/admin">
              <Button variant="default" size="sm" className="h-8 text-xs bg-primary hover:bg-primary/90">
                <ShieldAlert className="h-3 w-3 mr-1.5" />
                Admin Panel
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 text-xs text-muted-foreground hover:text-destructive">
            <LogOut className="h-3 w-3 mr-1.5" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content: Full Screen Mobile Image */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="relative w-full max-w-[400px] aspect-[9/18] bg-white rounded-[3rem] shadow-2xl border-[12px] border-slate-900 overflow-hidden ring-4 ring-primary/5">
          <Image
            src={displayImage}
            alt="Mobile Content"
            fill
            className="object-cover"
            priority
            unoptimized={displayImage.includes('ik.imagekit.io')}
          />
          {!configData?.mobileImageUrl && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/40 backdrop-blur-[2px]">
              <h2 className="text-white text-2xl font-bold font-headline mb-4 drop-shadow-md">Your Mobile Dashboard</h2>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                This space is currently ready for your custom app content. 
                Admins can set a custom image from the panel.
              </p>
              
              {!isAdmin && !isUserDataLoading && (
                <div className="mt-4 p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md max-w-[280px]">
                  <div className="flex items-center justify-center gap-2 text-white/90 font-medium text-xs mb-2">
                    <Info className="h-3 w-3" />
                    Admin Debug Info
                  </div>
                  <p className="text-[10px] text-white/60 mb-2">
                    Ensure document <code className="bg-black/30 px-1 py-0.5 rounded">users/{user?.uid}</code> has <code className="text-white">isAdmin: true</code>
                  </p>
                  <div className="text-[9px] bg-black/40 p-1.5 rounded text-white/40 break-all select-all cursor-help font-mono" title="Click to copy your UID">
                    {user?.uid}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
