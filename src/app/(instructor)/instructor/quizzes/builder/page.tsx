import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCourses } from "@/lib/db";
import { PageHeader } from "@/components/ui/page-header";
import { QuizManagerClient } from "@/components/admin/quiz-manager-client";

export default async function InstructorQuizBuilderPage() {
  const session = await getSession();

  if (!session || (session.role !== "INSTRUCTOR" && session.role !== "ADMIN")) {
    redirect("/dashboard?error=unauthorized");
  }

  const courses = await getCourses();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Assessment & Quiz Builder"
        description="Design automated quizzes, question banks, answer options, and passing scores for course lessons."
        badgeText="Assessment Suite"
      />

      <QuizManagerClient courses={courses} initialQuizzes={[]} />
    </div>
  );
}
