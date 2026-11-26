'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

const msg = (path: string, m: string) => redirect(`${path}?message=${encodeURIComponent(m)}`)

export async function login(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get('email') || '').trim(),
    password: String(formData.get('password') || ''),
  })
  if (error) msg('/login', 'อีเมลหรือรหัสผ่านไม่ถูกต้อง')

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')
  if (password.length < 8) msg('/register', 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')

  const h = await headers()
  const origin = process.env.NEXT_PUBLIC_APP_URL || `${h.get('x-forwarded-proto') ?? 'https'}://${h.get('host')}`

  const { data, error } = await supabase.auth.signUp({
    email, password, options: { emailRedirectTo: `${origin}/auth/callback` },
  })
  if (error) msg('/register', error.message.includes('registered') ? 'อีเมลนี้ถูกใช้แล้ว' : 'สมัครสมาชิกไม่สำเร็จ ลองใหม่อีกครั้ง')

  // With email confirmation enabled there is no session yet.
  if (!data.session) msg('/login', 'สมัครสำเร็จ! กรุณายืนยันอีเมลของคุณ แล้วเข้าสู่ระบบ')

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
