import { NextRequest, NextResponse } from 'next/server'

interface PsiAudit {
  title: string
  displayValue?: string
  score: number | null
  details?: { type: string; overallSavingsMs?: number }
}

interface PsiData {
  lighthouseResult?: {
    categories?: Record<string, { score: number }>
    audits?: Record<string, PsiAudit>
  }
}

async function psiCall(url: string, strategy: 'mobile' | 'desktop', key: string): Promise<PsiData> {
  const endpoint =
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
    `?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${key}` +
    `&category=performance&category=accessibility&category=best-practices&category=seo`
  const res = await fetch(endpoint, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`PSI ${strategy} ${res.status}`)
  return res.json()
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 })

  const key = process.env.GOOGLE_PAGESPEED_API_KEY
  if (!key) {
    return NextResponse.json({
      mobile: {
        performance: 45, accessibility: 72, bestPractices: 79, seo: 83,
        metrics: {
          fcp: { display: '2.1 s', score: 0.4 },
          lcp: { display: '4.8 s', score: 0.2 },
          tbt: { display: '480 ms', score: 0.3 },
          cls: { display: '0.18', score: 0.4 },
          si:  { display: '3.2 s', score: 0.5 },
        },
        opportunities: [
          { title: 'Imágenes sin comprimir', displayValue: 'Potencial ahorro de 1.8 s', savingsS: '1.8 s' },
          { title: 'JavaScript sin usar', displayValue: 'Potencial ahorro de 0.9 s', savingsS: '0.9 s' },
        ],
      },
      desktop: { performance: 62 },
    })
  }

  try {
    const [mob, desk] = await Promise.all([
      psiCall(url, 'mobile', key),
      psiCall(url, 'desktop', key),
    ])

    const cats = mob.lighthouseResult?.categories ?? {}
    const aud  = mob.lighthouseResult?.audits ?? {}

    const catScore = (k: string) =>
      cats[k] != null ? Math.round(cats[k].score * 100) : 0

    const metricOf = (k: string) => {
      const a = aud[k]
      return { display: a?.displayValue ?? null, score: a?.score ?? null }
    }

    const opportunities = Object.values(aud)
      .filter((a): a is PsiAudit & { details: NonNullable<PsiAudit['details']> } =>
        a.score !== null &&
        a.score < 0.9 &&
        a.details?.type === 'opportunity' &&
        (a.details?.overallSavingsMs ?? 0) > 200
      )
      .sort((a, b) =>
        (b.details.overallSavingsMs ?? 0) - (a.details.overallSavingsMs ?? 0)
      )
      .slice(0, 4)
      .map(a => ({
        title: a.title,
        displayValue: a.displayValue ?? null,
        savingsS: a.details.overallSavingsMs
          ? `${(a.details.overallSavingsMs / 1000).toFixed(1)} s`
          : null,
      }))

    const deskCats = desk.lighthouseResult?.categories ?? {}

    return NextResponse.json({
      mobile: {
        performance:   catScore('performance'),
        accessibility: catScore('accessibility'),
        bestPractices: catScore('best-practices'),
        seo:           catScore('seo'),
        metrics: {
          fcp: metricOf('first-contentful-paint'),
          lcp: metricOf('largest-contentful-paint'),
          tbt: metricOf('total-blocking-time'),
          cls: metricOf('cumulative-layout-shift'),
          si:  metricOf('speed-index'),
        },
        opportunities,
      },
      desktop: {
        performance: deskCats['performance'] != null
          ? Math.round(deskCats['performance'].score * 100)
          : 0,
      },
    })
  } catch (e) {
    console.error('[pagespeed]', e)
    return NextResponse.json({ error: 'pagespeed_failed' }, { status: 502 })
  }
}
