
'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Image from 'next/image';

export function MobileHomeView() {
  const { user } = useUser();
  const db = useFirestore();
  
  const userDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const configDocRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'config', 'general');
  }, [db]);

  const { data: configData } = useDoc(configDocRef);
  
  const displayImage = configData?.mobileImageUrl || "https://picsum.photos/seed/full-screen-bg/1080/1920";

  return (
    <div className="relative w-full h-screen h-[100svh] bg-black overflow-hidden">
      {/* Background Image Container - Filling entire screen */}
      <main className="absolute inset-0 w-full h-full flex items-center justify-center">
        <Image
          src={displayImage}
          alt="Dashboard Content"
          fill
          className="object-contain transition-opacity duration-700"
          priority
          unoptimized={displayImage.includes('ik.imagekit.io')}
        />
      </main>

      {/* Navigation Header Overlay - Positioned on top of the image */}
      <header className="absolute top-0 left-0 z-20 w-full pt-8 pb-4 px-6 flex items-center gap-8 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-[2px]">
        <div className="flex flex-col items-start gap-1">
          <button className="text-white font-bold text-lg tracking-tight shadow-sm">
            INR Wallet
          </button>
          <div className="h-[3px] w-full bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
        </div>
        
        <button className="text-gray-300 font-medium text-lg tracking-tight hover:text-white transition-colors drop-shadow-md">
          Futures Wallet
        </button>
      </header>
      
      {/* Visual hint for status bar area on modern mobiles */}
      <div className="absolute top-0 left-0 w-full h-8 bg-transparent z-30" />
    </div>
  );
}
