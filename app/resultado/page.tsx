'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion'
import {
  Globe,
  MapPin,
  Star,
  Shield,
  Smartphone,
  MessageCircle,
  Calendar,
  Megaphone,
  Camera,
  Mail,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ExternalLink,
} from 'lucide-react'

const MOCK_CATEGORIES = [
  { id: 'speed',    icon: Globe,          name: 'Velocidad web',       score: 45,  max: 100, detail: 'PageSpeed mobile: 45/100' },
  { id: 'gmaps',    icon: MapPin,         name: 'Google Maps',         score: 70,  max: 100, detail: '4.2 ★ · 38 reseñas' },
  { id: 'reviews',  icon: Star,           name: 'Reseñas',             score: 65,  max: 100, detail: 'Promedio 4.2 — pocas reseñas' },
  { id: 'ssl',      icon: Shield,         name: 'Seguridad (SSL)',      score: 100, max: 100, detail: 'Certificado activo' },
  { id: 'social',   icon: Smartphone,     name: 'Redes sociales',      score: 0,   max: 100, detail: 'Calculado de respuestas' },
  { id: 'attention',icon: MessageCircle,  name: 'Atención digital',    score: 0,   max: 100, detail: 'Calculado de respuestas' },
  { id: 'booking',  icon: Calendar,       name: 'Sistema de reservas', score: 0,   max: 100, detail: 'Calculado de respuestas' },
  { id: 'ads',      icon: Megaphone,      name: 'Publicidad paga',     score: 0,   max: 100, detail: 'Calculado de respuestas' },
  { id: 'content',  icon: Camera,         name: 'Contenido visual',    score: 0,   max: 100, detail: 'Calculado de respuestas' },
]

const RECOMMENDATIONS: Record<string, string> = {
  speed:    'Tu sitio tarda demasiado en cargar. Google te penaliza y los usuarios se van. Optimizá imágenes y usá un buen hosting.',
  gmaps:    'Tu perfil de Google Maps necesita más reseñas. Pedíselas activamente a tus clientes después de cada experiencia.',
  reviews:  'Con menos de 50 reseñas generás poca confianza. Implementá una estrategia para conseguir más reviews orgánicas.',
  ssl:      '¡Perfecto! Tu sitio tiene seguridad activa. Google premia esto en el ranking.',
  social:   'Publicar menos de una vez por semana invisibiliza tu negocio. El algoritmo premia la consistencia.',
  attention:'Responder tarde mata conversiones. Considerá automatizar respuestas iniciales con un chatbot o auto-reply.',
  booking:  'Sin sistema de reservas online perdés clientes que quieren reservar fuera de horario. Evaluá una landing simple con formulario.',
  ads:      'Sin publicidad paga tu crecimiento depende 100% del orgánico. Incluso un presupuesto pequeño en Meta Ads puede duplicar tu alcance.',
  content:  'El contenido del celular se nota y baja la percepción de calidad. Una sesión de fotos profesional es inversión, no gasto.',
}

function getRangeInfo(score: number) {
  if (score <= 40) return { label: 'Presencia Crítica',     color: '#EF4444', sub: 'Estás perdiendo reservas todos los días' }
  if (score <= 65) return { label: 'Presencia Básica',      color: '#F97316', sub: 'Dejás dinero sobre la mesa' }
  if (score <= 85) return { label: 'Presencia Intermedia',  color: '#EAB308', sub: 'Bien encaminado, hay gaps importantes' }
  return            { label: 'Presencia Sólida',            color: '#22C55E', sub: 'Buen trabajo. Veamos cómo escalar' }
}

