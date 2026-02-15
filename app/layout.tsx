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
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

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
  title: {
    template: `%s — ${SITE_NAME}`,
    default: `${SITE_NAME} — Track Your SCP Foundation Reading Progress`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/scp-logo.svg",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://scp-reader.co'),
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
        <QueryProvider>
          <ModalProvider>
            <SkipLink />
            <Suspense>
              <Navigation />
            </Suspense>
            {children}
            <SiteFooter />
            <SharedFooter />
          </ModalProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
