import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  company: z.string().trim().min(1).max(120),
  role: z.string().trim().min(1).max(120),
  notes: z.string().trim().max(2000).default("")
});

export async function POST(req: Request) {
  try {
    await requireSession();
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid AI input." }, { status: 400 });

    const { company, role, notes } = parsed.data;

    // Provider-neutral fallback. Replace this function with AI SDK + OpenAI/Gemini/Groq
    // when an API key is available. Keeping the contract stable makes provider changes easy.
    const brief = [
      `Application brief — ${role} at ${company}`,
      "",
      "1. Research focus: understand the product, customer, business model and the team's engineering priorities.",
      "2. Technical focus: prepare two concrete examples showing scalable APIs, database design, validation, security and performance optimization.",
      "3. Role focus: map your strongest React/Next.js/Node.js work to the responsibilities in the job description.",
      "4. Questions to prepare: architecture trade-offs, SSR/SSG, caching, API security, database indexing and deployment.",
      notes ? `5. Your notes to revisit: ${notes}` : "5. Add your own notes to make this brief more specific."
    ].join("\\n");

    return NextResponse.json({ brief });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    return NextResponse.json({ error: "AI request failed." }, { status: 500 });
  }
}