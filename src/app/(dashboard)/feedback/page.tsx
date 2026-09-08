import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PageHeader } from "@/components/ui/page-header";
import { FeedbackClient } from "@/components/feedback/feedback-client";

export default async function StudentFeedbackPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/feedback");
  }

  if (session.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="BSc Research Usability & Satisfaction Survey"
        description="Your feedback directly supports evaluating the research question: 'How can an AI-powered LMS improve online learning, engagement, and self-paced study?'"
        badgeText="Academic Survey"
      />

      <FeedbackClient studentName={session.name} />
    </div>
  );
}
