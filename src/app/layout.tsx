import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: 'NATX Premium Member Portal',
    template: '%s | NATX Member Portal'
  },
  description:
    'Premium light-themed portal for NATX members with access to events, resources, and community tools.'
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, 'min-h-screen bg-neutral-background text-neutral')}>
        {children}
      </body>
    </html>
  );
}
