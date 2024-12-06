import { redirect } from '@/i18n/routing'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/play')
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      {children}
    </div>
  )
} 