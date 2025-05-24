"use client"

import { motion, type Variants, type MotionProps } from "framer-motion"
import { forwardRef, type ReactNode } from "react"

// Optimized animation variants
export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

export const scaleInVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

// Optimized motion components
interface OptimizedMotionProps extends MotionProps {
  children: ReactNode
  className?: string
}

export const FadeInMotion = forwardRef<HTMLDivElement, OptimizedMotionProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div ref={ref} className={className} variants={fadeInVariants} initial="hidden" animate="visible" {...props}>
      {children}
    </motion.div>
  ),
)
FadeInMotion.displayName = "FadeInMotion"

export const ScaleInMotion = forwardRef<HTMLDivElement, OptimizedMotionProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={className}
      variants={scaleInVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {children}
    </motion.div>
  ),
)
ScaleInMotion.displayName = "ScaleInMotion"

export const SlideUpMotion = forwardRef<HTMLDivElement, OptimizedMotionProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={className}
      variants={slideUpVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {children}
    </motion.div>
  ),
)
SlideUpMotion.displayName = "SlideUpMotion"

export const StaggerContainer = forwardRef<HTMLDivElement, OptimizedMotionProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={className}
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {children}
    </motion.div>
  ),
)
StaggerContainer.displayName = "StaggerContainer"

export const CardHoverMotion = forwardRef<HTMLDivElement, OptimizedMotionProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={className}
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      {...props}
    >
      {children}
    </motion.div>
  ),
)
CardHoverMotion.displayName = "CardHoverMotion"

// Performance-optimized button component
interface AnimatedButtonProps extends OptimizedMotionProps {
  variant?: "primary" | "secondary"
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  disabled?: boolean
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className, variant = "primary", size = "md", onClick, disabled, ...props }, ref) => (
    <motion.button
      ref={ref}
      className={`
        ${className}
        ${variant === "primary" ? "bg-gradient-to-r from-blue-600 to-purple-600" : "border border-blue-400/50"}
        ${size === "sm" ? "px-4 py-2 text-sm" : size === "lg" ? "px-8 py-4 text-lg" : "px-6 py-3"}
        rounded-lg font-medium transition-all duration-200 will-change-transform
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  ),
)
AnimatedButton.displayName = "AnimatedButton"
