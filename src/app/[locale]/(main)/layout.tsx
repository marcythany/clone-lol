import { redirect } from '@/i18n/routing'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen">
      {/* Aqui você pode adicionar Navbar, Sidebar, etc */}
      {children}
    </div>
  )
} 