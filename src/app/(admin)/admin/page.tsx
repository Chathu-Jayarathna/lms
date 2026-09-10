import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAdminMetrics } from "@/lib/admin-db";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, FileText, Award, Plus, ShieldCheck, Activity, BarChart2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await getSession();

  // Strict Server-Side Authorization Check
  if (!session || session.role !== "ADMIN") {
    redirect("/dashboard?error=unauthorized");
  }

  const metrics = await getAdminMetrics();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Institutional Admin Dashboard"
        description="Thakral Global Learning executive management suite: real-time database metrics for candidates, course inventory, and outcome analytics."
        badgeText="Admin Portal"
        action={
          <Link href="/admin/courses">
            <Button variant="accent" size="sm" className="gap-1.5 font-semibold">
              <Plus className="h-4 w-4" /> Create New Course
            </Button>
          </Link>
        }
      />

      {/* Real Admin Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Student Candidates"
          value={metrics.totalStudents}
          change="Registered Candidates"
          trend="up"
          icon={<Users className="h-5 w-5 text-blue-600" />}
        />
        <StatCard
          title="Course Inventory"
          value={`${metrics.totalCourses} Courses`}
          description="Curriculum modules"
          icon={<BookOpen className="h-5 w-5 text-amber-600" />}
        />
        <StatCard
          title="Active Enrollments"
          value={metrics.activeEnrollments}
          description="Candidate learning streams"
          icon={<Award className="h-5 w-5 text-emerald-600" />}
        />
        <StatCard
          title="Avg Employability Score"
          value={`${metrics.avgProgress}%`}
          change="PostgreSQL Computed"
          trend="up"
          icon={<ShieldCheck className="h-5 w-5 text-purple-600" />}
        />
      </div>

      {/* Analytics Chart & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Institutional Outcome Bar Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-blue-600" /> Candidate Progress Distribution
                </CardTitle>
                <CardDescription>Live breakdown of candidate course completion stages</CardDescription>
              </div>
              <Badge variant="default">Real-Time DB</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Completed Courses (100% Verified)</span>
                    <span className="text-emerald-700 font-bold">{metrics.completedCourses} Courses</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                      className="bg-emerald-600 h-3 rounded-full transition-all"
                      style={{
                        width: `${metrics.totalCourses > 0 ? (metrics.completedCourses / metrics.totalCourses) * 100 : 25}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Active Enrollments In-Progress</span>
                    <span className="text-blue-700 font-bold">{metrics.activeEnrollments} Active</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{
                        width: `${metrics.totalCourses > 0 ? (metrics.activeEnrollments / metrics.totalCourses) * 100 : 50}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Average Skill Matrix Index</span>
                    <span className="text-amber-700 font-bold">{metrics.avgProgress}% Score</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                      className="bg-amber-500 h-3 rounded-full transition-all"
                      style={{ width: `${metrics.avgProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Candidate Activity Log */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-600" /> Recent Candidate Activity
                </CardTitle>
                <CardDescription>Real-time audit log of candidate learning triggers</CardDescription>
              </div>
              <Link href="/admin/students">
                <Button variant="ghost" size="sm" className="text-blue-600 text-xs">
                  Manage Students
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {metrics.recentActivity.map((act) => (
                <div key={act.id} className="flex items-center justify-between p-3 border-b border-slate-100 text-xs hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900 block">{act.userName}</span>
                      <span className="text-slate-500">{act.action}: <strong className="text-slate-700">{act.detail}</strong></span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Recently</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Admin Management Shortcuts */}
        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-slate-800">
            <CardHeader className="space-y-2">
              <Badge variant="accent" className="w-fit">Quick Suite</Badge>
              <CardTitle className="text-white text-lg">Admin Management Console</CardTitle>
              <CardDescription className="text-slate-300 text-xs">
                Manage course creation, publish status, and student records.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <Link href="/admin/courses">
                <Button variant="accent" className="w-full justify-start text-xs font-semibold gap-2">
                  <BookOpen className="h-4 w-4" /> Course Inventory & Editor
                </Button>
              </Link>
              <Link href="/admin/students">
                <Button variant="outline" className="w-full justify-start text-xs bg-slate-800 text-white border-slate-700 hover:bg-slate-700 gap-2">
                  <Users className="h-4 w-4 text-blue-400" /> Student Candidates Directory
                </Button>
              </Link>
              <Link href="/admin/reports">
                <Button variant="outline" className="w-full justify-start text-xs bg-slate-800 text-white border-slate-700 hover:bg-slate-700 gap-2">
                  <FileText className="h-4 w-4 text-amber-400" /> Employability Reports
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
