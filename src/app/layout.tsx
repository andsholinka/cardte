import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastHost } from "@/components/Toast";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Cardte — Simpan Kartumu di Satu Tempat",
  description:
    "Cardte adalah aplikasi sederhana untuk menyimpan kartu bank dan kartu member favoritmu. Data tersimpan aman di perangkatmu.",
  manifest: "/manifest.json",
  applicationName: "Cardte",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cardte",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-bg text-white antialiased">
        <I18nProvider>
          <div className="mx-auto min-h-[100dvh] max-w-md">{children}</div>
          <ToastHost />
        </I18nProvider>
      </body>
    </html>
  );
}
