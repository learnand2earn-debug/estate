import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || 'https://galiyat-estates.example.com';
  const staticRoutes = [
    '',
    '/properties',
    '/locations',
    '/explore',
    '/gallery',
    '/investment',
    '/about',
    '/contact',
    '/admin',
    '/privacy',
    '/terms',
  ];

  const locationSlugs = [
    'wholdings',
    'dunga-gali',
    'ayubia',
    'changla-gali',
    'khanspur',
    'bara-gali',
  ];

  const propertySlugs = [
    'governors-ridge-sovereign-villa',
    'deodar-mist-alpine-cottage',
    'cloudline-penthouse-residences',
    'changla-summit-glass-house',
    'khanspur-snowline-estate-plot',
    'ayubia-promenade-commercial-plaza',
    'bara-gali-heritage-retreat-hotel',
    'pipeline-trail-cedar-sanctuary',
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : 0.8,
    })),
    ...locationSlugs.map((slug) => ({
      url: `${baseUrl}/locations/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    })),
    ...propertySlugs.map((slug) => ({
      url: `${baseUrl}/properties/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    })),
  ];
}
