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
  title: "FastTrack AI",
  description: "Accelerate your AI journey",
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
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
