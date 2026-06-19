import postgres from 'postgres'

// Si no hay DATABASE_URL (desarrollo sin DB), sql es null y el API loguea en consola
let sql: ReturnType<typeof postgres> | null = null

if (process.env.DATABASE_URL) {
  sql = postgres(process.env.DATABASE_URL, {
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 10,
    idle_timeout: 20,
  })
}

export { sql }
