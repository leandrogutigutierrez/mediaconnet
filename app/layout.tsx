import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import { TranslationErrorBoundary } from '@/components/providers/TranslationErrorBoundary';

export const metadata: Metadata = {
  title:       'MediaConnet — Connect. Create. Grow.',
  description: 'The platform connecting Transmedia Production students with real-world creative opportunities.',
  keywords:    'transmedia, media production, student jobs, creative opportunities, portfolio',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <TranslationErrorBoundary>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  borderRadius: '10px',
                  fontSize:     '14px',
                },
              }}
            />
          </AuthProvider>
        </TranslationErrorBoundary>
      </body>
    </html>
  );
}
