/**
 * Generates term-frequency vector embeddings for semantic text matching.
 */
export function generateVectorEmbedding(text: string): Map<string, number> {
  const vec = new Map<string, number>();
  const tokens = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((t) => t.length > 2);

  tokens.forEach((token) => {
    vec.set(token, (vec.get(token) || 0) + 1);
  });

  return vec;
}

/**
 * Computes Cosine Similarity between two term vector embeddings.
 * Cosine Similarity = (V1 • V2) / (||V1|| * ||V2||)
 */
export function cosineSimilarity(
  v1: Map<string, number>,
  v2: Map<string, number>
): number {
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  v1.forEach((val, key) => {
    mag1 += val * val;
    if (v2.has(key)) {
      dotProduct += val * v2.get(key)!;
    }
  });

  v2.forEach((val) => {
    mag2 += val * val;
  });

  if (mag1 === 0 || mag2 === 0) return 0;
  return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
}
