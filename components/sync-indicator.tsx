"use client"

import { useEffect, useState } from 'react'
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'

interface SyncIndicatorProps {
  isVisible: boolean
  status: 'syncing' | 'success' | 'error'
  message?: string
}

export function SyncIndicator({ isVisible, status, message }: SyncIndicatorProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShow(true)
      if (status === 'success') {
        const timer = setTimeout(() => setShow(false), 3000)
        return () => clearTimeout(timer)
      }
    } else {
      setShow(false)
    }
  }, [isVisible, status])

  if (!show) return null

  const getIcon = () => {
    switch (status) {
      case 'syncing':
        return <RefreshCw className="w-4 h-4 animate-spin" />
      case 'success':
        return <CheckCircle className="w-4 h-4" />
      case 'error':
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getColors = () => {
    switch (status) {
      case 'syncing':
        return 'bg-blue-500 text-white'
      case 'success':
        return 'bg-green-500 text-white'
      case 'error':
        return 'bg-red-500 text-white'
    }
  }

  const getMessage = () => {
    if (message) return message
    
    switch (status) {
      case 'syncing':
        return 'Sincronizando dados...'
      case 'success':
        return 'Dados sincronizados!'
      case 'error':
        return 'Erro na sincronização'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
      <div className={`${getColors()} px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2`}>
        {getIcon()}
        <span className="text-sm font-medium">{getMessage()}</span>
      </div>
    </div>
  )
}