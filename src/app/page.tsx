import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth";
import {
  Sparkles,
  Target,
  BrainCircuit,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  BookOpen,
} from "lucide-react";

export default async function LandingPage() {
  const session = await getSession();

  if (session?.role === "ADMIN") {
    redirect("/admin");
  }

  if (session?.role === "STUDENT") {
    redirect("/dashboard");
  }

  const pillars = [
    {
      icon: Target,
      title: "Targeted Employability Pathways",
      description:
        "Structured learning paths designed specifically around real-world job roles in Software Engineering, Data Analytics, and Technical Management.",
    },
    {
      icon: BrainCircuit,
      title: "AI-Powered Skill Simulator",
      description:
        "Real-time AI feedback on technical interview responses, CV positioning, and communication clarity to ensure candidate confidence.",
    },
    {
      icon: TrendingUp,
      title: "Employability Index Tracking",
      description:
        "Quantitative metric tracking assessing technical proficiency, soft skills, and project readiness to benchmark student progress.",
    },
    {
      icon: Award,
      title: "Industry Skill Verification",
      description:
        "Earn verified employability credentials endorsed by Thakral Global Learning for direct employer placement opportunities.",
    },
  ];

  const featuredCourses = [
    {
      title: "Full-Stack Software Engineering Employability Prep",
      category: "Software Development",
      level: "Intermediate",
      duration: "6 Weeks",
      enrolled: 420,
      description: "Master modern web architectures, system design interviews, and enterprise Git workflows.",
    },
    {
      title: "Executive Communication & Technical Leadership",
      category: "Soft Skills",
      level: "All Levels",
      duration: "4 Weeks",
      enrolled: 680,
      description: "Refine client presentations, stakeholder messaging, and collaborative problem-solving skills.",
    },
    {
      title: "AI & Data Engineering Career Bootcamp",
      category: "Data & AI",
      level: "Advanced",
      duration: "8 Weeks",
      enrolled: 310,
      description: "Practical pipeline building, SQL mastery, and machine learning model deployment standards.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar session={session} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Thakral Global Learning (TGL) Initiative</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight">
              AI-Powered LMS for <span className="text-blue-500">Employability Skills</span> Development
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed font-normal">
              Bridge the critical gap between academic computer science knowledge and global industry recruitment standards through adaptive AI coaching, skill gap analytics, and hands-on career training.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href={session ? ((session.role as string) === "ADMIN" ? "/admin" : (session.role as string) === "INSTRUCTOR" ? "/instructor" : "/dashboard") : "/register"}>
                <Button variant="accent" size="lg" className="gap-2">
                  {session ? "Enter Your Portal" : "Launch Learner Portal"} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" size="lg" className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">
                  Explore Course Matrix
                </Button>
              </Link>
            </div>

            {/* Quick Metrics Banner */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-800">
              <div>
                <div className="text-2xl font-bold text-white">94%</div>
                <div className="text-xs text-slate-400">Graduate Employability Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">15+</div>
                <div className="text-xs text-slate-400">Specialized Skill Tracks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">24/7</div>
                <div className="text-xs text-slate-400">AI Career Coach Assistance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Employability Pillars */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Platform Core</h2>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">Architected for Industry Placement</p>
            <p className="text-sm text-slate-500">
              TGL LMS equips graduates with the exact technical, behavioral, and communication competencies top global employers demand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <Card key={idx} className="border-slate-200 hover:border-blue-500/50 hover:shadow-md transition-all">
                  <CardHeader className="space-y-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{pillar.title}</CardTitle>
                    <CardDescription className="text-xs leading-relaxed">{pillar.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Employability Courses Preview */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Curriculum</span>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">Curated Employability Courses</h2>
            </div>
            <Link href="/courses">
              <Button variant="outline" size="sm" className="gap-1.5">
                View All Courses <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCourses.map((course, idx) => (
              <Card key={idx} className="flex flex-col justify-between hover:shadow-md transition-all">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="default">{course.category}</Badge>
                    <span className="text-xs text-slate-500 font-medium">{course.level}</span>
                  </div>
                  <CardTitle className="text-lg leading-snug pt-1">{course.title}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {course.enrolled} Enrolled
                    </span>
                  </div>
                  <Link href="/courses">
                    <Button variant="secondary" size="sm" className="w-full">
                      View Syllabus Shell
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Banner */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <Badge variant="accent" className="font-mono uppercase">AI Assistant Module</Badge>
            <h2 className="text-3xl font-bold tracking-tight">Personalized Mock Interview & Resume Feedback</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Experience automated feedback on response structure, keyword optimization for technical job listings, and real-time guidance tuned to employer requirements.
            </p>
          </div>
          <Link href="/ai-assistant">
            <Button variant="accent" size="lg" className="whitespace-nowrap">
              Try AI Coach Shell
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
