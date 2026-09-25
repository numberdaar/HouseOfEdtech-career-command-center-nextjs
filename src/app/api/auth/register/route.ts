import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { registerSchema } from "@/lib/validation";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const parsed = registerSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid registration data." }, { status: 400 });

    await connectDB();
    const existing = await User.findOne({ email: parsed.data.email }).lean();
    if (existing) return NextResponse.json({ error: "An account already exists." }, { status: 409 });

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await User.create({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash
    });

    await createSession({ userId: user._id.toString(), email: user.email, name: user.name });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}