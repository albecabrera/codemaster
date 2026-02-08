
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Lock } from 'lucide-react';

function RewardBadge({ achievement, locked = false }) {
  // Dynamic icon import helper
  const getIcon = async (iconName) => {
    try {
      const module = await import('lucide-react');
      return module[iconName] || Award;
    } catch {
      return Award;
    }
  };

  // Use a fallback approach with direct imports
  const iconMap = {
    Award,
    Lock,
  };

  const IconComponent = iconMap[achievement.icon] || Award;
  
  return (
    <motion.div
      whileHover={{ scale: locked ? 1 : 1.05, y: locked ? 0 : -5 }}
      className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
        locked
          ? 'bg-gray-900/50 border-gray-700 opacity-50'
          : 'bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/50 shadow-lg shadow-purple-500/20'
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className={`p-4 rounded-full ${
            locked
              ? 'bg-gray-800'
              : 'bg-gradient-to-br from-purple-500 to-blue-500'
          }`}
        >
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        
        <div className="text-center">
          <h3 className={`font-bold text-lg ${locked ? 'text-gray-400' : 'text-white'}`}>
            {achievement.name}
          </h3>
          <p className={`text-sm ${locked ? 'text-gray-500' : 'text-gray-300'}`}>
            {achievement.description}
          </p>
          
          {!locked && achievement.unlockedAt && (
            <p className="text-xs text-purple-400 mt-2">
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      
      {locked && (
        <div className="absolute top-3 right-3">
          <Lock className="w-5 h-5 text-gray-600" />
        </div>
      )}
    </motion.div>
  );
}

export default RewardBadge;
