import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Background3D } from "@/components/Background3D";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AlgoRhythm // Pro Audio Engine",
  description: "Next-generation AI music synthesis and live coding environment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.className} antialiased min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground`}>
        {/* Ambient background mesh */}
        <Background3D />
        <div className="fixed inset-0 -z-20 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: "1.5s" }} />
        </div>
        {children}
      </body>
    </html>
  );
}
