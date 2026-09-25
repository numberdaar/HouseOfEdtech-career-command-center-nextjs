import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { loginSchema } from "@/lib/validation";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const parsed = loginSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });

    await connectDB();
    const user = await User.findOne({ email: parsed.data.email });
    if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    await createSession({ userId: user._id.toString(), email: user.email, name: user.name });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}