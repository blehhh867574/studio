'use client';

import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * MobileHomeView displays the primary dashboard image managed by the admin.
 * Features a seamless dual-tab interface for INR and Futures views.
 * Transition is optimized for speed without fade animations.
 * Layout is optimized to avoid status bar overlap on mobile devices.
 */
export function MobileHomeView() {
  const db = useFirestore();
  const [activeTab, setActiveTab] = useState<'inr' | 'futures'>('inr');

  const configDocRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'config', 'general');
  }, [db]);

  const { data: configData } = useDoc(configDocRef);
  
  // Tab-specific background selection
  const inrImage = configData?.mobileImageUrl || "https://picsum.photos/seed/inr-main/1080/1920";
  const futuresImage = configData?.futuresImageUrl || "https://picsum.photos/seed/futures-main/1080/1920";
  
  const displayImage = activeTab === 'inr' ? inrImage : futuresImage;

  return (
    <div className="relative w-full h-screen h-[100svh] bg-black overflow-hidden select-none">
      {/* Main Image Layer - Instant switching */}
      <main className="absolute inset-0 w-full h-full flex items-center justify-center">
        <Image
          src={displayImage}
          alt={`${activeTab} Dashboard`}
          fill
          className="object-contain"
          priority
          unoptimized={displayImage.includes('ik.imagekit.io')}
        />
      </main>

      {/* Integrated Navigation Header Overlay - Increased padding for status bar safety */}
      <header className="absolute top-0 left-0 z-20 w-full pt-10 pb-6 px-6 flex items-center gap-6 bg-gradient-to-b from-black/20 to-transparent">
        {/* INR Wallet Tab */}
        <div className="flex flex-col items-start gap-1">
          <button 
            onClick={() => setActiveTab('inr')}
            className={cn(
              "font-bold text-[12px] tracking-wide transition-colors active:opacity-70",
              activeTab === 'inr' ? "text-white" : "text-gray-400 hover:text-gray-200"
            )}
          >
            INR Wallet
          </button>
          {activeTab === 'inr' && (
            <div className="h-[2px] w-full bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          )}
        </div>
        
        {/* Futures Wallet Tab */}
        <div className="flex flex-col items-start gap-1">
          <button 
            onClick={() => setActiveTab('futures')}
            className={cn(
              "font-bold text-[12px] tracking-wide transition-colors active:opacity-70",
              activeTab === 'futures' ? "text-white" : "text-gray-400 hover:text-gray-200"
            )}
          >
            Futures Wallet
          </button>
          {activeTab === 'futures' && (
            <div className="h-[2px] w-full bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          )}
        </div>
      </header>
      
      {/* Visual spacer for hardware status bar area */}
      <div className="absolute top-0 left-0 w-full h-10 bg-transparent z-30 pointer-events-none" />
    </div>
  );
}
