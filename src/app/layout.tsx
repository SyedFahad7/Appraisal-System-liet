import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LORDS Faculty Appraisal",
  description: "Faculty appraisal workflow for LORDS Institute",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f6fcfc] text-[#224563]">
        {children}
      </body>
    </html>
  );
}
