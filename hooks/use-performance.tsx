"use client"

import { useEffect, useState } from "react"

interface PerformanceMetrics {
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  ttfb?: number // Time to First Byte
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})

  useEffect(() => {
    // Measure Core Web Vitals
    const measurePerformance = () => {
      // First Contentful Paint
      const fcpEntry = performance.getEntriesByName("first-contentful-paint")[0] as PerformanceEntry
      if (fcpEntry) {
        setMetrics((prev) => ({ ...prev, fcp: fcpEntry.startTime }))
      }

      // Time to First Byte
      const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      if (navigationEntry) {
        setMetrics((prev) => ({
          ...prev,
          ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
        }))
      }
    }

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as PerformanceEntry
      setMetrics((prev) => ({ ...prev, lcp: lastEntry.startTime }))
    })

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        setMetrics((prev) => ({ ...prev, fid: entry.processingStart - entry.startTime }))
      })
    })

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      setMetrics((prev) => ({ ...prev, cls: clsValue }))
    })

    try {
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] })
      fidObserver.observe({ entryTypes: ["first-input"] })
      clsObserver.observe({ entryTypes: ["layout-shift"] })
    } catch (error) {
      console.warn("Performance Observer not supported:", error)
    }

    measurePerformance()

    return () => {
      lcpObserver.disconnect()
      fidObserver.disconnect()
      clsObserver.disconnect()
    }
  }, [])

  return metrics
}
