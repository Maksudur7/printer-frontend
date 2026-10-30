import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/lib/providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '🖨️ PrintKiosk — Smart Self-Service Printing',
  description: 'Scan a QR code, upload your document, pay online, and print instantly. The fastest self-service kiosk printing in Bangladesh.',
  keywords: 'printing, kiosk, document, upload, bKash, Nagad, Bangladesh',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFEF91] to-[#d4f0a0]">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
