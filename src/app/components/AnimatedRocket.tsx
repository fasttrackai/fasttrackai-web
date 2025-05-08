import { motion } from 'framer-motion';
import { Rocket, Bot } from 'lucide-react';
import Link from 'next/link';

export default function AnimatedRocket() {
  return (
    <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
      {/* Empty div to maintain layout without logo */}
      <div></div>

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