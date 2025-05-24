"use client"

import type React from "react"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // Yksinkertainen Markdown-parseri
  const parseMarkdown = (text: string): React.ReactNode => {
    const lines = text.split("\n")
    const elements: React.ReactNode[] = []
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
                <div key={index}>{parseInlineMarkdown(line)}</div>
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

      // Blockquote
      if (trimmedLine.startsWith("> ")) {
        flushList()
        inBlockquote = true
        blockquoteLines.push(trimmedLine.substring(2))
        return
      } else if (inBlockquote) {
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
      if (trimmedLine) {
        flushList()
        flushBlockquote()
        elements.push(
          <p key={`p-${index}`} className="text-gray-100 leading-relaxed my-2">
            {parseInlineMarkdown(trimmedLine)}
          </p>,
        )
      } else {
        flushList()
        flushBlockquote()
        // Empty line - add some spacing
        if (elements.length > 0) {
          elements.push(<div key={`space-${index}`} className="h-2" />)
        }
      }
    })

    // Flush any remaining content
    flushList()
    flushBlockquote()

    return elements
  }

  const parseInlineMarkdown = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = []
    let currentText = text
    let keyCounter = 0

    // Bold **text**
    currentText = currentText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
      const placeholder = `__BOLD_${keyCounter}__`
      parts.push(
        <strong key={`bold-${keyCounter}`} className="font-bold text-white">
          {content}
        </strong>,
      )
      keyCounter++
      return placeholder
    })

    // Italic *text*
    currentText = currentText.replace(/\*(.*?)\*/g, (match, content) => {
      const placeholder = `__ITALIC_${keyCounter}__`
      parts.push(
        <em key={`italic-${keyCounter}`} className="italic text-blue-200">
          {content}
        </em>,
      )
      keyCounter++
      return placeholder
    })

    // Code `text`
    currentText = currentText.replace(/`(.*?)`/g, (match, content) => {
      const placeholder = `__CODE_${keyCounter}__`
      parts.push(
        <code key={`code-${keyCounter}`} className="bg-gray-800 text-green-300 px-2 py-1 rounded text-sm font-mono">
          {content}
        </code>,
      )
      keyCounter++
      return placeholder
    })

    // Split by placeholders and reconstruct
    const segments = currentText.split(/(__[A-Z]+_\d+__)/g)
    const result: React.ReactNode[] = []

    segments.forEach((segment, index) => {
      if (segment.startsWith("__") && segment.endsWith("__")) {
        // Find the corresponding component
        const matchingPart = parts.find(
          (_, partIndex) => segment === `__${segment.split("_")[1]}_${segment.split("_")[2]}__`,
        )
        if (matchingPart) {
          result.push(matchingPart)
        }
      } else if (segment) {
        result.push(segment)
      }
    })

    return result.length > 0 ? result : text
  }

  return <div className={`markdown-content ${className}`}>{parseMarkdown(content)}</div>
}
