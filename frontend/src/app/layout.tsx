import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'VisualArch AI — Living Architecture Platform',
  description: 'AI-powered software architecture design and code generation platform. Generate production-ready architecture with real-time collaboration.',
  keywords: ['AI', 'software architecture', 'code generation', 'system design'],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'VisualArch AI',
    description: 'The first Living Architecture Platform',
    type: 'website',
  },
};

import { ToastContainer } from '@/components/ui/ToastContainer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="bg-bg text-text-primary antialiased">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
