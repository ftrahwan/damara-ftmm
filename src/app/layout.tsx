import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#B07A3C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "DAMARA",
  description:
    "Platform agregator lowongan magang terkurasi khusus mahasiswa Fakultas Teknologi Maju dan Multidisiplin (FTMM) Universitas Airlangga.",
  manifest: "/manifest.json",
  keywords: [
    "DAMARA",
    "Magang FTMM",
    "BEM FTMM UNAIR",
    "Lowongan Magang Industri",
    "Robotika & AI",
    "Elektro",
    "Industri",
    "Sains Data",
    "Rekayasa Nano",
  ],
  icons: {
    icon: "/logo-psdm.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col selection:bg-[#B07A3C] selection:text-white font-sans"
      >
        {children}
      </body>
    </html>
  );
}
