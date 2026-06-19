import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 })

  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY
  if (!apiKey) {
    return NextResponse.json({ score: 45, fcp: null, lcp: null })
  }

  try {
    const endpoint =
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
      `?url=${encodeURIComponent(url)}&strategy=mobile&key=${apiKey}`

    const res = await fetch(endpoint, { next: { revalidate: 3600 } })

    if (!res.ok) {
      console.error('[pagespeed] API error', res.status)
      return NextResponse.json({ score: 45, fcp: null, lcp: null })
    }

    const data = await res.json()
    const perf  = data.lighthouseResult?.categories?.performance
    const score = perf ? Math.round(perf.score * 100) : 45

    const audits = data.lighthouseResult?.audits ?? {}
    const fcpMs  = audits['first-contentful-paint']?.numericValue
    const lcpMs  = audits['largest-contentful-paint']?.numericValue

    return NextResponse.json({
      score,
      fcp: fcpMs ? `${(fcpMs / 1000).toFixed(1)}s` : null,
      lcp: lcpMs ? `${(lcpMs / 1000).toFixed(1)}s` : null,
    })
  } catch (e) {
    console.error('[pagespeed]', e)
    return NextResponse.json({ score: 45, fcp: null, lcp: null })
  }
}
