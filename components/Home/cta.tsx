import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export async function CTA() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90" />
          <div className="relative z-10">
            <CardHeader className="text-center pt-12">
              <CardTitle className="text-3xl sm:text-4xl mb-4 font-bold tracking-tight">
                Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
                Join thousands of users who are already organizing their lives
                with TodoList
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-12">
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="text-base px-8 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href={user ? "/dashboard" : "/auth/sign-up"}>
                    {user ? "Go to Dashboard" : "Start Free Trial"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base text-white border-white/20 hover:bg-white/10 transition-all duration-300 px-8 h-12"
                >
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </section>
  );
}
