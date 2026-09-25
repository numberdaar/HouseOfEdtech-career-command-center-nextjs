"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
    const body = mode === "register" ? { name, email, password } : { email, password };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Request failed");
      setBusy(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen grid place-items-center px-6">
      <form onSubmit={submit} className="card w-full max-w-md p-7">
        <Link href="/" className="text-sm text-blue-300">← Career Command Center</Link>
        <h1 className="mt-7 text-3xl font-black">{mode === "register" ? "Create workspace" : "Welcome back"}</h1>
        <p className="mt-2 text-sm text-slate-400">
          {mode === "register" ? "Build your private career pipeline." : "Continue managing your career pipeline."}
        </p>

        {mode === "register" && (
          <label className="mt-6 block text-sm">
            Name
            <input className="input mt-2" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
          </label>
        )}

        <label className="mt-5 block text-sm">
          Email
          <input className="input mt-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label className="mt-5 block text-sm">
          Password
          <input className="input mt-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        </label>

        {error && <p className="mt-4 rounded-lg bg-red-950/60 p-3 text-sm text-red-300">{error}</p>}

        <button disabled={busy} className="btn btn-primary mt-6 w-full disabled:opacity-50">
          {busy ? "Working…" : mode === "register" ? "Create account" : "Sign in"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          {mode === "register" ? "Already have an account? " : "Need an account? "}
          <Link className="text-blue-300 hover:underline" href={mode === "register" ? "/login" : "/register"}>
            {mode === "register" ? "Sign in" : "Register"}
          </Link>
        </p>
      </form>
    </main>
  );
}