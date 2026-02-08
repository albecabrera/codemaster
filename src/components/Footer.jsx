
import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Github, Twitter, Linkedin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {t('common.appName')}
              </span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              {t('home.subtitle')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('common.footer.learn')}</h3>
            <ul className="space-y-2">
              <li><Link to="/html-css" className="text-gray-400 hover:text-white transition-colors">{t('nav.html')}</Link></li>
              <li><Link to="/python" className="text-gray-400 hover:text-white transition-colors">{t('nav.python')}</Link></li>
              <li><Link to="/java" className="text-gray-400 hover:text-white transition-colors">{t('nav.java')}</Link></li>
              <li><Link to="/progress" className="text-gray-400 hover:text-white transition-colors">{t('nav.progress')}</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('common.footer.resources')}</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">{t('common.footer.documentation')}</span></li>
              <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">{t('common.footer.tutorials')}</span></li>
              <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">{t('common.footer.community')}</span></li>
              <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">{t('common.footer.support')}</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            {t('common.footer.copyright', { year: currentYear })}
          </p>
          <div className="flex gap-6 text-sm">
            <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">{t('common.footer.privacyPolicy')}</span>
            <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">{t('common.footer.termsOfService')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
