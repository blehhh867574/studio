
'use client';

import { useAuth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { LogIn, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Something went wrong during Google sign in.",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Staff Access</h1>
        <p className="text-gray-400 text-sm">Secure login for administrators</p>
      </div>

      <Button 
        onClick={handleLogin} 
        size="lg" 
        className="bg-white text-black hover:bg-gray-200 font-bold px-8"
      >
        <LogIn className="mr-2 h-5 w-5" />
        Sign in with Google
      </Button>

      <Link href="/">
        <Button variant="ghost" className="text-gray-500 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Display
        </Button>
      </Link>
    </div>
  );
}
