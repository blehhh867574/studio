
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
      </header>

      {/* Background Image Container */}
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
