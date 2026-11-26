import { signup } from '../actions'
import AuthForm from '@/components/AuthForm'

export const metadata = { title: 'สมัครสมาชิก' }

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const { message } = await searchParams
  return <AuthForm mode="register" action={signup} message={message} />
}
