import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ResponsiveCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
}

/**
 * A responsive card component that provides consistent spacing
 * across different screen sizes with improved mobile padding
 */
export default function ResponsiveCard({ 
  children, 
  className = '',
  ...motionProps
}: ResponsiveCardProps) {
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-100 hover:shadow-lg transition-all duration-300 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
} 