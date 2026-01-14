import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      rating: 5,
      text: "This app has completely transformed how I manage my daily tasks. I'm more productive than ever!",
      name: "Sarah Johnson",
      role: "Product Manager",
    },
    {
      rating: 5,
      text: "The best todo app I've ever used. Clean interface, fast performance, and it just works!",
      name: "Michael Chen",
      role: "Software Engineer",
    },
    {
      rating: 5,
      text: "Perfect for team collaboration. We use it daily to keep our projects organized and on track.",
      name: "Emily Rodriguez",
      role: "Team Lead",
    },
  ];

  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied users who are getting more done
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription>{testimonial.text}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

