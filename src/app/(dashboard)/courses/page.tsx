import { getCourses, getStudentEnrollments } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PageHeader } from "@/components/ui/page-header";
import { CoursesClient } from "@/components/courses/courses-client";

import { redirect } from "next/navigation";

export default async function CoursesPage() {
  const session = await getSession();

  if (session?.role === "ADMIN") {
    redirect("/admin/courses");
  }

  const userId = session?.userId || "";
  
  const courses = await getCourses();
  const enrollments = userId ? await getStudentEnrollments(userId) : [];
  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Employability Course Catalog"
        description="Explore TGL's curated employability curriculum. Filter by category, view course details, and enroll to build your skills."
        badgeText="Curriculum Matrix"
      />

      <CoursesClient courses={courses} enrolledCourseIds={Array.from(enrolledCourseIds)} />
    </div>
  );
}
