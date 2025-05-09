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

// Robot head outline component
const RobotHead = () => (
  <svg 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="none" 
    className="absolute -right-1 -top-1 z-20"
    style={{ filter: "drop-shadow(0 0 1px rgba(255,255,255,0.5))" }}
  >
    <rect 
      x="3" 
      y="5" 
      width="18" 
      height="14" 
      rx="2" 
      stroke="white" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    <circle cx="9" cy="12" r="2" stroke="white" strokeWidth="2" />
    <circle cx="15" cy="12" r="2" stroke="white" strokeWidth="2" />
    <line x1="8" y1="19" x2="16" y2="19" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="7" y1="3" x2="7" y2="5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="17" y1="3" x2="17" y2="5" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function AnimatedRocket() {
  return (
    <div className="flex items-center w-full max-w-6xl mx-auto">
      {/* Logo with Rocket Icon */}
      <Link href="/" className="flex items-center">
        <motion.div 
          className="relative flex items-center justify-center w-14 h-14 mr-2"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {/* Rounded square background instead of circle */}
          <div className="absolute w-12 h-12 bg-purple-700 rounded-lg"></div>
          
          {/* White outlined rocket with hover effect */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -2, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative z-10"
          >
            <Rocket className="w-6 h-6 text-white stroke-[2.5px] relative z-10" />
            {/* Robot head near rocket tip */}
            <RobotHead />
          </motion.div>
          
          {/* Sparkle effects */}
          <SparkleEffect top="25%" left="25%" delay={0.5} color="white" />
          <SparkleEffect top="30%" left="70%" delay={1.2} color="white" />
          <SparkleEffect top="60%" left="40%" delay={0.8} color="white" />
          <SparkleEffect top="70%" left="65%" delay={1.7} color="white" size={3} />
        </motion.div>
        
        <div className="font-bold text-xl tracking-tight">
          <span className="text-black">fasttrack</span>
          <span className="text-amber-500">ai</span>
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