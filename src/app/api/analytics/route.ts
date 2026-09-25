import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { Opportunity } from "@/models/Opportunity";

export async function GET() {
  try {
    const session = await requireSession();
    await connectDB();

    const stats = await Opportunity.aggregate([
      { $match: { userId: session.userId } },
      { $group: { _id: "$stage", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return NextResponse.json({ stats });
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
}