import Link from "next/link";
export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="text-center">
        <p className="text-6xl font-black">404</p>
        <p className="mt-3 text-slate-400">Page not found.</p>
        <Link href="/" className="btn btn-primary mt-6 inline-block">Go home</Link>
      </div>
    </main>
  );
}