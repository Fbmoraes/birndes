"use client"

import { useEffect } from 'react'
import { useStore } from '@/lib/store-new'
import Script from 'next/script'

export function AnalyticsScripts() {
  const { settings } = useStore()

  useEffect(() => {
    // Configurar Google Analytics se o ID estiver disponível
    if (settings.googleAnalyticsId && typeof window !== 'undefined') {
      // @ts-ignore
      window.gtag = window.gtag || function() {
        // @ts-ignore
        (window.dataLayer = window.dataLayer || []).push(arguments)
      }
      // @ts-ignore
      window.gtag('js', new Date())
      // @ts-ignore
      window.gtag('config', settings.googleAnalyticsId)
    }

    // Configurar Facebook Pixel se o ID estiver disponível
    if (settings.facebookPixelId && typeof window !== 'undefined') {
      // @ts-ignore
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      // @ts-ignore
      window.fbq('init', settings.facebookPixelId)
      // @ts-ignore
      window.fbq('track', 'PageView')
    }
  }, [settings.googleAnalyticsId, settings.facebookPixelId])

  return (
    <>
      {/* Google Analytics */}
      {settings.googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${settings.googleAnalyticsId}');
            `}
          </Script>
        </>
      )}

      {/* Facebook Pixel */}
      {settings.facebookPixelId && (
        <>
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${settings.facebookPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img 
              height="1" 
              width="1" 
              style={{display: 'none'}}
              src={`https://www.facebook.com/tr?id=${settings.facebookPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* Google Search Console verification */}
      {settings.googleSearchConsoleId && (
        <meta name="google-site-verification" content={settings.googleSearchConsoleId} />
      )}
    </>
  )
}