"use client";

import { useState } from "react";

export default function AIBrief({ role, company, notes }: { role: string; company: string; notes: string }) {
  const [brief, setBrief] = useState("");
  const [busy, setBusy] = useState(false);

  async function generate() {
    setBusy(true);
    const res = await fetch("/api/ai/brief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, company, notes })
    });
    const data = await res.json();
    setBrief(data.brief ?? data.error ?? "No brief generated.");
    setBusy(false);
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-bold">AI application brief</h2>
          <p className="mt-1 text-sm text-slate-500">Turn your opportunity notes into an action-oriented preparation brief.</p>
        </div>
        <button className="btn btn-secondary text-sm" onClick={generate} disabled={busy}>{busy ? "Generating…" : "Generate"}</button>
      </div>
      {brief && <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-300">{brief}</pre>}
    </div>
  );
}