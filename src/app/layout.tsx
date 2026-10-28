import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#fa0079",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "NovaesWeb Entregador | Tudo o que o motoboy precisa em um só lugar",
  description:
    "Reconstrução fiel e interativa da plataforma NovaesWeb Entregador. Passo a passo do fluxo operacional de despacho e entrega de motoboys próprios.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NovaesWeb Entregador",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full dark antialiased`}>
      <body className="min-h-full flex flex-col bg-[#07040d] text-white overflow-x-hidden font-sans">
        {children}
      </body>
    </html>
  );
}
