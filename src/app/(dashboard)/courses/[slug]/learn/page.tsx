import { notFound, redirect } from "next/navigation";
import { getCourseBySlug, isStudentEnrolled, getCompletedLessonIds } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { LessonPlayerClient } from "@/components/courses/lesson-player-client";

interface LearnPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function LearnPage({ params }: LearnPageProps) {
  const { slug } = await params;
  const session = await getSession();

  if (!session) {
    redirect(`/login?callbackUrl=/courses/${slug}/learn`);
  }

  const course = await getCourseBySlug(slug);
  if (!course) {
    notFound();
  }

  const enrolled = await isStudentEnrolled(session.userId, course.id);
  if (!enrolled) {
    redirect(`/courses/${slug}`);
  }

  const completedLessonIds = await getCompletedLessonIds(session.userId);

  return (
    <div className="-m-6 lg:-m-8 min-h-[calc(100vh-4rem)] flex flex-col bg-slate-50">
      <LessonPlayerClient
        course={course}
        completedLessonIds={Array.from(completedLessonIds)}
      />
    </div>
  );
}
