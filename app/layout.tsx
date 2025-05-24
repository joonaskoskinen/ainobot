import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Aino AI - Älykäs Chatbot Suomalaisille Yrityksille | 24/7 Asiakaspalvelu",
  description:
    "Automatisoi asiakaspalvelu Aino AI chatbotilla. Säästä 75% kustannuksista, paranna asiakaskokemusta ja kasvata myyntiä. Suomalainen ratkaisu, GDPR-yhteensopiva. Ilmainen demo!",
  keywords: [
    "chatbot",
    "AI chatbot",
    "asiakaspalvelu",
    "tekoäly",
    "automatisaatio",
    "suomalainen chatbot",
    "Aino AI",
    "24/7 asiakaspalvelu",
    "GDPR chatbot",
    "myynti chatbot",
  ],
  authors: [{ name: "Aino AI" }],
  creator: "Aino AI",
  publisher: "Aino AI",
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
    locale: "fi_FI",
    url: "https://ainochatbot.com",
    title: "Aino AI - Älykäs Chatbot Suomalaisille Yrityksille",
    description:
      "Automatisoi asiakaspalvelu Aino AI chatbotilla. Säästä 75% kustannuksista ja paranna asiakaskokemusta.",
    siteName: "Aino AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aino AI - Suomalainen Chatbot-ratkaisu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aino AI - Älykäs Chatbot Suomalaisille Yrityksille",
    description:
      "Automatisoi asiakaspalvelu Aino AI chatbotilla. Säästä 75% kustannuksista ja paranna asiakaskokemusta.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://ainochatbot.com",
    languages: {
      "fi-FI": "https://ainochatbot.com",
      "en-US": "https://ainochatbot.com/en",
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fi" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#1e293b" />
        <meta name="color-scheme" content="dark" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Aino AI",
              description: "Älykäs chatbot-ratkaisu suomalaisille yrityksille",
              url: "https://ainochatbot.com",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "149",
                priceCurrency: "EUR",
                priceValidUntil: "2025-12-31",
              },
              provider: {
                "@type": "Organization",
                name: "Aino AI",
                url: "https://ainochatbot.com",
                contactPoint: {
                  "@type": "ContactPoint",
                  email: "ainochatbot@gmail.com",
                  contactType: "customer service",
                  areaServed: "FI",
                  availableLanguage: "Finnish",
                },
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "127",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        <div id="root">{children}</div>
        <div id="portal-root"></div>
      </body>
    </html>
  )
}
