'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-red-400" />
        </div>
        <h2 className="text-xl font-bold mb-2">Algo salió mal</h2>
        <p className="text-gray-500 text-sm mb-6">
          Ocurrió un error inesperado. Podés intentar recargar la página.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-surface border border-border hover:border-teal/40 text-white font-medium px-5 py-3 rounded-xl transition-colors"
        >
          <RefreshCw size={15} />
          Intentar de nuevo
        </button>
      </motion.div>
    </main>
  )
}
