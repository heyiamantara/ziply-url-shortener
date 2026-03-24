import Link from "next/link";
import { BarChart3, Link2, QrCode, Sparkles, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Instant URL Shortening",
    description: "Create short links in seconds with a clean and fast workflow.",
    icon: Link2,
  },
  {
    title: "Real-time Analytics",
    description: "Track clicks, trends, and top-performing links as they happen.",
    icon: BarChart3,
  },
  {
    title: "AI-Powered Safety",
    description: "Automatically check destination URLs before sharing them.",
    icon: Sparkles,
  },
  {
    title: "Custom Short Codes",
    description: "Create branded and memorable short codes for every campaign.",
    icon: Link2,
  },
  {
    title: "QR Code Generation",
    description: "Generate QR codes for quick sharing across print and digital channels.",
    icon: QrCode,
  },
  {
    title: "Role-Based Access",
    description: "Control team permissions with secure user role management.",
    icon: Users,
  },
];

const howItWorksSteps = [
  {
    title: "Paste your URL",
    description: "Add your long link and optional custom short code.",
  },
  {
    title: "Generate and share",
    description: "Create the short link instantly and share it anywhere.",
  },
  {
    title: "Track performance",
    description: "Use analytics insights to improve conversion and engagement.",
  },
];

export function LandingSections() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <section aria-labelledby="features-heading" className="py-24 md:py-32 space-y-12">
        <div className="text-center">
          <h2
            id="features-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          >
            Built for modern teams
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            Everything you need to shorten, monitor, and protect links at scale.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="rounded-2xl border border-border/50 p-6 md:p-8 hover:shadow-lg transition-shadow"
            >
              <CardHeader className="px-0 pb-2">
                <feature.icon className="size-5 text-primary" />
                <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <CardDescription className="leading-relaxed text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="how-it-works-heading" className="py-24 md:py-32 space-y-12">
        <div className="text-center">
          <h2
            id="how-it-works-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          >
            How it works
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {howItWorksSteps.map((step, index) => (
            <Card
              key={step.title}
              className="rounded-2xl border border-border/50 p-6 hover:shadow-lg transition-shadow"
            >
              <CardHeader className="px-0 pb-2">
                <p className="text-sm font-medium text-primary mb-2">Step {index + 1}</p>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <CardDescription className="leading-relaxed text-muted-foreground">
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="cta-heading" className="py-24 md:py-32">
        <Card className="max-w-3xl mx-auto text-center py-20 px-6 rounded-2xl border border-border/50 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle id="cta-heading" className="text-2xl md:text-3xl mb-4">
              Start shortening smarter with Ziply
            </CardTitle>
            <CardDescription className="leading-relaxed text-muted-foreground mb-6">
              Create secure, trackable short links and optimize your campaigns in minutes.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 mt-4">
            <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild>
              <Link href="/register">Create free account</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            </div>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}
