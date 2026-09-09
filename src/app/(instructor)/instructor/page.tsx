import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCourses } from "@/lib/db";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, FileCheck, Plus, CheckSquare, PenTool } from "lucide-react";
import Link from "next/link";

export default async function InstructorDashboardPage() {
  const session = await getSession();

  if (!session || (session.role !== "INSTRUCTOR" && session.role !== "ADMIN")) {
    redirect("/dashboard?error=unauthorized");
  }

  const courses = await getCourses();

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Instructor Dashboard - ${session.name}`}
        description="Course authoring suite, student attendance manager, assignment feedback, and quiz assessment analytics."
        badgeText="Instructor Console"
        action={
          <Link href="/instructor/courses/create">
            <Button variant="accent" size="sm" className="gap-1.5 font-semibold">
              <Plus className="h-4 w-4" /> Create Course Shell
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Authored Courses"
          value={`${courses.length} Courses`}
          description="Active learning curricula"
          icon={<BookOpen className="h-5 w-5 text-blue-600" />}
        />
        <StatCard
          title="Active Students"
          value="142 Candidates"
          description="Enrolled in your classes"
          icon={<Users className="h-5 w-5 text-amber-600" />}
        />
        <StatCard
          title="Pending Submissions"
          value="8 Submissions"
          description="Awaiting feedback & grade"
          icon={<PenTool className="h-5 w-5 text-emerald-600" />}
        />
        <StatCard
          title="Avg Attendance Rate"
          value="96.4%"
          description="Institutional track score"
          icon={<CheckSquare className="h-5 w-5 text-purple-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">My Course Inventory</CardTitle>
                <CardDescription>Manage modules, lesson videos, PDFs, and quizzes</CardDescription>
              </div>
              <Link href="/instructor/courses/create">
                <Button variant="outline" size="sm" className="text-xs">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Course
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {courses.slice(0, 4).map((c) => (
                <div key={c.id} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">{c.category}</Badge>
                      <span className="text-xs font-semibold text-emerald-600">{c.isPublished ? "Published" : "Draft"}</span>
                    </div>
                    <h4 className="font-semibold text-slate-900 text-sm">{c.title}</h4>
                    <p className="text-xs text-slate-500">{c.modulesCount} Modules • {c.lessonsCount} Lessons</p>
                  </div>
                  <Link href={`/admin/courses/${c.id}/edit`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      Curriculum Editor
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-slate-800">
            <CardHeader>
              <Badge variant="accent" className="w-fit">Shortcuts</Badge>
              <CardTitle className="text-white text-lg">Instructor Action Center</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/instructor/attendance">
                <Button variant="accent" className="w-full justify-start text-xs gap-2 font-semibold">
                  <CheckSquare className="h-4 w-4" /> Mark Attendance
                </Button>
              </Link>
              <Link href="/instructor/assignments/review">
                <Button variant="outline" className="w-full justify-start text-xs bg-slate-800 text-white border-slate-700 hover:bg-slate-700 gap-2">
                  <PenTool className="h-4 w-4 text-emerald-400" /> Grade Submissions
                </Button>
              </Link>
              <Link href="/instructor/quizzes/builder">
                <Button variant="outline" className="w-full justify-start text-xs bg-slate-800 text-white border-slate-700 hover:bg-slate-700 gap-2">
                  <FileCheck className="h-4 w-4 text-amber-400" /> Quiz & Question Bank
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
