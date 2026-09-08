import { getSession } from "@/lib/auth";
import { getStudentEnrollments } from "@/lib/db";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, PlayCircle, Clock } from "lucide-react";
import Link from "next/link";

import { redirect } from "next/navigation";

export default async function MyCoursesPage() {
  const session = await getSession();

  if (session?.role === "ADMIN") {
    redirect("/admin");
  }

  const userId = session?.userId || "student-preview";

  // Queries only courses belonging to the logged-in student candidate
  const enrollments = await getStudentEnrollments(userId);

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Enrolled Courses"
        description="Track your active coursework, continue lessons, and view real-time progress calculated from completed lessons."
        badgeText="Learner Workspace"
      />

      {enrollments.length === 0 ? (
        <Card className="p-12 text-center border border-dashed border-slate-200 space-y-4">
          <BookOpen className="h-12 w-12 mx-auto text-slate-300" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No Enrolled Courses Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              You are not enrolled in any courses yet. Browse the course catalog to enroll in targeted employability programs.
            </p>
          </div>
          <Link href="/courses">
            <Button variant="accent" size="sm">
              Browse Employability Catalog
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enr) => {
            const isCompleted = enr.progressPercent === 100;

            return (
              <Card key={enr.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2">
                      <Badge variant={isCompleted ? "success" : "default"}>
                        {enr.course.category}
                      </Badge>
                      <span className="text-xs font-semibold text-slate-500">
                        {isCompleted ? "Course Completed" : "In Progress"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{enr.course.title}</h3>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5 text-slate-400" /> {enr.course.modulesCount} Modules ({enr.course.lessonsCount} Lessons)
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" /> {enr.course.durationMins} Mins
                      </span>
                    </div>

                    {/* Dynamic Progress Bar */}
                    <div className="space-y-1 pt-2">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>Course Completion</span>
                        <span>{enr.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isCompleted ? "bg-emerald-600" : "bg-blue-600"
                          }`}
                          style={{ width: `${enr.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                    {isCompleted ? (
                      <Button variant="outline" size="sm" className="w-full sm:w-auto gap-1.5 border-emerald-300 bg-emerald-50 text-emerald-800">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Certificate Earned
                      </Button>
                    ) : null}

                    <Link href={`/courses/${enr.course.slug}/learn`}>
                      <Button variant={isCompleted ? "secondary" : "primary"} size="sm" className="w-full sm:w-auto gap-1.5">
                        <PlayCircle className="h-4 w-4" /> {isCompleted ? "Review Course" : "Continue Course"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
