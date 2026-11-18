import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'civic';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#183B3A] text-white hover:bg-[#122C2B] focus:ring-[#183B3A] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] dark:text-white',
    civic:
      'bg-[#2563EB] text-white hover:bg-[#1D4ED8] active:bg-[#1E40AF] focus:ring-[#2563EB] shadow-xs',
    secondary:
      'bg-[#FFFFFF] text-[#202B2A] border border-[#E5E8E4] hover:bg-[#F4F5F0] focus:ring-slate-300 dark:bg-[#131E30] dark:text-[#F1F5F9] dark:border-[#22344D] dark:hover:bg-[#172438]',
    outline:
      'border border-[#E5E8E4] text-[#202B2A] hover:bg-[#F4F5F0] focus:ring-slate-300 dark:border-[#22344D] dark:text-slate-200 dark:hover:bg-slate-800/60',
    ghost:
      'text-[#66736F] hover:text-[#202B2A] hover:bg-slate-100/70 focus:ring-slate-300 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800',
    danger:
      'bg-[#C34B4B] text-white hover:bg-[#A83838] focus:ring-rose-500 shadow-xs',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;
