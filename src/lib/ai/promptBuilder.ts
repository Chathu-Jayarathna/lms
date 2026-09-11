import { LessonContext } from "./contextBuilder";

export interface ChatMessageItem {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Constructs an educational prompt with RAG retrieved context and citation rules.
 */
export function buildEducationalPrompt(
  studentQuestion: string,
  context: LessonContext,
  history: ChatMessageItem[] = [],
  ragContextText?: string,
  citations?: string[]
): { systemPrompt: string; fullUserPrompt: string } {
  const citationsFormatted = citations && citations.length > 0
    ? citations.join("\n")
    : `[Source: ${context.courseTitle} > ${context.moduleTitle} > ${context.lessonTitle}]`;

  const systemPrompt = `
You are the Thakral Global Learning (TGL) AI Educational Assistant powered by Course-Aware Retrieval-Augmented Generation (RAG).
Your primary role is to serve as an intelligent, supportive, and grounded learning tutor for Computer Science candidates developing key employability skills.

RAG & PEDAGOGICAL RULES:
1. Prioritize answering using the RETRIEVED COURSE MATERIAL EXCERPTS provided below.
2. Ground your explanations primarily in the current Course, Module, and Lesson.
3. If the question is directly answered by the course materials, cite the exact source using this citation tag: ${citationsFormatted}
4. If the question is outside available course materials, clearly state: "This concept falls outside our current TGL course materials, but here is an explanation based on general software engineering principles:"
5. DO NOT invent false course facts or claim certainty on unavailable information.
6. DO NOT complete quizzes, tests, or academic assessments for students dishonestly.
7. Explain concepts simply with practical real-world industry examples.

CURRENT ACTIVE STUDY CONTEXT:
- Active Course: ${context.courseTitle} (${context.category})
- Active Module: ${context.moduleTitle}
- Active Lesson: ${context.lessonTitle}

${
  ragContextText
    ? `SEMANTICALLY RETRIEVED COURSE EXCERPTS (RAG):\n${ragContextText}\n`
    : `CURRENT LESSON READING:\n"""\n${context.lessonContent}\n"""\n`
}
`;

  let historyFormatted = "";
  if (history.length > 0) {
    historyFormatted = "\nRECENT CONVERSATION HISTORY:\n" +
      history
        .slice(-4)
        .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
        .join("\n") +
      "\n";
  }

  const fullUserPrompt = `${historyFormatted}STUDENT QUESTION: "${studentQuestion}"\n\nPlease provide a clear, structured educational response including the source material citation badge.`;

  return { systemPrompt, fullUserPrompt };
}
