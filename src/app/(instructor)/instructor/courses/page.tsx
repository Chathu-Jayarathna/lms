import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCourses } from "@/lib/db";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Edit } from "lucide-react";
import Link from "next/link";

export default async function InstructorCoursesPage() {
  const session = await getSession();

  if (!session || (session.role !== "INSTRUCTOR" && session.role !== "ADMIN")) {
    redirect("/dashboard?error=unauthorized");
  }

  const courses = await getCourses();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Instructor Course Management"
        description="View, edit, and create your authored employability courses, modules, and video/PDF lesson contents."
        badgeText="Course Manager"
        action={
          <Link href="/instructor/courses/create">
            <Button variant="accent" size="sm" className="gap-1.5 font-semibold">
              <Plus className="h-4 w-4" /> Add New Course
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col justify-between p-5 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="default">{course.category}</Badge>
                <span className="text-xs font-semibold text-emerald-600">
                  {course.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">{course.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{course.modulesCount} Modules • {course.lessonsCount} Lessons</span>
              <Link href={`/admin/courses/${course.id}/edit`}>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                  <Edit className="h-3.5 w-3.5" /> Edit Syllabus
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
