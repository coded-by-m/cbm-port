import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coded by M — Experience Lab",
  description:
    "Laboratório técnico da Coded by M. Experimentos visuais e estruturais antes da Home final.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#050505] text-[#e0e0e0]">
        {children}
      </body>
    </html>
  );
}
