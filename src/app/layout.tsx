import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Adam — Portfolio',
  description: 'Portfolio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-[#0b0b10] text-white min-h-dvh">
        {children}
      </body>
    </html>
  );
}
