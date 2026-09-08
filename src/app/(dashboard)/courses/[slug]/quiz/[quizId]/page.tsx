import { notFound, redirect } from "next/navigation";
import { getQuizForStudent, getQuizAttemptResults } from "@/lib/quiz-db";
import { getCourseBySlug } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { QuizPlayerClient } from "@/components/quiz/quiz-player-client";

interface QuizPageProps {
  params: Promise<{
    slug: string;
    quizId: string;
  }>;
  searchParams: Promise<{
    attemptId?: string;
  }>;
}

export default async function StudentQuizPage({ params, searchParams }: QuizPageProps) {
  const { slug, quizId } = await params;
  const { attemptId } = await searchParams;
  const session = await getSession();

  if (!session) {
    redirect(`/login?callbackUrl=/courses/${slug}/quiz/${quizId}`);
  }

  const course = await getCourseBySlug(slug);
  if (!course) {
    notFound();
  }

  const quiz = await getQuizForStudent(quizId);
  if (!quiz) {
    notFound();
  }

  // If viewing completed attempt results
  const attemptResults = attemptId ? await getQuizAttemptResults(attemptId, session.userId) : null;

  return (
    <div className="-m-6 lg:-m-8 min-h-[calc(100vh-4rem)] flex flex-col bg-slate-50">
      <QuizPlayerClient
        courseSlug={slug}
        courseTitle={course.title}
        quiz={quiz}
        initialAttemptResults={attemptResults}
      />
    </div>
  );
}
