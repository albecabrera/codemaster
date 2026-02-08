
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Trophy, Zap, Target, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageIconComponent from '@/components/LanguageIconComponent';

function HomePage() {
  const { t } = useLanguage();

  const languages = [
    {
      name: t('nav.html'),
      key: 'HTML',
      path: '/html-css',
      description: t('home.languageCards.html'),
      color: 'from-orange-500 to-red-500'
    },
    {
      name: t('nav.python'),
      key: 'Python',
      path: '/python',
      description: t('home.languageCards.python'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: t('nav.java'),
      key: 'Java',
      path: '/java',
      description: t('home.languageCards.java'),
      color: 'from-red-500 to-orange-600'
    },
    {
      name: 'JavaScript',
      key: 'JavaScript',
      path: '/javascript-editor',
      description: t('home.languageCards.javascript'),
      color: 'from-yellow-500 to-amber-500'
    }
  ];

  const features = [
    {
      icon: Code2,
      title: t('home.features.interactive'),
      description: t('home.features.interactiveDesc')
    },
    {
      icon: Trophy,
      title: t('home.features.rewards'),
      description: t('home.features.rewardsDesc')
    },
    {
      icon: Zap,
      title: t('home.features.feedback'),
      description: t('home.features.feedbackDesc')
    },
    {
      icon: Target,
      title: t('home.features.levelUp'),
      description: t('home.features.levelUpDesc')
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t('common.appName')} - {t('home.title')}</title>
        <meta name="description" content={t('home.subtitle')} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1675495666624-25ac90479578"
              alt="Modern coding workspace"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 bg-gradient-to-br from-white/95 via-gray-100/90 to-blue-50/90 dark:from-purple-900/90 dark:via-gray-900/95 dark:to-blue-900/90" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                {t('home.title')}{' '}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
                  {t('home.titleSuffix')}
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
                {t('home.subtitle')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {languages.map((lang, index) => (
                  <motion.div key={lang.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 + 0.3 }}>
                    <Link to={lang.path}>
                      <motion.div whileHover={{ scale: 1.05, y: -5 }} className={`p-6 rounded-2xl bg-gradient-to-br ${lang.color} backdrop-blur-sm shadow-xl hover:shadow-2xl cursor-pointer group h-full flex flex-col items-center`}>
                        <div className="mb-4 drop-shadow-lg p-2 bg-white/20 rounded-full">
                           <LanguageIconComponent language={lang.key} size="xl" className="w-16 h-16" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{lang.name}</h3>
                        <p className="text-white/90 text-sm mb-4">{lang.description}</p>
                        <div className="mt-auto flex items-center justify-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                          {t('home.start')} <ArrowRight className="w-5 h-5" />
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                <Link to="/progress">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-500 dark:to-blue-500 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-purple-500/30">
                    <Trophy className="w-5 h-5 mr-2" /> {t('home.viewProgress')}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
          
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-10 border-2 border-gray-400 dark:border-white/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-gray-400 dark:bg-white/50 rounded-full" />
            </div>
          </motion.div>
        </section>

        <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('home.why')}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">{t('home.whySubtitle')}</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -5 }} className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-500/50 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-4"><feature.icon className="w-6 h-6 text-white" /></div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50 dark:bg-black transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('home.track')}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-12">{t('home.trackDesc')}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-900 shadow-lg">
                  <div className="text-5xl font-bold text-purple-600 dark:text-white mb-2">50+</div>
                  <div className="text-gray-600 dark:text-gray-300">{t('home.stats.challenges')}</div>
                </div>
                <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-900 shadow-lg">
                  <div className="text-5xl font-bold text-blue-600 dark:text-white mb-2">20+</div>
                  <div className="text-gray-600 dark:text-gray-300">{t('home.stats.achievements')}</div>
                </div>
                <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-cyan-200 dark:border-cyan-900 shadow-lg">
                  <div className="text-5xl font-bold text-cyan-600 dark:text-white mb-2">∞</div>
                  <div className="text-gray-600 dark:text-gray-300">{t('home.stats.learning')}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}

export default HomePage;
