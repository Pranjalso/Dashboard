import "./globals.css";
import { Inter } from "next/font/google";
import AppShell from "@/components/AppShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Clinic CRM - Healthcare Pro",
  description: "Healthcare management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F5F7F6] text-[#0F172A]`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
