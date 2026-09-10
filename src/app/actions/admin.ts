"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma, executeDbQuery } from "@/lib/prisma";
import { Role } from "@prisma/client";

export interface AdminActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Server-side helper to verify that the requesting user has ADMIN privileges.
 */
async function verifyAdminSession() {
  const session = await getSession();
  if (!session || session.role !== Role.ADMIN) {
    throw new Error("UNAUTHORIZED_ADMIN_ACCESS");
  }
  return session;
}

/**
 * Create a new course record in PostgreSQL database.
 */
export async function createCourseAction(data: {
  title: string;
  description: string;
  category: string;
  level: string;
  imageUrl?: string;
}): Promise<AdminActionResult> {
  try {
    const adminSession = await verifyAdminSession();

    if (!data.title || data.title.length < 3) {
      return { success: false, error: "Course title must be at least 3 characters long." };
    }

    const slug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await executeDbQuery(
      prisma.course.findUnique({ where: { slug } }),
      100
    ).catch(() => null);

    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    await executeDbQuery(
      prisma.course.create({
        data: {
          title: data.title,
          slug: finalSlug,
          description: data.description || "Employability course curriculum.",
          category: data.category || "Soft Skills",
          level: data.level || "Beginner",
          imageUrl: data.imageUrl || "/images/default-course.jpg",
          isPublished: false,
          instructorId: adminSession.userId,
        },
      }),
      200
    );

    try {
      revalidatePath("/admin/courses");
      revalidatePath("/courses");
    } catch (e) {}

    return { success: true, message: "Course created successfully!" };
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED_ADMIN_ACCESS") {
      return { success: false, error: "Unauthorized access. Admin privileges required." };
    }
    console.error("Create course error:", err);
    return { success: false, error: "Failed to create course." };
  }
}

/**
 * Update course metadata details.
 */
export async function updateCourseAction(
  courseId: string,
  data: {
    title?: string;
    description?: string;
    category?: string;
    level?: string;
    imageUrl?: string;
    isPublished?: boolean;
  }
): Promise<AdminActionResult> {
  try {
    await verifyAdminSession();

    await executeDbQuery(
      prisma.course.update({
        where: { id: courseId },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.description && { description: data.description }),
          ...(data.category && { category: data.category }),
          ...(data.level && { level: data.level }),
          ...(data.imageUrl && { imageUrl: data.imageUrl }),
          ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
        },
      }),
      200
    );

    try {
      revalidatePath(`/admin/courses/${courseId}/edit`);
      revalidatePath("/admin/courses");
      revalidatePath("/courses");
    } catch (e) {}

    return { success: true, message: "Course updated successfully!" };
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED_ADMIN_ACCESS") {
      return { success: false, error: "Unauthorized access. Admin privileges required." };
    }
    console.error("Update course error:", err);
    return { success: false, error: "Failed to update course." };
  }
}

/**
 * Toggle published state of a course.
 */
export async function togglePublishCourseAction(
  courseId: string,
  isPublished?: boolean
): Promise<AdminActionResult> {
  const current = await executeDbQuery(
    prisma.course.findUnique({ where: { id: courseId }, select: { isPublished: true } }),
    100
  ).catch(() => null);
  const nextPublished = isPublished !== undefined ? isPublished : !(current?.isPublished ?? false);
  return updateCourseAction(courseId, { isPublished: nextPublished });
}

/**
 * Delete a course and all associated modules/lessons.
 */
export async function deleteCourseAction(courseId: string): Promise<AdminActionResult> {
  try {
    await verifyAdminSession();

    await executeDbQuery(
      prisma.course.delete({
        where: { id: courseId },
      }),
      200
    );

    try {
      revalidatePath("/admin/courses");
      revalidatePath("/courses");
    } catch (e) {}

    return { success: true, message: "Course deleted successfully!" };
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED_ADMIN_ACCESS") {
      return { success: false, error: "Unauthorized access. Admin privileges required." };
    }
    console.error("Delete course error:", err);
    return { success: false, error: "Failed to delete course." };
  }
}

