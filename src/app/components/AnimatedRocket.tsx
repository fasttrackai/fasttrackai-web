import { motion } from 'framer-motion';
import { Rocket, Bot } from 'lucide-react';
import Link from 'next/link';

export default function AnimatedRocket() {
  return (
    <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
      {/* Logo with fasttrackai text */}
      <Link href="/" className="flex items-center group">
        <motion.div
          className="bg-purple-700 p-2.5 rounded-lg mr-2.5 relative overflow-visible shadow-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Integrated rocket and AI robot */}
          <Rocket className="h-7 w-7 text-white" />
          <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5 border-2 border-purple-700">
            <Bot className="h-3 w-3 text-purple-700" strokeWidth={3} />
          </div>
        </motion.div>
        <span className="font-bold text-2xl md:text-[1.65rem] tracking-tight group-hover:text-purple-700 transition-colors font-minigap">
          <span className="text-black">fasttrack</span>
          <span className="text-amber-600">ai</span>
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