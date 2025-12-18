import "./globals.css";

export const metadata = {
  title: "Monaco Editor Demo",
  description: "Next.js App Router example showcasing the Monaco code editor"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
