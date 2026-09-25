"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="card max-w-md p-7 text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-slate-400">The workspace could not load this request.</p>
        <button className="btn btn-primary mt-5" onClick={() => reset()}>Try again</button>
      </div>
    </main>
  );
}