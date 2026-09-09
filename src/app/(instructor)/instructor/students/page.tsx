import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllStudentsAdmin } from "@/lib/admin-db";
import { PageHeader } from "@/components/ui/page-header";
import { StudentsClient } from "@/components/admin/students-client";

export default async function InstructorStudentsPage() {
  const session = await getSession();

  if (!session || (session.role !== "INSTRUCTOR" && session.role !== "ADMIN")) {
    redirect("/dashboard?error=unauthorized");
  }

  const students = await getAllStudentsAdmin();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Student Roster & Skill Tracking"
        description="Inspect enrolled candidates, view course completion progress, and track overall employability scores."
        badgeText="Class Roster"
      />

      <StudentsClient students={students} />
    </div>
  );
}
