"use client";

import { motion } from "motion/react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className={`bg-[#e2ebe6] border border-[#d0dcd4] ${className}`}
      style={{ borderRadius: "2px" }}
    />
  );
}
