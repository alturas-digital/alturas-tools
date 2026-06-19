-- Ejecutar en Railway Postgres (o cualquier Postgres)
-- Railway: Dashboard → tu proyecto → Postgres → Query tab → pegá esto y ejecutá

CREATE TABLE IF NOT EXISTS leads (
  id            SERIAL PRIMARY KEY,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Datos del formulario
  business_name TEXT NOT NULL,
  email         TEXT NOT NULL,
  website_url   TEXT,
  location      TEXT,

  -- Tracking de origen (UTM/src del reel o campaña)
  src           TEXT,

  -- Resultado del diagnóstico
  score         INTEGER,
  answers       JSONB,   -- { q1: 10, q2: 5, q3: 0, ... }

  -- Estado del lead
  email_sent    BOOLEAN NOT NULL DEFAULT FALSE
);

-- Índice para buscar por email y por origen
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads (email);
CREATE INDEX IF NOT EXISTS leads_src_idx   ON leads (src);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
