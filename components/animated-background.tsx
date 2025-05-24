"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  if (!isClient) return null

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs */}
      <motion.div
        className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full mix-blend-multiply filter blur-xl"
        animate={{
          x: mousePosition.x * 100 - 50,
          y: mousePosition.y * 100 - 50,
          scale: [1, 1.2, 1],
        }}
        transition={{
          x: { type: "spring", stiffness: 50, damping: 30 },
          y: { type: "spring", stiffness: 50, damping: 30 },
          scale: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }}
        style={{
          top: "10%",
          right: "10%",
        }}
      />

      <motion.div
        className="absolute w-80 h-80 bg-gradient-to-r from-purple-500/25 to-pink-500/25 rounded-full mix-blend-multiply filter blur-xl"
        animate={{
          x: -mousePosition.x * 80 + 40,
          y: -mousePosition.y * 80 + 40,
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{
          x: { type: "spring", stiffness: 40, damping: 25 },
          y: { type: "spring", stiffness: 40, damping: 25 },
          scale: { duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }}
        style={{
          bottom: "15%",
          left: "15%",
        }}
      />

      <motion.div
        className="absolute w-72 h-72 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-xl"
        animate={{
          x: mousePosition.x * 60 - 30,
          y: -mousePosition.y * 60 + 30,
          scale: [1, 1.3, 0.9, 1],
        }}
        transition={{
          x: { type: "spring", stiffness: 60, damping: 35 },
          y: { type: "spring", stiffness: 60, damping: 35 },
          scale: { duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }}
        style={{
          top: "50%",
          left: "50%",
        }}
      />

      {/* Floating Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400/40 rounded-full"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(i) * 50, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 8 + i * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
          style={{
            left: `${10 + ((i * 4) % 80)}%`,
            top: `${20 + ((i * 7) % 60)}%`,
          }}
        />
      ))}

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Animated Lines */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="rgb(147, 51, 234)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {Array.from({ length: 5 }).map((_, i) => (
          <motion.path
            key={i}
            d={`M ${i * 200} 0 Q ${i * 200 + 100} ${200 + i * 50} ${i * 200 + 200} 400`}
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 1.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {/* Pulsing Dots */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-1 h-1 bg-purple-400/60 rounded-full"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.4,
            ease: "easeOut",
          }}
          style={{
            left: `${15 + ((i * 12) % 70)}%`,
            top: `${25 + ((i * 9) % 50)}%`,
          }}
        />
      ))}

      {/* Rotating Rings */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-32 h-32 border border-blue-400/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <motion.div
          className="absolute inset-4 border border-purple-400/30 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <motion.div
            className="absolute inset-4 border border-cyan-400/40 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        </motion.div>
      </motion.div>

      {/* Neural Network Effect */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        {Array.from({ length: 6 }).map((_, i) => (
          <g key={`network-${i}`}>
            <motion.circle
              cx={`${20 + i * 15}%`}
              cy={`${30 + (i % 3) * 20}%`}
              r="2"
              fill="rgb(59, 130, 246)"
              animate={{
                opacity: [0.3, 1, 0.3],
                r: [2, 4, 2],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.3,
              }}
            />
            {i < 5 && (
              <motion.line
                x1={`${20 + i * 15}%`}
                y1={`${30 + (i % 3) * 20}%`}
                x2={`${20 + (i + 1) * 15}%`}
                y2={`${30 + ((i + 1) % 3) * 20}%`}
                stroke="rgb(147, 51, 234)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 1, 0] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.5,
                }}
              />
            )}
          </g>
        ))}
      </svg>

      {/* Floating AI Icons */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`ai-icon-${i}`}
          className="absolute text-blue-400/30 text-2xl"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 6 + i,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 2,
            ease: "easeInOut",
          }}
          style={{
            left: `${25 + i * 25}%`,
            top: `${40 + i * 10}%`,
          }}
        >
          🤖
        </motion.div>
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-transparent to-slate-900/50" />
    </div>
  )
}
