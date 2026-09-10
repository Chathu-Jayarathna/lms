import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getResearchAnalyticsAction } from "@/app/actions/research";
import { PageHeader } from "@/components/ui/page-header";
import { ResearchDashboardClient } from "@/components/admin/research-dashboard-client";

export default async function AdminResearchPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/dashboard?error=unauthorized");
  }

  const analytics = await getResearchAnalyticsAction();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Executive Research Evaluation & System Analytics"
        description="Anonymized aggregated dataset evaluating the three core BSc Computer Science research questions on LMS engagement, AI assistant effectiveness, and centralized progress tracking."
        badgeText="BSc Research Evaluation"
      />

      <ResearchDashboardClient data={analytics} />
    </div>
  );
}
