"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { isStudentEnrolled, enrollStudentInCourse, toggleLessonCompletion } from "@/lib/db";

export interface LMSActionResult {
  success: boolean;
  error?: string;
  message?: string;
  alreadyEnrolled?: boolean;
  isCompleted?: boolean;
}

/**
 * Server Action for candidate course enrollment.
 */
export async function enrollInCourseAction(courseId: string): Promise<LMSActionResult> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Please sign in to enroll in courses." };
    }

    const alreadyEnrolled = await isStudentEnrolled(session.userId, courseId);
    if (alreadyEnrolled) {
      return { success: true, alreadyEnrolled: true, message: "You are already enrolled in this course." };
    }

    await enrollStudentInCourse(session.userId, courseId);

    try {
      revalidatePath("/courses");
      revalidatePath("/my-courses");
      revalidatePath("/dashboard");
    } catch (e) {}

    return { success: true, message: "Successfully enrolled in course!" };
  } catch (err: any) {
    console.error("Enrollment action error:", err);
    return { success: false, error: "Failed to process course enrollment. Please try again." };
  }
}

/**
 * Server Action to toggle lesson completion and recalculate progress percentage.
 */
export async function toggleLessonCompletionAction(
  lessonId: string,
  courseId: string
): Promise<LMSActionResult> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Please sign in to save learning progress." };
    }

    const isCompleted = await toggleLessonCompletion(session.userId, lessonId, courseId);

    try {
      revalidatePath("/dashboard");
      revalidatePath("/my-courses");
      revalidatePath("/progress");
    } catch (e) {}

    return { success: true, isCompleted };
  } catch (err: any) {
    console.error("Lesson completion action error:", err);
    return { success: false, error: "Failed to update lesson progress." };
  }
}
