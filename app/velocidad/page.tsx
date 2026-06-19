'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import {
  CheckCircle,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Zap,
} from 'lucide-react'

const MOCK_SCORE_MOBILE  = 45
const MOCK_SCORE_DESKTOP = 62

const LOADING_STEPS = [
  'Conectando con tu sitio web...',
  'Midiendo tiempo de carga...',
  'Analizando rendimiento mobile...',
  'Generando tu informe...',
]

function getRangeInfo(score: number) {
  if (score < 50) return {
    label: 'Velocidad Crítica',
    color: '#EF4444',
    sub:   'Tu sitio está perdiendo clientes. Cada segundo de espera cuesta reservas.',
  }
  if (score < 80) return {
    label: 'Velocidad Mejorable',
    color: '#F97316',
    sub:   'Hay margen de mejora importante. La velocidad impacta directo en tus reservas.',
  }
  return {
    label: 'Velocidad Sólida',
    color: '#22C55E',
    sub:   'Buen rendimiento. Veamos cómo mantenerlo y seguir mejorando.',
  }
}

function GaugeChart({ score, color }: { score: number; color: string }) {
  const circumference = Math.PI * 90
  const offset        = circumference - (score / 100) * circumference
  const count         = useMotionValue(0)
  const rounded       = useTransform(count, (v) => Math.round(v))

  useEffect(() => {
    const controls = animate(count, score, { duration: 1.6, ease: 'easeOut' })
    return controls.stop
  }, [score]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative flex flex-col items-center w-full max-w-[220px] mx-auto">
      <svg viewBox="0 0 220 120" className="w-full">
        <path
          d="M 20 110 A 90 90 0 0 1 200 110"
          fill="none"
          stroke="#1E2535"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <motion.path
          d="M 20 110 A 90 90 0 0 1 200 110"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute bottom-0 flex flex-col items-center" style={{ bottom: '-4px' }}>
        <motion.span className="text-5xl font-black leading-none" style={{ color }}>
          {rounded}
        </motion.span>
        <span className="text-gray-500 text-sm font-medium">/100</span>
      </div>
    </div>
  )
}

type Phase    = 'form' | 'loading' | 'result'
type FormData = { websiteUrl: string; email: string; businessName: string }

