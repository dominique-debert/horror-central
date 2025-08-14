'use client'

import { motion, HTMLMotionProps, Variants } from 'framer-motion'
import { ReactNode } from 'react'

// Animation variants
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

// Animation components
interface AnimateProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  variant?: 'fadeInUp' | 'fadeIn' | 'slideUp' | 'scale'
  delay?: number
  duration?: number
}

export const Animate = ({
  children,
  variant = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  ...props
}: AnimateProps) => {
  const variants: Record<string, Variants> = {
    fadeInUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration, delay, ease: [0.16, 1, 0.3, 1] }
      }
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration, delay, ease: 'easeOut' }
      }
    },
    slideUp: {
      hidden: { opacity: 0, y: 40 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration, delay, ease: [0.22, 1, 0.36, 1] }
      }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { 
          duration, 
          delay,
          ease: [0.16, 1, 0.3, 1]
        }
      }
    }
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={variants[variant]}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Staggered container
interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  children: ReactNode
}

export const StaggerContainer = ({ children, ...props }: StaggerContainerProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      variants={staggerContainer}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Reusable animation components
export const FadeInUp = (props: Omit<AnimateProps, 'variant'>) => (
  <Animate variant="fadeInUp" {...props} />
)

export const FadeIn = (props: Omit<AnimateProps, 'variant'>) => (
  <Animate variant="fadeIn" {...props} />
)

export const SlideUp = (props: Omit<AnimateProps, 'variant'>) => (
  <Animate variant="slideUp" {...props} />
)

export const Scale = (props: Omit<AnimateProps, 'variant'>) => (
  <Animate variant="scale" {...props} />
)
