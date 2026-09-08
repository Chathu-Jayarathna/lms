import { getSession } from "@/lib/auth";
import { getStudentEnrollments } from "@/lib/db";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, TrendingUp, Bot, Award, ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";
import Link from "next/link";

import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();

  if (session?.role === "ADMIN") {
    redirect("/admin");
  }

  const userId = session?.userId || "student-preview";
  const userName = session?.name || "Student Candidate";

  // Real Database Calculations from PostgreSQL / Prisma Data Layer
  const enrollments = await getStudentEnrollments(userId);
  
  const enrolledCount = enrollments.length;
  const inProgressEnrollments = enrollments.filter((e) => e.progressPercent < 100);
  const inProgressCount = inProgressEnrollments.length;
  const completedCount = enrollments.filter((e) => e.progressPercent === 100).length;

  const overallProgress =
    enrolledCount > 0
      ? Math.round(enrollments.reduce((acc, e) => acc + e.progressPercent, 0) / enrolledCount)
      : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Learner Dashboard - ${userName}`}
        description="Welcome back to Thakral Global Learning. Your active learning statistics and employability metrics are computed live from PostgreSQL."
        badgeText="TGL Verified Learner"
        action={
          <Link href="/courses">
            <Button variant="accent" size="sm" className="gap-1.5">
              <BookOpen className="h-4 w-4" /> Browse Course Catalog
            </Button>
          </Link>
        }
      />

      {/* Real Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall Employability Progress"
          value={`${overallProgress}%`}
          change={enrolledCount > 0 ? "Computed Live" : "Enroll to Start"}
          trend="up"
          description="Average course completion"
          icon={<Award className="h-5 w-5 text-amber-600" />}
        />
        <StatCard
          title="Total Enrolled Courses"
          value={`${enrolledCount} ${enrolledCount === 1 ? "Course" : "Courses"}`}
          description={`${inProgressCount} active, ${completedCount} completed`}
          icon={<BookOpen className="h-5 w-5 text-blue-600" />}
        />
        <StatCard
          title="Courses in Progress"
          value={`${inProgressCount} Courses`}
          description="Active learning modules"
          icon={<GraduationCap className="h-5 w-5 text-emerald-600" />}
        />
        <StatCard
          title="Completed Courses"
          value={`${completedCount} Courses`}
          description="100% verified complete"
          icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
        />
      </div>

      {/* Main Grid: Active Learning & Continue Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>In-Progress Employability Courses</CardTitle>
                <CardDescription>Continue your active lessons</CardDescription>
              </div>
              <Link href="/my-courses">
                <Button variant="ghost" size="sm" className="text-blue-600">
                  View All ({enrolledCount})
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {inProgressEnrollments.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl space-y-3">
                  <BookOpen className="h-8 w-8 mx-auto text-slate-400" />
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-800 text-sm">No Active Courses In Progress</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Explore our 8 curated employability courses to start developing key technical & soft skills.
                    </p>
                  </div>
                  <Link href="/courses">
                    <Button variant="primary" size="sm" className="mt-2">
                      Explore Course Catalog
                    </Button>
                  </Link>
                </div>
              ) : (
                inProgressEnrollments.map((enr) => (
                  <div
                    key={enr.id}
                    className="p-4 border border-slate-200 rounded-xl space-y-3 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="default">{enr.course.category}</Badge>
                      <span className="text-xs font-semibold text-blue-600">{enr.progressPercent}% Completed</span>
                    </div>
                    <h4 className="font-semibold text-slate-900">{enr.course.title}</h4>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${enr.progressPercent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>{enr.course.modulesCount} Modules • {enr.course.lessonsCount} Lessons</span>
                      <Link href={`/courses/${enr.course.slug}/learn`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                          <PlayCircle className="h-3.5 w-3.5" /> Continue Lesson
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Action Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Employability Milestone Checklist</CardTitle>
              <CardDescription>Verified tasks to maximize employer recruitment visibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">Complete Communication & Leadership Modules</span>
                  <p className="text-slate-500">Unlocks executive presentation badge on candidate profile.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">Finish Technical & Behavioral Interview Course</span>
                  <p className="text-slate-500">Prepares candidates for live coding and STAR format questions.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Employability Sidebar */}
        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-slate-800">
            <CardHeader className="space-y-2">
              <Badge variant="accent" className="w-fit">Quick Action</Badge>
              <CardTitle className="text-white text-lg">Browse Course Matrix</CardTitle>
              <CardDescription className="text-slate-300 text-xs">
                All 8 TGL employability skills courses are now available in the catalog.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Link href="/courses">
                <Button variant="accent" className="w-full text-xs gap-1.5">
                  View Course Catalog <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Verified Skill Competencies</CardTitle>
              <CardDescription>Skills tracked across completed lessons</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge variant="success">Technical Speaking</Badge>
              <Badge variant="success">Active Listening</Badge>
              <Badge variant="success">Agile Scrum</Badge>
              <Badge variant="default">Deep Work</Badge>
              <Badge variant="warning">STAR Framework</Badge>
              <Badge variant="outline">ATS Resume Optimization</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
