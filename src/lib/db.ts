import { prisma, executeDbQuery } from "@/lib/prisma";
import { Role } from "@prisma/client";

// Types matching database schema
export interface CourseWithDetails {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  level: string;
  imageUrl?: string | null;
  isPublished: boolean;
  instructorName: string;
  modulesCount: number;
  lessonsCount: number;
  durationMins: number;
  modules: {
    id: string;
    title: string;
    order: number;
    lessons: {
      id: string;
      title: string;
      content: string | null;
      durationMins: number;
      order: number;
    }[];
  }[];
}

export interface EnrollmentWithCourse {
  id: string;
  userId: string;
  courseId: string;
  progressPercent: number;
  enrolledAt: Date;
  completedAt: Date | null;
  course: CourseWithDetails;
}

// In-Memory Seed Data Fallback Store (Used if PostgreSQL daemon is offline on localhost)
const IN_MEMORY_COURSES: CourseWithDetails[] = [
  {
    id: "c-comm-1",
    title: "Communication Skills for Employability",
    slug: "communication-skills-for-employability",
    category: "Soft Skills",
    level: "Beginner",
    description: "Master executive oral presentation, professional technical writing, and active listening for global corporate environments.",
    imageUrl: "/images/courses/communication.jpg",
    isPublished: true,
    instructorName: "Dr. Sarah Jenkins",
    modulesCount: 2,
    lessonsCount: 4,
    durationMins: 90,
    modules: [
      {
        id: "m-comm-1",
        title: "Module 1: Professional Foundations & Workplace Communication",
        order: 1,
        lessons: [
          {
            id: "l-comm-1",
            title: "Lesson 1.1: Active Listening in High-Stakes Environments",
            durationMins: 20,
            order: 1,
            content: `Active listening is a fundamental employability skill in modern software engineering and corporate management environments.

Key Principles of Active Listening:
1. Paraphrasing & Clarification: Always restate technical requirements in your own words before beginning implementation to confirm mutual alignment.
2. Non-Verbal Attunement: Maintain appropriate eye contact, open posture, and nod to acknowledge speaker points during agile standups and architecture reviews.
3. Deferring Judgment: Refrain from interrupting clients or team members prematurely during problem diagnosis.
4. Empathetic Responding: Validate the speaker's context and constraints before proposing technical trade-offs.

Workplace Application Scenario:
During a sprint planning meeting, a product manager expresses concern regarding application latency. An active listener clarifies: "If I understand correctly, our primary objective for this sprint is to reduce P99 latency below 200ms for mobile clients, even if it delays secondary analytics dashboard features?"`,
          },
          {
            id: "l-comm-2",
            title: "Lesson 1.2: Executive Email Etiquette & Technical Writing",
            durationMins: 25,
            order: 2,
            content: `Written communication in technical engineering roles must be concise, structured, and actionable.

Core Pillars of Executive Writing:
- BLUF (Bottom Line Up Front): Place your key recommendation or decision request in the first paragraph.
- Scannable Formatting: Utilize bulleted lists, bold key metrics, and keep paragraphs under 4 lines.
- Clear Calls to Action (CTA): Explicitly state who needs to take action, what action is required, and the target deadline.

Example Executive Brief:
"Team, we recommend migrating our authentication microservice to Edge JWT verification by Friday, March 15. This change reduces API response times by 40% with zero impact on candidate sessions."`,
          },
        ],
      },
      {
        id: "m-comm-2",
        title: "Module 2: Technical Presentations & Cross-Functional Alignment",
        order: 2,
        lessons: [
          {
            id: "l-comm-3",
            title: "Lesson 2.1: Structuring Architecture Proposals for Stakeholders",
            durationMins: 25,
            order: 3,
            content: `Communicating complex architectural decisions to non-technical business stakeholders requires translating technical specifications into business value (cost, risk, velocity).`,
          },
          {
            id: "l-comm-4",
            title: "Lesson 2.2: Conflict Resolution & Constructive Code Review",
            durationMins: 20,
            order: 4,
            content: `Providing constructive code review feedback maintains team morale while enforcing high code quality standards. Always critique the code, never the developer.`,
          },
        ],
      },
    ],
  },
  {
    id: "c-resume-2",
    title: "Technical Resume & Portfolio Optimization",
    slug: "technical-resume-and-portfolio-optimization",
    category: "Career Strategy",
    level: "Intermediate",
    description: "Craft an ATS-optimized technical resume, structure impactful STAR bullet points, and build an impressive candidate GitHub portfolio.",
    imageUrl: "/images/courses/resume.jpg",
    isPublished: true,
    instructorName: "Alex Morgan",
    modulesCount: 1,
    lessonsCount: 2,
    durationMins: 50,
    modules: [
      {
        id: "m-res-1",
        title: "Module 1: ATS Optimization & STAR Accomplishment Formatting",
        order: 1,
        lessons: [
          {
            id: "l-res-1",
            title: "Lesson 1.1: Beating Applicant Tracking Systems (ATS)",
            durationMins: 25,
            order: 1,
            content: `Modern tech hiring uses Applicant Tracking Systems (ATS) to filter candidate applications. Ensure single-column formatting, standard section headers (Experience, Projects, Education, Skills), and matching keywords from job descriptions.`,
          },
          {
            id: "l-res-2",
            title: "Lesson 1.2: Quantifying Impact with the STAR Method",
            durationMins: 25,
            order: 2,
            content: `Structure bullet points as: Action Verb + Task/Context + Measurable Business Metric Result. Example: "Architected PostgreSQL caching layer with Redis, decreasing P99 latency by 65% across 50,000 monthly active users."`,
          },
        ],
      },
    ],
  },
  {
    id: "c-techint-3",
    title: "Software Engineering Interview Preparation",
    slug: "software-engineering-interview-preparation",
    category: "Technical Prep",
    level: "Advanced",
    description: "Master Data Structures, System Design, and Behavioral Interview questions to ace senior technical engineering assessments.",
    imageUrl: "/images/courses/interview.jpg",
    isPublished: true,
    instructorName: "Marcus Vance",
    modulesCount: 1,
    lessonsCount: 2,
    durationMins: 60,
    modules: [
      {
        id: "m-int-1",
        title: "Module 1: Technical Interview Frameworks",
        order: 1,
        lessons: [
          {
            id: "l-int-1",
            title: "Lesson 1.1: System Design Fundamentals & Scalability",
            durationMins: 30,
            order: 1,
            content: `Deconstruct high-level system design: Load Balancers, API Gateways, Caching strategies, Database Sharding, and Microservices vs Monolith trade-offs.`,
          },
          {
            id: "l-int-2",
            title: "Lesson 1.2: Behavioral Interviews using Amazon Leadership Principles",
            durationMins: 30,
            order: 2,
            content: `Demonstrate Ownership, Bias for Action, and Customer Obsession through structured storytelling during behavioral interviewer panels.`,
          },
        ],
      },
    ],
  },
];

