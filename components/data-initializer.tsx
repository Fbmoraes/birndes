"use client"

import { useEffect } from 'react'
import { useStore } from '@/lib/store-new'

export function DataInitializer({ children }: { children: React.ReactNode }) {
  const { fetchData, checkAuth, isLoading } = useStore()

  useEffect(() => {
    // Initialize data on app start
    const initialize = async () => {
      try {
        await fetchData()
        await checkAuth()
      } catch (error) {
        console.error('Failed to initialize data:', error)
      }
    }

    initialize()
  }, [fetchData, checkAuth])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}