function VelocidadContent() {
  const router      = useRouter()
  const searchParams = useSearchParams()

  const [phase,       setPhase]       = useState<Phase>('form')
  const [formData,    setFormData]    = useState<FormData>({ websiteUrl: '', email: '', businessName: '' })
  const [errors,      setErrors]      = useState<Record<string, string>>({})
  const [loadingStep, setLoadingStep] = useState(0)
  const [progress,    setProgress]    = useState(0)

  // Guardar src de campaña al cargar la página
  useEffect(() => {
    const src = searchParams.get('src')
    if (src) localStorage.setItem('diagnostico_src', src)
  }, [searchParams])

  // Animación de loading
  useEffect(() => {
    if (phase !== 'loading') return
    let step = 0
    const interval = setInterval(() => {
      step++
      setLoadingStep(step)
      setProgress(Math.round((step / LOADING_STEPS.length) * 100))
      if (step >= LOADING_STEPS.length) {
        clearInterval(interval)
        setTimeout(() => setPhase('result'), 600)
      }
    }, 1100)
    return () => clearInterval(interval)
  }, [phase])

  // Guardar lead cuando se muestra el resultado
  useEffect(() => {
    if (phase !== 'result') return
    const src = localStorage.getItem('diagnostico_src')
    fetch('/api/lead', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: formData.businessName || '',
        email:        formData.email,
        websiteUrl:   formData.websiteUrl,
        location:     null,
        src:          src ?? null,
        score:        MOCK_SCORE_MOBILE,
        answers:      { source: 'velocidad' },
      }),
    }).catch(() => {})
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    let url = formData.websiteUrl.trim()
    if (url && !/^https?:\/\//i.test(url)) url = `https://${url}`

    const errs: Record<string, string> = {}
    if (!url) errs.websiteUrl = 'Ingresá la URL de tu sitio'
    if (!formData.email.trim()) errs.email = 'El email es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Email inválido'

    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const normalized = { ...formData, websiteUrl: url }
    setFormData(normalized)
    localStorage.setItem('velocidad_form', JSON.stringify(normalized))
    setPhase('loading')
  }

  function handleEscalon() {
    // Pre-cargar datos para /diagnostico
    localStorage.setItem('diagnostico_form', JSON.stringify({
      websiteUrl:   formData.websiteUrl,
      email:        formData.email,
      businessName: formData.businessName || 'Mi negocio',
      location:     '',
    }))
    // Pasar score de velocidad ya calculado
    localStorage.setItem('diagnostico_pagespeed', JSON.stringify({
      score: MOCK_SCORE_MOBILE,
      fcp:   null,
      lcp:   null,
    }))
    // Señal para saltear el loading en /diagnostico
    localStorage.setItem('diagnostico_skip_loading', '1')
    router.push('/diagnostico')
  }

  // ── Paso 1: Formulario ────────────────────────────────────────────────────

  if (phase === 'form') {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-teal/4 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-teal/10 border border-teal/20 flex items-center justify-center">
              <Zap size={24} className="text-teal" />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-center mb-3 leading-snug">
            ¿Tu sitio web carga rápido o estás perdiendo clientes por esos segundos de espera?
          </h1>
          <p className="text-center text-gray-500 text-sm mb-8">
            Analizamos la velocidad de tu sitio en 30 segundos. Gratis.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="https://tu-sitio.com"
                value={formData.websiteUrl}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, websiteUrl: e.target.value }))
                  if (errors.websiteUrl) setErrors((p) => ({ ...p, websiteUrl: '' }))
                }}
                className={`w-full bg-surface border rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal/60 transition-colors ${
                  errors.websiteUrl ? 'border-red-500/60' : 'border-border'
                }`}
              />
              {errors.websiteUrl && (
                <p className="text-red-400 text-xs mt-1.5">{errors.websiteUrl}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email para recibir el reporte"
                value={formData.email}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, email: e.target.value }))
                  if (errors.email) setErrors((p) => ({ ...p, email: '' }))
                }}
                className={`w-full bg-surface border rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal/60 transition-colors ${
                  errors.email ? 'border-red-500/60' : 'border-border'
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Nombre del negocio (opcional)"
                value={formData.businessName}
                onChange={(e) => setFormData((p) => ({ ...p, businessName: e.target.value }))}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal/60 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal hover:bg-teal-dark text-bg font-bold text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors mt-2"
            >
              Analizar mi sitio gratis
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-gray-600 text-xs mt-6">
            Una herramienta gratuita de{' '}
            <a
              href="https://alturas-digital.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal/70 hover:text-teal transition-colors"
            >
              Alturas Digital
            </a>
          </p>
        </div>
      </main>
    )
  }

  // ── Paso 2: Loading ───────────────────────────────────────────────────────

  if (phase === 'loading') {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-10">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-teal/20 animate-ping" />
              <div className="absolute inset-0 rounded-full border-2 border-teal/40" />
              <div className="w-20 h-20 rounded-full bg-teal/10 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full"
                />
              </div>
            </div>
          </div>

          <h2 className="text-center text-2xl font-bold mb-2">Analizando tu sitio</h2>
          <p className="text-center text-gray-500 text-sm mb-10 truncate px-4">
            {formData.websiteUrl}
          </p>

          <div className="space-y-3 mb-8">
            {LOADING_STEPS.map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: i < loadingStep ? 1 : 0.25, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-center gap-3"
              >
                {i < loadingStep ? (
                  <CheckCircle size={18} className="text-teal flex-shrink-0" />
                ) : (
                  <div className="w-[18px] h-[18px] rounded-full border border-gray-700 flex-shrink-0" />
                )}
                <span className={`text-sm ${i < loadingStep ? 'text-white' : 'text-gray-600'}`}>
                  {step}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-teal rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <p className="text-right text-xs text-gray-600 mt-1">{progress}%</p>
        </div>
      </main>
    )
  }

  // ── Paso 3: Resultado ─────────────────────────────────────────────────────

  const rangeInfo     = getRangeInfo(MOCK_SCORE_MOBILE)
  const businessLabel = formData.businessName || formData.websiteUrl

  return (
    <main className="min-h-screen bg-bg pb-24">
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: `${rangeInfo.color}08` }}
      />

      <div className="relative max-w-lg mx-auto px-4 pt-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-2"
        >
          <p className="text-gray-500 text-sm">Resultado de velocidad para</p>
          <h1 className="text-xl font-bold truncate">{businessLabel}</h1>
        </motion.div>

        {/* Gauge principal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-border rounded-2xl p-8 mt-6 flex flex-col items-center"
        >
          <GaugeChart score={MOCK_SCORE_MOBILE} color={rangeInfo.color} />
          <div className="mt-5 text-center">
            <span
              className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-1"
              style={{ background: `${rangeInfo.color}20`, color: rangeInfo.color }}
            >
              {rangeInfo.label}
            </span>
            <p className="text-gray-400 text-sm mt-1">{rangeInfo.sub}</p>
          </div>
        </motion.div>

        {/* Breakdown mobile / desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-4 grid grid-cols-2 gap-3"
        >
          {[
            { label: 'Velocidad mobile',  score: MOCK_SCORE_MOBILE,  color: rangeInfo.color },
            { label: 'Velocidad desktop', score: MOCK_SCORE_DESKTOP, color: '#22C55E' },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-surface border border-border rounded-xl p-4 text-center"
            >
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className="text-2xl font-black" style={{ color: item.color }}>{item.score}</p>
              <p className="text-xs text-gray-600">/100</p>
            </div>
          ))}
        </motion.div>

        {/* CTAs principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 space-y-3"
        >
          <a
            href="https://alturas-digital.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-teal hover:bg-teal-dark text-bg font-bold text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            Quiero mejorar la velocidad de mi sitio
            <ExternalLink size={16} />
          </a>

          <a
            href="https://www.instagram.com/alturas.digital"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-surface border border-border hover:border-teal/40 text-white font-medium text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle size={16} className="text-teal" />
            Escribinos por Instagram
          </a>
        </motion.div>

        {/* Escalón al diagnóstico completo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-8 border border-border rounded-2xl p-6 bg-surface/50"
        >
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            La velocidad es solo una parte de tu presencia digital. ¿Querés ver el diagnóstico
            completo?{' '}
            <span className="text-gray-300">
              (Google Maps, reseñas, redes, reservas online y más)
            </span>
          </p>
          <button
            onClick={handleEscalon}
            className="w-full bg-bg border border-teal/40 hover:bg-teal/5 hover:border-teal/60 text-teal font-semibold text-sm py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            Hacer el diagnóstico completo
            <ArrowRight size={15} />
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-gray-600 text-xs mt-10"
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

export default function VelocidadPage() {
  return (
    <Suspense>
      <VelocidadContent />
    </Suspense>
  )
}
