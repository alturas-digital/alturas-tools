'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Globe, Star, Users, Zap } from 'lucide-react'

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

  // Guardar src en localStorage para persistirlo en todo el flujo
  useEffect(() => {
    if (src) {
      localStorage.setItem('diagnostico_src', src)
    }
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
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setSubmitting(true)
    // Guardar datos del formulario para el flujo
    localStorage.setItem('diagnostico_form', JSON.stringify(form))
    router.push('/diagnostico')
  }

  return (
    <main className="min-h-screen bg-bg relative overflow-hidden">
      {/* Glow de fondo */}
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

        {/* Contexto de origen (solo visible si viene del reel) */}
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
            { icon: Star, label: '100% gratuito', sub: 'sin tarjeta' },
            { icon: Zap, label: '60 segundos', sub: 'de análisis' },
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
            {/* Nombre del negocio */}
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

            {/* URL */}
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

            {/* Google Maps */}
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

            {/* Ubicación */}
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

            {/* Email */}
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

            {/* CTA */}
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

        {/* Footer mínimo */}
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
    </main>
  )
}

export default function HomePage() {
  return (
    <Suspense>
      <HeroContent />
    </Suspense>
  )
}
