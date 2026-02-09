import type { Metadata } from "next";
import { Suspense } from "react";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/query-provider";
import { SkipLink } from "@/components/ui/skip-link";
import { Navigation } from "@/components/navigation";
import { ModalProvider } from "@/components/ui/modal-provider";
import { SiteFooter } from "@/components/ui/site-footer";
import { SharedFooter } from "@/components/shared-footer";
import { Analytics } from "@/components/ui/analytics";
import { AuthCompleteTracker } from "@/components/ui/auth-complete-tracker";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const robotoMono = Roboto_Mono({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "SCP Reader",
  description: "Track your SCP Foundation reading progress",
  icons: {
    icon: "/scp-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${robotoMono.variable}`}>
      <body>
        <Analytics />
        <AuthCompleteTracker />
        <ModalProvider>
          <SkipLink />
          <Suspense>
            <Navigation />
          </Suspense>
          <QueryProvider>{children}</QueryProvider>
          <SiteFooter />
          <SharedFooter />
        </ModalProvider>
      </body>
    </html>
  );
}
