import { notFound } from "next/navigation";
import Link from "next/link";
import { getCourseBySlug, isStudentEnrolled } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Users, ArrowLeft, CheckCircle2, Award, User, ShieldCheck } from "lucide-react";
import { CourseEnrollButton } from "@/components/courses/course-enroll-button";

interface CourseDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const session = await getSession();
  const userId = session?.userId || "";
  const enrolled = userId ? await isStudentEnrolled(userId, course.id) : false;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/courses" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-4 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Course Catalog
        </Link>
        <PageHeader
          title={course.title}
          description={course.description}
          badgeText={course.category}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Overview & Syllabus */}
        <div className="lg:col-span-2 space-y-6">
          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" /> What You Will Learn & Achieve
              </CardTitle>
              <CardDescription>Employability competencies verified upon course completion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">Master real-world technical and soft skills targeted by top global recruiters.</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">Construct audit-ready portfolio artifacts and documented incident solutions.</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">Earn Thakral Global Learning verified digital skill badges.</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">Prepare for technical whiteboarding and behavioral STAR interview formats.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Module Syllabus Accordion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" /> Course Syllabus ({course.modulesCount} Modules, {course.lessonsCount} Lessons)
              </CardTitle>
              <CardDescription>Structured breakdown of modules and lesson contents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {course.modules.map((mod, idx) => (
                <div key={mod.id} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 p-4 flex items-center justify-between font-semibold text-slate-900 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      {mod.title}
                    </span>
                    <span className="text-xs text-slate-500 font-normal">{mod.lessons.length} Lessons</span>
                  </div>

                  <div className="divide-y divide-slate-100 bg-white">
                    {mod.lessons.map((les, lIdx) => (
                      <div key={les.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 font-mono text-[11px]">{lIdx + 1}.</span>
                          <span className="font-medium text-slate-800">{les.title}</span>
                        </div>
                        <span className="text-slate-500 font-mono flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" /> {les.durationMins} mins
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Course Action & Overview Card */}
        <div className="space-y-6">
          <Card className="sticky top-20 shadow-md">
            <CardHeader className="space-y-3 pb-4">
              <div className="flex items-center justify-between">
                <Badge variant="default">{course.category}</Badge>
                <Badge variant="outline">{course.level}</Badge>
              </div>
              <CardTitle className="text-xl leading-tight">{course.title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 border-t border-slate-100 pt-4 text-xs">
              <div className="space-y-2.5">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Total Duration</span>
                  <span className="font-semibold text-slate-900">{course.durationMins} Minutes</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Modules & Lessons</span>
                  <span className="font-semibold text-slate-900">{course.modulesCount} Modules / {course.lessonsCount} Lessons</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Lead Instructor</span>
                  <span className="font-semibold text-slate-900">{course.instructorName}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> TGL Credential</span>
                  <span className="font-semibold text-emerald-600">Verified Certificate</span>
                </div>
              </div>

              {/* Enrollment Button */}
              <div className="pt-4">
                <CourseEnrollButton
                  courseId={course.id}
                  courseSlug={course.slug}
                  isEnrolled={enrolled}
                  isLoggedIn={!!session}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
