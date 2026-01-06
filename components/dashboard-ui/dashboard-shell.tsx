import TasksList from "@/components/dashboard-ui/tasks-list";
import { Suspense } from "react";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

interface DashboardShellProps {
  user: any;
}

export function DashboardShell({ user }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-background to-background">
      <div className="container px-4 py-10 mx-auto">
        <main>
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-muted-foreground animate-pulse font-medium">
                  Loading your productivity hub...
                </p>
              </div>
            }
          >
            <TasksList />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
