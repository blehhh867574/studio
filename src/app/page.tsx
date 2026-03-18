
'use client';

import { useEffect } from 'react';
import { useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { MobileHomeView } from "@/components/home/mobile-home-view";

export default function Home() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  useEffect(() => {
    if (user && db) {
      // Sync user data to Firestore if they happen to log in (e.g., via hidden admin flow)
      const userRef = doc(db, 'users', user.uid);
      setDocumentNonBlocking(userRef, {
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        profilePictureUrl: user.photoURL,
        lastLoginAt: serverTimestamp(),
      }, { merge: true });
    }
  }, [user, db]);

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Directly show the image view for all users
  return <MobileHomeView />;
}
