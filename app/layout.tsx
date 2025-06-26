import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { DataInitializer } from "@/components/data-initializer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://printsbrindes.com.br"),
  title: {
    default: "PrintsBrindes - Presentes e Artigos Personalizados",
    template: "%s | PrintsBrindes",
  },
  description:
    "Presentes e artigos para festas personalizados! Canecas, cadernos, bolos e muito mais, tudo personalizado do seu jeito! Localizada em Guaratiba, Rio de Janeiro.",
  keywords: [
    "presentes personalizados",
    "brindes personalizados",
    "festas infantis",
    "lembrancinhas de festa",
    "canecas personalizadas",
    "cadernos personalizados",
    "bolos personalizados",
    "relógios personalizados",
    "personalização",
    "Guaratiba",
    "Rio de Janeiro",
    "RJ",
    "festa",
    "aniversário",
    "casamento",
    "formatura",
  ],
  authors: [{ name: "PrintsBrindes", url: "https://printsbrindes.com.br" }],
  creator: "PrintsBrindes",
  publisher: "PrintsBrindes",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://printsbrindes.com.br",
    title: "PrintsBrindes - Presentes e Artigos Personalizados",
    description:
      "Presentes e artigos para festas personalizados! Canecas, cadernos, bolos e muito mais, tudo personalizado do seu jeito!",
    siteName: "PrintsBrindes",
    images: [
      {
        url: "/logo-og.png",
        width: 1200,
        height: 630,
        alt: "PrintsBrindes - Presentes Personalizados",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrintsBrindes - Presentes e Artigos Personalizados",
    description:
      "Presentes e artigos para festas personalizados! Canecas, cadernos, bolos e muito mais, tudo personalizado do seu jeito!",
    images: ["/logo-og.png"],
    creator: "@printsbrindes",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://printsbrindes.com.br",
  },
  verification: {
    google: "your-google-verification-code-here",
    yandex: "your-yandex-verification-code-here",
    yahoo: "your-yahoo-verification-code-here",
  },
  category: "shopping",
    generator: 'v0.dev'
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ec4899" },
    { media: "(prefers-color-scheme: dark)", color: "#ec4899" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec4899" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PrintsBrindes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#ec4899" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `,
          }}
        />

        {/* Google Search Console */}
        <meta name="google-site-verification" content="your-google-verification-code-here" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "PrintsBrindes",
              description: "Presentes e artigos para festas personalizados",
              url: "https://printsbrindes.com.br",
              telephone: "+55-21-99930-0409",
              email: "contato@printsbrindes.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Rua Goes e Vasconcellos 96",
                addressLocality: "Guaratiba",
                addressRegion: "RJ",
                postalCode: "23030-240",
                addressCountry: "BR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "-23.0731",
                longitude: "-43.5982",
              },
              openingHours: ["Mo-Fr 09:00-18:00", "Sa 09:00-15:00"],
              priceRange: "$",
              image: "https://printsbrindes.com.br/logo.png",
              sameAs: ["https://facebook.com/printsbrindes", "https://instagram.com/printsbrindes"],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <DataInitializer>
          {children}
        </DataInitializer>
      </body>
    </html>
  )
}
