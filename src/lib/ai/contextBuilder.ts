import { getCourses, getCourseBySlug } from "@/lib/db";

export interface LessonContext {
  courseId: string;
  courseTitle: string;
  category: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  lessonContent: string;
}

/**
 * Builds structured lesson context for AI prompt grounding and future RAG extension.
 */
export async function buildLessonContext(
  courseId?: string,
  lessonId?: string
): Promise<LessonContext> {
  const allCourses = await getCourses();
  let targetCourse = allCourses[0];

  if (courseId) {
    const found =
      allCourses.find((c) => c.id === courseId || c.slug === courseId) ||
      (await getCourseBySlug(courseId));
    if (found) targetCourse = found;
  }

  let targetModuleTitle = targetCourse.modules[0]?.title || "General Module";
  let targetLessonId = targetCourse.modules[0]?.lessons[0]?.id || "l-default";
  let targetLessonTitle = targetCourse.modules[0]?.lessons[0]?.title || "Employability Core Reading";
  let targetLessonContent =
    targetCourse.modules[0]?.lessons[0]?.content ||
    targetCourse.description ||
    "Employability skills development curriculum.";

  if (lessonId) {
    for (const mod of targetCourse.modules) {
      const les = mod.lessons.find((l) => l.id === lessonId);
      if (les) {
        targetModuleTitle = mod.title;
        targetLessonId = les.id;
        targetLessonTitle = les.title;
        targetLessonContent = les.content || targetLessonContent;
        break;
      }
    }
  }

  return {
    courseId: targetCourse.id,
    courseTitle: targetCourse.title,
    category: targetCourse.category,
    moduleTitle: targetModuleTitle,
    lessonId: targetLessonId,
    lessonTitle: targetLessonTitle,
    lessonContent: targetLessonContent,
  };
}
