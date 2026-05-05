import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter-var', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit-var', display: 'swap' });

export const metadata: Metadata = {
  title: '🖨️ PrintKiosk — Smart Self-Service Printing',
  description: 'Scan a QR code, upload your document, pay online, and print instantly. The fastest self-service kiosk printing in Bangladesh.',
  keywords: 'printing, kiosk, document, upload, bKash, Nagad, Bangladesh',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-inter antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
