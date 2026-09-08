import { prisma, executeDbQuery } from "@/lib/prisma";

export interface QuizOptionStudent {
  id: string;
  optionText: string;
}

export interface QuizQuestionStudent {
  id: string;
  questionText: string;
  marks: number;
  options: QuizOptionStudent[];
}

export interface QuizStudentDetails {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  passingScore: number;
  questions: QuizQuestionStudent[];
}

export interface QuizOptionAdmin {
  id: string;
  optionText: string;
  isCorrect: boolean;
}

export interface QuizQuestionAdmin {
  id: string;
  questionText: string;
  marks: number;
  options: QuizOptionAdmin[];
}

export interface QuizAdminDetails {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  passingScore: number;
  questions: QuizQuestionAdmin[];
}

export interface QuizAttemptResult {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  submittedAt: Date;
  questions: {
    id: string;
    questionText: string;
    marks: number;
    selectedOptionId: string | null;
    isCorrect: boolean;
    options: { id: string; optionText: string; isCorrect: boolean }[];
  }[];
}

// In-Memory Seed Quizzes Fallback Store
export const IN_MEMORY_QUIZZES: QuizAdminDetails[] = [
  {
    id: "q-comm-1",
    courseId: "c-comm-1",
    title: "Communication Skills & Active Listening Assessment",
    description: "Evaluates workplace listening attunement, executive email structure, and architectural proposal clarity.",
    passingScore: 70,
    questions: [
      {
        id: "q1",
        questionText: "What is the primary objective of paraphrasing requirements during an technical architecture review?",
        marks: 10,
        options: [
          { id: "q1-opt1", optionText: "Confirm mutual alignment and eliminate ambiguous specs before coding", isCorrect: true },
          { id: "q1-opt2", optionText: "Delay project deadlines until sprint ends", isCorrect: false },
          { id: "q1-opt3", optionText: "Demonstrate superior vocabulary to clients", isCorrect: false },
          { id: "q1-opt4", optionText: "Bypass secondary security testing", isCorrect: false },
        ],
      },
      {
        id: "q2",
        questionText: "In executive email etiquette, what does 'BLUF' stand for?",
        marks: 10,
        options: [
          { id: "q2-opt5", optionText: "Bottom Line Up Front", isCorrect: true },
          { id: "q2-opt6", optionText: "Basic Listening Under Pressure", isCorrect: false },
          { id: "q2-opt7", optionText: "Build Log User Format", isCorrect: false },
          { id: "q2-opt8", optionText: "Backlog Unified Framework", isCorrect: false },
        ],
      },
      {
        id: "q3",
        questionText: "When delivering constructive code review feedback, which approach is recommended?",
        marks: 10,
        options: [
          { id: "q3-opt9", optionText: "Critique the code patterns and propose solutions without personal criticism", isCorrect: true },
          { id: "q3-opt10", optionText: "Reject pull requests silently without explanation", isCorrect: false },
          { id: "q3-opt11", optionText: "Focus exclusively on author's junior status", isCorrect: false },
          { id: "q3-opt12", optionText: "Approve all code changes without inspection", isCorrect: false },
        ],
      },
    ],
  },
];

export const IN_MEMORY_ATTEMPTS: Map<
  string,
  {
    id: string;
    quizId: string;
    userId: string;
    score: number;
    maxScore: number;
    percentage: number;
    passed: boolean;
    submittedAt: Date | null;
    answersMap?: Record<string, string>;
  }
> = new Map();

/**
 * Fetch quizzes for a course.
 */
export async function getCourseQuizzes(courseId: string): Promise<QuizStudentDetails[]> {
  try {
    const quizzes = await executeDbQuery(
      prisma.quiz.findMany({
        where: { lessonId: courseId },
        include: {
          questions: {
            orderBy: { order: "asc" },
            include: { options: true },
          },
        },
      }),
      100
    );

    if (quizzes && quizzes.length > 0) {
      return quizzes.map((q) => ({
        id: q.id,
        courseId,
        title: q.title,
        description: "Course assessment quiz.",
        passingScore: q.passingScorePercent,
        questions: q.questions.map((ques) => ({
          id: ques.id,
          questionText: ques.text,
          marks: ques.points,
          options: ques.options.map((opt) => ({
            id: opt.id,
            optionText: opt.text,
          })),
        })),
      }));
    }
  } catch (e) {
    // Fallback
  }

  return IN_MEMORY_QUIZZES.filter((q) => q.courseId === courseId || courseId === "c-comm-1").map(
    (q) => ({
      id: q.id,
      courseId: q.courseId,
      title: q.title,
      description: q.description,
      passingScore: q.passingScore,
      questions: q.questions.map((ques) => ({
        id: ques.id,
        questionText: ques.questionText,
        marks: ques.marks,
        options: ques.options.map((opt) => ({
          id: opt.id,
          optionText: opt.optionText,
        })),
      })),
    })
  );
}

/**
 * Fetches active student quiz with isCorrect STRIPPED from options for security.
 */
