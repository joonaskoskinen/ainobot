"use client"

import { useEffect } from "react"
import { usePerformance } from "@/hooks/use-performance"

export default function PerformanceMonitor() {
  const metrics = usePerformance()

  useEffect(() => {
    // Log performance metrics for debugging
    if (process.env.NODE_ENV === "development") {
      console.group("🚀 Performance Metrics")
      console.log("First Contentful Paint:", metrics.fcp ? `${metrics.fcp.toFixed(2)}ms` : "Not measured")
      console.log("Largest Contentful Paint:", metrics.lcp ? `${metrics.lcp.toFixed(2)}ms` : "Not measured")
      console.log("First Input Delay:", metrics.fid ? `${metrics.fid.toFixed(2)}ms` : "Not measured")
      console.log("Cumulative Layout Shift:", metrics.cls ? metrics.cls.toFixed(4) : "Not measured")
      console.log("Time to First Byte:", metrics.ttfb ? `${metrics.ttfb.toFixed(2)}ms` : "Not measured")
      console.groupEnd()
    }

    // Send metrics to analytics (in production)
    if (process.env.NODE_ENV === "production" && metrics.lcp) {
      // Example: Send to Google Analytics
      // gtag('event', 'web_vitals', {
      //   name: 'LCP',
      //   value: metrics.lcp,
      //   event_category: 'Performance'
      // })
    }
  }, [metrics])

  return null // This component doesn't render anything
}
