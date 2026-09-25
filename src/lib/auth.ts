import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "career_session";
const secret = process.env.JWT_SECRET;

if (!secret || secret.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters");
}

const key = new TextEncoder().encode(secret);

export type Session = { userId: string; email: string; name: string };

export async function createSession(session: Session) {
  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, key);
    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string"
    ) return null;

    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name
    };
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function clearSession() {
  (await cookies()).delete(COOKIE_NAME);
}