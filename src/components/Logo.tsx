
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center", className)}>
      <span className="text-2xl font-bold text-engace-purple">CDK<span className="text-engace-purple">Ace</span></span>
    </div>
  );
};

export default Logo;
