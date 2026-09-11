import { LessonContext } from "./contextBuilder";
import { buildEducationalPrompt, ChatMessageItem } from "./promptBuilder";

export type { ChatMessageItem };

export interface AIGenerateParams {
  question: string;
  context: LessonContext;
  history?: ChatMessageItem[];
  ragExcerpts?: string;
  citations?: string[];
}

export interface AIServiceProvider {
  generateResponse(
    studentQuestion: string,
    context: LessonContext,
    history?: ChatMessageItem[],
    ragContextText?: string,
    citations?: string[]
  ): Promise<string>;

  generateEducationalResponse(params: AIGenerateParams): Promise<{ text: string; citations: string[] }>;
}

/**
 * Intelligent Educational Fallback AI Provider (Grounded in Lesson Context & RAG Citations).
 */
export class EducationalFallbackAIService implements AIServiceProvider {
  async generateResponse(
    studentQuestion: string,
    context: LessonContext,
    history: ChatMessageItem[] = [],
    ragContextText?: string,
    citations: string[] = []
  ): Promise<string> {
    const qLower = studentQuestion.toLowerCase();
    const citationTag = citations.length > 0
      ? `\n\n📌 **Course Reference:** ${citations.join(" | ")}`
      : `\n\n📌 **Course Reference:** [Source: ${context.courseTitle} > ${context.moduleTitle} > ${context.lessonTitle}]`;

    if (qLower.includes("explain") || qLower.includes("simply")) {
      return `**Explanation for ${context.lessonTitle}:**

In the context of **${context.courseTitle}**, this lesson focuses on core professional competency.

**Key Explanation:**
${context.lessonContent}

*Practical Real-World Example:*
When working on cross-functional software engineering teams, applying these principles reduces project friction and ensures architectural alignment across developers and product managers.

*Follow-up Thought Question:* How would you apply this concept in your next team sprint review or technical interview?${citationTag}`;
    }

    if (qLower.includes("example") || qLower.includes("case study")) {
      return `**Practical Industry Example for ${context.lessonTitle}:**

Imagine leading a technical deployment at **Thakral Global Learning**:
1. **Scenario:** A production API endpoint experiences latency spikes during peak student enrollment.
2. **Action:** Applying the principles from *${context.lessonTitle}*, you deconstruct the problem using root cause analysis rather than quick superficial patches.
3. **Outcome:** Communication with non-technical stakeholders remains transparent while engineers resolve the underlying database bottleneck.

*Key Takeaway:* Applying *${context.lessonTitle}* helps engineers bridge technical execution with business value outcomes.${citationTag}`;
    }

    if (qLower.includes("summarize") || qLower.includes("summary") || qLower.includes("key points")) {
      return `**Summary of ${context.lessonTitle} (${context.courseTitle}):**

1. **Core Reading Focus:** ${context.lessonContent.substring(0, 150)}...
2. **Primary Learning Goal:** Master structured, professional workflows expected by top tech recruiters.
3. **Employability Competency:** Verified skill badge awarded upon completing lesson assessments.

*Study Guidance:* Review the module reading once more, then attempt the course assessment quiz to test your comprehension.${citationTag}`;
    }

    // Out-of-Scope Detection
    if (qLower.includes("quantum physics") || qLower.includes("cooking recipe") || qLower.includes("movie review")) {
      return `This concept (*"${studentQuestion}"*) falls outside our current Thakral Global Learning employability curriculum. 

However, in computer science and software development, remaining curious and applying structured problem-solving is always encouraged!

*Recommendation:* Please select a relevant course or lesson topic above to explore employability skills.${citationTag}`;
    }

    // Default Grounded Answer
    return `Regarding your question about **"${studentQuestion}"**:

Based on the study reading for **${context.lessonTitle}** in **${context.courseTitle}**:

${context.lessonContent}

*Summary:*
Applying these principles ensures high-impact engineering communication, teamwork, and problem solving.

*Critical Thinking Exercise:* Can you identify a recent project where you could have applied this approach?${citationTag}`;
  }

  async generateEducationalResponse(params: AIGenerateParams): Promise<{ text: string; citations: string[] }> {
    const text = await this.generateResponse(
      params.question,
      params.context,
      params.history,
      params.ragExcerpts,
      params.citations
    );
    return { text, citations: params.citations || [] };
  }
}

/**
 * Google Gemini API Provider with RAG Excerpt Injection.
 */
export class GeminiAIService implements AIServiceProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(
    studentQuestion: string,
    context: LessonContext,
    history: ChatMessageItem[] = [],
    ragContextText?: string,
    citations: string[] = []
  ): Promise<string> {
    try {
      const { systemPrompt, fullUserPrompt } = buildEducationalPrompt(
        studentQuestion,
        context,
        history,
        ragContextText,
        citations
      );

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemPrompt}\n\n${fullUserPrompt}` }],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 800,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API HTTP Error ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const citationTag = citations.length > 0
          ? `\n\n📌 **Course Reference:** ${citations.join(" | ")}`
          : "";
        return `${text}${citationTag}`;
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to educational provider:", err);
    }

    const fallback = new EducationalFallbackAIService();
    return fallback.generateResponse(studentQuestion, context, history, ragContextText, citations);
  }

  async generateEducationalResponse(params: AIGenerateParams): Promise<{ text: string; citations: string[] }> {
    const text = await this.generateResponse(
      params.question,
      params.context,
      params.history,
      params.ragExcerpts,
      params.citations
    );
    return { text, citations: params.citations || [] };
  }
}

/**
 * Factory function returning active AI provider.
 */
export function getAIService(): AIServiceProvider {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.length > 5) {
    return new GeminiAIService(apiKey);
  }
  return new EducationalFallbackAIService();
}
