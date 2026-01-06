import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardOverview } from "@/components/dashboard-ui/dashboard-overview";
import TasksList from "@/components/dashboard-ui/tasks-list";

async function getUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return data.claims;
}

import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/dashboard-ui/dashboard-skeleton";

async function DashboardContent({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;

  if (view === "tasks") {
    return <TasksList />;
  }

  const user = await getUser();

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
