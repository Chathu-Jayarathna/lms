import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, Calendar } from "lucide-react";

export default async function StudentAttendancePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/attendance");
  }

  if (session.role === "ADMIN") redirect("/admin");
  if (session.role === "INSTRUCTOR") redirect("/instructor");

  const attendanceRecords = [
    { id: "att-1", date: "Sep 03, 2026", course: "Communication Skills for Employability", status: "PRESENT" },
    { id: "att-2", date: "Sep 01, 2026", course: "Communication Skills for Employability", status: "PRESENT" },
    { id: "att-3", date: "Aug 28, 2026", course: "Communication Skills for Employability", status: "LATE" },
    { id: "att-4", date: "Aug 25, 2026", course: "Communication Skills for Employability", status: "PRESENT" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Attendance History - ${session.name}`}
        description="Track your verified course attendance percentages and session records."
        badgeText="Attendance Record"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Overall Attendance Rate"
          value="95.0%"
          change="Institutional Threshold Met"
          trend="up"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
        />
        <StatCard
          title="Total Sessions Attended"
          value="19 Sessions"
          description="Verified present by instructor"
          icon={<Calendar className="h-5 w-5 text-blue-600" />}
        />
        <StatCard
          title="Late Arrival Counter"
          value="1 Session"
          description="Within 15-min grace period"
          icon={<Clock className="h-5 w-5 text-amber-600" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Attendance Log</CardTitle>
          <CardDescription>Real-time session records marked by course instructors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {attendanceRecords.map((rec) => (
            <div key={rec.id} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500">{rec.date}</span>
                <h4 className="font-semibold text-slate-900 text-xs">{rec.course}</h4>
              </div>
              <Badge variant={rec.status === "PRESENT" ? "success" : rec.status === "LATE" ? "warning" : "danger"}>
                {rec.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
