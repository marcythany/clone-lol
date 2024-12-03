'use client';

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LogoutPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function handleSignOut() {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Error signing out:', error.message);
        }
      } catch (error) {
        console.error('Error during sign out:', error);
      } finally {
        // Always redirect to login page
        router.replace(`/${locale}/login`);
      }
    }

    handleSignOut();
  }, [locale, router, supabase.auth]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-white" />
      <p className="mt-4 text-white">Signing out...</p>
    </div>
  );
}
