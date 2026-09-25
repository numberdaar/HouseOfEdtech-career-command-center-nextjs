"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Opportunity = {
  _id: string;
  company: string;
  role: string;
  location: string;
  stage: string;
  priority: string;
  salary: string;
  nextAction: string;
  followUpDate: string;
  notes: string;
  jobUrl: string;
};

const empty = {
  company: "", role: "", location: "", stage: "saved", priority: "medium",
  salary: "", nextAction: "", followUpDate: "", notes: "", jobUrl: ""
};

export default function OpportunityManager({ initial }: { initial: Opportunity[] }) {
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState<any>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("all");
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => items.filter((item) => {
    const haystack = `${item.company} ${item.role} ${item.location}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (stage === "all" || item.stage === stage);
  }), [items, query, stage]);

  function change(key: string, value: string) {
    setForm((f: any) => ({ ...f, [key]: value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch(editing ? `/api/opportunities/${editing}` : "/api/opportunities", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error ?? "Could not save");

    if (editing) {
      setItems((old) => old.map((x) => x._id === editing ? data.item : x));
    } else {
      setItems((old) => [data.item, ...old]);
    }
    setForm(empty);
    setEditing(null);
    setMessage("Saved successfully.");
  }

  async function remove(id: string) {
    if (!confirm("Delete this opportunity?")) return;
    const res = await fetch(`/api/opportunities/${id}`, { method: "DELETE" });
    if (res.ok) setItems((old) => old.filter((x) => x._id !== id));
  }

  function edit(item: Opportunity) {
    setEditing(item._id);
    setForm({ ...item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <form onSubmit={submit} className="card h-fit p-5 lg:sticky lg:top-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{editing ? "Edit opportunity" : "Add opportunity"}</h2>
          {editing && <button type="button" className="text-xs text-slate-400" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button>}
        </div>

        <div className="mt-5 grid gap-3">
          <input className="input" placeholder="Company *" value={form.company} onChange={e => change("company", e.target.value)} required />
          <input className="input" placeholder="Role *" value={form.role} onChange={e => change("role", e.target.value)} required />
          <input className="input" placeholder="Location / remote" value={form.location} onChange={e => change("location", e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <select className="input" value={form.stage} onChange={e => change("stage", e.target.value)}>
              {["saved","applied","screening","interview","offer","rejected"].map(x => <option key={x}>{x}</option>)}
            </select>
            <select className="input" value={form.priority} onChange={e => change("priority", e.target.value)}>
              {["low","medium","high"].map(x => <option key={x}>{x}</option>)}
            </select>
          </div>
          <input className="input" placeholder="Salary / range" value={form.salary} onChange={e => change("salary", e.target.value)} />
          <input className="input" placeholder="Next action" value={form.nextAction} onChange={e => change("nextAction", e.target.value)} />
          <input className="input" type="date" value={form.followUpDate} onChange={e => change("followUpDate", e.target.value)} />
          <input className="input" type="url" placeholder="Job URL" value={form.jobUrl} onChange={e => change("jobUrl", e.target.value)} />
          <textarea className="input min-h-28" placeholder="Notes" value={form.notes} onChange={e => change("notes", e.target.value)} />
        </div>

        {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}
        <button className="btn btn-primary mt-4 w-full">{editing ? "Update opportunity" : "Add opportunity"}</button>
      </form>

      <section>
        <div className="card mb-4 flex flex-col gap-3 p-4 md:flex-row">
          <input className="input" placeholder="Search company, role, location…" value={query} onChange={e => setQuery(e.target.value)} />
          <select className="input md:max-w-44" value={stage} onChange={e => setStage(e.target.value)}>
            <option value="all">All stages</option>
            {["saved","applied","screening","interview","offer","rejected"].map(x => <option key={x}>{x}</option>)}
          </select>
        </div>

        <div className="grid gap-3">
          {filtered.map(item => (
            <article key={item._id} className="card p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold">{item.role}</h3>
                    <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs text-blue-300">{item.stage}</span>
                    <span className="rounded-full bg-slate-700/60 px-2.5 py-1 text-xs text-slate-300">{item.priority} priority</span>
                  </div>
                  <p className="mt-1 text-slate-300">{item.company} · {item.location || "Location not set"}</p>
                  <p className="mt-3 text-sm text-slate-400">{item.nextAction || "No next action set"}</p>
                  {item.followUpDate && <p className="mt-1 text-xs text-amber-300">Follow up: {item.followUpDate}</p>}
                  {item.notes && <p className="mt-3 text-sm leading-6 text-slate-500">{item.notes}</p>}
                </div>
                <div className="flex shrink-0 items-start gap-2">
                  {item.jobUrl && <a className="btn btn-secondary text-sm" href={item.jobUrl} target="_blank">Job ↗</a>}
                  <button className="btn btn-secondary text-sm" onClick={() => edit(item)}>Edit</button>
                  <button className="btn btn-danger text-sm" onClick={() => remove(item._id)}>Delete</button>
                </div>
              </div>
            </article>
          ))}
          {!filtered.length && <div className="card p-10 text-center text-slate-500">No opportunities match your filters.</div>}
        </div>
      </section>
    </div>
  );
}