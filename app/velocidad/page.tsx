'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import {
  CheckCircle, ArrowRight, ExternalLink, MessageCircle, Zap,
  AlertTriangle, Clock,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Metric { display: string | null; score: number | null }

interface PageSpeedResult {
  mobile: {
    performance:   number
    accessibility: number
    bestPractices: number
    seo:           number
    metrics: { fcp: Metric; lcp: Metric; tbt: Metric; cls: Metric; si: Metric }
    opportunities: { title: string; displayValue: string | null; savingsS: string | null }[]
  }
  desktop: { performance: number }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function scoreColor(score: number | null): string {
  if (score === null) return '#7888a8'
  if (score >= 90) return '#22C55E'
  if (score >= 50) return '#F97316'
  return '#EF4444'
}

function metricColor(score: number | null): string {
  if (score === null) return '#7888a8'
  if (score >= 0.9) return '#22C55E'
  if (score >= 0.5) return '#F97316'
  return '#EF4444'
}

function getRangeInfo(score: number) {
  if (score < 50) return {
    label: 'Velocidad Crítica',
    color: '#EF4444',
    sub: 'Tu sitio está perdiendo clientes. Cada segundo de espera cuesta reservas.',
  }
  if (score < 90) return {
    label: 'Velocidad Mejorable',
    color: '#F97316',
    sub: 'Hay margen de mejora importante. La velocidad impacta directo en tus reservas.',
  }
  return {
    label: 'Velocidad Sólida',
    color: '#22C55E',
    sub: 'Buen rendimiento. Veamos cómo mantenerlo y seguir mejorando.',
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

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
        <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke="#1E2535"
          strokeWidth="12" strokeLinecap="round" />
        <motion.path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke={color}
          strokeWidth="12" strokeLinecap="round"
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

function ScorePill({ label, score }: { label: string; score: number }) {
  const color = scoreColor(score)
  return (
    <div className="bg-surface border border-border rounded-xl p-3 text-center flex flex-col items-center gap-1">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border-2"
        style={{ borderColor: color, color }}
      >
        {score}
      </div>
      <p className="text-xs text-gray-400 leading-tight">{label}</p>
    </div>
  )
}

function MetricRow({
  label, sub, metric,
}: {
  label: string; sub: string; metric: Metric
}) {
  const color = metricColor(metric.score)
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
      <div>
        <p className="text-sm text-white font-medium">{label}</p>
        <p className="text-xs text-gray-600">{sub}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-sm font-bold" style={{ color }}>
          {metric.display ?? '—'}
        </span>
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
      </div>
    </div>
  )
}

const LOADING_STEPS = [
  'Conectando con PageSpeed de Google...',
  'Analizando velocidad mobile...',
  'Analizando velocidad desktop...',
  'Evaluando Core Web Vitals...',
  'Preparando tu informe...',
]

type Phase    = 'form' | 'loading' | 'result'
type FormData = { websiteUrl: string; email: string; businessName: string }

// ── Main Component ────────────────────────────────────────────────────────────

function VelocidadContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const [phase,       setPhase]       = useState<Phase>('form')
  const [formData,    setFormData]    = useState<FormData>({ websiteUrl: '', email: '', businessName: '' })
  const [errors,      setErrors]      = useState<Record<string, string>>({})
  const [loadingStep, setLoadingStep] = useState(0)
  const [progress,    setProgress]    = useState(0)
  const [psiData,     setPsiData]     = useState<PageSpeedResult | null>(null)
  const [apiError,    setApiError]    = useState(false)
  const psiDataRef = useRef<PageSpeedResult | null>(null)

  useEffect(() => {
    const src = searchParams.get('src')
    if (src) localStorage.setItem('diagnostico_src', src)
  }, [searchParams])

  // Step cycling animation while loading
  useEffect(() => {
    if (phase !== 'loading') return
    setLoadingStep(0)
    setProgress(0)

    const stepInterval = setInterval(() => {
      setLoadingStep(p => (p + 1) % LOADING_STEPS.length)
    }, 2000)

    // Progress fills over ~20s to 92%, then holds
    const start = Date.now()
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - start
      const p = Math.min(Math.round((elapsed / 20000) * 92), 92)
      setProgress(p)
    }, 200)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
  }, [phase])

  // Real API call when loading starts
  useEffect(() => {
    if (phase !== 'loading') return

    const url = formData.websiteUrl
    fetch(`/api/pagespeed?url=${encodeURIComponent(url)}`)
      .then(r => {
        if (!r.ok) throw new Error('api error')
        return r.json() as Promise<PageSpeedResult>
      })
      .then(data => {
        if ('error' in data) throw new Error(String((data as Record<string,unknown>).error))
        psiDataRef.current = data
        setPsiData(data)
      })
      .catch(() => {
        setApiError(true)
        // Fallback so the user still sees something
        const fallback: PageSpeedResult = {
          mobile: {
            performance: 50, accessibility: 75, bestPractices: 79, seo: 83,
            metrics: {
              fcp: { display: null, score: null },
              lcp: { display: null, score: null },
              tbt: { display: null, score: null },
              cls: { display: null, score: null },
              si:  { display: null, score: null },
            },
            opportunities: [],
          },
          desktop: { performance: 60 },
        }
        psiDataRef.current = fallback
        setPsiData(fallback)
      })
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Go to result when API data arrives
  useEffect(() => {
    if (psiData && phase === 'loading') {
      setProgress(100)
      setTimeout(() => setPhase('result'), 400)
    }
  }, [psiData, phase])

  // Save lead when result shows
  useEffect(() => {
    if (phase !== 'result' || !psiData) return
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
        score:        psiData.mobile.performance,
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
    const score = psiData?.mobile.performance ?? 50
    localStorage.setItem('diagnostico_form', JSON.stringify({
      websiteUrl: formData.websiteUrl, email: formData.email,
      businessName: formData.businessName || 'Mi negocio', location: '',
    }))
    localStorage.setItem('diagnostico_pagespeed', JSON.stringify({ score, fcp: null, lcp: null }))
    localStorage.setItem('diagnostico_skip_loading', '1')
    router.push('/diagnostico')
  }

  // ── Form ────────────────────────────────────────────────────────────────────

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
            ¿Tu sitio web carga rápido o estás perdiendo clientes?
          </h1>
          <p className="text-center text-gray-500 text-sm mb-8">
            Analizamos velocidad, SEO y más con datos reales de Google. Gratis.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input type="text" placeholder="https://tu-sitio.com"
                value={formData.websiteUrl}
                onChange={(e) => { setFormData(p => ({ ...p, websiteUrl: e.target.value })); if (errors.websiteUrl) setErrors(p => ({ ...p, websiteUrl: '' })) }}
                className={`w-full bg-surface border rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal/60 transition-colors ${errors.websiteUrl ? 'border-red-500/60' : 'border-border'}`}
              />
              {errors.websiteUrl && <p className="text-red-400 text-xs mt-1.5">{errors.websiteUrl}</p>}
            </div>
            <div>
              <input type="email" placeholder="Email para recibir el reporte"
                value={formData.email}
                onChange={(e) => { setFormData(p => ({ ...p, email: e.target.value })); if (errors.email) setErrors(p => ({ ...p, email: '' })) }}
                className={`w-full bg-surface border rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal/60 transition-colors ${errors.email ? 'border-red-500/60' : 'border-border'}`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
            </div>
            <div>
              <input type="text" placeholder="Nombre del negocio (opcional)"
                value={formData.businessName}
                onChange={(e) => setFormData(p => ({ ...p, businessName: e.target.value }))}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal/60 transition-colors"
              />
            </div>
            <button type="submit"
              className="w-full bg-teal hover:bg-teal-dark text-bg font-bold text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors mt-2">
              Analizar mi sitio gratis <ArrowRight size={18} />
            </button>
          </form>
          <p className="text-center text-gray-600 text-xs mt-6">
            Una herramienta gratuita de{' '}
            <a href="https://alturas-digital.com" target="_blank" rel="noopener noreferrer" className="text-teal/70 hover:text-teal transition-colors">
              Alturas Digital
            </a>
          </p>
        </div>
      </main>
    )
  }

  // ── Loading ─────────────────────────────────────────────────────────────────

  if (phase === 'loading') {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-10">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-teal/20 animate-ping" />
              <div className="absolute inset-0 rounded-full border-2 border-teal/40" />
              <div className="w-20 h-20 rounded-full bg-teal/10 flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full"
                />
              </div>
            </div>
          </div>
          <h2 className="text-center text-2xl font-bold mb-2">Analizando tu sitio</h2>
          <p className="text-center text-gray-500 text-sm mb-8 truncate px-4">
            {formData.websiteUrl}
          </p>
          <div className="space-y-3 mb-8">
            {LOADING_STEPS.map((step, i) => (
              <motion.div key={step}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: i === loadingStep ? 1 : 0.3, x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3"
              >
                {i === loadingStep ? (
                  <motion.div animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    className="w-[18px] h-[18px] border-2 border-teal border-t-transparent rounded-full flex-shrink-0"
                  />
                ) : (
                  <CheckCircle size={18} className="text-teal/30 flex-shrink-0" />
                )}
                <span className={`text-sm ${i === loadingStep ? 'text-white' : 'text-gray-600'}`}>{step}</span>
              </motion.div>
            ))}
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <motion.div className="h-full bg-teal rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <p className="text-right text-xs text-gray-600 mt-1">{progress}%</p>
          <p className="text-center text-xs text-gray-600 mt-4">
            Consultando PageSpeed de Google — puede tomar hasta 20 segundos
          </p>
        </div>
      </main>
    )
  }

  // ── Result ──────────────────────────────────────────────────────────────────

  if (!psiData) return null

  const { mobile, desktop } = psiData
  const rangeInfo     = getRangeInfo(mobile.performance)
  const businessLabel = formData.businessName || formData.websiteUrl

  return (
    <main className="min-h-screen bg-bg pb-24">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: `${rangeInfo.color}08` }}
      />

      <div className="relative max-w-lg mx-auto px-4 pt-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-2">
          <p className="text-gray-500 text-sm">Resultado para</p>
          <h1 className="text-xl font-bold truncate">{businessLabel}</h1>
          {apiError && (
            <p className="text-xs text-amber-400 mt-1 flex items-center justify-center gap-1">
              <AlertTriangle size={12} /> Datos aproximados — no se pudo contactar la API
            </p>
          )}
        </motion.div>

        {/* Main gauge */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-border rounded-2xl p-8 mt-6 flex flex-col items-center">
          <GaugeChart score={mobile.performance} color={rangeInfo.color} />
          <div className="mt-5 text-center">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-1"
              style={{ background: `${rangeInfo.color}20`, color: rangeInfo.color }}>
              {rangeInfo.label}
            </span>
            <p className="text-gray-400 text-sm mt-1">{rangeInfo.sub}</p>
          </div>
        </motion.div>

        {/* 4 category scores */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 grid grid-cols-4 gap-2">
          <ScorePill label="Rendimiento" score={mobile.performance} />
          <ScorePill label="Accesibilidad" score={mobile.accessibility} />
          <ScorePill label="Buenas prácticas" score={mobile.bestPractices} />
          <ScorePill label="SEO" score={mobile.seo} />
        </motion.div>
        <p className="text-xs text-gray-600 text-center mt-1.5">Mobile · Fuente: Google Lighthouse</p>

        {/* Mobile vs Desktop */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 grid grid-cols-2 gap-3">
          {[
            { label: 'Velocidad mobile',  score: mobile.performance,  color: scoreColor(mobile.performance) },
            { label: 'Velocidad desktop', score: desktop.performance, color: scoreColor(desktop.performance) },
          ].map(item => (
            <div key={item.label} className="bg-surface border border-border rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className="text-2xl font-black" style={{ color: item.color }}>{item.score}</p>
              <p className="text-xs text-gray-600">/100</p>
            </div>
          ))}
        </motion.div>

        {/* Core Web Vitals */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-teal" />
            <h2 className="text-sm font-bold text-white">Core Web Vitals</h2>
            <span className="text-xs text-gray-600 ml-auto">Mobile</span>
          </div>
          <MetricRow label="First Contentful Paint" sub="Primer contenido visible"   metric={mobile.metrics.fcp} />
          <MetricRow label="Largest Contentful Paint" sub="Contenido principal visible" metric={mobile.metrics.lcp} />
          <MetricRow label="Total Blocking Time" sub="Tiempo que el sitio bloquea interacción" metric={mobile.metrics.tbt} />
          <MetricRow label="Cumulative Layout Shift" sub="Estabilidad visual (evita saltos)"  metric={mobile.metrics.cls} />
          <MetricRow label="Speed Index" sub="Velocidad de pintado progresivo" metric={mobile.metrics.si} />
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50 text-xs text-gray-600">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Bueno</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> Mejorable</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Crítico</span>
          </div>
        </motion.div>

        {/* Opportunities */}
        {mobile.opportunities.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 bg-surface border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} className="text-amber-400" />
              <h2 className="text-sm font-bold text-white">Qué está frenando tu sitio</h2>
            </div>
            <div className="space-y-2">
              {mobile.opportunities.map((opp, i) => (
                <div key={i} className="flex items-start justify-between gap-3 py-2 border-b border-border/50 last:border-0">
                  <p className="text-sm text-gray-300 leading-snug">{opp.title}</p>
                  {opp.savingsS && (
                    <span className="text-xs font-semibold text-amber-400 whitespace-nowrap flex-shrink-0 bg-amber-400/10 px-2 py-0.5 rounded-full">
                      −{opp.savingsS}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-3">Ahorro potencial en tiempo de carga mobile</p>
          </motion.div>
        )}

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 space-y-3">
          <a href="https://alturas-digital.com" target="_blank" rel="noopener noreferrer"
            className="w-full bg-teal hover:bg-teal-dark text-bg font-bold text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors">
            Quiero mejorar la velocidad de mi sitio <ExternalLink size={16} />
          </a>
          <a href="https://www.instagram.com/alturas.digital" target="_blank" rel="noopener noreferrer"
            className="w-full bg-surface border border-border hover:border-teal/40 text-white font-medium text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <MessageCircle size={16} className="text-teal" />
            Escribinos por Instagram
          </a>
        </motion.div>

        {/* Escalón al diagnóstico completo */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 border border-border rounded-2xl p-6 bg-surface/50">
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            La velocidad es solo una parte de tu presencia digital. ¿Querés ver el diagnóstico
            completo?{' '}
            <span className="text-gray-300">(Google Maps, reseñas, redes, reservas online y más)</span>
          </p>
          <button onClick={handleEscalon}
            className="w-full bg-bg border border-teal/40 hover:bg-teal/5 hover:border-teal/60 text-teal font-semibold text-sm py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-all">
            Hacer el diagnóstico completo <ArrowRight size={15} />
          </button>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="text-center text-gray-600 text-xs mt-10">
          Una herramienta gratuita de{' '}
          <a href="https://alturas-digital.com" target="_blank" rel="noopener noreferrer"
            className="text-teal/70 hover:text-teal transition-colors">
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
