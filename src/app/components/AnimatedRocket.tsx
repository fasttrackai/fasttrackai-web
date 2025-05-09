import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import Link from 'next/link';

// Sparkle component for decorative elements
const SparkleEffect = ({ 
  delay = 0, 
  size = 4, 
  top, 
  left, 
  color = "#fff" 
}: { 
  delay?: number; 
  size?: number; 
  top: string; 
  left: string; 
  color?: string; 
}) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ 
      top, 
      left,
      width: size, 
      height: size,
      background: color,
      borderRadius: '50%',
      boxShadow: `0 0 ${size/2}px ${color}`
    }}
    animate={{
      scale: [0, 1.2, 0],
      opacity: [0, 1, 0],
    }}
    transition={{
      duration: 2,
      delay: delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 3 + 2
    }}
  />
);

export default function AnimatedRocket() {
  return (
    <div className="flex items-center w-full max-w-6xl mx-auto">
      {/* Logo with Rocket Icon */}
      <Link href="/" className="flex items-center">
        <div className="relative flex items-center justify-center w-12 h-12 mr-1">
          <div className="absolute w-10 h-10 bg-gradient-to-b from-purple-600 to-purple-800 rounded-full"></div>
          <Rocket className="w-5 h-5 text-white relative z-10" />
        </div>
        <div className="font-bold text-xl tracking-tight">
          <span className="text-black">fasttrack</span>
          <span className="text-purple-700">ai</span>
        </div>
      </Link>

      {/* Checkpoints with enhanced animation */}
      <div className="flex items-center justify-center space-x-4 ml-4 relative">
        {/* Subtle connecting line */}
        <div className="absolute h-0.5 w-full -z-10 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10"></div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 8,
            times: [0, 0.2, 0.3, 0.4],
            repeat: Infinity,
          }}
          className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-3 py-1 rounded-md text-white font-medium text-sm shadow-sm relative overflow-hidden"
        >
          <motion.div 
            className="absolute inset-0 bg-white opacity-0"
            animate={{ opacity: [0, 0.2, 0] }}
            transition={{ duration: 1.5, delay: 1, repeat: Infinity, repeatDelay: 7 }}
          />
          Grow
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 8,
            times: [0.3, 0.4, 0.5, 0.6],
            repeat: Infinity,
          }}
          className="bg-gradient-to-r from-blue-700 to-blue-800 px-3 py-1 rounded-md text-white font-medium text-sm shadow-sm relative overflow-hidden"
        >
          <motion.div 
            className="absolute inset-0 bg-white opacity-0"
            animate={{ opacity: [0, 0.2, 0] }}
            transition={{ duration: 1.5, delay: 3.2, repeat: Infinity, repeatDelay: 7 }}
          />
          Optimize
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 8,
            times: [0.5, 0.6, 0.65, 0.7],
            repeat: Infinity,
          }}
          className="bg-gradient-to-r from-purple-700 to-purple-800 px-3 py-1 rounded-md text-white font-medium text-sm shadow-sm relative overflow-hidden"
        >
          <motion.div 
            className="absolute inset-0 bg-white opacity-0"
            animate={{ opacity: [0, 0.2, 0] }}
            transition={{ duration: 1.5, delay: 5, repeat: Infinity, repeatDelay: 7 }}
          />
          Sell
        </motion.div>
      </div>
    </div>
  );
} 