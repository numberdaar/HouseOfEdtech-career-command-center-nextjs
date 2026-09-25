import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { Opportunity } from "@/models/Opportunity";
import { opportunitySchema } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const session = await requireSession();
    const { id } = await ctx.params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

    const parsed = opportunitySchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid opportunity data." }, { status: 400 });

    await connectDB();
    const item = await Opportunity.findOneAndUpdate(
      { _id: id, userId: session.userId },
      { $set: parsed.data },
      { new: true, runValidators: true }
    ).lean();

    if (!item) return NextResponse.json({ error: "Opportunity not found." }, { status: 404 });
    return NextResponse.json({ item });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    return NextResponse.json({ error: "Could not update opportunity." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const session = await requireSession();
    const { id } = await ctx.params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

    await connectDB();
    const result = await Opportunity.deleteOne({ _id: id, userId: session.userId });
    if (!result.deletedCount) return NextResponse.json({ error: "Opportunity not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    return NextResponse.json({ error: "Could not delete opportunity." }, { status: 500 });
  }
}