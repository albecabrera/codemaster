
import React from 'react';
import { motion } from 'framer-motion';

function ProgressBar({ currentXp, maxXp, level }) {
  const percentage = (currentXp / maxXp) * 100;
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white">Level {level}</span>
        <span className="text-sm text-gray-400">
          {currentXp} / {maxXp} XP
        </span>
      </div>
      
      <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full"
        >
          <motion.div
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </motion.div>
      </div>
    </div>
  );
}

export default ProgressBar;
