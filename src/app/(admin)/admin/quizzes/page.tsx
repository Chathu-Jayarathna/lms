import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllAdminCourses } from "@/lib/admin-db";
import { getCourseQuizzes } from "@/lib/quiz-db";
import { PageHeader } from "@/components/ui/page-header";
import { AdminQuizManagerClient } from "@/components/admin/quiz-manager-client";

export default async function AdminQuizzesPage() {
  const session = await getSession();

  // Strict Server-Side Authorization Check
  if (!session || session.role !== "ADMIN") {
    redirect("/dashboard?error=unauthorized");
  }

  const courses = await getAllAdminCourses();
  const quizzes = await getCourseQuizzes("c-comm-1");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Institutional Assessment & Quiz Manager"
        description="Create quizzes, configure passing threshold scores, set multiple-choice questions, and define correct answer keys."
        badgeText="Assessment Suite"
      />

      <AdminQuizManagerClient courses={courses} initialQuizzes={quizzes} />
    </div>
  );
}
