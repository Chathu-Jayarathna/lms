import { getSession } from "@/lib/auth";
import { getCourses } from "@/lib/db";
import { getAIAnalyticsAction } from "@/app/actions/ai";
import { PageHeader } from "@/components/ui/page-header";
import { AIAssistantClient } from "@/components/ai/ai-assistant-client";

import { redirect } from "next/navigation";

export default async function AIAssistantPage() {
  const session = await getSession();

  if (session?.role === "ADMIN") {
    redirect("/admin");
  }

  const userName = session?.name || "Student Candidate";

  const courses = await getCourses();
  const analytics = await getAIAnalyticsAction();

  return (
    <div className="space-y-8">
      <PageHeader
        title={`AI Learning Assistant - ${userName}`}
        description="Your dedicated educational AI tutor grounded in Thakral Global Learning course reading. Ask questions, request simplified explanations, and explore real-world examples."
        badgeText="TGL AI Tutor"
      />

      <AIAssistantClient courses={courses} analytics={analytics} />
    </div>
  );
}