// In-Memory Fast Cache with 30s TTL
let CACHED_COURSES: { data: CourseWithDetails[]; timestamp: number } | null = null;

// In-Memory Enrollment & Progress Store
const IN_MEMORY_ENROLLMENTS: Map<string, { courseId: string; userId: string; enrolledAt: Date; progressPercent: number }> = new Map();
const IN_MEMORY_LESSON_PROGRESS: Set<string> = new Set(); // "userId:lessonId"

/**
 * Fetch all published courses from PostgreSQL or in-memory fallback (cached for 30s).
 */
export async function getCourses(): Promise<CourseWithDetails[]> {
  const now = Date.now();
  if (CACHED_COURSES && now - CACHED_COURSES.timestamp < 30000) {
    return CACHED_COURSES.data;
  }

  try {
    const dbCourses = await executeDbQuery(
      prisma.course.findMany({
        where: { isPublished: true },
        include: {
          instructor: { select: { name: true } },
          modules: {
            orderBy: { order: "asc" },
            include: {
              lessons: { orderBy: { order: "asc" } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      120
    );

    if (dbCourses && dbCourses.length > 0) {
      const formatted = dbCourses.map((c) => {
        const totalLessons = c.modules.reduce((acc, m) => acc + m.lessons.length, 0);
        const durationMins = c.modules.reduce(
          (acc, m) => acc + m.lessons.reduce((lAcc, l) => lAcc + l.durationMins, 0),
          0
        );
        return {
          id: c.id,
          title: c.title,
          slug: c.slug,
          description: c.description,
          category: c.category,
          level: c.level,
          imageUrl: c.imageUrl,
          isPublished: c.isPublished,
          instructorName: c.instructor.name,
          modulesCount: c.modules.length,
          lessonsCount: totalLessons,
          durationMins,
          modules: c.modules.map((m) => ({
            id: m.id,
            title: m.title,
            order: m.order,
            lessons: m.lessons.map((l) => ({
              id: l.id,
              title: l.title,
              content: l.content,
              durationMins: l.durationMins,
              order: l.order,
            })),
          })),
        };
      });

      CACHED_COURSES = { data: formatted, timestamp: now };
      return formatted;
    }
  } catch (e) {
    // Database fallback
  }

  return IN_MEMORY_COURSES;
}

/**
 * Fetch a single course by its slug.
 */
export async function getCourseBySlug(slug: string): Promise<CourseWithDetails | null> {
  const courses = await getCourses();
  const found = courses.find((c) => c.slug === slug || c.id === slug);
  if (found) return found;

  try {
    const c = await executeDbQuery(
      prisma.course.findUnique({
        where: { slug },
        include: {
          instructor: { select: { name: true } },
          modules: {
            orderBy: { order: "asc" },
            include: {
              lessons: { orderBy: { order: "asc" } },
            },
          },
        },
      }),
      120
    );

    if (c) {
      const totalLessons = c.modules.reduce((acc, m) => acc + m.lessons.length, 0);
      const durationMins = c.modules.reduce(
        (acc, m) => acc + m.lessons.reduce((lAcc, l) => lAcc + l.durationMins, 0),
        0
      );
      return {
        id: c.id,
        title: c.title,
        slug: c.slug,
        description: c.description,
        category: c.category,
        level: c.level,
        imageUrl: c.imageUrl,
        isPublished: c.isPublished,
        instructorName: c.instructor.name,
        modulesCount: c.modules.length,
        lessonsCount: totalLessons,
        durationMins,
        modules: c.modules.map((m) => ({
          id: m.id,
          title: m.title,
          order: m.order,
          lessons: m.lessons.map((l) => ({
            id: l.id,
            title: l.title,
            content: l.content,
            durationMins: l.durationMins,
            order: l.order,
          })),
        })),
      };
    }
  } catch (e) {
    // Database fallback
  }

  return IN_MEMORY_COURSES.find((c) => c.slug === slug || c.id === slug) || null;
}

/**
 * Checks if a student is enrolled in a given course.
 */
export async function isStudentEnrolled(userId: string, courseId: string): Promise<boolean> {
  try {
    const enrollment = await executeDbQuery(
      prisma.enrollment.findUnique({
        where: {
          userId_courseId: { userId, courseId },
        },
      }),
      100
    );
    if (enrollment) return true;
  } catch (e) {
    // Fallback
  }

  const key = `${userId}:${courseId}`;
  return IN_MEMORY_ENROLLMENTS.has(key);
}

/**
 * Enroll student in a course.
 */
export async function enrollStudentInCourse(userId: string, courseId: string) {
  try {
    return await executeDbQuery(
      prisma.enrollment.create({
        data: {
          userId,
          courseId,
          progressPercent: 0,
        },
      }),
      200
    );
  } catch (e) {
    // Fallback
    const key = `${userId}:${courseId}`;
    IN_MEMORY_ENROLLMENTS.set(key, {
      userId,
      courseId,
      enrolledAt: new Date(),
      progressPercent: 0,
    });
  }
}

/**
 * Fetch all enrollments for a specific student.
 */
export async function getStudentEnrollments(userId: string): Promise<EnrollmentWithCourse[]> {
  const allCourses = await getCourses();

  try {
    const dbEnrollments = await executeDbQuery(
      prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            include: {
              instructor: { select: { name: true } },
              modules: {
                include: { lessons: true },
              },
            },
          },
        },
      }),
      120
    );

    if (dbEnrollments && dbEnrollments.length > 0) {
      return dbEnrollments.map((e) => {
        const matchingCourse = allCourses.find((c) => c.id === e.courseId) || allCourses[0];
        return {
          id: e.id,
          userId: e.userId,
          courseId: e.courseId,
          progressPercent: e.progressPercent,
          enrolledAt: e.enrolledAt,
          completedAt: e.completedAt,
          course: matchingCourse,
        };
      });
    }
  } catch (e) {
    // Fallback
  }

  const results: EnrollmentWithCourse[] = [];
  IN_MEMORY_ENROLLMENTS.forEach((val, key) => {
    if (val.userId === userId) {
      const course = allCourses.find((c) => c.id === val.courseId);
      if (course) {
        results.push({
          id: `enr-${key}`,
          userId: val.userId,
          courseId: val.courseId,
          progressPercent: val.progressPercent,
          enrolledAt: val.enrolledAt,
          completedAt: val.progressPercent === 100 ? new Date() : null,
          course,
        });
      }
    }
  });

  return results;
}

/**
 * Get lesson completion status for a student.
 */
export async function getCompletedLessonIds(userId: string): Promise<Set<string>> {
  const completedIds = new Set<string>();

  try {
    const dbProgress = await executeDbQuery(
      prisma.lessonProgress.findMany({
        where: { userId, isCompleted: true },
        select: { lessonId: true },
      }),
      100
    );
    if (dbProgress) {
      dbProgress.forEach((p) => completedIds.add(p.lessonId));
      if (completedIds.size > 0) return completedIds;
    }
  } catch (e) {
    // Fallback
  }

  IN_MEMORY_LESSON_PROGRESS.forEach((entry) => {
    const [uId, lId] = entry.split(":");
    if (uId === userId) {
      completedIds.add(lId);
    }
  });

  return completedIds;
}

/**
 * Toggle lesson completion state and recalculate course progress percentage.
 */
export async function toggleLessonCompletion(userId: string, lessonId: string, courseId: string) {
  let isCompleted = false;

  try {
    const existing = await executeDbQuery(
      prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId } },
      }),
      100
    );

    if (existing) {
      isCompleted = !existing.isCompleted;
      await executeDbQuery(
        prisma.lessonProgress.update({
          where: { id: existing.id },
          data: { isCompleted, completedAt: isCompleted ? new Date() : null },
        }),
        150
      );
    } else {
      isCompleted = true;
      await executeDbQuery(
        prisma.lessonProgress.create({
          data: { userId, lessonId, isCompleted: true, completedAt: new Date() },
        }),
        150
      );
    }

    // Recalculate progress percentage
    const course = (await getCourseBySlug(courseId)) || (await getCourses()).find((c) => c.id === courseId);
    if (course) {
      const allLessons = course.modules.flatMap((m) => m.lessons);
      const completedCount = await executeDbQuery(
        prisma.lessonProgress.count({
          where: {
            userId,
            lessonId: { in: allLessons.map((l) => l.id) },
            isCompleted: true,
          },
        }),
        100
      );
      const progressPercent = Math.round((completedCount / allLessons.length) * 100);

      await executeDbQuery(
        prisma.enrollment.update({
          where: { userId_courseId: { userId, courseId: course.id } },
          data: {
            progressPercent,
            completedAt: progressPercent === 100 ? new Date() : null,
          },
        }),
        150
      );
    }
  } catch (e) {
    // In-memory fallback
    const key = `${userId}:${lessonId}`;
    if (IN_MEMORY_LESSON_PROGRESS.has(key)) {
      IN_MEMORY_LESSON_PROGRESS.delete(key);
      isCompleted = false;
    } else {
      IN_MEMORY_LESSON_PROGRESS.add(key);
      isCompleted = true;
    }

    // Recalculate progress in memory
    const course = (await getCourses()).find((c) => c.id === courseId || c.slug === courseId);
    if (course) {
      const allLessons = course.modules.flatMap((m) => m.lessons);
      let compCount = 0;
      allLessons.forEach((l) => {
        if (IN_MEMORY_LESSON_PROGRESS.has(`${userId}:${l.id}`)) compCount++;
      });
      const progressPercent = Math.round((compCount / allLessons.length) * 100);

      const enrKey = `${userId}:${course.id}`;
      const enr = IN_MEMORY_ENROLLMENTS.get(enrKey);
      if (enr) {
        enr.progressPercent = progressPercent;
      }
    }
  }

  return isCompleted;
}
