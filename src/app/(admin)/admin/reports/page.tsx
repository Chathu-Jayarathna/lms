import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAdminReportsData, getAdminAnalyticsCharts } from "@/lib/analytics-db";
import { getAllAdminCourses, getAllAdminStudents } from "@/lib/admin-db";
import { PageHeader } from "@/components/ui/page-header";
import { AdminReportsClient } from "@/components/admin/admin-reports-client";

export default async function AdminReportsPage() {
  const session = await getSession();

  // Strict Server-Side Authorization Check
  if (!session || session.role !== "ADMIN") {
    redirect("/dashboard?error=unauthorized");
  }

  const reports = await getAdminReportsData();
  const charts = await getAdminAnalyticsCharts();
  const courses = await getAllAdminCourses();
  const students = await getAllAdminStudents();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Institutional Analytics & Reports"
        description="Filter candidate progress records, export institutional employability data, and inspect learning performance trends."
        badgeText="Executive Reports"
      />

      <AdminReportsClient
        initialReports={reports}
        charts={charts}
        courses={courses}
        students={students}
      />
    </div>
  );
}
