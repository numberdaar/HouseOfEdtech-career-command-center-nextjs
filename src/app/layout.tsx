import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Career Command Center",
  description: "A secure career opportunity intelligence workspace."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>

          <footer className="border-t bg-white">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-gray-600 sm:flex-row">
              <p>
                © 2026 Ankit Dalal · Software Developer
              </p>

              <div className="flex gap-5">
                <a
                  href="https://github.com/numberdaar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black hover:underline"
                >
                  GitHub
                </a>

                <a
                  href="https://www.linkedin.com/in/ankit-dalal-154a16229"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black hover:underline"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}