import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { Opportunity } from "@/models/Opportunity";
import { opportunitySchema } from "@/lib/validation";

export async function GET(req: Request) {
  try {
    const session = await requireSession();
    await connectDB();
    const url = new URL(req.url);
    const stage = url.searchParams.get("stage");
    const q = url.searchParams.get("q")?.trim();

    const filter: any = { userId: session.userId };
    if (stage && stage !== "all") filter.stage = stage;
    if (q) filter.$or = [
      { company: { $regex: q, $options: "i" } },
      { role: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } }
    ];

    const items = await Opportunity.find(filter).sort({ updatedAt: -1 }).limit(100).lean();
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Unauthorized or failed request." }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireSession();
    const parsed = opportunitySchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid opportunity data." }, { status: 400 });

    await connectDB();
    const item = await Opportunity.create({ ...parsed.data, userId: session.userId });
    return NextResponse.json({ item }, { status: 201 });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    return NextResponse.json({ error: "Could not create opportunity." }, { status: 500 });
  }
}