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
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=panchang@200,300,400,500,600,700,800&f[]=satoshi@300,400,500,700&display=swap"
        />
      </head>
      <body className="min-h-screen bg-[#000F08] text-[#e0e0e0]">
        {children}
      </body>
    </html>
  );
}
