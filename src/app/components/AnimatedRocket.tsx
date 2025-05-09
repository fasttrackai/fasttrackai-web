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

// Robot head outline component with gold circular background
const RobotHead = () => (
  <div className="absolute -top-5 left-14 z-30 w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none"
      className="relative"
    >
      <rect 
        x="4" 
        y="6" 
        width="16" 
        height="12" 
        rx="2" 
        stroke="white" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      <circle cx="9" cy="12" r="1.5" stroke="white" strokeWidth="2.5" />
      <circle cx="15" cy="12" r="1.5" stroke="white" strokeWidth="2.5" />
      <line x1="8" y1="18" x2="16" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="7" y1="4" x2="7" y2="6" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="17" y1="4" x2="17" y2="6" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  </div>
);

export default function AnimatedRocket() {
  return (
    <div className="flex items-center w-full max-w-6xl mx-auto">
      {/* Logo with Rocket Icon */}
      <Link href="/" className="flex items-center">
        <div className="relative mr-6">
          <motion.div 
            className="relative flex items-center justify-center w-14 h-14"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {/* Rounded square background instead of circle */}
            <div className="absolute w-14 h-14 bg-purple-700 rounded-xl"></div>
            
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
              <Rocket className="w-8 h-8 text-white stroke-[2.5px] relative z-10" />
            </motion.div>
            
            {/* Sparkle effects */}
            <SparkleEffect top="25%" left="25%" delay={0.5} color="white" />
            <SparkleEffect top="30%" left="70%" delay={1.2} color="white" />
            <SparkleEffect top="60%" left="40%" delay={0.8} color="white" />
            <SparkleEffect top="70%" left="65%" delay={1.7} color="white" size={3} />
          </motion.div>
          
          {/* Robot head placed in gold circle */}
          <RobotHead />
        </div>
        
        <div className="font-sans text-3xl tracking-tighter">
          <span className="text-black font-bold">fasttrack</span>
          <span className="text-amber-500 font-bold">ai</span>
        </div>
      </Link>

      {/* Checkpoints with enhanced animation */}
      <div className="flex items-center justify-center space-x-4 ml-4 relative">
        {/* Removed the subtle connecting line */}
        
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