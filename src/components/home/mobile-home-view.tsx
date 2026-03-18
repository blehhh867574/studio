
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
    <div className="relative w-full h-screen h-[100svh] bg-black overflow-hidden flex items-center justify-center">
      {/* Background Image - Optimized for full visibility */}
      <div className="absolute inset-0 z-0">
        <Image
          src={displayImage}
          alt="Dashboard Content"
          fill
          className="object-contain transition-opacity duration-700"
          priority
          unoptimized={displayImage.includes('ik.imagekit.io')}
        />
      </div>

      {/* Admin controls - Only visible to logged-in admins */}
      {user && isAdmin && (
        <header className="absolute top-0 right-0 z-50 p-4 flex gap-2">
          <Link href="/admin">
            <Button variant="outline" size="sm" className="h-8 text-xs bg-black/40 hover:bg-black/60 text-white border-white/20 backdrop-blur-md">
              <ShieldAlert className="h-3 w-3 mr-1.5" />
              Admin Panel
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => signOut(auth)} 
            className="h-8 w-8 p-0 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/10"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </header>
      )}
    </div>
  );
}
