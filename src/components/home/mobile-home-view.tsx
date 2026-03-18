
'use client';

import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon, ShieldAlert, ArrowLeft } from 'lucide-react';
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

  const { data: userData } = useDoc(userDocRef);
  const { data: configData } = useDoc(configDocRef);
  
  const isAdmin = userData?.isAdmin === true;
  const displayImage = configData?.mobileImageUrl || "https://picsum.photos/seed/mobile-app-placeholder/400/800";

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      {/* Mini Header */}
      <header className="p-4 border-b bg-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden">
            {user?.photoURL ? (
              <Image 
                src={user.photoURL} 
                alt="Avatar" 
                width={32} 
                height={32} 
                className="rounded-full object-cover"
              />
            ) : (
              <UserIcon size={16} />
            )}
          </div>
          <span className="font-semibold text-sm hidden sm:block">Welcome, {user?.displayName?.split(' ')[0]}</span>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link href="/admin">
              <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/5">
                <ShieldAlert className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content: Full Screen Mobile Image */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[400px] aspect-[9/18] bg-white rounded-[3rem] shadow-2xl border-[12px] border-slate-900 overflow-hidden">
          <Image
            src={displayImage}
            alt="Mobile Content"
            fill
            className="object-cover"
            priority
            unoptimized={displayImage.includes('ik.imagekit.io')}
          />
          {!configData?.mobileImageUrl && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/40">
              <h2 className="text-white text-2xl font-bold font-headline mb-4">Your Mobile Dashboard</h2>
              <p className="text-white/80 text-sm">
                This space is currently ready for your custom app content. 
                Admins can set a custom image from the panel.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