function getBadge(score: number) {
  if (score >= 70) return { label: 'Bien',      color: 'text-green-400',  bg: 'bg-green-400/10  border-green-400/30',  Icon: CheckCircle }
  if (score >= 40) return { label: 'Mejorable', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', Icon: AlertTriangle }
  return            { label: 'Crítico',         color: 'text-red-400',    bg: 'bg-red-400/10    border-red-400/30',    Icon: XCircle }
}

// ─── Paso 4: pantalla de cálculo ────────────────────────────────────────────

function CalculatingScreen({ score, onDone }: { score: number; onDone: () => void }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))

  useEffect(() => {
    // El número sube durante 1.8s, luego esperamos un poco y avisamos
    const controls = animate(count, score, { duration: 1.8, ease: 'easeOut' })
    const timer = setTimeout(onDone, 2400)
    return () => { controls.stop(); clearTimeout(timer) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const rangeInfo = getRangeInfo(score)

  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        {/* Anillo giratorio */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-2 border-teal/10" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-t-teal border-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-3xl font-black"
              style={{ color: rangeInfo.color }}
            >
              {rounded}
            </motion.span>
          </div>
        </div>

        <div>
          <p className="text-white font-semibold text-lg">Calculando tu presencia digital</p>
          <p className="text-gray-500 text-sm mt-1">Analizando {score} puntos de datos...</p>
        </div>

        {/* Barra de progreso */}
        <div className="w-48 h-1 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: rangeInfo.color }}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </main>
  )
}

// ─── Gauge semicircular ─────────────────────────────────────────────────────

function GaugeChart({ score, color }: { score: number; color: string }) {
  const circumference = Math.PI * 90 // radio = 90 en viewBox 220x120
  const offset = circumference - (score / 100) * circumference
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))

  useEffect(() => {
    const controls = animate(count, score, { duration: 1.6, ease: 'easeOut' })
    return controls.stop
  }, [score]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative flex flex-col items-center w-full max-w-[220px] mx-auto">
      <svg viewBox="0 0 220 120" className="w-full">
        <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke="#1E2535" strokeWidth="12" strokeLinecap="round" />
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
        <motion.span className="text-5xl font-black leading-none" style={{ color }}>{rounded}</motion.span>
        <span className="text-gray-500 text-sm font-medium">/100</span>
      </div>
    </div>
  )
}

// ─── Dashboard principal (Paso 5) ───────────────────────────────────────────

