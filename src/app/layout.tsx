import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import ClientLayout from "./ClientLayout";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: "FastTrack AI | Accelerate Your AI Journey",
  description: "FastTrack AI helps businesses accelerate their AI implementation with expert consulting, custom solutions, and comprehensive training programs.",
  keywords: "AI consulting, artificial intelligence, business automation, AI implementation, machine learning, data analytics, AI training, digital transformation",
  authors: [{ name: "FastTrack AI Team" }],
  creator: "FastTrack AI",
  publisher: "FastTrack AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fasttrackai.io'),
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "FastTrack AI | Accelerate Your AI Journey",
    description: "FastTrack AI helps businesses accelerate their AI implementation with expert consulting, custom solutions, and comprehensive training programs.",
    url: 'https://fasttrackai.io',
    siteName: 'FastTrack AI',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'FastTrack AI',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FastTrack AI | Accelerate Your AI Journey',
    description: 'FastTrack AI helps businesses accelerate their AI implementation with expert consulting, custom solutions, and comprehensive training programs.',
    images: ['/twitter-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.png" type="image/png" />
        {/* Custom font styling for Minigap-like appearance */}
        <style dangerouslySetInnerHTML={{ __html: `
          .font-minigap {
            font-family: 'Space Grotesk', sans-serif;
            letter-spacing: -0.05em;
            font-weight: 500;
            font-feature-settings: 'tnum' on, 'lnum' on;
          }
        `}} />
      </head>
      <body className={`${inter.className} ${spaceGrotesk.variable} antialiased`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              <ClientLayout>{children}</ClientLayout>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
