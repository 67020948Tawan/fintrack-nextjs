import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FinTrack - แอปบันทึกรายรับรายจ่าย',
  description: 'จัดการการเงินของคุณให้เป็นเรื่องง่าย',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // เติม suppressHydrationWarning ตรงนี้เพื่อแก้ Error
    <html lang="th" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 text-slate-900`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}