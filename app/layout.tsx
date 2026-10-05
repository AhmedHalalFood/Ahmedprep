import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { BUSINESS } from '@/lib/business'

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: BUSINESS.name,
  description: 'SHSAT tutoring and Digital SAT preparation for New York students, led by Tariq Ahmed.',
  telephone: BUSINESS.phoneE164,
  email: BUSINESS.email,
  founder: { '@type': 'Person', name: 'Tariq Ahmed' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS.address.street,
    addressLocality: BUSINESS.address.city,
    addressRegion: BUSINESS.address.region,
    postalCode: BUSINESS.address.postalCode,
    addressCountry: BUSINESS.address.country,
  },
  areaServed: 'New York City',
}

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: 'AhmedPrep | SHSAT & Digital SAT Prep in NYC',
  description: 'Specialized SHSAT tutoring and Digital SAT preparation for ambitious New York students, led by Tariq Ahmed.',
  keywords: ['SHSAT tutoring NYC', 'SHSAT prep NYC', 'SHSAT tutor', 'Digital SAT tutoring NYC', 'SAT prep NYC', 'Digital SAT tutor NYC', 'NYC test prep'],
  openGraph: {
    title: 'AhmedPrep | SHSAT & Digital SAT Prep in NYC',
    description: 'Specialized preparation for ambitious New York students.',
    type: 'website',
  },
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
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
