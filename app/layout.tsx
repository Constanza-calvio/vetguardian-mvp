import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
     <html lang="en">
      <body className={`${inter.className} bg-white text-[#1A1A1A]`}>
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
