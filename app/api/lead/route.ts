import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { businessName, email, websiteUrl, location, src, score, answers } = body

    if (!email || !businessName) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    if (!sql) {
      // Sin DATABASE_URL — modo desarrollo sin DB
      console.log('[LEAD — sin DB]', { businessName, email, src, score, answers })
      return NextResponse.json({ ok: true, id: null, warning: 'Sin DATABASE_URL' })
    }

    const [lead] = await sql`
      INSERT INTO leads (business_name, email, website_url, location, src, score, answers)
      VALUES (
        ${businessName},
        ${email},
        ${websiteUrl ?? null},
        ${location ?? null},
        ${src ?? null},
        ${score ?? null},
        ${answers ? JSON.stringify(answers) : null}
      )
      ON CONFLICT DO NOTHING
      RETURNING id
    `

    // TODO sesión 2: disparar envío de email con Resend si email_sent = false
    console.log('[LEAD guardado] id:', lead?.id, '| src:', src, '| score:', score)

    return NextResponse.json({ ok: true, id: lead?.id ?? null })
  } catch (err) {
    console.error('[LEAD error]', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
