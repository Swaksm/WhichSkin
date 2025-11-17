'use client'

import { ReactNode, useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

export default function AppWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 20
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => setProgress(100), 100)
        }
        return Math.min(next, 100)
      })
    }, 30)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  // Si la route n'existe pas, déclenche une 404
  if (!children) {
    notFound()
  }

  if (progress < 100) {
    return (
      <div
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
        }}
        className="fixed inset-0 flex flex-col items-center justify-center z-50"
      >
        <h1 style={{ color: 'var(--accent)' }} className="text-4xl font-bold mb-6">
          WhichSkin
        </h1>
        <div
          style={{ backgroundColor: 'var(--background-secondary)' }}
          className="w-64 h-4 rounded overflow-hidden border border-var(--border)"
        >
          <div
            style={{
              width: `${progress}%`,
              backgroundColor: 'var(--accent-dark)',
            }}
            className="h-full transition-all duration-150"
          />
        </div>
        <p style={{ color: 'var(--foreground-secondary)' }} className="mt-4">
          Chargement {Math.round(progress)}%
        </p>
      </div>
    )
  }

  return <>{children}</>
}
