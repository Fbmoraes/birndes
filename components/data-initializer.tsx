"use client"

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store-new'
import { initializePersistence } from '@/lib/persistence-config'

export function DataInitializer({ children }: { children: React.ReactNode }) {
  const { fetchData, checkAuth } = useStore()
  const [isInitializing, setIsInitializing] = useState(true)
  const [initError, setInitError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize data on app start - only run once
    const initialize = async () => {
      try {
        setIsInitializing(true)
        setInitError(null)
        
        // Inicializar sistema de persistência
        initializePersistence()
        
        await Promise.all([
          fetchData().catch(err => {
            console.warn('Failed to fetch data:', err)
            // Don't throw, just log the warning
          }),
          checkAuth().catch(err => {
            console.warn('Failed to check auth:', err)
            // Don't throw, just log the warning
          })
        ])
        
        console.log('Data initialization completed')
      } catch (error) {
        console.error('Failed to initialize data:', error)
        setInitError(error instanceof Error ? error.message : 'Initialization failed')
      } finally {
        setIsInitializing(false)
      }
    }

    initialize()
  }, []) // Empty dependency array - only run once on mount

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    )
  }

  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️ Erro ao carregar dados</div>
          <p className="text-gray-600 mb-4">{initError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}