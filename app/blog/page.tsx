import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllPosts, formatDate } from '@/lib/blog'
import { ArrowRight, Clock, Tag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog de Marketing Turístico | Alturas Digital',
  description: 'Artículos prácticos sobre marketing digital para operadores turísticos: estrategias, publicidad paga, SEO y herramientas gratuitas para atraer más reservas.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
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
            <Link href="/blog" className="text-xs text-teal font-medium">
              Blog
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-14">
        {/* Header */}
        <div className="mb-12">
          <span className="inline-block text-xs font-semibold text-teal uppercase tracking-widest mb-3">Blog</span>
          <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight">
            Marketing digital para<br />operadores turísticos
          </h1>
          <p className="text-gray-400 text-base max-w-xl">
            Estrategias prácticas, sin tecnicismos, para atraer más reservas y mejorar tu presencia digital.
          </p>
        </div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-surface border border-border rounded-2xl p-6 hover:border-teal/40 transition-all duration-200 flex flex-col"
            >
              {/* Category + reading time */}
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal bg-teal/10 border border-teal/20 rounded-full px-2.5 py-1">
                  <Tag size={10} />
                  {post.category}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                  <Clock size={10} />
                  {post.readingTime}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-white leading-snug mb-2 group-hover:text-teal transition-colors">
                {post.title}
              </h2>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">
                {post.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <span className="text-xs text-gray-600">{formatDate(post.date)}</span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-teal group-hover:gap-2 transition-all">
                  Leer artículo
                  <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border/40 text-center">
          <p className="text-gray-600 text-xs">
            Un blog de{' '}
            <a href="https://alturas-digital.com" target="_blank" rel="noopener noreferrer" className="text-teal/70 hover:text-teal transition-colors">
              Alturas Digital
            </a>{' '}
            · Agencia de marketing digital especializada en turismo
          </p>
        </div>
      </div>
    </main>
  )
}
