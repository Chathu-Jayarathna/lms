import { getCourses } from "@/lib/db";
import { createCourseChunks, CourseChunk } from "./chunker";
import { VectorStore, SearchResult } from "./vectorStore";

export interface RAGRetrievalResult {
  retrievedText: string;
  citations: string[];
  maxScore: number;
  isInScope: boolean;
  results: SearchResult[];
}

export class RAGService {
  private static instance: RAGService;
  private vectorStore: VectorStore;
  private isInitialized = false;

  private constructor() {
    this.vectorStore = new VectorStore();
  }

  public static getInstance(): RAGService {
    if (!RAGService.instance) {
      RAGService.instance = new RAGService();
    }
    return RAGService.instance;
  }

  /**
   * Initializes the vector index with current course materials.
   */
  public async initializeIndex() {
    if (this.isInitialized) return;
    try {
      const courses = await getCourses();
      const chunks = createCourseChunks(courses);
      this.vectorStore.addChunks(chunks);
      this.isInitialized = true;
    } catch (e) {
      console.error("Failed to initialize RAG vector index:", e);
    }
  }

  /**
   * Performs course-aware semantic retrieval over course materials.
   */
  public async retrieveRelevantContext(
    query: string,
    activeCourseId?: string,
    activeLessonId?: string
  ): Promise<RAGRetrievalResult> {
    await this.initializeIndex();

    const searchResults = this.vectorStore.search(query, activeCourseId, activeLessonId, 3);
    const maxScore = searchResults[0]?.score || 0;
    const isInScope = maxScore >= 0.15;

    const citations = Array.from(new Set(searchResults.map((r) => r.citation)));

    const retrievedText = searchResults
      .map(
        (r, idx) =>
          `[RETIEVED EXCERPT ${idx + 1}] ${r.citation}\n"${r.chunk.text}"`
      )
      .join("\n\n");

    return {
      retrievedText,
      citations,
      maxScore,
      isInScope,
      results: searchResults,
    };
  }
}

export const ragService = RAGService.getInstance();
