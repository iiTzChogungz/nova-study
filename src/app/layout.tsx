import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rocket-learn.vercel.app"),
  title: "Rocket Learn | Your AI Study Companion",
  description: "Upload PDFs, images, or notes and let Rocket Learn instantly generate summaries, answer questions, and build interactive quizzes to help you study faster.",
  keywords: ["AI tutor", "study companion", "PDF summarizer", "AI quiz generator", "student tools", "education"],
  authors: [{ name: "Rocket Learn Team" }],
  openGraph: {
    title: "Rocket Learn | Master any subject in record time",
    description: "Your personal AI tutor. Upload documents and get instant summaries, answers, and quizzes.",
    url: "https://rocket-learn.vercel.app",
    siteName: "Rocket Learn",
    images: [
      {
        url: "/og-image.jpg", // Placeholder for actual OG image
        width: 1200,
        height: 630,
        alt: "Rocket Learn Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rocket Learn | AI Study Companion",
    description: "Upload documents and get instant summaries, answers, and quizzes.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
