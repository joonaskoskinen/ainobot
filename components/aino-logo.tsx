"use client"

import { motion } from "framer-motion"

interface AinoLogoProps {
  className?: string
}

export default function AinoLogo({ className = "h-8 w-auto" }: AinoLogoProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      <motion.div
        className="relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>

          {/* Main "A" letter */}
          <div className="relative z-10 text-white font-bold text-lg">A</div>

          {/* AI dots */}
          <div className="absolute top-1 right-1 flex space-x-0.5">
            <motion.div
              className="w-1 h-1 bg-white rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
            />
            <motion.div
              className="w-1 h-1 bg-white rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
            />
            <motion.div
              className="w-1 h-1 bg-white rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.6 }}
            />
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl blur-sm opacity-50 -z-10"></div>
        </div>
      </motion.div>

      {/* Logo Text */}
      <motion.div
        className="flex flex-col"
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Aino
          </span>
          <span className="text-lg font-semibold text-blue-400">AI</span>
        </div>
        <div className="text-xs text-gray-400 -mt-1 tracking-wider">CHATBOT</div>
      </motion.div>
    </div>
  )
}
