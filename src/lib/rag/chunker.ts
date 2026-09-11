import { CourseWithDetails } from "@/lib/db";

export interface CourseChunk {
  id: string;
  courseId: string;
  courseTitle: string;
  category: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  text: string;
}

/**
 * Splits course materials into semantic text chunks with metadata for RAG indexing.
 */
export function createCourseChunks(courses: CourseWithDetails[]): CourseChunk[] {
  const chunks: CourseChunk[] = [];

  courses.forEach((course) => {
    course.modules.forEach((mod) => {
      mod.lessons.forEach((les) => {
        const fullText = les.content || course.description;
        // Split text into semantic paragraphs/paragraphs
        const paragraphs = fullText
          .split(/\n\n|\.\s+/)
          .filter((p) => p.trim().length > 15);

        if (paragraphs.length === 0) {
          chunks.push({
            id: `chunk-${course.id}-${les.id}-0`,
            courseId: course.id,
            courseTitle: course.title,
            category: course.category,
            moduleTitle: mod.title,
            lessonId: les.id,
            lessonTitle: les.title,
            text: `${les.title}: ${fullText}`,
          });
        } else {
          paragraphs.forEach((p, pIdx) => {
            chunks.push({
              id: `chunk-${course.id}-${les.id}-${pIdx}`,
              courseId: course.id,
              courseTitle: course.title,
              category: course.category,
              moduleTitle: mod.title,
              lessonId: les.id,
              lessonTitle: les.title,
              text: `${les.title} - ${p.trim()}`,
            });
          });
        }
      });
    });
  });

  return chunks;
}
