
import React from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  delay: number;
  onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  subtitle, 
  description, 
  icon, 
  iconBg,
  delay,
  onClick
}) => {
  return (
    <div 
      className="feature-card dark:bg-gray-800 dark:shadow-gray-900/30 animate-fade-in cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <div className={cn("feature-icon mx-auto", iconBg)}>
        {icon}
      </div>
      <h2 className="feature-title dark:text-white">{title}</h2>
      <p className="feature-subtitle dark:text-gray-400">{subtitle}</p>
      <p className="feature-description dark:text-gray-300">{description}</p>
    </div>
  );
};

export default FeatureCard;
