import bcrypt from "bcryptjs";

/**
 * Hashes raw password string using bcrypt (Node environment).
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verifies plain text password against stored hash (Node environment).
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
