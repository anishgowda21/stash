import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Stash",
  description: "Stash your files",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
