import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  userId: string;
  role: "admin" | "author" | "reader";
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (
      typeof decoded === "object" &&
      "userId" in decoded &&
      typeof decoded.userId === "string" &&
      "role" in decoded &&
      typeof decoded.role === "string"
    ) {
      return { userId: decoded.userId, role: decoded.role as "admin" | "author" | "reader" };
    }
    return null;
  } catch {
    return null;
  }
}