import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Footer } from '@/components/footer'
import { GoogleAnalytics } from '@/components/google-analytics'
import { Header } from '@/components/header'
import { MobileCtaBar } from '@/components/mobile-cta-bar'
import { BUSINESS, MAPS_URL, SITE_URL } from '@/lib/business'
import { baseOpenGraph } from '@/lib/seo'

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['EducationalOrganization', 'LocalBusiness'],
  '@id': `${SITE_URL}/#organization`,
  name: BUSINESS.name,
  url: SITE_URL,
  logo: `${SITE_URL}/ahmedprep-logo.png`,
  image: `${SITE_URL}/ahmedprep-hero.png`,
  description: 'SHSAT and Digital SAT preparation in Astoria, Queens for students across New York City, led by Tariq Ahmed.',
  telephone: BUSINESS.phoneE164,
  email: BUSINESS.email,
  hasMap: MAPS_URL,
  founder: { '@type': 'Person', name: 'Tariq Ahmed', jobTitle: 'Founder & Lead Instructor' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS.address.street,
    addressLocality: BUSINESS.address.city,
    addressRegion: BUSINESS.address.region,
    postalCode: BUSINESS.address.postalCode,
    addressCountry: BUSINESS.address.country,
  },
  areaServed: [
    { '@type': 'Place', name: 'Astoria, Queens' },
    { '@type': 'Place', name: 'Queens, NY' },
    { '@type': 'City', name: 'New York City' },
  ],
  knowsAbout: ['SHSAT preparation', 'Digital SAT preparation', 'Test preparation'],
}

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'SHSAT & Digital SAT Prep in Astoria, Queens | AhmedPrep',
    template: '%s | AhmedPrep',
  },
  description:
    'Personalized SHSAT and Digital SAT preparation in Astoria, Queens for students across NYC. Book a free diagnostic with AhmedPrep.',
  keywords: [
    'SHSAT prep Queens',
    'SHSAT tutoring Astoria',
    'SHSAT prep NYC',
    'Digital SAT prep Queens',
    'SAT tutoring Astoria',
    'Digital SAT prep NYC',
    'test prep Astoria Queens',
  ],
  openGraph: baseOpenGraph,
  other: {
    'business:contact_data:street_address': BUSINESS.address.street,
    'business:contact_data:locality': BUSINESS.address.city,
    'business:contact_data:region': BUSINESS.address.region,
    'business:contact_data:postal_code': BUSINESS.address.postalCode,
    'business:contact_data:country_name': 'United States',
    'business:contact_data:phone_number': BUSINESS.phoneE164,
  },
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' }],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#08264a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileCtaBar />
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <GoogleAnalytics />
      </body>
    </html>
  )
}
