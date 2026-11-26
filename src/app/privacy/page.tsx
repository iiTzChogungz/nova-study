import LegalPage from '@/components/LegalPage'

export const metadata = { title: 'นโยบายความเป็นส่วนตัว' }

export default function Privacy() {
  const contact = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@example.com'
  return (
    <LegalPage title="นโยบายความเป็นส่วนตัว">
      <h2>ข้อมูลที่เราเก็บ</h2>
      <p>อีเมลและรหัสผ่านที่เข้ารหัสสำหรับบัญชีของคุณ, ไฟล์และข้อความที่สกัดจากไฟล์ที่คุณอัปโหลด, ประวัติการใช้ AI และสถิติการใช้งานเพื่อคำนวณโควตา</p>
      <h2>การใช้ข้อมูล</h2>
      <p>เนื้อหาเอกสารของคุณจะถูกส่งไปยังผู้ให้บริการ AI (Google Gemini) เพื่อประมวลผลตามคำสั่งของคุณเท่านั้น เราไม่ขายข้อมูลของคุณ</p>
      <h2>การจัดเก็บและการลบ</h2>
      <p>ไฟล์ถูกเก็บแบบส่วนตัวบน Supabase คุณลบเอกสาร (รวมไฟล์และผลลัพธ์ AI ที่เกี่ยวข้อง) ได้ทุกเมื่อจากหน้า &ldquo;เอกสารของฉัน&rdquo; และขอลบบัญชีได้โดยติดต่อเรา</p>
      <h2>ติดต่อเรา</h2>
      <p>{contact}</p>
    </LegalPage>
  )
}
