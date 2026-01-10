import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ListTodo,
  Clock,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import Link from "next/link";

interface DashboardOverviewProps {
  user: any;
}

export function UserGreeting({ user }: { user: any }) {
  const email = user?.email ?? "User";

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          <CheckCircle2 className="h-8 w-8 text-primary relative z-10" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Welcome back,{" "}
            <span className="text-primary italic">{email.split("@")[0]}</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Here's a quick overview of your productivity today.
          </p>
        </div>
      </div>
    </div>
  );
}

export function AccountCard({ user }: { user: any }) {
  const email = user?.email ?? "User";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">Signed in as</div>
          <div className="font-medium break-all">{email}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Plan</div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Free</Badge>
            <span className="text-xs text-muted-foreground">
              Upgrade from the home page
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export async function DashboardOverview({ user }: DashboardOverviewProps) {
  const supabase = await createClient();
  // Calculate start and end of "today" in local time
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  // Fetch today's tasks using a range to be safe with timezones
  const { data: todayTasks } = await supabase
    .from("tasks")
    .select("*")
    .gte("created_at", startOfDay.toISOString())
    .lte("created_at", endOfDay.toISOString());

  const totalToday = todayTasks?.length ?? 0;
  const completedToday = todayTasks?.filter((t) => t.completed).length ?? 0;
  const remainingToday = totalToday - completedToday;

  // Fetch today's focus sessions
  const { data: focusSessions } = await supabase
    .from("focus_sessions")
    .select("*")
    .gte("created_at", startOfDay.toISOString());

  const totalFocusSessions = focusSessions?.length ?? 0;
  const totalMinutes =
    focusSessions?.reduce((acc, s) => acc + (s.duration_minutes ?? 0), 0) ?? 0;
  const focusHours = Math.floor(totalMinutes / 60);
  const focusMinsRemaining = totalMinutes % 60;

  // Fetch weekly completions
  const { count: weeklyCompletions } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("completed", true)
    .gte("created_at", startOfWeek.toISOString());

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <Suspense
        fallback={
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Welcome back...
                </h1>
                <p className="text-sm text-muted-foreground">
                  Loading your dashboard...
                </p>
              </div>
            </div>
          </div>
        }
      >
        <UserGreeting user={user} />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="group cursor-pointer hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-primary/10 bg-gradient-to-br from-card to-primary/5">
          <Link href="/dashboard?view=tasks" className="block">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks today</CardTitle>
              <ListTodo className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {totalToday}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-emerald-500 font-medium">
                  {completedToday} completed
                </span>{" "}
                · {remainingToday} remaining
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Focus sessions
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFocusSessions}</div>
            <p className="text-xs text-muted-foreground">
              {focusHours}h {focusMinsRemaining}m focused time today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This week</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyCompletions ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              Tasks completed this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Today&apos;s Focus</CardTitle>
              <p className="text-sm text-muted-foreground">
                Your top-priority items for the day.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm mb-4">
              {todayTasks && todayTasks.length > 0 ? (
                todayTasks.slice(0, 5).map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          task.completed
                            ? "bg-emerald-500"
                            : task.priority === "high"
                            ? "bg-rose-500"
                            : task.priority === "medium"
                            ? "bg-amber-500"
                            : "bg-primary"
                        }`}
                      />
                      <span
                        className={
                          task.completed
                            ? "line-through text-muted-foreground"
                            : ""
                        }
                      >
                        {task.title}
                      </span>
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {task.priority}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground italic">
                  No tasks for today yet.
                </li>
              )}
            </ul>
            <Button
              asChild
              variant="default"
              className="w-full shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              <Link href="/dashboard?view=tasks">
                Go to Tasks List
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Suspense
          fallback={
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="text-xs text-muted-foreground">Loading...</div>
              </CardContent>
            </Card>
          }
        >
          <AccountCard user={user} />
        </Suspense>

      </div>
    </div>
  );
}
