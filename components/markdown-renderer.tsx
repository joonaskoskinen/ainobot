"use client"

import React from "react"

import type { ReactNode } from "react"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const parseMarkdown = (text: string): ReactNode => {
    const lines = text.split("\n")
    const elements: ReactNode[] = []
    let currentList: string[] = []
    let inBlockquote = false
    let blockquoteLines: string[] = []

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 my-2 ml-4">
            {currentList.map((item, index) => (
              <li key={index} className="text-gray-100">
                {parseInlineMarkdown(item)}
              </li>
            ))}
          </ul>,
        )
        currentList = []
      }
    }

    const flushBlockquote = () => {
      if (blockquoteLines.length > 0) {
        elements.push(
          <blockquote
            key={`quote-${elements.length}`}
            className="border-l-4 border-blue-400 pl-4 py-2 my-3 bg-blue-900/20 rounded-r"
          >
            <div className="text-blue-200 italic">
              {blockquoteLines.map((line, index) => (
                <React.Fragment key={index}>
                  {parseInlineMarkdown(line)}
                  {index < blockquoteLines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </blockquote>,
        )
        blockquoteLines = []
        inBlockquote = false
      }
    }

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()

      // Tyhjä rivi
      if (!trimmedLine) {
        flushList()
        flushBlockquote()
        elements.push(<div key={`space-${index}`} className="h-2" />)
        return
      }

      // Blockquote
      if (trimmedLine.startsWith("> ")) {
        flushList()
        inBlockquote = true
        blockquoteLines.push(trimmedLine.substring(2))
        return
      } else if (inBlockquote && !trimmedLine.startsWith(">")) {
        flushBlockquote()
      }

      // Headers
      if (trimmedLine.startsWith("## ")) {
        flushList()
        flushBlockquote()
        elements.push(
          <h2 key={`h2-${index}`} className="text-xl font-bold text-white mt-4 mb-2 flex items-center">
            {parseInlineMarkdown(trimmedLine.substring(3))}
          </h2>,
        )
        return
      }

      if (trimmedLine.startsWith("### ")) {
        flushList()
        flushBlockquote()
        elements.push(
          <h3 key={`h3-${index}`} className="text-lg font-semibold text-white mt-3 mb-2">
            {parseInlineMarkdown(trimmedLine.substring(4))}
          </h3>,
        )
        return
      }

      // Lists
      if (trimmedLine.startsWith("• ") || trimmedLine.startsWith("- ")) {
        flushBlockquote()
        currentList.push(trimmedLine.substring(2))
        return
      }

      // Regular paragraphs
      flushList()
      flushBlockquote()
      elements.push(
        <p key={`p-${index}`} className="text-gray-100 leading-relaxed my-2">
          {parseInlineMarkdown(trimmedLine)}
        </p>,
      )
    })

    // Flush any remaining content
    flushList()
    flushBlockquote()

    return elements
  }

  const parseInlineMarkdown = (text: string): ReactNode => {
    if (!text) return ""

    const parts: ReactNode[] = []
    let remaining = text
    let keyCounter = 0

    const processMatch = (regex: RegExp, component: (content: string, key: string) => ReactNode) => {
      let match
      while ((match = regex.exec(remaining)) !== null) {
        const content = match[1]
        const key = `__${match[0].replace(/[^A-Z0-9]/g, "_")}_${keyCounter}__`
        parts.push(component(content, key))
        remaining = remaining.replace(match[0], key)
        keyCounter++
      }
    }

    // Process bold **text**
    processMatch(/\*\*(.*?)\*\*/g, (content, key) => (
      <strong key={key} className="font-bold text-white">
        {content}
      </strong>
    ))

    // Process italic *text*
    processMatch(/(?<!\*)\*([^*]+)\*(?!\*)/g, (content, key) => (
      <em key={key} className="italic text-blue-200">
        {content}
      </em>
    ))

    // Process code `text`
    processMatch(/`([^`]+)`/g, (content, key) => (
      <code key={key} className="bg-gray-800 text-green-300 px-2 py-1 rounded text-sm font-mono">
        {content}
      </code>
    ))

    // Split and reconstruct
    const segments = remaining.split(/(__[^_]+(?:_[^_]+)+__)/g)
    const result: ReactNode[] = []

    segments.forEach((segment, index) => {
      if (segment.match(/^(__[^_]+(?:_[^_]+)+__)$/)) {
        const matchingPart = parts.find((part: any) => part.key === segment)
        if (matchingPart) {
          result.push(matchingPart)
        } else {
          result.push(segment) // If not found, keep the original segment
        }
      } else {
        result.push(segment)
      }
    })

    return result.length > 0 ? result : text
  }

  return <div className={`markdown-content ${className}`}>{parseMarkdown(content)}</div>
}
