import { Variants } from "motion/react";

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

export const fadeSlideUp: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring" as const, stiffness: 80, damping: 20 } 
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1, 
    transition: { duration: 0.6 } 
  },
}

export const slideFromLeft: Variants = {
  hidden: { x: -60, opacity: 0 },
  show: { 
    x: 0, 
    opacity: 1, 
    transition: { type: "spring" as const, stiffness: 80, damping: 20 } 
  },
}
