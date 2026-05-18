import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastHost } from "@/components/Toast";
import { I18nProvider } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cardte — All your cards, one tap away",
  description:
    "Your cards. Simplified. Store bank cards and memberships securely on your device — no server, no sign-up.",
  manifest: "/manifest.json",
  applicationName: "Cardte",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cardte",
  },
  icons: {
    icon: [
      { url: "/logo/logo.png", sizes: "192x192", type: "image/png" },
      { url: "/logo/logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/logo/logo.png", sizes: "192x192" }],
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
    <html lang="id" className={inter.variable}>
      <body className="bg-black text-white font-sans antialiased">
        <I18nProvider>
          <div className="mx-auto min-h-[100dvh] max-w-md">{children}</div>
          <ToastHost />
        </I18nProvider>
      </body>
    </html>
  );
}
