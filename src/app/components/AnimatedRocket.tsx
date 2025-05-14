import { motion } from 'framer-motion';
import { Rocket, Bot } from 'lucide-react';
import Link from 'next/link';

export default function AnimatedRocket() {
  return (
    <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
      {/* Logo with fasttrackai text */}
      <Link href="/" className="flex items-center group">
        <motion.div
          className="bg-purple-700 p-2.5 rounded-lg mr-2.5 relative overflow-visible shadow-lg"
          whileHover={{ 
            scale: 1.05,
            rotate: [0, -3, 3, 0],
            transition: { rotate: { duration: 0.5 } }
          }}
          whileTap={{ scale: 0.95 }}
          // Add subtle floating animation
          animate={{ 
            y: [0, -2, 0], 
            boxShadow: [
              '0 4px 6px -1px rgba(139, 92, 246, 0.3), 0 2px 4px -1px rgba(139, 92, 246, 0.2)',
              '0 4px 12px -1px rgba(139, 92, 246, 0.5), 0 2px 8px -1px rgba(139, 92, 246, 0.4)',
              '0 4px 6px -1px rgba(139, 92, 246, 0.3), 0 2px 4px -1px rgba(139, 92, 246, 0.2)'
            ]
          }}
          transition={{ 
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Portal effect behind the rocket */}
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <motion.div 
              className="absolute -inset-1 bg-gradient-to-r from-purple-800/30 via-purple-600/30 to-indigo-700/30 blur-sm"
              animate={{ 
                rotate: [0, 360],
                scale: [0.98, 1.02, 0.98],
              }}
              transition={{ 
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          </div>
          
          {/* Star particles effect */}
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-0.5 w-0.5 bg-white rounded-full opacity-70"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  repeatDelay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Integrated rocket - removed thruster effect */}
          <div className="relative">
            <Rocket className="h-7 w-7 text-white relative z-10" />
          </div>
          
          {/* AI Bot indicator with glow */}
          <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5 border-2 border-purple-700 shadow-md">
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 0px rgba(251, 191, 36, 0.0)',
                  '0 0 6px rgba(251, 191, 36, 0.5)',
                  '0 0 0px rgba(251, 191, 36, 0.0)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Bot className="h-3 w-3 text-purple-700" strokeWidth={3} />
            </motion.div>
          </div>
        </motion.div>
        
        {/* Text without hover animation that was causing flickering */}
        <span className="font-bold text-2xl md:text-[1.65rem] tracking-tight group-hover:text-purple-700 transition-colors duration-300 font-minigap relative">
          <span className="text-black relative inline-block">
            <motion.span
              className="absolute -top-1 -right-1 h-0.5 w-0.5 bg-purple-400 rounded-full opacity-0"
              animate={{
                opacity: [0, 0.8, 0],
                y: [0, -8],
                x: [0, 3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            />
            fasttrack
          </span>
          <span className="text-amber-600 relative">
            <motion.span
              className="absolute -top-1 left-1 h-1 w-1 bg-amber-300 rounded-full opacity-0"
              animate={{
                opacity: [0, 0.8, 0],
                y: [0, -10],
                x: [0, 5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 4,
                delay: 1,
              }}
            />
            ai
          </span>
        </span>
      </Link>

      {/* Checkpoints - condensed spacing */}
      <div className="flex items-center justify-center space-x-4 ml-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 8,
            times: [0, 0.2, 0.3, 0.4],
            repeat: Infinity,
          }}
          className="bg-emerald-800 px-3 py-1 rounded-md text-white font-medium text-sm shadow-sm"
        >
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
          className="bg-blue-800 px-3 py-1 rounded-md text-white font-medium text-sm shadow-sm"
        >
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
          className="bg-purple-800 px-3 py-1 rounded-md text-white font-medium text-sm shadow-sm"
        >
          Sell
        </motion.div>
      </div>
    </div>
  );
} 