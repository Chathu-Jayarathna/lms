import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllAdminStudents } from "@/lib/admin-db";
import { PageHeader } from "@/components/ui/page-header";
import { StudentsClient } from "@/components/admin/students-client";

export default async function AdminStudentsPage() {
  const session = await getSession();

  // Strict Server-Side Authorization Check
  if (!session || session.role !== "ADMIN") {
    redirect("/dashboard?error=unauthorized");
  }

  const students = await getAllAdminStudents();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Student Candidate Directory"
        description="Inspect registered candidate profiles, target career roles, and individual course progress metrics."
        badgeText="Candidate Directory"
      />

      <StudentsClient students={students} />
    </div>
  );
}