function Dashboard({ score, businessName }: { score: number; businessName: string }) {
  const [categories, setCategories] = useState(MOCK_CATEGORIES)
  const [emailSent, setEmailSent] = useState(false)
  const rangeInfo = getRangeInfo(score)

  useEffect(() => {
    const raw = localStorage.getItem('diagnostico_answers')
    if (!raw) return
    const answers: Record<string, number> = JSON.parse(raw)

    // Guardar lead en DB con todos los datos disponibles
    const formRaw  = localStorage.getItem('diagnostico_form')
    const src      = localStorage.getItem('diagnostico_src')
    const formData = formRaw ? JSON.parse(formRaw) : {}

    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: formData.businessName ?? businessName,
        email:        formData.email ?? '',
        websiteUrl:   formData.websiteUrl ?? null,
        location:     formData.location ?? null,
        src:          src ?? null,
        score,
        answers,
      }),
    }).catch((e) => console.error('[lead save]', e))

    const pct = (q: string) => Math.round(((answers[q] ?? 0) / 10) * 100)
    setCategories(MOCK_CATEGORIES.map((cat) => {
      switch (cat.id) {
        case 'social':    return { ...cat, score: pct('q1') }
        case 'attention': return { ...cat, score: pct('q2') }
        case 'booking':   return { ...cat, score: pct('q3') }
        case 'ads':       return { ...cat, score: pct('q4') }
        case 'content':   return { ...cat, score: pct('q5') }
        default:          return cat
      }
    }))
  }, [])

  const priorities = [...categories].sort((a, b) => a.score - b.score).slice(0, 3)

  function handleEmailCTA() {
    // TODO sesión 2: conectar Resend para envío real del reporte por email
    setEmailSent(true)
  }

  return (
    <main className="min-h-screen bg-bg pb-24">
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: `${rangeInfo.color}08` }}
      />

      <div className="relative max-w-2xl mx-auto px-4 pt-10">
        {/* Nombre del negocio */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-2">
          <p className="text-gray-500 text-sm">Diagnóstico de</p>
          <h1 className="text-xl font-bold">{businessName}</h1>
        </motion.div>

        {/* Score + gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-border rounded-2xl p-8 mt-6 flex flex-col items-center"
        >
          <GaugeChart score={score} color={rangeInfo.color} />
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

        {/* Grid de categorías */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Análisis por categoría</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat, i) => {
              const badge = getBadge(cat.score)
              const Icon = cat.icon
              const BadgeIcon = badge.Icon
              const barColor = badge.color.includes('green') ? '#22C55E' : badge.color.includes('yellow') ? '#EAB308' : '#EF4444'
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                  className="bg-surface border border-border rounded-xl p-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-bg flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-teal" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium truncate">{cat.name}</span>
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${badge.bg} ${badge.color}`}>
                        <BadgeIcon size={10} />
                        {badge.label}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1 bg-border rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: barColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.score}%` }}
                        transition={{ duration: 0.9, delay: 0.4 + i * 0.04, ease: 'easeOut' }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{cat.detail}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* 3 prioridades */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mt-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Tus 3 prioridades</h2>
          <div className="space-y-3">
            {priorities.map((cat, i) => {
              const Icon = cat.icon
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="bg-surface border border-border rounded-xl p-4 flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={15} className="text-red-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold">{cat.name}</span>
                      <span className="text-xs text-red-400 font-medium">{cat.score}/100</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{RECOMMENDATIONS[cat.id]}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-8 space-y-3">
          <a
            href="https://alturas-digital.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-teal hover:bg-teal-dark text-bg font-bold text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            Quiero que Alturas Digital mejore mi presencia digital
            <ExternalLink size={16} />
          </a>

          {emailSent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full bg-teal/10 border border-teal/30 text-teal font-medium text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2"
            >
              <CheckCircle size={16} />
              ¡Listo! Te enviamos el reporte a tu email.
            </motion.div>
          ) : (
            <button
              onClick={handleEmailCTA}
              // TODO sesión 2: conectar Resend para envío real del reporte por email
              className="w-full bg-surface border border-border hover:border-teal/40 text-white font-medium text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Mail size={16} className="text-teal" />
              Recibí el reporte completo por email
            </button>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-gray-600 text-xs mt-10"
        >
          Una herramienta gratuita de{' '}
          <a href="https://alturas-digital.com" target="_blank" rel="noopener noreferrer" className="text-teal/70 hover:text-teal transition-colors">
            Alturas Digital
          </a>{' '}
          · Agencia de marketing digital especializada en turismo
        </motion.p>
      </div>
    </main>
  )
}

// ─── Página raíz ─────────────────────────────────────────────────────────────

export default function ResultadoPage() {
  const [score, setScore] = useState<number | null>(null)
  const [businessName, setBusinessName] = useState('Tu negocio')
  const [phase, setPhase] = useState<'calculating' | 'dashboard'>('calculating')

  useEffect(() => {
    const savedScore = localStorage.getItem('diagnostico_score')
    const savedForm  = localStorage.getItem('diagnostico_form')

    // TODO sesión 2: guardar src junto con el lead en base de datos para atribución de campaña
    console.log('[DEBUG] src de origen:', localStorage.getItem('diagnostico_src'))

    if (savedForm) {
      try { setBusinessName(JSON.parse(savedForm).businessName || 'Tu negocio') } catch {}
    }
    setScore(savedScore ? Number(savedScore) : 72) // fallback demo
  }, [])

  if (score === null) return null // esperar hidratación

  return (
    <AnimatePresence mode="wait">
      {phase === 'calculating' ? (
        <motion.div key="calculating" exit={{ opacity: 0 }}>
          <CalculatingScreen score={score} onDone={() => setPhase('dashboard')} />
        </motion.div>
      ) : (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Dashboard score={score} businessName={businessName} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
