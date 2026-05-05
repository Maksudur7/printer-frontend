import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "PrintEZ — Smart Printing Kiosk System",
  description: "Upload your documents and print from any kiosk near you. Fast, secure, and affordable printing on demand.",
  keywords: "printing, kiosk, document, upload, Bangladesh",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} noise-bg`}>
        <ThemeProvider>
          <AuthProvider>
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
              <div style={{
                position: 'absolute', top: '-10%', left: '-5%',
                width: 600, height: 600,
                background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
                filter: 'blur(40px)'
              }} />
              <div style={{
                position: 'absolute', bottom: '10%', right: '-10%',
                width: 500, height: 500,
                background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
                filter: 'blur(40px)'
              }} />
              <div style={{
                position: 'absolute', top: '50%', left: '40%',
                width: 400, height: 400,
                background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)',
                filter: 'blur(60px)'
              }} />
            </div>
            <Navbar />
            <main style={{ position: 'relative', zIndex: 1 }}>{children}</main>
            {/* <Footer /> */}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
