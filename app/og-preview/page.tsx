// Ruta temporal para generar la imagen OG.
// Flujo:
//   1. Abrí http://localhost:3002/og-preview en Chrome
//   2. Abrí DevTools → ícono de dispositivo → dimensiones manuales 1200 × 630
//   3. Screenshot de la zona de la página (no del viewport completo)
//   4. Guardalo como public/og-image.png
//   5. Borrá esta ruta (app/og-preview/)

export default function OgPreview() {
  return (
    // Sin body padding ni bg del layout — forzamos fondo propio
    <div
      style={{
        width: 1200,
        height: 630,
        backgroundColor: '#0F1117',
        fontFamily: 'Inter, system-ui, sans-serif',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Glows de fondo ─────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          left: -80,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -200,
          right: 100,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,170,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Grid dots decorativos (fondo) ──────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* ── Contenido principal ────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '52px 72px 44px',
        }}
      >
        {/* Header: logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'auto' }}>
          {/* Icono cuadrado */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'rgba(0,212,170,0.15)',
              border: '1.5px solid rgba(0,212,170,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: 500, letterSpacing: '0.02em' }}>
            Alturas Digital
          </span>
          {/* Separador */}
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 15, marginLeft: 8 }}>·</span>
          <span
            style={{
              color: '#00D4AA',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              background: 'rgba(0,212,170,0.1)',
              border: '1px solid rgba(0,212,170,0.25)',
              borderRadius: 20,
              padding: '3px 10px',
              marginLeft: 4,
            }}
          >
            Herramienta gratuita
          </span>
        </div>

        {/* Body: texto + gauge lado a lado */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 60,
            flex: 1,
            marginTop: 40,
            marginBottom: 40,
          }}
        >
          {/* Columna izquierda — texto */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Headline */}
            <h1
              style={{
                margin: 0,
                fontSize: 54,
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
              }}
            >
              ¿Tu negocio turístico{' '}
              <span style={{ color: '#00D4AA' }}>aparece</span> cuando tus
              clientes te buscan?
            </h1>

            {/* Subtexto */}
            <p
              style={{
                margin: 0,
                fontSize: 22,
                color: 'rgba(255,255,255,0.5)',
                fontWeight: 400,
                lineHeight: 1.4,
              }}
            >
              Diagnóstico gratuito de presencia digital en 60 segundos
            </p>

            {/* Chips de categorías */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
              {['Velocidad web', 'Google Maps', 'Reseñas', 'Redes sociales', 'Reservas'].map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.45)',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 20,
                    padding: '5px 14px',
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Columna derecha — Gauge decorativo */}
          <div
            style={{
              width: 300,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
            }}
          >
            {/* Tarjeta contenedor del gauge */}
            <div
              style={{
                background: 'rgba(22,27,39,0.8)',
                border: '1px solid rgba(30,37,53,1)',
                borderRadius: 24,
                padding: '32px 28px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                backdropFilter: 'blur(8px)',
                width: '100%',
              }}
            >
              {/* SVG Gauge semicircular */}
              <div style={{ position: 'relative', width: 240, height: 130 }}>
                <svg viewBox="0 0 240 130" width="240" height="130">
                  {/* Track */}
                  <path
                    d="M 20 120 A 100 100 0 0 1 220 120"
                    fill="none"
                    stroke="#1E2535"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />
                  {/* Segmento rojo (0-40) */}
                  <path
                    d="M 20 120 A 100 100 0 0 1 220 120"
                    fill="none"
                    stroke="url(#gaugeGrad)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.PI * 100 * 0.78} ${Math.PI * 100}`}
                    strokeDashoffset="0"
                  />
                  <defs>
                    <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="50%" stopColor="#EAB308" />
                      <stop offset="100%" stopColor="#00D4AA" />
                    </linearGradient>
                  </defs>
                  {/* Punto del indicador */}
                  <circle cx="181" cy="49" r="7" fill="#00D4AA" />
                  <circle cx="181" cy="49" r="3" fill="#0F1117" />
                </svg>
                {/* Número central */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    lineHeight: 1,
                  }}
                >
                  <span style={{ fontSize: 52, fontWeight: 900, color: '#00D4AA', display: 'block' }}>78</span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>/100</span>
                </div>
              </div>

              {/* Label del score */}
              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    display: 'inline-block',
                    background: 'rgba(234,179,8,0.15)',
                    color: '#EAB308',
                    borderRadius: 20,
                    padding: '4px 16px',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Presencia Intermedia
                </span>
              </div>

              {/* Mini barras de categorías */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                {[
                  { label: 'Velocidad', pct: 45, color: '#EF4444' },
                  { label: 'Google Maps', pct: 70, color: '#EAB308' },
                  { label: 'Redes', pct: 90, color: '#00D4AA' },
                ].map(({ label, pct, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', width: 68, flexShrink: 0 }}>{label}</span>
                    <div style={{ flex: 1, height: 4, background: '#1E2535', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', width: 28, textAlign: 'right' }}>{pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 16,
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>
            tools.alturas-digital.com
          </span>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.2)' }}>
            Gratis · Sin registro · 60 segundos
          </span>
        </div>
      </div>
    </div>
  )
}
