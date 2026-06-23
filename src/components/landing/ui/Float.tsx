import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FloatProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

export function Float({ 
  children, 
  className, 
  delay = 0,
  duration = 4,
  yOffset = 15
}: FloatProps) {
  return (
    <motion.div
      className={cn("w-fit", className)}
      animate={{ y: [0, -yOffset, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
