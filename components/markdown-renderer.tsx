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

      // Skip empty lines
      if (!trimmedLine) {
        flushList()
        flushBlockquote()
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
          <h2 key={`h2-${index}`} className="text-xl font-bold text-white mt-4 mb-2">
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

      // Lists - handle both • and -
      if (trimmedLine.match(/^[•-]\s+/)) {
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

    // Handle bold **text** first
    let result = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Handle italic *text* (but not when part of **)
    result = result.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>")

    // Handle code `text`
    result = result.replace(/`([^`]+)`/g, "<code>$1</code>")

    // Split by HTML tags and process
    const parts = result.split(/(<\/?(?:strong|em|code)>)/g)

    return parts
      .map((part, index) => {
        if (part === "<strong>") return null
        if (part === "</strong>") return null
        if (part === "<em>") return null
        if (part === "</em>") return null
        if (part === "<code>") return null
        if (part === "</code>") return null

        // Check if this part should be wrapped
        const prevTag = parts[index - 1]
        const nextTag = parts[index + 1]

        if (prevTag === "<strong>" && nextTag === "</strong>") {
          return (
            <strong key={index} className="font-bold text-white">
              {part}
            </strong>
          )
        }
        if (prevTag === "<em>" && nextTag === "</em>") {
          return (
            <em key={index} className="italic text-blue-200">
              {part}
            </em>
          )
        }
        if (prevTag === "<code>" && nextTag === "</code>") {
          return (
            <code key={index} className="bg-gray-800 text-green-300 px-2 py-1 rounded text-sm font-mono">
              {part}
            </code>
          )
        }

        return part
      })
      .filter(Boolean)
  }

  return <div className={`markdown-content ${className}`}>{parseMarkdown(content)}</div>
}
