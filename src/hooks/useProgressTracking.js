
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'codemaster_progress';
const XP_PER_LEVEL = 1000;

const useProgressTracking = () => {
  const [progress, setProgress] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return getDefaultProgress();
      }
    }
    return getDefaultProgress();
  });

  function getDefaultProgress() {
    return {
      level: 1,
      xp: 0,
      totalPoints: 0,
      pointsToday: 0,
      achievements: [],
      completedChallenges: [],
      lastActivityDate: new Date().toDateString()
    };
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const calculateLevel = (xp) => {
    return Math.floor(xp / XP_PER_LEVEL) + 1;
  };

  const addPoints = (points, challengeId) => {
    setProgress(prev => {
      const newXp = prev.xp + points;
      const newLevel = calculateLevel(newXp);
      const leveledUp = newLevel > prev.level;
      
      const today = new Date().toDateString();
      const isToday = prev.lastActivityDate === today;
      
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        totalPoints: prev.totalPoints + points,
        pointsToday: isToday ? prev.pointsToday + points : points,
        lastActivityDate: today,
        completedChallenges: challengeId && !prev.completedChallenges.includes(challengeId)
          ? [...prev.completedChallenges, challengeId]
          : prev.completedChallenges,
        leveledUp
      };
    });
  };

  const unlockAchievement = (achievement) => {
    setProgress(prev => {
      if (prev.achievements.some(a => a.id === achievement.id)) {
        return prev;
      }
      return {
        ...prev,
        achievements: [...prev.achievements, {
          ...achievement,
          unlockedAt: new Date().toISOString()
        }]
      };
    });
  };

  const completeChallenge = (challengeId, points, achievement) => {
    addPoints(points, challengeId);
    if (achievement) {
      unlockAchievement(achievement);
    }
  };

  const resetProgress = () => {
    setProgress(getDefaultProgress());
  };

  const getNextLevelXp = () => {
    return progress.level * XP_PER_LEVEL;
  };

  const getCurrentLevelXp = () => {
    return progress.xp % XP_PER_LEVEL;
  };

  return {
    progress,
    addPoints,
    unlockAchievement,
    completeChallenge,
    resetProgress,
    getNextLevelXp,
    getCurrentLevelXp
  };
};

export default useProgressTracking;
