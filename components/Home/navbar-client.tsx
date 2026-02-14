"use client";

import Link from "next/link";
import { CheckCircle2, LayoutDashboard, ListTodo } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavbarClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isAuth = pathname?.startsWith("/auth");

  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">TodoList</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-6">
        {isDashboard ? (
          <>
            <Link
              href="/dashboard"
              className={`text-sm font-semibold transition-colors flex items-center gap-2 ${
                pathname === "/dashboard" && !searchParams?.get("view")
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </Link>
            <Link
              href="/dashboard?view=tasks"
              className={`text-sm font-semibold transition-colors flex items-center gap-2 ${
                searchParams?.get("view") === "tasks"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ListTodo className="h-4 w-4" />
              Tasks
            </Link>
          </>
        ) : !isAuth ? (
          <>
            <Link
              href="/#features"
              className="text-sm font-semibold hover:text-primary transition-colors text-muted-foreground"
            >
              Features
            </Link>
            <Link
              href="/#testimonials"
              className="text-sm font-semibold hover:text-primary transition-colors text-muted-foreground"
            >
              Testimonials
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-semibold hover:text-primary transition-colors text-muted-foreground"
            >
              Pricing
            </Link>
          </>
        ) : null}
      </div>
    </>
  );
}
