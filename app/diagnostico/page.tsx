'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'

// Pasos del loading animado
const LOADING_STEPS = [
  'Analizando velocidad del sitio web...',
  'Verificando presencia en Google Maps...',
  'Revisando reseñas y valoraciones...',
  'Evaluando presencia en redes sociales...',
  'Calculando tu score...',
]

// Preguntas del autodiagnóstico
const QUESTIONS = [
  {
    id: 'q1',
    text: '¿Publicás contenido en Instagram o Facebook al menos una vez por semana?',
    options: [
      { label: 'Sí, regularmente', value: 'si', points: 10 },
      { label: 'A veces', value: 'aveces', points: 5 },
      { label: 'No', value: 'no', points: 0 },
    ],
  },
  {
    id: 'q2',
    text: '¿Respondés los mensajes de clientes en menos de 2 horas?',
    options: [
      { label: 'Sí siempre', value: 'si', points: 10 },
      { label: 'A veces', value: 'aveces', points: 5 },
      { label: 'Casi nunca', value: 'no', points: 0 },
    ],
  },
  {
    id: 'q3',
    text: '¿Tus clientes pueden reservar online sin necesidad de llamarte?',
    options: [
      { label: 'Sí, tengo sistema online', value: 'online', points: 10 },
      { label: 'Solo por WhatsApp', value: 'whatsapp', points: 5 },
      { label: 'No, solo por teléfono', value: 'no', points: 0 },
    ],
  },
  {
    id: 'q4',
    text: '¿Estás invirtiendo en publicidad paga (Meta Ads o Google Ads)?',
    options: [
      { label: 'Sí actualmente', value: 'si', points: 10 },
      { label: 'Lo hice antes', value: 'antes', points: 4 },
      { label: 'Nunca', value: 'no', points: 0 },
    ],
  },
  {
    id: 'q5',
    text: '¿Tenés fotos o videos profesionales de tus experiencias?',
    options: [
      { label: 'Sí, profesionales', value: 'si', points: 10 },
      { label: 'Tengo pero son del celular', value: 'celular', points: 5 },
      { label: 'No tengo', value: 'no', points: 0 },
    ],
  },
  {
    id: 'q6',
    text: '¿Sabés cuántas visitas recibe tu web por mes?',
    options: [
      { label: 'Sí, lo monitoreo', value: 'si', points: 10 },
      { label: 'Lo vi alguna vez', value: 'aveces', points: 4 },
      { label: 'No tengo idea', value: 'no', points: 0 },
    ],
  },
]

type Phase = 'loading' | 'questions'

export default function DiagnosticoPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('loading')
  const [loadingStep, setLoadingStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})

  // Lanzar PageSpeed en background (solo si no viene ya el score de /velocidad)
  useEffect(() => {
    if (localStorage.getItem('diagnostico_pagespeed')) return
    const formRaw = localStorage.getItem('diagnostico_form')
    if (!formRaw) return
    let websiteUrl: string
    try { websiteUrl = JSON.parse(formRaw).websiteUrl } catch { return }
    if (!websiteUrl) return

    fetch(`/api/pagespeed?url=${encodeURIComponent(websiteUrl)}`)
      .then((r) => r.json())
      .then((data) => localStorage.setItem('diagnostico_pagespeed', JSON.stringify(data)))
      .catch(() => {})
  }, [])

  // Fase de loading: avanzar pasos o saltar si viene de /velocidad
  useEffect(() => {
    const skip = localStorage.getItem('diagnostico_skip_loading')
    if (skip) {
      localStorage.removeItem('diagnostico_skip_loading')
      setPhase('questions')
      return
    }

    let step = 0
    const interval = setInterval(() => {
      step++
      setLoadingStep(step)
      setProgress(Math.round((step / LOADING_STEPS.length) * 100))

      if (step >= LOADING_STEPS.length) {
        clearInterval(interval)
        setTimeout(() => setPhase('questions'), 600)
      }
    }, 900)

    return () => clearInterval(interval)
  }, [])

  function selectAnswer(questionId: string, points: number) {
    const updated = { ...answers, [questionId]: points }
    setAnswers(updated)

    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ((q) => q + 1), 350)
    } else {
      // Última pregunta — guardar y calcular resultado
      const totalQuestionPoints = Object.values(updated).reduce((a, b) => a + b, 0)
      // Base mockeada + bonus por preguntas (60 puntos base + hasta 40 de preguntas)
      const score = Math.round(60 + (totalQuestionPoints / 60) * 40)
      localStorage.setItem('diagnostico_answers', JSON.stringify(updated))
      localStorage.setItem('diagnostico_score', String(Math.min(score, 100)))
      router.push('/resultado')
    }
  }

  if (phase === 'loading') {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Icono central animado */}
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

          <h2 className="text-center text-2xl font-bold mb-2">Analizando tu negocio</h2>
          <p className="text-center text-gray-500 text-sm mb-10">Esto tarda solo unos segundos...</p>

          {/* Lista de pasos */}
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
                <span
                  className={`text-sm ${
                    i < loadingStep ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {step}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Barra de progreso */}
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

  // Fase de preguntas
  const question = QUESTIONS[currentQ]

  return (
    <main className="min-h-screen bg-bg flex flex-col">
      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-teal/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-lg">
        {/* Indicador de progreso */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => currentQ > 0 && setCurrentQ((q) => q - 1)}
            className={`p-2 rounded-lg border border-border text-gray-500 hover:text-white hover:border-gray-600 transition-colors ${
              currentQ === 0 ? 'opacity-0 pointer-events-none' : ''
            }`}
          >
            <ArrowLeft size={16} />
          </button>

          <div className="flex flex-col items-center gap-2 flex-1 mx-4">
            <span className="text-xs text-gray-500 font-medium">
              Pregunta {currentQ + 1} de {QUESTIONS.length}
            </span>
            <div className="w-full h-1 bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-teal rounded-full"
                animate={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="w-9" /> {/* Spacer para centrar la barra */}
        </div>

        {/* Pregunta */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 leading-snug">
              {question.text}
            </h2>

            <div className="space-y-3">
              {question.options.map((opt, i) => (
                <motion.button
                  key={opt.value}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => selectAnswer(question.id, opt.points)}
                  className="w-full text-left px-5 py-4 rounded-xl border border-border bg-surface hover:border-teal/50 hover:bg-teal/5 text-white font-medium text-base transition-all duration-200 group flex items-center justify-between"
                >
                  <span>{opt.label}</span>
                  <ArrowRight
                    size={16}
                    className="text-gray-600 group-hover:text-teal transition-colors"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      </div>

      <p className="text-center text-gray-600 text-xs py-4">
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
    </main>
  )
}
