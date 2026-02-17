import { AuthProvider } from '@/context/auth-context';
import { NotificationProvider } from '@/context/notification-context';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OmniLogistics ERP',
  description: 'Enterprise Resource Planning',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NotificationProvider>
            {children}
            <Toaster position="top-right" richColors />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
