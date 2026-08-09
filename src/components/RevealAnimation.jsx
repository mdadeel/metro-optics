"use client";

import { motion } from "motion/react"

/**
 * Reusable scroll-triggered reveal animation wrapper.
 * Children fade in + slide up when they enter the viewport.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.6,
  once = true,
}) {
  const directionVariants = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 },
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...directionVariants[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Staggered children reveal - each child appears with a progressive delay.
 */
export function StaggerReveal({
  children,
  className = "",
  staggerDelay = 0.08,
  once = true,
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Individual item for use inside a StaggerReveal parent.
 */
export function RevealItem({
  children,
  className = "",
  direction = "up",
  duration = 0.5,
}) {
  const directionVariants = {
    up: { y: 24 },
    down: { y: -24 },
    left: { x: 24 },
    right: { x: -24 },
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...directionVariants[direction] },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
