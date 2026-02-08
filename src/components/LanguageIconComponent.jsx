
import React from 'react';
import { getLanguageIcon, LANGUAGES } from '@/utils/LanguageColorConfig';
import { FileCode } from 'lucide-react';

const LanguageIconComponent = ({ language, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-16 h-16' // For HomePage
  };

  const iconSize = sizeClasses[size] || sizeClasses.md;
  const combinedClassName = `${iconSize} ${className}`;

  // Use the utility to get the image element
  const iconElement = getLanguageIcon(language, combinedClassName);

  if (iconElement) {
    return iconElement;
  }

  // Fallback
  return <FileCode className={combinedClassName} />;
};

export default LanguageIconComponent;
