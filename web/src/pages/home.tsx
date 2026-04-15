import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Search, Zap, Shield, Globe, Code, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: BookOpen,
    title: "Comprehensive Documentation",
    description: "Access 300+ AI documentation files covering fundamentals to production deployment.",
  },
  {
    icon: Search,
    title: "Full-Text Search",
    description: "Find exactly what you need with our powerful search powered by Fuse.js.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built with Vite for optimal performance and instant page loads.",
  },
  {
    icon: Shield,
    title: "Always Up-to-Date",
    description: "Content regularly updated to reflect the latest AI developments.",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Support for multiple languages with i18n built-in.",
  },
  {
    icon: Code,
    title: "Open Source",
    description: "Fully open source under MIT license. Contribute on GitHub.",
  },
];

const stats = [
  { label: "Documentation Files", value: "300+" },
  { label: "Knowledge Chapters", value: "14" },
  { label: "AI Concepts", value: "800+" },
  { label: "Learning Paths", value: "6" },
];

export function HomePage() {
  return (
    <div className="container relative">
      {/* Hero Section */}
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-4 py-12 md:py-24 lg:py-32">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
            AI Guru Knowledge Base
          </h1>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            A comprehensive, modern knowledge base for AI learning. 
            From fundamentals to production deployment, all in one place.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/docs">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/search">Search Docs</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/arena">
              <Trophy className="mr-2 h-4 w-4" />
              Agent Leaderboard
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/50 py-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-3xl font-bold">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Everything you need for AI learning and reference.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col">
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t py-12 md:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
            Ready to start learning?
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Explore our comprehensive documentation and start your AI journey today.
          </p>
          <Button size="lg" asChild className="mt-4">
            <Link to="/docs">
              Browse Documentation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