export async function getQuizForStudent(quizId: string): Promise<QuizStudentDetails | null> {
  try {
    const q = await executeDbQuery(
      prisma.quiz.findUnique({
        where: { id: quizId },
        include: {
          questions: {
            orderBy: { order: "asc" },
            include: { options: true },
          },
        },
      }),
      100
    );

    if (q) {
      return {
        id: q.id,
        courseId: "c-comm-1",
        title: q.title,
        description: "Course assessment quiz.",
        passingScore: q.passingScorePercent,
        questions: q.questions.map((ques) => ({
          id: ques.id,
          questionText: ques.text,
          marks: ques.points,
          options: ques.options.map((opt) => ({
            id: opt.id,
            optionText: opt.text, // isCorrect intentionally stripped!
          })),
        })),
      };
    }
  } catch (e) {
    // Fallback
  }

  const inMem = IN_MEMORY_QUIZZES.find((q) => q.id === quizId) || IN_MEMORY_QUIZZES[0];
  return {
    id: inMem.id,
    courseId: inMem.courseId,
    title: inMem.title,
    description: inMem.description,
    passingScore: inMem.passingScore,
    questions: inMem.questions.map((ques) => ({
      id: ques.id,
      questionText: ques.questionText,
      marks: ques.marks,
      options: ques.options.map((opt) => ({
        id: opt.id,
        optionText: opt.optionText,
      })),
    })),
  };
}

/**
 * Fetches full quiz data including correct answer flags for Admin management.
 */
export async function getQuizForAdmin(quizId: string): Promise<QuizAdminDetails | null> {
  try {
    const q = await executeDbQuery(
      prisma.quiz.findUnique({
        where: { id: quizId },
        include: {
          questions: {
            orderBy: { order: "asc" },
            include: { options: true },
          },
        },
      }),
      100
    );

    if (q) {
      return {
        id: q.id,
        courseId: "c-comm-1",
        title: q.title,
        description: "Course assessment quiz.",
        passingScore: q.passingScorePercent,
        questions: q.questions.map((ques) => ({
          id: ques.id,
          questionText: ques.text,
          marks: ques.points,
          options: ques.options.map((opt) => ({
            id: opt.id,
            optionText: opt.text,
            isCorrect: opt.isCorrect,
          })),
        })),
      };
    }
  } catch (e) {
    // Fallback
  }

  return IN_MEMORY_QUIZZES.find((q) => q.id === quizId) || IN_MEMORY_QUIZZES[0];
}

/**
 * Fetches a candidate's completed quiz attempt results for review mode.
 */
export async function getQuizAttemptResults(
  attemptId: string,
  userId: string
): Promise<QuizAttemptResult | null> {
  try {
    const attempt = await executeDbQuery(
      prisma.quizAttempt.findUnique({
        where: { id: attemptId },
        include: {
          quiz: {
            include: {
              questions: {
                orderBy: { order: "asc" },
                include: { options: true },
              },
            },
          },
          answers: true,
        },
      }),
      100
    );

    if (attempt && attempt.userId === userId) {
      const answersMap = new Map(attempt.answers.map((a) => [a.questionId, a.selectedOptionId]));

      const totalMaxScore = attempt.quiz.questions.reduce((acc, q) => acc + q.points, 0);
      const earnedScore = Math.round((attempt.scorePercent / 100) * totalMaxScore);

      return {
        id: attempt.id,
        quizId: attempt.quizId,
        quizTitle: attempt.quiz.title,
        score: earnedScore,
        maxScore: totalMaxScore,
        percentage: Math.round(attempt.scorePercent),
        passed: attempt.isPassed,
        submittedAt: attempt.attemptedAt,
        questions: attempt.quiz.questions.map((ques) => {
          const selectedOptId = answersMap.get(ques.id) || null;
          const correctOpt = ques.options.find((o) => o.isCorrect);
          const isUserCorrect = selectedOptId === correctOpt?.id;

          return {
            id: ques.id,
            questionText: ques.text,
            marks: ques.points,
            selectedOptionId: selectedOptId,
            isCorrect: isUserCorrect,
            options: ques.options.map((opt) => ({
              id: opt.id,
              optionText: opt.text,
              isCorrect: opt.isCorrect,
            })),
          };
        }),
      };
    }
  } catch (e) {
    // Fallback
  }

  const inMemAttempt = IN_MEMORY_ATTEMPTS.get(attemptId);
  if (inMemAttempt && inMemAttempt.userId === userId) {
    const quiz = IN_MEMORY_QUIZZES.find((q) => q.id === inMemAttempt.quizId) || IN_MEMORY_QUIZZES[0];
    const answersMap: Record<string, string> = inMemAttempt.answersMap || {};

    return {
      id: inMemAttempt.id,
      quizId: quiz.id,
      quizTitle: quiz.title,
      score: inMemAttempt.score,
      maxScore: inMemAttempt.maxScore,
      percentage: inMemAttempt.percentage,
      passed: inMemAttempt.passed,
      submittedAt: inMemAttempt.submittedAt || new Date(),
      questions: quiz.questions.map((ques) => {
        const selectedOptId = answersMap[ques.id] || null;
        const correctOpt = ques.options.find((o) => o.isCorrect);
        const isUserCorrect = selectedOptId === correctOpt?.id;

        return {
          id: ques.id,
          questionText: ques.questionText,
          marks: ques.marks,
          selectedOptionId: selectedOptId,
          isCorrect: isUserCorrect,
          options: ques.options.map((opt) => ({
            id: opt.id,
            optionText: opt.optionText,
            isCorrect: opt.isCorrect,
          })),
        };
      }),
    };
  }

  return null;
}
