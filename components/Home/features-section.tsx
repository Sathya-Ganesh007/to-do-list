import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, Users, Zap, Shield, Bell } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: CheckCircle2,
      title: "Smart Task Management",
      description: "Create, organize, and prioritize tasks with ease. Set due dates and reminders to never miss a deadline.",
    },
    {
      icon: Clock,
      title: "Real-time Sync",
      description: "Access your tasks from anywhere, anytime. Your data syncs across all devices instantly.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share lists with your team and collaborate on projects together in real-time.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built for speed. Create and manage tasks in seconds with our intuitive interface.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and secure. We take your privacy seriously.",
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Get notified about upcoming deadlines and important tasks with customizable alerts.",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your tasks efficiently
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

