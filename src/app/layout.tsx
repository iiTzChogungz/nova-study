import type { Metadata } from 'next'
import { Geist_Mono, Noto_Sans_Thai } from 'next/font/google'
import './globals.css'

const sansTh = Noto_Sans_Thai({ variable: '--font-sans-th', subsets: ['thai', 'latin'] })
const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

const url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: { default: 'Nova Study | ติวเตอร์ AI ส่วนตัว สรุป ออกข้อสอบ จากไฟล์ของคุณ', template: '%s | Nova Study' },
  description: 'อัปโหลด PDF รูปภาพ หรือโน้ต แล้วให้ AI สรุปบทเรียน ออกข้อสอบ ทำแฟลชการ์ด และตอบคำถามจากเอกสารของคุณ ใช้ฟรี เริ่มได้ทันที',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  keywords: ['AI ติวเตอร์', 'สรุปบทเรียน', 'ออกข้อสอบ AI', 'แฟลชการ์ด', 'สรุป PDF', 'สรุปชีท', 'ติวสอบ AI', 'ข้อสอบปรนัย AI', 'AI ช่วยเรียน ฟรี', 'Nova Study'],
  openGraph: {
    title: 'Nova Study | เรียนรู้เร็วขึ้นด้วย AI',
    description: 'สรุป ออกข้อสอบ แฟลชการ์ด และถาม-ตอบ จากไฟล์เรียนของคุณ',
    url,
    siteName: 'Nova Study',
    locale: 'th_TH',
    type: 'website',
  },
  twitter: { card: 'summary', title: 'Nova Study | ติวเตอร์ AI ส่วนตัว', description: 'สรุป ออกข้อสอบ แฟลชการ์ด จากไฟล์เรียนของคุณ' },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={`${sansTh.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
