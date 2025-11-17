import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Upjeet Baswan - Full-Stack Developer",
  description: "Full-stack developer building production web apps and reliable APIs with React, Node.js, and PostgreSQL. Available for work in Canada.",
  keywords: ["portfolio", "full-stack developer", "web developer", "react", "next.js", "typescript", "node.js", "postgresql"],
  authors: [{ name: "Upjeet Baswan" }],
  openGraph: {
    title: "Upjeet Baswan - Full-Stack Developer Portfolio",
    description: "Full-stack developer building production web apps and reliable APIs",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
