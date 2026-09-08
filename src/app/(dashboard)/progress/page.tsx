import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getStudentDetailedProgress } from "@/lib/analytics-db";
import { PageHeader } from "@/components/ui/page-header";
import { StudentProgressClient } from "@/components/analytics/student-progress-client";

export default async function StudentProgressPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/progress");
  }

  if (session.role === "ADMIN") {
    redirect("/admin");
  }

  const progressData = await getStudentDetailedProgress(session.userId);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Employability Analytics - ${session.name}`}
        description="Comprehensive analytics on your active coursework, completed lessons, assessment scores, and verified skill achievements."
        badgeText="Skill Progress Matrix"
      />

      <StudentProgressClient data={progressData} />
    </div>
  );
}
