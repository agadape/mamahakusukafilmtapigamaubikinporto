import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { PageTransition } from "@/components/layout/PageTransition";
import "../styles/globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Agadape — Portfolio",
  description: "Developer web-based information systems. Project sebagai diary film.",
  openGraph: {
    title: "Agadape — Portfolio",
    description: "Developer web-based information systems. Project sebagai diary film.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
