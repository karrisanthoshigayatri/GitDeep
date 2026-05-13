import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { StoreProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'GitHub AI Assessor',
  description: 'AI-powered brutal assessment of GitHub profiles',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-[#0D1117] text-[#C9D1D9] min-h-screen font-sans border-8 border-[#161B22] flex flex-col">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
