import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./auth/logout-button";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export async function AuthButton() {
  const supabase = await createClient();

  // getUser allows us to access user_metadata for avatar_url
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage
            src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
          />
          <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="ghost" className="font-medium">
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button
        asChild
        size="sm"
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm transition-all shadow-primary/10"
      >
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
