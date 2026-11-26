import { login } from '../actions'
import AuthForm from '@/components/AuthForm'

export const metadata = { title: 'เข้าสู่ระบบ' }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const { message } = await searchParams
  return <AuthForm mode="login" action={login} message={message} />
}
