import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardOverview } from "@/components/dashboard-ui/dashboard-overview";
import TasksList from "@/components/dashboard-ui/tasks-list";

async function getUser() {
  const supabase = await createClient();
  // Check for a valid session and user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  return user;
}

import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/ui/skeleton";

async function DashboardContent({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  const user = await getUser();

  if (view === "tasks") {
    // @ts-ignore - We are about to update the component to accept this prop
    return <TasksList user={user} />;
  }

  return (
    <div className="container px-4 py-10 mx-auto">
      <DashboardOverview user={user} />
    </div>
  );
}

export default function OverviewPage(props: {
  searchParams: Promise<{ view?: string }>;
}) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent searchParams={props.searchParams} />
    </Suspense>
  );
}
