import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllPosts, getPostBySlug, formatDate } from '@/lib/blog'
import { ArrowLeft, Clock, Tag, ExternalLink } from 'lucide-react'

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Metadata {
  const post = getPostBySlug(params.slug)
  if (!post) return {}

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `https://tools.alturas-digital.com/blog/${post.slug}`,
    author: {
      '@type': 'Organization',
      name: 'Alturas Digital',
      url: 'https://alturas-digital.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Alturas Digital',
      url: 'https://alturas-digital.com',
    },
  }

  return {
    title: `${post.title} | Alturas Digital`,
    description: post.description,
    alternates: {
      canonical: `https://tools.alturas-digital.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      url: `https://tools.alturas-digital.com/blog/${post.slug}`,
    },
  }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `https://tools.alturas-digital.com/blog/${post.slug}`,
    author: {
      '@type': 'Organization',
      name: 'Alturas Digital',
      url: 'https://alturas-digital.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Alturas Digital',
      url: 'https://alturas-digital.com',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main className="min-h-screen bg-bg">
        {/* Nav */}
        <nav className="border-b border-border/60 bg-bg/80 backdrop-blur sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="text-sm font-semibold text-white hover:text-teal transition-colors">
              Alturas Digital Tools
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/herramientas" className="text-xs text-gray-500 hover:text-white transition-colors">
                Herramientas
              </Link>
              <Link href="/blog" className="text-xs text-gray-500 hover:text-white transition-colors">
                Blog
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-10">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-teal transition-colors mb-8"
          >
            <ArrowLeft size={13} />
            Volver al blog
          </Link>

          {/* Article header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal bg-teal/10 border border-teal/20 rounded-full px-2.5 py-1">
                <Tag size={10} />
                {post.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                <Clock size={10} />
                {post.readingTime} de lectura
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black leading-snug mb-4">
              {post.title}
            </h1>

            <p className="text-gray-400 text-base leading-relaxed mb-4">
              {post.description}
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-600 border-t border-border/40 pt-4">
              <span>Por</span>
              <a href="https://alturas-digital.com" target="_blank" rel="noopener noreferrer" className="text-teal/80 hover:text-teal transition-colors font-medium">
                Alturas Digital
              </a>
              <span>·</span>
              <span>{formatDate(post.date)}</span>
            </div>
          </header>

          {/* Article body */}
          <article
            className="prose-blog"
            dangerouslySetInnerHTML={{ __html: post.htmlContent }}
          />

          {/* CTA final */}
          <div className="mt-12 pt-8 border-t border-border/40">
            <div className="bg-surface border border-border rounded-2xl p-7 text-center">
              <p className="text-xs font-semibold text-teal uppercase tracking-widest mb-2">¿Querés mejorar tu presencia digital?</p>
              <h2 className="text-xl font-bold mb-2">Hablemos de tu negocio turístico</h2>
              <p className="text-sm text-gray-400 mb-5 max-w-md mx-auto">
                En Alturas Digital trabajamos exclusivamente con operadores turísticos. Si querés saber cómo aplicar esto a tu caso específico, agendá una consulta gratuita.
              </p>
              <a
                href="https://alturas-digital.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-teal hover:opacity-90 text-bg font-bold text-sm py-3 px-6 rounded-xl transition-opacity"
              >
                Hablar con Alturas Digital
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-gray-600 text-xs">
              Un artículo de{' '}
              <a href="https://alturas-digital.com" target="_blank" rel="noopener noreferrer" className="text-teal/70 hover:text-teal transition-colors">
                Alturas Digital
              </a>{' '}
              · Agencia de marketing digital especializada en turismo
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
