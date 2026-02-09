import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { AuthButton } from "@/components/auth-button";
import { Suspense } from "react";
import { NavbarClient } from "./navbar-client";

export function NavbarSection() {
  return (
    <nav className="w-full border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="w-full max-w-5xl mx-auto px-8 md:px-12">
        <div className="flex h-16 items-center justify-between">
          <NavbarClient />

          {/* Actions area */}
          <div className="flex items-center gap-2 md:gap-4 border-l border-border/40 pl-4 md:pl-8">
            <ThemeSwitcher />
            <div className="h-4 w-px bg-border/40 mx-1 md:mx-2" />
            <Suspense
              fallback={
                <div className="h-9 w-20 bg-muted/20 animate-pulse rounded-xl" />
              }
            >
              <AuthButton />
            </Suspense>
          </div>
        </div>
      </div>
    </nav>
  );
}
