import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Opportunity } from "@/models/Opportunity";
import LogoutButton from "@/components/LogoutButton";
import OpportunityManager from "@/components/OpportunityManager";
import AIBrief from "@/components/AIBrief";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await getSession();
  if (!session) redirect("/login");

  await connectDB();
  const docs = await Opportunity.find({ userId: session.userId }).sort({ updatedAt: -1 }).lean();
  const items = docs.map((d: any) => ({
    _id: d._id.toString(),
    company: d.company, role: d.role, location: d.location, stage: d.stage,
    priority: d.priority, salary: d.salary, nextAction: d.nextAction,
    followUpDate: d.followUpDate, notes: d.notes, jobUrl: d.jobUrl
  }));

  const counts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.stage] = (acc[item.stage] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="min-h-screen">
      <header className="border-b border-slate-800 bg-[#07111f]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-blue-400">Career Command Center</p>
            <h1 className="mt-1 text-2xl font-black">Good to see you, {session.name}</h1>
          </div>
          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {["saved","applied","screening","interview","offer","rejected"].map(s => (
            <div className="card p-4" key={s}>
              <p className="text-xs uppercase tracking-wide text-slate-500">{s}</p>
              <p className="mt-2 text-3xl font-black">{counts[s] || 0}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <AIBrief
            role={items[0]?.role || "Target role"}
            company={items[0]?.company || "Target company"}
            notes={items[0]?.notes || ""}
          />
        </div>

        <div className="mt-6">
          <OpportunityManager initial={items} />
        </div>

        <footer className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-500">
          Built by <span className="text-slate-300">Ankit Dalal</span> · Software Developer ·
          <a className="ml-1 text-blue-300 hover:underline" href="https://github.com/numberdaar" target="_blank">GitHub</a>
          <span className="mx-2">·</span>
          <a className="text-blue-300 hover:underline" href="https://www.linkedin.com/" target="_blank">LinkedIn</a>
          <span className="ml-2 text-slate-600">(replace with your profile URL before submission)</span>
        </footer>
      </div>
    </main>
  );
}