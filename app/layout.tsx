// app/layout.tsx
import { Inter, Prompt } from 'next/font/google';
import './globals.css';

// โหลดฟอนต์ Inter สำหรับภาษาอังกฤษ/ตัวเลข
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter' 
});

// โหลดฟอนต์ Prompt สำหรับภาษาไทย (สไตล์โมเดิร์น)
const prompt = Prompt({ 
  subsets: ['thai'], 
  weight: ['300', '400', '600', '700'], 
  variable: '--font-prompt' 
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${inter.variable} ${prompt.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}