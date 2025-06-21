import type { Metadata } from "next";
import { Geist, Geist_Mono, Kanit, Sarabun } from "next/font/google";
import "./globals.css";
import Providers from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const kanit = Kanit({
  subsets: ["thai", "latin"], // โหลด glyph ไทย + สากล
  weight: ["100", "200", "300", "400", "700", "500", "600"], // Add the weights you want to use
  display: "swap", // แสดงตัวอักษรก่อน โหลดฟอนต์เสร็จ
  variable: "--font-kanit", // (ถ้าจะใช้ CSS variable)
});
const sarabun = Sarabun({
  variable: "--font-sarabun",
  weight: ["100", "200", "300", "400", "700", "500", "600"], // Add the weights you want to use
  subsets: ["thai", "latin"],
  display: "swap", // หรือ 'optional' ตามชอบ
});
export const metadata: Metadata = {
  title: "ESCO",
  description: "ESCO Model",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white text-black">
      <head>
        <link rel="manifest" href="/manifest.json?v=4" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#008000" />
      </head>
      <body className={`${sarabun.variable} ${kanit.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
