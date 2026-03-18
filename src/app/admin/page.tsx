
'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const userDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const configDocRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'config', 'general');
  }, [db]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
  const { data: configData, isLoading: isConfigLoading } = useDoc(configDocRef);

  const [imageUrl, setImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (configData?.mobileImageUrl) {
      setImageUrl(configData.mobileImageUrl);
    }
  }, [configData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    setIsSaving(true);
    try {
      await setDoc(doc(db, 'config', 'general'), {
        mobileImageUrl: imageUrl,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      toast({
        title: "Configuration Saved",
        description: "The mobile home image has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update configuration.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthLoading || isUserDataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || userData?.isAdmin !== true) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <ShieldCheck className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You do not have administrative privileges to view this page.</p>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold font-headline">Admin Control Panel</h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            <ShieldCheck className="h-4 w-4" />
            Admin Verified
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Mobile View Image
              </CardTitle>
              <CardDescription>
                Provide a URL for the image to be displayed on the mobile dashboard for all users.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSave}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Image URL (ImageKit, Unsplash, etc.)</label>
                  <Input 
                    type="url" 
                    placeholder="https://ik.imagekit.io/your-id/..." 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                  />
                </div>
                {imageUrl && (
                  <div className="mt-4 rounded-lg overflow-hidden border bg-white p-2">
                    <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                    <div className="relative aspect-[9/16] max-h-[300px] mx-auto overflow-hidden rounded-md border">
                      <img 
                        src={imageUrl} 
                        alt="Preview" 
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/400x800?text=Invalid+Image+URL";
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Configuration
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card className="shadow-lg bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle>Admin Guidance</CardTitle>
              <CardDescription className="text-primary-foreground/70">
                Tips for managing your application view.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>• <strong>Aspect Ratio:</strong> The mobile view works best with 9:16 vertical images.</p>
              <p>• <strong>Performance:</strong> Using a CDN like ImageKit helps images load instantly for your users.</p>
              <p>• <strong>Real-time:</strong> Updates are pushed immediately to all connected clients without page reloads.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
