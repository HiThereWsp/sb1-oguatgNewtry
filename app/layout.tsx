import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SupabaseProvider } from '@/lib/supabase/context'
import UserMenu from '@/components/auth/UserMenu'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pedagoia - Assistant IA pour Enseignants',
  description: 'Plateforme innovante d\'outils pédagogiques propulsée par l\'IA pour les enseignants',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <SupabaseProvider>
          <div className="min-h-screen flex flex-col">
            <header className="border-b">
              <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
                <h1 className="text-xl font-bold">Pedagoia</h1>
                <UserMenu />
              </div>
            </header>
            <main className="flex-1">
              {children}
            </main>
          </div>
        </SupabaseProvider>
      </body>
    </html>
  )
}