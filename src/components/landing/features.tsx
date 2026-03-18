
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, ShieldCheck, Zap } from "lucide-react";

const features = [
  {
    title: "Instant Connectivity",
    description: "Link all your essential business tools into one seamless dashboard with Google-powered authentication.",
    icon: Zap,
    color: "text-accent",
  },
  {
    title: "Scalable Architecture",
    description: "Built for teams of any size. From garage startups to global enterprises, LaunchPad scales with you.",
    icon: Layers,
    color: "text-primary",
  },
  {
    title: "Ironclad Security",
    description: "We take your data seriously. Enterprise-grade encryption and secure Google login protect your assets.",
    icon: ShieldCheck,
    color: "text-accent",
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-white/50">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary font-headline">
            Designed for Modern Productivity
          </h2>
          <p className="text-lg text-muted-foreground">
            LaunchPad Link provides the foundation for your team to do their best work without the technical overhead.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-background">
              <CardHeader>
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-headline">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
