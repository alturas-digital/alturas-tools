'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  MapPin,
  Globe,
  Star,
  Users,
  Zap,
  Shield,
  Smartphone,
  Calendar,
  ChevronDown,
} from 'lucide-react'

// ── Schema JSON-LD ────────────────────────────────────────────────────────────

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Diagnóstico de Presencia Digital Turística',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'Herramienta gratuita para operadores turísticos. Analizá tu presencia digital en 60 segundos: velocidad web, Google Maps, reseñas, redes sociales y sistema de reservas.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'ARS',
  },
  provider: {
    '@type': 'Organization',
    name: 'Alturas Digital',
    url: 'https://alturas-digital.com',
  },
  url: 'https://tools.alturas-digital.com',
}

// ── Datos de las secciones SEO ────────────────────────────────────────────────

const ANALYSIS_POINTS = [
  {
    icon: Globe,
    title: 'Velocidad web',
    desc: 'Medimos cuánto tarda en cargar tu sitio en mobile con PageSpeed Insights de Google. Cada segundo de demora te cuesta reservas.',
  },
  {
    icon: MapPin,
    title: 'Presencia en Google Maps',
    desc: 'Verificamos si tu negocio aparece cuando alguien busca experiencias turísticas en tu zona y con qué posición.',
  },
  {
    icon: Star,
    title: 'Reseñas online',
    desc: 'Evaluamos la cantidad y calidad de tus reseñas en Google. Los viajeros las leen antes de decidir con quién reservar.',
  },
  {
    icon: Smartphone,
    title: 'Redes sociales',
    desc: 'Analizamos si publicás contenido con la frecuencia que el algoritmo necesita para darte alcance orgánico.',
  },
  {
    icon: Calendar,
    title: 'Sistema de reservas',
    desc: 'Revisamos si tus clientes pueden reservar online las 24 horas, sin necesidad de llamarte o esperar respuesta.',
  },
]

const FAQS = [
  {
    q: '¿Es gratis este diagnóstico?',
    a: 'Sí, completamente gratis. No requiere tarjeta de crédito ni registro previo. Alturas Digital lo ofrece sin costo como herramienta de diagnóstico para operadores turísticos de habla hispana.',
  },
  {
    q: '¿Cuánto tiempo toma completarlo?',
    a: 'Aproximadamente 60 segundos. Completás un formulario corto con los datos de tu negocio y respondés 6 preguntas sobre tu presencia digital actual. El análisis es inmediato.',
  },
  {
    q: '¿Qué hago con los resultados?',
    a: 'Recibís un score de 0 a 100 y tus 3 prioridades concretas — los puntos que más impacto tienen en tus reservas. Podés trabajarlos por tu cuenta o contactarnos para que los resolvamos juntos.',
  },
  {
    q: '¿Quién está detrás de esta herramienta?',
    a: '',
    custom: true,
  },
]

// ── Componente Hero ───────────────────────────────────────────────────────────

function HeroContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const src = searchParams.get('src') ?? ''

  const [form, setForm] = useState({
    businessName: '',
    websiteUrl: '',
    googleMapsName: '',
    location: '',
    email: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    if (src) localStorage.setItem('diagnostico_src', src)
  }, [src])

  function validate() {
    const e: Record<string, string> = {}
    if (!form.businessName.trim()) e.businessName = 'El nombre del negocio es requerido'
    if (!form.email.trim()) e.email = 'El email es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    localStorage.setItem('diagnostico_form', JSON.stringify(form))
    router.push('/diagnostico')
  }

  return (
    <>
      {/* Schema JSON-LD — leído por Google para rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      <main className="bg-bg">

        {/* ── Hero (sin cambios) ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-teal/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-32 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative max-w-2xl mx-auto px-4 pt-16 pb-24">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex justify-center mb-8"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal/30 bg-teal/10 text-teal text-xs font-medium">
                <Zap size={12} />
                Herramienta gratuita de Alturas Digital
              </span>
            </motion.div>

            {/* Contexto de origen */}
            {src && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-6 p-3 rounded-xl border border-teal/20 bg-teal/5 text-center"
              >
                <p className="text-sm text-teal/90">
                  Vas a ver qué tan rápido es tu sitio — y también otros puntos clave
                  que Google mira para mostrarte primero.
                </p>
              </motion.div>
            )}

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-center mb-4"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
                ¿Tu negocio turístico aparece{' '}
                <span className="text-teal">cuando tus clientes</span> te buscan?
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-center text-gray-400 text-lg mb-10 leading-relaxed"
            >
              Analizamos tu presencia digital en 60 segundos y te decimos
              exactamente qué estás perdiendo.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center gap-4 sm:gap-8 mb-10"
            >
              {[
                { icon: Users, label: '+200 operadores', sub: 'ya lo usaron' },
                { icon: Star,  label: '100% gratuito',   sub: 'sin tarjeta' },
                { icon: Zap,   label: '60 segundos',     sub: 'de análisis' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center min-w-0">
                  <div className="flex justify-center mb-1">
                    <Icon size={16} className="text-teal" />
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white">{label}</div>
                  <div className="text-xs text-gray-500">{sub}</div>
                </div>
              ))}
            </motion.div>

            {/* Formulario */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <form
                onSubmit={handleSubmit}
                className="bg-surface border border-border rounded-2xl p-6 md:p-8 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Nombre del negocio <span className="text-teal">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Aventura Patagónica Tours"
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    className={`w-full bg-bg border rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors focus:border-teal/60 ${
                      errors.businessName ? 'border-red-500/60' : 'border-border'
                    }`}
                  />
                  {errors.businessName && (
                    <p className="text-red-400 text-xs mt-1">{errors.businessName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    <Globe size={13} className="inline mr-1.5 text-gray-500" />
                    URL del sitio web{' '}
                    <span className="text-gray-500 text-xs font-normal">(opcional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://tu-sitio.com"
                    value={form.websiteUrl}
                    onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                    className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors focus:border-teal/60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    <MapPin size={13} className="inline mr-1.5 text-gray-500" />
                    Nombre en Google Maps{' '}
                    <span className="text-gray-500 text-xs font-normal">(para buscar reseñas)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Como aparece en Google Maps"
                    value={form.googleMapsName}
                    onChange={(e) => setForm({ ...form, googleMapsName: e.target.value })}
                    className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors focus:border-teal/60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    País / Ciudad
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Argentina, Bariloche"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors focus:border-teal/60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Email <span className="text-teal">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`w-full bg-bg border rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors focus:border-teal/60 ${
                      errors.email ? 'border-red-500/60' : 'border-border'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full mt-2 bg-teal hover:bg-teal-dark text-bg font-bold text-base py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                      Iniciando análisis...
                    </span>
                  ) : (
                    <>
                      Analizá mi negocio gratis
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>

                <p className="text-center text-gray-600 text-xs pt-1">
                  Más de 200 operadores turísticos ya lo usaron · 100% gratis
                </p>
              </form>
            </motion.div>

            {/* Footer del hero */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center text-gray-600 text-xs mt-8"
            >
              Una herramienta gratuita de{' '}
              <a
                href="https://alturas-digital.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal/70 hover:text-teal transition-colors"
              >
                Alturas Digital
              </a>{' '}
              · Agencia de marketing digital especializada en turismo
            </motion.p>
          </div>
        </section>

        {/* ── Sección 2: Por qué necesitás presencia digital ────────────── */}
        <section className="max-w-2xl mx-auto px-4 py-16 border-t border-border/40">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-snug">
            ¿Por qué tu negocio turístico necesita presencia digital fuerte?
          </h2>

          <div className="space-y-5 text-gray-400 leading-relaxed text-[15px]">
            <p>
              Antes de reservar un tour, una excursión o alojamiento, el viajero de hoy investiga
              online. Compara en Google, lee reseñas, mira fotos en Instagram, y decide si el
              sitio web le genera confianza. Todo eso ocurre antes del primer contacto con tu
              negocio. Y en ese proceso, muchos operadores turísticos pierden clientes sin
              siquiera saberlo.
            </p>

            <div>
              <h3 className="text-white font-semibold text-base mb-2">
                El turista digital toma decisiones antes de contactarte
              </h3>
              <p>
                El 80% de los viajeros usa internet para planificar su viaje. Buscan en Google
                "tours en [destino]", comparan los primeros resultados, leen las reseñas más
                recientes y eligen. Si tu negocio no aparece, si tu web tarda en cargar o si tenés
                pocas reseñas, no existís para ese potencial cliente — por más que hagas las
                mejores excursiones de la región.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base mb-2">
                Qué significa "presencia digital" para un operador turístico
              </h3>
              <p className="mb-3">
                No es solo tener redes sociales. Presencia digital es el conjunto de puntos de
                contacto que un cliente potencial puede encontrar sobre tu negocio online:
              </p>
              <ul className="space-y-2 pl-4">
                {[
                  'Tu sitio web: ¿carga en menos de 3 segundos en el celular? Google penaliza los sitios lentos y los turistas los abandonan. El 53% de los usuarios móviles se va si la página tarda más de 3 segundos.',
                  'Google Maps: ¿aparecés cuando alguien busca experiencias en tu zona? ¿Cuántas reseñas tenés y con qué puntaje?',
                  'Reseñas: un negocio con 15 reseñas a 4.5 pierde contra uno con 200 reseñas a 4.2. El volumen genera confianza.',
                  'Redes sociales: ¿publicás contenido regularmente? El algoritmo favorece a quienes son constantes.',
                  'Sistema de reservas: ¿pueden reservar tus clientes a las 11 de la noche sin llamarte? Si no, estás perdiendo reservas fuera de horario.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-teal mt-1 flex-shrink-0">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base mb-2">
                Por qué muchos operadores pierden reservas sin saberlo
              </h3>
              <p>
                El problema es que estas pérdidas son invisibles. No recibís una notificación que
                diga "perdiste 3 consultas hoy porque tu web tardó 8 segundos en cargar".
                Simplemente no llegan. Y mientras tanto, tu competidor con mejor presencia digital
                captura esas reservas. La buena noticia: la mayoría de estos problemas tienen
                solución concreta una vez que los identificás.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base mb-2">
                Cómo esta herramienta gratuita te ayuda a identificarlo
              </h3>
              <p>
                El Diagnóstico de Presencia Digital Turística evalúa los 5 puntos clave que
                determinan si tu negocio turístico atrae o pierde clientes online. En 60 segundos
                recibís un score personalizado y tus 3 prioridades concretas: lo primero que tenés
                que mejorar para empezar a capturar más reservas. Es gratuito, no requiere
                conocimientos técnicos, y fue diseñado específicamente para operadores turísticos
                — no para marketers.
              </p>
            </div>
          </div>
        </section>

        {/* ── Sección 3: Qué analiza la herramienta ────────────────────── */}
        <section className="border-t border-border/40 py-16">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Qué analiza esta herramienta
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Cinco dimensiones clave de tu presencia digital turística.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ANALYSIS_POINTS.map((point, i) => {
                const Icon = point.icon
                return (
                  <div
                    key={i}
                    className="bg-surface border border-border rounded-xl p-5 flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-teal/10 border border-teal/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-teal" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm mb-1">{point.title}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{point.desc}</p>
                    </div>
                  </div>
                )
              })}

              {/* Quinto punto ocupa full-width en mobile, normal en sm */}
            </div>
          </div>
        </section>

        {/* ── Sección 4: FAQ ─────────────────────────────────────────────── */}
        <section className="border-t border-border/40 py-16">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              Preguntas frecuentes
            </h2>

            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="border border-border rounded-xl overflow-hidden bg-surface"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-white hover:text-teal transition-colors"
                  >
                    <span>{faq.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0 ml-4"
                    >
                      <ChevronDown size={16} className="text-gray-500" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-sm text-gray-400 leading-relaxed border-t border-border/50 pt-3">
                          {faq.custom ? (
                            <p>
                              Alturas Digital, una agencia de marketing especializada en turismo.
                              Trabajamos con operadores turísticos de toda Latinoamérica ayudándolos
                              a mejorar su presencia digital y capturar más reservas online.{' '}
                              <a
                                href="https://alturas-digital.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal hover:underline"
                              >
                                Conocé más en alturas-digital.com
                              </a>
                            </p>
                          ) : (
                            <p>{faq.a}</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Quiénes somos ─────────────────────────────────────────────── */}
        <section className="border-t border-border/40 py-14">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-xl font-bold mb-4">¿Quién hizo esta herramienta?</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-lg mx-auto">
              Este diagnóstico es un producto gratuito de{' '}
              <a
                href="https://alturas-digital.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal hover:underline"
              >
                Alturas Digital
              </a>
              , agencia de marketing digital especializada exclusivamente en turismo. Trabajamos
              con operadores turísticos de toda Latinoamérica ayudándolos a mejorar su presencia
              online y capturar más reservas. Esta herramienta es nuestra forma de aportar valor
              a la industria antes de cualquier conversación comercial.
            </p>
          </div>
        </section>

        {/* ── Footer global ──────────────────────────────────────────────── */}
        <footer className="border-t border-border/40 py-8">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <p className="text-gray-600 text-xs">
              © 2025{' '}
              <a
                href="https://alturas-digital.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal/70 hover:text-teal transition-colors"
              >
                Alturas Digital
              </a>{' '}
              · Agencia de marketing digital especializada en turismo ·{' '}
              <a
                href="https://tools.alturas-digital.com/velocidad"
                className="text-gray-600 hover:text-gray-400 transition-colors"
              >
                Analizá tu velocidad
              </a>
            </p>
          </div>
        </footer>

      </main>
    </>
  )
}

export default function HomePage() {
  return (
    <Suspense>
      <HeroContent />
    </Suspense>
  )
}
