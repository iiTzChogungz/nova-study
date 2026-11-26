import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { after } from 'next/server'
import { checkUsageLimit, recordUsage } from '@/lib/usage'
import { extractTextFromFile } from '@/lib/extractText'
import { ALLOWED_MIME_TYPES, MAX_UPLOAD_BYTES } from '@/lib/plans'

export const maxDuration = 60

const EXT: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'text/plain': 'txt',
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) return NextResponse.json({ error: 'ไม่พบไฟล์' }, { status: 400 })

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'รองรับเฉพาะ PDF, PNG, JPG, WEBP และ TXT' }, { status: 400 })
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'ไฟล์ใหญ่เกิน 10MB' }, { status: 400 })
    }
    if (!(await checkUsageLimit(user.id, 'upload'))) {
      return NextResponse.json({ error: 'ใช้โควตาอัปโหลดของวันนี้ครบแล้ว กลับมาใหม่พรุ่งนี้นะ', code: 'LIMIT' }, { status: 403 })
    }

    const path = `${user.id}/${crypto.randomUUID()}.${EXT[file.type]}`
    const { error: storageError } = await supabase.storage.from('documents').upload(path, file, { contentType: file.type })
    if (storageError) throw storageError

    const { data: doc, error: docError } = await supabase
      .from('documents')
      .insert({ user_id: user.id, title: file.name.slice(0, 200), file_url: path, file_type: file.type, content: null })
      .select()
      .single()
    if (docError) throw docError

    await recordUsage(user.id, 'upload')

    // Runs after the response is sent (kept alive by the platform up to maxDuration).
    // Uses the admin client because the user session cookie isn't reliable here.
    const admin = createAdminClient()
    after(async () => {
      try {
        const text = await extractTextFromFile(file)
        await admin
          .from('documents')
          .update({ content: text || 'ERROR: ไม่สามารถอ่านข้อความจากไฟล์นี้ได้' })
          .eq('id', doc.id)
          .eq('user_id', user.id)
      } catch (err: any) {
        console.error('Extraction error:', err)
        await admin.from('documents').update({ content: `ERROR: ${err.message || 'processing failed'}` }).eq('id', doc.id)
      }
    })

    return NextResponse.json({ success: true, document: doc })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'อัปโหลดไม่สำเร็จ กรุณาลองใหม่' }, { status: 500 })
  }
}
