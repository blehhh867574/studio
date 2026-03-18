'use client';

import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Image from 'next/image';

/**
 * MobileHomeView displays the primary dashboard image managed by the admin.
 * It features a cinematic overlay with small navigation tabs integrated into the UI.
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
      {/* Reduced padding, font size, and removed backdrop blur to keep the top of the image sharp */}
      <header className="absolute top-0 left-0 z-20 w-full pt-8 pb-4 px-6 flex items-center gap-6 bg-gradient-to-b from-black/30 to-transparent">
        <div className="flex flex-col items-start gap-0.5">
          <button className="text-white font-bold text-[13px] tracking-wide drop-shadow-sm active:opacity-80 transition-opacity">
            INR Wallet
          </button>
          {/* Active indicator bar - smaller and cleaner */}
          <div className="h-[2px] w-full bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
        </div>
        
        <button className="text-gray-300 font-semibold text-[13px] tracking-wide hover:text-white transition-colors drop-shadow-sm active:opacity-80">
          Futures Wallet
        </button>
      </header>
      
      {/* Decorative top safe area for modern mobile status bars */}
      <div className="absolute top-0 left-0 w-full h-8 bg-transparent z-30 pointer-events-none" />
    </div>
  );
}
