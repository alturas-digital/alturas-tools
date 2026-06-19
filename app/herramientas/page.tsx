import Link from 'next/link'
import type { Metadata } from 'next'
import { Zap, Globe, ArrowRight, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Herramientas gratuitas para operadores turísticos | Alturas Digital',
  description: 'Diagnóstico de presencia digital y análisis de velocidad web: herramientas gratuitas creadas por Alturas Digital para operadores turísticos.',
}

const TOOLS = [
  {
    icon: Zap,
    name: 'Diagnóstico de Presencia Digital',
    desc: 'Analizamos tu presencia digital en 60 segundos: velocidad web, Google Maps, reseñas, redes sociales y sistema de reservas. Obtenés un score y tus 3 prioridades concretas.',
    href: 'https://tools.alturas-digital.com/diagnostico',
    cta: 'Hacer el diagnóstico',
    badge: 'Más completo',
  },
  {
    icon: Globe,
    name: 'Análisis de Velocidad Web',
    desc: 'Medimos la velocidad de tu sitio en mobile y desktop con datos reales de Google PageSpeed. Sabés en 60 segundos si tu sitio está perdiendo clientes por lentitud.',
    href: 'https://tools.alturas-digital.com/velocidad',
    cta: 'Analizar mi velocidad',
    badge: 'Rápido',
  },
]

export default function HerramientasPage() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="border-b border-border/60 bg-bg/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-white hover:text-teal transition-colors">
            Alturas Digital Tools
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/herramientas" className="text-xs text-teal font-medium">
              Herramientas
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-14">
        {/* Header */}
        <div className="mb-12 text-center max-w-xl mx-auto">
          <span className="inline-block text-xs font-semibold text-teal uppercase tracking-widest mb-3">Herramientas gratuitas</span>
          <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight">
            Diagnosticá tu presencia digital
          </h1>
          <p className="text-gray-400 text-base">
            Herramientas gratuitas de Alturas Digital para operadores turísticos. Sin registro, sin tarjeta de crédito.
          </p>
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {TOOLS.map((tool) => {
            const Icon = tool.icon
            return (
              <div
                key={tool.name}
                className="bg-surface border border-border rounded-2xl p-7 flex flex-col relative overflow-hidden"
              >
                {/* Badge */}
                <span className="absolute top-5 right-5 text-xs font-medium text-teal bg-teal/10 border border-teal/20 rounded-full px-2.5 py-0.5">
                  {tool.badge}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center mb-5">
                  <Icon size={22} className="text-teal" />
                </div>

                {/* Content */}
                <h2 className="text-lg font-bold mb-2">{tool.name}</h2>
                <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-6">{tool.desc}</p>

                {/* CTA */}
                <a
                  href={tool.href}
                  className="inline-flex items-center justify-center gap-2 bg-teal hover:opacity-90 text-bg font-bold text-sm py-3 px-5 rounded-xl transition-opacity"
                >
                  {tool.cta}
                  <ArrowRight size={15} />
                </a>
              </div>
            )
          })}
        </div>

        {/* About */}
        <div className="mt-16 text-center max-w-lg mx-auto">
          <p className="text-sm text-gray-500 leading-relaxed">
            Estas herramientas son un producto gratuito de{' '}
            <a href="https://alturas-digital.com" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">
              Alturas Digital
            </a>
            , agencia de marketing digital especializada exclusivamente en turismo. Las creamos para ayudar a los operadores turísticos a entender su situación digital antes de cualquier conversación comercial.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border/40 text-center">
          <p className="text-gray-600 text-xs">
            © 2025{' '}
            <a href="https://alturas-digital.com" target="_blank" rel="noopener noreferrer" className="text-teal/70 hover:text-teal transition-colors">
              Alturas Digital
            </a>{' '}
            · Agencia de marketing digital especializada en turismo
          </p>
        </div>
      </div>
    </main>
  )
}
