import type { Metadata } from "next";
import "@/styles/globals.css";
import { TerraStoreProvider } from "@/lib/store";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { CommandPalette } from "@/components/layout/CommandPalette";

import { AuthGuard } from "@/components/auth/AuthGuard";

export const metadata: Metadata = {
  title: "Terra — Toastmasters Club Operating System",
  description: "Apple-inspired, high-performance private operating system for Terra Toastmasters.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-terra-canvas text-terra-text-primary antialiased selection:bg-terra-amber/20 selection:text-terra-amber pb-24 md:pb-12">
        <TerraStoreProvider>
          <AuthGuard>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              {children}
            </main>
            <MobileNav />
            <CommandPalette />
          </AuthGuard>
        </TerraStoreProvider>
      </body>
    </html>
  );
}
