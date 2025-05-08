import { motion } from 'framer-motion';
import { Rocket, Bot, Sparkles } from 'lucide-react';
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
    <div className="flex items-center justify-between w-full max-w-6xl mx-auto relative">
      {/* Logo Placeholder with Link */}
      <Link href="/" className="relative flex items-center">
        <span className="font-bold text-xl text-purple-800 tracking-tight">FastTrackAI</span>
        
        {/* Subtle sparkle effects around the logo */}
        <div className="absolute inset-0 overflow-hidden">
          <SparkleEffect delay={0.5} size={3} top="-2px" left="30%" color="rgba(168, 85, 247, 0.8)" />
          <SparkleEffect delay={1.2} size={2} top="50%" left="80%" color="rgba(79, 70, 229, 0.8)" />
          <SparkleEffect delay={2.1} size={2.5} top="80%" left="40%" color="rgba(168, 85, 247, 0.8)" />
          <SparkleEffect delay={0.8} size={2} top="15%" left="95%" color="rgba(79, 70, 229, 0.8)" />
        </div>
        
        {/* AI Indicator */}
        <motion.div 
          className="ml-1 flex items-center bg-gradient-to-r from-indigo-500 to-purple-700 px-1.5 py-0.5 rounded-md shadow-sm"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 8px rgba(139, 92, 246, 0.5)"
          }}
        >
          <Sparkles className="w-3 h-3 text-white mr-0.5" />
          <span className="text-white text-xs font-semibold tracking-wide">AI</span>
        </motion.div>
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