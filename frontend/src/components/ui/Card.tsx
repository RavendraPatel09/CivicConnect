import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white dark:bg-[#131E30] rounded-lg border border-[#E5E8E4] dark:border-[#22344D] shadow-subtle ${
        hoverable ? 'hover:shadow-elevated hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-150' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, className = '' }) => (
  <div className={`p-5 pb-4 border-b border-[#E5E8E4] dark:border-[#22344D] flex items-center justify-between gap-4 ${className}`}>
    <div>
      <h3 className="font-bold text-[#183B3A] dark:text-white text-base tracking-tight font-heading">{title}</h3>
      {subtitle && <p className="text-xs text-[#66736F] dark:text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`p-5 ${className}`}>{children}</div>;

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`p-4 bg-[#FAFAF7] dark:bg-[#111A29] border-t border-[#E5E8E4] dark:border-[#22344D] rounded-b-lg flex items-center justify-between ${className}`}>
    {children}
  </div>
);

export default Card;
