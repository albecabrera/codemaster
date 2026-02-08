
import React from 'react';

export const LANGUAGES = {
  HTML: {
    name: 'HTML',
    color: '#E34C26',
    iconUrl: 'https://horizons-cdn.hostinger.com/1edae0f9-a26f-4408-9d45-c1b37ca3d61b/a8607cd4f40e4cc7ea1846ba1b76c26d.png',
    path: '/html-css'
  },
  CSS: {
    name: 'CSS',
    color: '#563D7C',
    iconUrl: 'https://horizons-cdn.hostinger.com/1edae0f9-a26f-4408-9d45-c1b37ca3d61b/c755fbd980857541e12a7e6dee8bd7c6.png',
    path: '/html-css'
  },
  JAVASCRIPT: {
    name: 'JavaScript',
    color: '#F7DF1E',
    iconUrl: 'https://horizons-cdn.hostinger.com/1edae0f9-a26f-4408-9d45-c1b37ca3d61b/aaed8497d9a9055169bf853f0b662f2b.png',
    path: '/javascript-editor'
  },
  PYTHON: {
    name: 'Python',
    color: '#3776AB',
    iconUrl: 'https://horizons-cdn.hostinger.com/1edae0f9-a26f-4408-9d45-c1b37ca3d61b/81a2b0b83a374a06dc8a9c28ae93905c.png',
    path: '/python'
  },
  JAVA: {
    name: 'Java',
    color: '#007396',
    iconUrl: 'https://horizons-cdn.hostinger.com/1edae0f9-a26f-4408-9d45-c1b37ca3d61b/e3ff61dd53240ea80018121f6338c188.png',
    path: '/java'
  }
};

export const getLanguageColor = (language) => {
  const lang = Object.values(LANGUAGES).find(l => l.name.toLowerCase() === language.toLowerCase());
  return lang ? lang.color : '#888888';
};

export const getLanguageIcon = (language, className = "w-6 h-6") => {
  const lang = Object.values(LANGUAGES).find(l => l.name.toLowerCase() === language.toLowerCase());
  if (lang && lang.iconUrl) {
    return React.createElement('img', {
      src: lang.iconUrl,
      alt: `${lang.name} icon`,
      className: `object-contain ${className}`
    });
  }
  return null;
};

export const getAllLanguages = () => Object.values(LANGUAGES);
