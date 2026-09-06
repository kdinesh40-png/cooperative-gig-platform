import type { Metadata } from "next";
import "./globals.css";
import DemoRoleSwitcher from "@/components/layout/DemoRoleSwitcher";
import FloatingBottomNav from "@/components/layout/FloatingBottomNav";

export const metadata: Metadata = {
  title: "Sahkar — Cooperative Gig Services Platform | SIH26089",
  description: "Ministry of Cooperation Initiative — Worker-Owned Platform Cooperative ('Sevak Hi Malik') for Household & Community Services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F8F6F0] text-[#18181B]">
        <DemoRoleSwitcher />
        <main className="flex-1 w-full">
          {children}
        </main>
        <FloatingBottomNav />
      </body>
    </html>
  );
}
