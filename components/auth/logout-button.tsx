"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Button
      onClick={logout}
      size="sm"
      variant="outline"
      className="h-9 px-3 md:px-4 text-xs md:text-sm font-bold"
    >
      Logout
    </Button>
  );
}
