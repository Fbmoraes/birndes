"use client"

import { useEffect } from 'react'
import Script from 'next/script'

interface GoogleAnalyticsProps {
  gaId: string
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  useEffect(() => {
    if (gaId && typeof window !== 'undefined') {
      // Initialize dataLayer
      window.dataLayer = window.dataLayer || []
      
      // Define gtag function
      function gtag(...args: any[]) {
        window.dataLayer.push(args)
      }
      
      // Make gtag available globally
      ;(window as any).gtag = gtag
      
      // Initialize gtag
      gtag('js', new Date())
      gtag('config', gaId)
      
      console.log('Google Analytics initialized with ID:', gaId)
    }
  }, [gaId])

  if (!gaId) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}

// Hook para tracking de eventos
export function useGoogleAnalytics() {
  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  }

  const trackPurchase = (transactionId: string, value: number, items: any[]) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: value,
        currency: 'BRL',
        items: items,
      })
    }
  }

  const trackPageView = (pagePath: string, pageTitle?: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: pagePath,
        page_title: pageTitle,
      })
    }
  }

  return {
    trackEvent,
    trackPurchase,
    trackPageView,
  }
}