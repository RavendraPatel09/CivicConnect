import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'icon' | 'stacked';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark' | 'auto';
  showTagline?: boolean;
  showAiBadge?: boolean;
  className?: string;
}

export const CivicLogoIcon: React.FC<{ sizeClass?: string; className?: string }> = ({
  sizeClass = 'w-9 h-9',
  className = '',
}) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClass} ${className} flex-shrink-0 transition-transform duration-150`}
      aria-label="CivicConnect AI Icon"
    >
      {/* Restrained Architectural Location Pin */}
      <path
        d="M24 4C15.716 4 9 10.716 9 19C9 28.5 22.88 42.12 23.48 42.76C23.76 43.05 24.24 43.05 24.52 42.76C25.12 42.12 39 28.5 39 19C39 10.716 32.284 4 24 4Z"
        fill="#183B3A"
      />
      
      {/* Inner Accent Core */}
      <path
        d="M24 7C17.373 7 12 12.373 12 19C12 26.2 22.8 37.8 24 39.1C25.2 37.8 36 26.2 36 19C36 12.373 30.627 7 24 7Z"
        fill="#2563EB"
        fillOpacity="0.12"
      />

      {/* Geometric City Skyline Architecture */}
      {/* Left Municipal Wing */}
      <rect x="16" y="21" width="4" height="10" rx="0.5" fill="#FFFFFF" fillOpacity="0.9" />
      <rect x="17.25" y="23" width="1.5" height="1.5" rx="0.2" fill="#183B3A" fillOpacity="0.6" />
      <rect x="17.25" y="26" width="1.5" height="1.5" rx="0.2" fill="#183B3A" fillOpacity="0.6" />

      {/* Center Civic Spire Tower */}
      <rect x="22" y="15" width="4.5" height="16" rx="0.5" fill="#FFFFFF" />
      <polygon points="24.25,10 22,15 26.5,15" fill="#FFFFFF" />
      <rect x="23.25" y="17.5" width="2" height="2" rx="0.2" fill="#2563EB" />
      <rect x="23.25" y="21" width="2" height="2" rx="0.2" fill="#2563EB" />
      <rect x="23.25" y="24.5" width="2" height="2" rx="0.2" fill="#2563EB" />

      {/* Right Municipal Wing */}
      <rect x="28.5" y="18" width="4" height="13" rx="0.5" fill="#FFFFFF" fillOpacity="0.9" />
      <rect x="29.75" y="20.5" width="1.5" height="1.5" rx="0.2" fill="#183B3A" fillOpacity="0.6" />
      <rect x="29.75" y="24" width="1.5" height="1.5" rx="0.2" fill="#183B3A" fillOpacity="0.6" />

      {/* Verified Resolution Checkpoint Node */}
      <circle cx="24.25" cy="28.5" r="3" fill="#183B3A" />
      <path
        d="M23 28.5L23.9 29.4L25.8 27.5"
        stroke="#23845B"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  theme = 'auto',
  showTagline = false,
  showAiBadge = false,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', sub: 'text-[10px]' },
    md: { icon: 'w-8 h-8', text: 'text-xl', sub: 'text-xs' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-12 h-12', text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  const textColor =
    theme === 'dark'
      ? 'text-white'
      : theme === 'light'
      ? 'text-[#183B3A]'
      : 'text-[#183B3A] dark:text-white';

  const subtextColor =
    theme === 'dark'
      ? 'text-slate-400'
      : theme === 'light'
      ? 'text-[#66736F]'
      : 'text-[#66736F] dark:text-slate-400';

  if (variant === 'icon') {
    return <CivicLogoIcon sizeClass={currentSize.icon} className={className} />;
  }

  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center gap-1.5 text-center ${className}`}>
        <CivicLogoIcon sizeClass={currentSize.icon} />
        <div>
          <div className="flex items-center justify-center gap-1">
            <span className={`font-extrabold tracking-tight font-heading ${currentSize.text} ${textColor}`}>
              Civic<span className="text-[#2563EB]">Connect</span>
            </span>
            <span className="text-[11px] font-semibold text-[#66736F] dark:text-slate-400 tracking-wide uppercase ml-0.5">
              AI
            </span>
          </div>
          {showTagline && (
            <p className={`font-medium ${subtextColor} ${currentSize.sub} mt-0.5`}>
              Your City. Your Voice. Real Action.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <CivicLogoIcon sizeClass={currentSize.icon} />
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className={`font-extrabold tracking-tight font-heading ${currentSize.text} ${textColor}`}>
            Civic<span className="text-[#2563EB]">Connect</span>
          </span>
          <span className="text-[11px] font-semibold text-[#66736F] dark:text-slate-400 tracking-wider uppercase">
            AI
          </span>
        </div>
        {showTagline && (
          <span className={`font-medium ${subtextColor} ${currentSize.sub} tracking-normal mt-1`}>
            Your City. Your Voice. Real Action.
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
