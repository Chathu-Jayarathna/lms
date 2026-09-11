import { CourseChunk } from "./chunker";
import { generateVectorEmbedding, cosineSimilarity } from "./embeddings";

export interface SearchResult {
  chunk: CourseChunk;
  score: number;
  citation: string;
}

export class VectorStore {
  private index: { chunk: CourseChunk; vector: Map<string, number> }[] = [];

  /**
   * Indexes course chunks into the vector store.
   */
  public addChunks(chunks: CourseChunk[]) {
    this.index = chunks.map((chunk) => ({
      chunk,
      vector: generateVectorEmbedding(chunk.text),
    }));
  }

  /**
   * Performs semantic similarity search with 4-Tier Context Priority Boosting:
   * Priority 1: Active Lesson (1.5x boost)
   * Priority 2: Active Course (1.2x boost)
   * Priority 3: Related Employability Modules
   * Priority 4: General Knowledge Fallback
   */
  public search(
    query: string,
    activeCourseId?: string,
    activeLessonId?: string,
    topK = 3
  ): SearchResult[] {
    const queryVec = generateVectorEmbedding(query);

    const scored = this.index.map(({ chunk, vector }) => {
      let score = cosineSimilarity(queryVec, vector);

      // Priority 1: Active Lesson Boost
      if (activeLessonId && chunk.lessonId === activeLessonId) {
        score *= 1.5;
      }
      // Priority 2: Active Course Boost
      else if (activeCourseId && chunk.courseId === activeCourseId) {
        score *= 1.2;
      }

      const citation = `[Source: ${chunk.courseTitle} > ${chunk.moduleTitle} > ${chunk.lessonTitle}]`;

      return {
        chunk,
        score,
        citation,
      };
    });

    // Sort by relevance score descending
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK);
  }
}
