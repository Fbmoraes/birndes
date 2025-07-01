"use client"

import { useEffect, useState } from 'react'
import { GoogleAnalytics } from './google-analytics'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [analyticsId, setAnalyticsId] = useState<string>('G-PS2KYDM9N0') // Default ID provided

  useEffect(() => {
    // Fetch analytics configuration from settings
    const fetchAnalyticsConfig = async () => {
      try {
        const response = await fetch('/api/store')
        const data = await response.json()
        
        // Use the configured analytics ID or fall back to default
        const configuredId = data.settings?.analytics?.googleAnalytics || 
                           data.settings?.seo?.googleAnalyticsId ||
                           'G-PS2KYDM9N0'
        
        setAnalyticsId(configuredId)
        console.log('Analytics ID loaded:', configuredId)
      } catch (error) {
        console.log('Could not load analytics config, using default:', error)
        // Keep default ID if fetch fails
      }
    }

    fetchAnalyticsConfig()
  }, [])

  return (
    <>
      <GoogleAnalytics gaId={analyticsId} />
      {children}
    </>
  )
}