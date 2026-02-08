
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Award, TrendingUp, Calendar, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import RewardBadge from '@/components/RewardBadge';
import ProgressBar from '@/components/ProgressBar';
import useProgressTracking from '@/hooks/useProgressTracking';
import { challenges } from '@/data/challengeData';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageIconComponent from '@/components/LanguageIconComponent';

function LevelProgressDashboard() {
  const { progress, getNextLevelXp, getCurrentLevelXp, resetProgress } = useProgressTracking();
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const allAchievements = [];
  Object.values(challenges).forEach(langChallenges => {
    langChallenges.forEach(challenge => {
      if (challenge.achievement && !allAchievements.some(a => a.id === challenge.achievement.id)) {
        allAchievements.push(challenge.achievement);
      }
    });
  });

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      resetProgress();
      toast({
        title: t('dashboard.reset'),
        description: t('editor.resetDesc')
      });
    }
  };

  const stats = [
    {
      icon: Star,
      label: t('dashboard.stats.currentLevel'),
      value: progress.level,
      color: 'from-purple-500 to-blue-500',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Trophy,
      label: t('dashboard.stats.totalPoints'),
      value: progress.totalPoints.toLocaleString(),
      color: 'from-amber-500 to-orange-500',
      iconColor: 'text-amber-600 dark:text-amber-400'
    },
    {
      icon: Zap,
      label: t('dashboard.stats.pointsToday'),
      value: progress.pointsToday.toLocaleString(),
      color: 'from-blue-500 to-cyan-500',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Award,
      label: t('dashboard.stats.achievements'),
      value: `${progress.achievements.length}/${allAchievements.length}`,
      color: 'from-green-500 to-emerald-500',
      iconColor: 'text-green-600 dark:text-green-400'
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t('dashboard.title')} - {t('common.appName')}</title>
        <meta name="description" content={t('dashboard.subtitle')} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                {t('dashboard.title')}
              </h1>
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {t('dashboard.reset')}
              </Button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">{t('dashboard.subtitle')}</p>
          </div>

          {/* Level Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{t('dashboard.levelProgress')}</h2>
              {progress.leveledUp && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full font-bold text-white"
                >
                  🎉 {t('dashboard.levelUp')}
                </motion.div>
              )}
            </div>
            <ProgressBar
              currentXp={getCurrentLevelXp()}
              maxXp={getNextLevelXp()}
              level={progress.level}
            />
            <div className="mt-4 flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>{progress.completedChallenges.length} {t('dashboard.challengesCompleted')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{t('dashboard.lastActive')}: {progress.lastActivityDate}</span>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-purple-200 dark:hover:border-gray-700 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                    <div className={`text-2xl font-bold ${stat.iconColor}`}>{stat.value}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Achievements Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <Trophy className="w-8 h-8 text-amber-500 dark:text-amber-400" />
              {t('dashboard.stats.achievements')}
            </h2>
            
            {progress.achievements.length === 0 ? (
              <div className="p-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-center">
                <Award className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 dark:text-gray-400 mb-2">{t('dashboard.noAchievements')}</h3>
                <p className="text-gray-500">{t('dashboard.noAchievementsDesc')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allAchievements.map((achievement, index) => {
                  const unlocked = progress.achievements.find(a => a.id === achievement.id);
                  const achievementDef = allAchievements.find(a => a.id === achievement.id);
                  const translation = achievementDef.translations?.[language] || achievementDef.translations?.['en'];
                  
                  // Infer language from achievement ID or manually map if possible
                  // E.g. 'first-html' -> HTML.
                  let lang = 'JavaScript';
                  if (achievement.id.includes('html')) lang = 'HTML';
                  if (achievement.id.includes('python')) lang = 'Python';
                  if (achievement.id.includes('java')) lang = 'Java';
                  if (achievement.id.includes('js')) lang = 'JavaScript';

                  const displayAchievement = {
                      ...achievement,
                      name: translation.name,
                      description: translation.description
                  };

                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <RewardBadge
                        achievement={displayAchievement}
                        locked={!unlocked}
                      />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              {t('dashboard.recentActivity')}
            </h2>
            
            {progress.achievements.length === 0 ? (
              <div className="p-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-center">
                <Zap className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 dark:text-gray-400 mb-2">{t('dashboard.noActivity')}</h3>
                <p className="text-gray-500">{t('dashboard.noActivityDesc')}</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                {progress.achievements
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map((achievement, index) => {
                    const originalDef = allAchievements.find(a => a.id === achievement.id);
                    const translation = originalDef?.translations?.[language] || originalDef?.translations?.['en'] || achievement;
                    
                    let lang = 'JavaScript';
                    if (achievement.id.includes('html')) lang = 'HTML';
                    else if (achievement.id.includes('python')) lang = 'Python';
                    else if (achievement.id.includes('java')) lang = 'Java';

                    return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center p-2">
                          <LanguageIconComponent language={lang} size="md" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{translation.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{translation.description}</p>
                        </div>
                        <div className="text-sm text-gray-400 dark:text-gray-500">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  )})}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default LevelProgressDashboard;
