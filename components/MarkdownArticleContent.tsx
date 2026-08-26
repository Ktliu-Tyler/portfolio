/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import type { ReactNode } from 'react'

type MarkdownBlock =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'image'; alt: string; src: string }
  | { type: 'code'; code: string; language: string }
  | { type: 'rule' }

function parseMarkdown(content: string): MarkdownBlock[] {
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const blocks: MarkdownBlock[] = []
  let paragraph: string[] = []
  let listItems: string[] = []
  let codeLines: string[] = []
  let codeLanguage = ''
  let inCodeBlock = false

  function flushParagraph() {
    if (paragraph.length > 0) {
      blocks.push({ type: 'paragraph', text: paragraph.join(' ') })
      paragraph = []
    }
  }

  function flushList() {
    if (listItems.length > 0) {
      blocks.push({ type: 'list', items: listItems })
      listItems = []
    }
  }

  lines.forEach((line) => {
    const trimmed = line.trim()

    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        blocks.push({
          type: 'code',
          code: codeLines.join('\n'),
          language: codeLanguage,
        })
        codeLines = []
        codeLanguage = ''
        inCodeBlock = false
        return
      }

      flushParagraph()
      flushList()
      codeLanguage = trimmed.replace(/^```/, '').trim()
      inCodeBlock = true
      return
    }

    if (inCodeBlock) {
      codeLines.push(line)
      return
    }

    if (!trimmed) {
      flushParagraph()
      flushList()
      return
    }

    if (trimmed === '---') {
      flushParagraph()
      flushList()
      blocks.push({ type: 'rule' })
      return
    }

    const imageMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/)

    if (imageMatch) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'image', alt: imageMatch[1], src: imageMatch[2] })
      return
    }

    if (trimmed.startsWith('## ')) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'heading', level: 2, text: trimmed.replace(/^## /, '') })
      return
    }

    if (trimmed.startsWith('### ')) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'heading', level: 3, text: trimmed.replace(/^### /, '') })
      return
    }

    if (trimmed.startsWith('- ')) {
      flushParagraph()
      listItems.push(trimmed.replace(/^- /, ''))
      return
    }

    paragraph.push(trimmed)
  })

  flushParagraph()
  flushList()

  return blocks
}

function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g
  let cursor = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) {
      parts.push(text.slice(cursor, match.index))
    }

    const token = match[0]

    if (token.startsWith('`')) {
      parts.push(
        <code
          key={`${token}-${match.index}`}
          className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-slate-800 dark:bg-white/[0.06] dark:text-slate-200"
        >
          {token.slice(1, -1)}
        </code>,
      )
    } else if (token.startsWith('**')) {
      parts.push(
        <strong key={`${token}-${match.index}`} className="font-medium text-slate-950 dark:text-white">
          {token.slice(2, -2)}
        </strong>,
      )
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)

      if (linkMatch) {
        parts.push(
          <Link
            key={`${token}-${match.index}`}
            href={linkMatch[2]}
            target={linkMatch[2].startsWith('http') ? '_blank' : undefined}
            rel={linkMatch[2].startsWith('http') ? 'noopener noreferrer' : undefined}
            className="marker-link font-medium text-slate-950 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-600 dark:text-white dark:decoration-white/25 dark:hover:text-slate-300"
          >
            {linkMatch[1]}
          </Link>,
        )
      }
    }

    cursor = match.index + token.length
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor))
  }

  return parts
}

export default function MarkdownArticleContent({ content }: { content: string }) {
  const blocks = parseMarkdown(content)

  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          const HeadingTag = block.level === 2 ? 'h2' : 'h3'

          return (
            <HeadingTag
              key={`${block.text}-${index}`}
              className={
                block.level === 2
                  ? 'marker-heading text-2xl font-heading font-medium tracking-tight text-slate-950 dark:text-white sm:text-3xl'
                  : 'text-xl font-heading font-medium text-slate-800 dark:text-slate-100'
              }
            >
              {block.text}
            </HeadingTag>
          )
        }

        if (block.type === 'paragraph') {
          return (
            <p
              key={`${block.text}-${index}`}
              className="text-base leading-8 text-slate-700 dark:text-slate-300 sm:text-lg"
            >
              {renderInline(block.text)}
            </p>
          )
        }

        if (block.type === 'list') {
          return (
            <ul
              key={`list-${index}`}
              className="space-y-3 text-base leading-8 text-slate-700 dark:text-slate-300"
            >
              {block.items.map((item) => (
                <li key={item} className="marker-list-item flex gap-3 border-l border-slate-200 pl-4 dark:border-white/[0.12]">
                  <span className="marker-bullet mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          )
        }

        if (block.type === 'image') {
          return (
            <figure key={`${block.src}-${index}`} className="space-y-3">
              <div className="marker-card overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.03]">
                <img src={block.src} alt={block.alt} className="h-auto w-full object-cover" />
              </div>
              {block.alt && (
                <figcaption className="text-center text-xs text-slate-500 dark:text-slate-400">
                  {block.alt}
                </figcaption>
              )}
            </figure>
          )
        }

        if (block.type === 'code') {
          return (
            <pre
              key={`code-${index}`}
              className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-5 text-sm leading-7 text-slate-100 dark:border-white/[0.08]"
            >
              <code data-language={block.language}>{block.code}</code>
            </pre>
          )
        }

        return (
          <div
            key={`rule-${index}`}
            className="editorial-rule"
          />
        )
      })}
    </>
  )
}
