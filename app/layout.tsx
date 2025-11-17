import './globals.css'
import { ReactNode } from 'react'
import Sidebar from './components/sidebar'
import AppWrapper from './components/loading'

export const metadata = {
  title: 'WhichSkin',
  description: 'Application Esport',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="h-screen bg-gray-100">
        <AppWrapper>
          <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Contenu principal */}
            <main className="flex-1 p-6 overflow-auto">
              {children}
            </main>
          </div>
        </AppWrapper>
      </body>
    </html>
  )
}
