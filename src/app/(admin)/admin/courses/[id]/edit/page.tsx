import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getAllAdminCourses } from "@/lib/admin-db";
import { PageHeader } from "@/components/ui/page-header";
import { ArrowLeft } from "lucide-react";
import { CurriculumEditorClient } from "@/components/admin/curriculum-editor-client";

interface EditCoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params;
  const session = await getSession();

  // Strict Server-Side Authorization Check
  if (!session || session.role !== "ADMIN") {
    redirect("/dashboard?error=unauthorized");
  }

  const allCourses = await getAllAdminCourses();
  const course = allCourses.find((c) => c.id === id || c.slug === id);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/courses" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-4 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Course Inventory
        </Link>
        <PageHeader
          title={`Curriculum Editor: ${course.title}`}
          description="Add, edit, and organize modules and lesson contents for this employability course."
          badgeText={course.category}
        />
      </div>

      <CurriculumEditorClient course={course} />
    </div>
  );
}
