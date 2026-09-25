import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="mb-6 inline-flex w-fit rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm text-blue-300">
          Next.js 16 · TypeScript · MongoDB · Tailwind CSS
        </div>
        <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
          Turn a scattered job search into a measurable career pipeline.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Career Command Center helps job seekers capture opportunities, manage interview stages,
          plan follow-ups and understand pipeline health from one secure workspace.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/register" className="btn btn-primary">Create workspace</Link>
          <Link href="/login" className="btn btn-secondary">Sign in</Link>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            ["Pipeline intelligence", "Stage filters, priorities, follow-up dates and conversion metrics."],
            ["Secure by design", "HTTP-only sessions, password hashing, validation and user-scoped queries."],
            ["AI-ready workflow", "Generate an application brief from a role and your notes."]
          ].map(([title, text]) => (
            <div className="card p-6" key={title}>
              <h2 className="text-lg font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
            </div>
          ))}
        </div>
        <Footer />
      </section>
    </main>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800 pt-6 text-sm text-slate-500">
      Built by <span className="text-slate-300">Ankit Dalal</span> · Software Developer ·
      <a className="ml-1 text-blue-300 hover:underline" href="https://github.com/numberdaar" target="_blank">GitHub</a>
      <span className="mx-2">·</span>
      <a className="text-blue-300 hover:underline" href="https://www.linkedin.com/" target="_blank">LinkedIn</a>
      <span className="ml-2 text-slate-600">(replace with your profile URL before submission)</span>
    </footer>
  );
}