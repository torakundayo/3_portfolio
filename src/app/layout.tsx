import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Portfolio — AI Canvas',
  description: 'AI-first portfolio. Type anything and watch the page transform.',
  metadataBase: new URL('https://portfolio.example.com'),
  openGraph: {
    title: 'Portfolio — AI Canvas',
    description: 'AI chatbot-first portfolio. Single page + AI dialogue. Design dynamically transforms based on input.',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'AI Canvas Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio — AI Canvas',
    description: 'AI chatbot-first portfolio. Design dynamically transforms based on input.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
