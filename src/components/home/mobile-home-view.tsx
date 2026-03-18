'use client';

import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Image from 'next/image';

/**
 * MobileHomeView displays the primary dashboard image managed by the admin.
 * It features a cinematic overlay with navigation tabs matching the mobile UI reference.
 */
export function MobileHomeView() {
  const db = useFirestore();

  const configDocRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'config', 'general');
  }, [db]);

  const { data: configData } = useDoc(configDocRef);
  
  // Default fallback image if none is configured in Firestore
  const displayImage = configData?.mobileImageUrl || "https://picsum.photos/seed/full-screen-bg/1080/1920";

  return (
    <div className="relative w-full h-screen h-[100svh] bg-black overflow-hidden select-none">
      {/* Background Image Container */}
      <main className="absolute inset-0 w-full h-full flex items-center justify-center">
        <Image
          src={displayImage}
          alt="Dashboard Content"
          fill
          className="object-contain transition-opacity duration-1000"
          priority
          unoptimized={displayImage.includes('ik.imagekit.io')}
        />
      </main>

      {/* Navigation Header Overlay */}
      {/* Gradient and backdrop-blur help the buttons feel like a natural part of the image UI */}
      <header className="absolute top-0 left-0 z-20 w-full pt-10 pb-6 px-6 flex items-center gap-8 bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-[1px]">
        <div className="flex flex-col items-start gap-1">
          <button className="text-white font-bold text-xl tracking-tight drop-shadow-md active:opacity-80 transition-opacity">
            INR Wallet
          </button>
          {/* Active indicator bar */}
          <div className="h-[3px] w-full bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
        </div>
        
        <button className="text-gray-300 font-semibold text-xl tracking-tight hover:text-white transition-colors drop-shadow-md active:opacity-80">
          Futures Wallet
        </button>
      </header>
      
      {/* Decorative top safe area for modern mobile status bars */}
      <div className="absolute top-0 left-0 w-full h-10 bg-transparent z-30 pointer-events-none" />
    </div>
  );
}
