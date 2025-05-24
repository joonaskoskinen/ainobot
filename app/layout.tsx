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
  title: "AinoBot - 24/7 Asiakaspalvelu Automaatio",
  description:
    "🤖 Aino AI - Suomalainen chatbot-ratkaisu yrityksille. Säästä 75% asiakaspalvelukustannuksista, paranna asiakaskokemusta ja kasvata myyntiä. ✅ GDPR-yhteensopiva ✅ Ilmainen demo ✅ 24/7 tuki",
  keywords: [
    // Pääkeywordit
    "chatbot suomi",
    "AI chatbot suomeksi",
    "asiakaspalvelu chatbot",
    "chatbot yritys",
    "Aino AI",

    // Pitkähäntäkeywordit
    "automaattinen asiakaspalvelu",
    "tekoäly asiakaspalvelu",
    "chatbot integraatio",
    "suomalainen chatbot ratkaisu",
    "24/7 asiakaspalvelu automaatio",

    // Toimialakohtaiset
    "verkkokauppa chatbot",
    "ravintola chatbot",
    "kiinteistö chatbot",
    "pankki chatbot",
    "terveydenhuolto chatbot",

    // Tekniset termit
    "GDPR chatbot",
    "AI customer service",
    "conversational AI",
    "natural language processing suomi",
  ],
  authors: [{ name: "Aino AI", url: "https://ainochatbot.com" }],
  creator: "Aino AI - Suomalainen AI-ratkaisu",
  publisher: "Aino AI Oy",
  category: "Technology",
  classification: "Business Software",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fi_FI",
    url: "https://ainochatbot.com",
    title: "Aino AI - Suomen Paras Chatbot | Säästä 75% Asiakaspalvelukustannuksista",
    description:
      "🚀 Suomalainen AI-chatbot joka mullistaa asiakaspalvelusi. ✅ 24/7 automaatio ✅ GDPR-yhteensopiva ✅ Ilmainen demo. Yli 500 yritystä luottaa Aino AI:hin!",
    siteName: "Aino AI - Suomalainen Chatbot",
    images: [
      {
        url: "/og-image-main.jpg",
        width: 1200,
        height: 630,
        alt: "Aino AI - Suomalainen chatbot-ratkaisu yrityksille",
        type: "image/jpeg",
      },
      {
        url: "/og-image-demo.jpg",
        width: 1200,
        height: 630,
        alt: "Aino AI chatbot demo - Kokeile ilmaiseksi",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@AinoAI",
    creator: "@AinoAI",
    title: "Aino AI - Suomen Paras Chatbot | 24/7 Asiakaspalvelu",
    description:
      "🤖 Suomalainen AI-chatbot. Säästä 75% kustannuksista, paranna asiakaskokemusta. Ilmainen demo! #ChatbotSuomi #TekoälyAsiakaspalvelu",
    images: ["/twitter-card.jpg"],
  },
  alternates: {
    canonical: "https://ainochatbot.com",
    languages: {
      "fi-FI": "https://ainochatbot.com",
      "en-US": "https://ainochatbot.com/en",
      "sv-SE": "https://ainochatbot.com/sv",
    },
  },
  verification: {
    google: "your-google-search-console-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
    other: {
      "msvalidate.01": "your-bing-verification-code",
    },
  },
  generator: "Aino AI v2.0",
  applicationName: "Aino AI Chatbot",
  referrer: "origin-when-cross-origin",
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b82f6" },
    { media: "(prefers-color-scheme: dark)", color: "#1e293b" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  appleWebApp: {
    capable: true,
    title: "Aino AI",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false,
  },
  abstract:
    "Aino AI on Suomen johtava chatbot-ratkaisu yrityksille. Automatisoi asiakaspalvelu, säästä kustannuksia ja paranna asiakaskokemusta 24/7 AI-chatbotilla.",
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
              description:
                "Suomalainen AI-chatbot-ratkaisu yrityksille. Automatisoi asiakaspalvelu ja paranna asiakaskokemusta.",
              url: "https://ainochatbot.com",
              applicationCategory: "BusinessApplication",
              applicationSubCategory: "Customer Service Software",
              operatingSystem: "Web, iOS, Android",
              softwareVersion: "2.0",
              datePublished: "2024-01-01",
              dateModified: new Date().toISOString(),
              inLanguage: ["fi", "en", "sv"],
              isAccessibleForFree: true,
              offers: [
                {
                  "@type": "Offer",
                  name: "Starter Plan",
                  price: "149",
                  priceCurrency: "EUR",
                  billingDuration: "P1M",
                  description: "Perusratkaisu pienille yrityksille",
                  priceValidUntil: "2025-12-31",
                },
                {
                  "@type": "Offer",
                  name: "Pro Plan",
                  price: "299",
                  priceCurrency: "EUR",
                  billingDuration: "P1M",
                  description: "Edistynyt ratkaisu kasvuyrityksille",
                  priceValidUntil: "2025-12-31",
                },
                {
                  "@type": "Offer",
                  name: "Enterprise Plan",
                  price: "599",
                  priceCurrency: "EUR",
                  billingDuration: "P1M",
                  description: "Täyden palvelun ratkaisu suuryrityksille",
                  priceValidUntil: "2025-12-31",
                },
              ],
              provider: {
                "@type": "Organization",
                name: "Aino AI Oy",
                url: "https://ainochatbot.com",
                logo: "https://ainochatbot.com/logo.png",
                sameAs: [
                  "https://linkedin.com/company/aino-ai",
                  "https://twitter.com/AinoAI",
                  "https://facebook.com/AinoAI",
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  email: "info@ainochatbot.com",
                  telephone: "+358-40-123-4567",
                  contactType: "customer service",
                  areaServed: ["FI", "SE", "NO", "DK"],
                  availableLanguage: ["Finnish", "English", "Swedish"],
                  hoursAvailable: {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                    opens: "00:00",
                    closes: "23:59",
                  },
                },
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Mannerheimintie 12",
                  addressLocality: "Helsinki",
                  postalCode: "00100",
                  addressCountry: "FI",
                },
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "247",
                bestRating: "5",
                worstRating: "1",
              },
              review: [
                {
                  "@type": "Review",
                  author: {
                    "@type": "Person",
                    name: "Maria Virtanen",
                  },
                  reviewRating: {
                    "@type": "Rating",
                    ratingValue: "5",
                  },
                  reviewBody: "Aino AI vähensi asiakaspalvelun työmäärää 75%. ROI saavutettiin 2 kuukaudessa!",
                },
              ],
              featureList: [
                "24/7 automaattinen asiakaspalvelu",
                "Suomenkielinen tuki",
                "GDPR-yhteensopiva",
                "CRM-integraatiot",
                "Reaaliaikainen analytiikka",
                "Helppo käyttöönotto",
              ],
              screenshot: "https://ainochatbot.com/screenshot.jpg",
              softwareHelp: "https://ainochatbot.com/help",
              downloadUrl: "https://ainochatbot.com/download",
              installUrl: "https://ainochatbot.com/install",
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
