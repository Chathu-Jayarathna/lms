import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllAdminCourses } from "@/lib/admin-db";
import { PageHeader } from "@/components/ui/page-header";
import { CourseManagerClient } from "@/components/admin/course-manager-client";

export default async function AdminCoursesPage() {
  const session = await getSession();

  // Strict Server-Side Authorization Check
  if (!session || session.role !== "ADMIN") {
    redirect("/dashboard?error=unauthorized");
  }

  const courses = await getAllAdminCourses();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage Employability Courses"
        description="Full course inventory management suite. Create, edit, publish/unpublish, or delete courses and curriculum modules."
        badgeText="Catalog Manager"
      />

      <CourseManagerClient courses={courses} />
    </div>
  );
}
