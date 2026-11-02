import type { Metadata } from 'next';
import './globals.css';

const appUrl = process.env.APP_URL || 'https://wholdings.pk';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: 'Wholdings — Luxury Mountain Real Estate',
    template: '%s | Wholdings',
  },
  description:
    'Discover luxury mountain villas, wooden cottages, alpine apartments, and investment opportunities with Wholdings.',
  icons: {
    icon: '/assets/wholdings-logo.png',
    apple: '/assets/wholdings-logo.png',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Wholdings — Luxury Mountain Real Estate',
    description:
      'Discover luxury mountain villas, wooden cottages, alpine apartments, and investment opportunities with Wholdings.',
    url: appUrl,
    siteName: 'Wholdings',
    type: 'website',
    locale: 'en_PK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wholdings — Discover Luxury Above the Clouds',
    description:
      'Explore mountain villas, cedar cottages, apartments, and real estate investments with Wholdings.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Wholdings',
    slogan: 'Discover Luxury Above the Clouds.',
    description:
      'Luxury mountain real estate discovery, private villas, wooden cottages, and investment advisory with Wholdings.',
    url: appUrl,
    areaServed: [
      'Wholdings',
      'Dunga Gali',
      'Ayubia',
      'Changla Gali',
      'Khanspur',
      'Bara Gali',
    ],
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="bg-[#101614] text-[#DCE5E0] antialiased selection:bg-[#C7A66A] selection:text-[#101614]">
        {children}
      </body>
    </html>
  );
}
