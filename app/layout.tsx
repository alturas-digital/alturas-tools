import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Diagnóstico de Presencia Digital Turística | Alturas Digital',
  description:
    'Analizá tu presencia digital en 60 segundos y descubrí exactamente qué estás perdiendo. Velocidad web, Google Maps, reseñas, redes sociales y más. Gratis.',
  metadataBase: new URL('https://tools.alturas-digital.com'),
  openGraph: {
    title: '¿Tu negocio turístico aparece cuando tus clientes te buscan?',
    description:
      'Analizamos tu presencia digital en 60 segundos y te decimos exactamente qué estás perdiendo. Gratis.',
    url: 'https://tools.alturas-digital.com',
    siteName: 'Alturas Digital',
    locale: 'es_AR',
    type: 'website',
    images: [
      {
        url: '/og-image.png', // TODO sesión 2: crear imagen OG real (1200x630)
        width: 1200,
        height: 630,
        alt: 'Diagnóstico de Presencia Digital Turística — Alturas Digital',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '¿Tu negocio turístico aparece cuando tus clientes te buscan?',
    description: 'Analizamos tu presencia digital en 60 segundos. Gratis.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-white font-sans antialiased">{children}</body>
    </html>
  )
}
