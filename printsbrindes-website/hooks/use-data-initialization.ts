"use client"

import { useEffect } from 'react'
import { useStore } from '@/lib/store-new'

export function useDataInitialization() {
  const { fetchData, checkAuth, isLoading } = useStore()

  useEffect(() => {
    // Initialize data and auth on app start
    const initialize = async () => {
      await Promise.all([
        fetchData(),
        checkAuth(),
      ])
    }

    initialize()
  }, [fetchData, checkAuth])

  return { isLoading }
}