/**
 * Create a new module inside a course.
 */
export async function createModuleAction(
  courseId: string,
  title: string
): Promise<AdminActionResult> {
  try {
    await verifyAdminSession();

    if (!title || title.trim().length < 3) {
      return { success: false, error: "Module title must be at least 3 characters." };
    }

    const existingModules = await executeDbQuery(
      prisma.module.findMany({ where: { courseId } }),
      100
    ).catch(() => []);

    const order = existingModules.length + 1;

    await executeDbQuery(
      prisma.module.create({
        data: {
          courseId,
          title,
          order,
        },
      }),
      200
    );

    try {
      revalidatePath(`/admin/courses/${courseId}/edit`);
    } catch (e) {}

    return { success: true, message: "Module created successfully!" };
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED_ADMIN_ACCESS") {
      return { success: false, error: "Unauthorized access. Admin privileges required." };
    }
    console.error("Create module error:", err);
    return { success: false, error: "Failed to create module." };
  }
}

export async function addModuleAction(courseId: string, title: string): Promise<AdminActionResult> {
  return createModuleAction(courseId, title);
}

/**
 * Delete a module from a course.
 */
export async function deleteModuleAction(
  moduleId: string,
  courseId: string
): Promise<AdminActionResult> {
  try {
    await verifyAdminSession();

    await executeDbQuery(
      prisma.module.delete({ where: { id: moduleId } }),
      200
    ).catch(() => null);

    try {
      revalidatePath(`/admin/courses/${courseId}/edit`);
    } catch (e) {}

    return { success: true, message: "Module deleted successfully!" };
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED_ADMIN_ACCESS") {
      return { success: false, error: "Unauthorized access. Admin privileges required." };
    }
    return { success: false, error: "Failed to delete module." };
  }
}

/**
 * Create a new lesson inside a module.
 */
export async function createLessonAction(
  moduleId: string,
  courseId: string,
  data: {
    title: string;
    content?: string;
    durationMins?: number;
  }
): Promise<AdminActionResult> {
  try {
    await verifyAdminSession();

    if (!data.title || data.title.trim().length < 3) {
      return { success: false, error: "Lesson title must be at least 3 characters." };
    }

    const existingLessons = await executeDbQuery(
      prisma.lesson.findMany({ where: { moduleId } }),
      100
    ).catch(() => []);

    const order = existingLessons.length + 1;

    await executeDbQuery(
      prisma.lesson.create({
        data: {
          moduleId,
          title: data.title,
          content: data.content || "Lesson reading materials.",
          durationMins: data.durationMins || 20,
          order,
        },
      }),
      200
    );

    try {
      revalidatePath(`/admin/courses/${courseId}/edit`);
      revalidatePath(`/courses`);
    } catch (e) {}

    return { success: true, message: "Lesson created successfully!" };
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED_ADMIN_ACCESS") {
      return { success: false, error: "Unauthorized access. Admin privileges required." };
    }
    console.error("Create lesson error:", err);
    return { success: false, error: "Failed to create lesson." };
  }
}

export async function addLessonAction(
  moduleId: string,
  courseId: string,
  data: { title: string; content?: string; durationMins?: number }
): Promise<AdminActionResult> {
  return createLessonAction(moduleId, courseId, data);
}

/**
 * Delete a lesson from a module.
 */
export async function deleteLessonAction(
  lessonId: string,
  courseId: string
): Promise<AdminActionResult> {
  try {
    await verifyAdminSession();

    await executeDbQuery(
      prisma.lesson.delete({ where: { id: lessonId } }),
      200
    ).catch(() => null);

    try {
      revalidatePath(`/admin/courses/${courseId}/edit`);
      revalidatePath(`/courses`);
    } catch (e) {}

    return { success: true, message: "Lesson deleted successfully!" };
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED_ADMIN_ACCESS") {
      return { success: false, error: "Unauthorized access. Admin privileges required." };
    }
    return { success: false, error: "Failed to delete lesson." };
  }
}
