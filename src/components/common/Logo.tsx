import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'icon' | 'stacked';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark' | 'auto';
  showTagline?: boolean;
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
      className={`${sizeClass} ${className} flex-shrink-0 transition-transform duration-200 hover:scale-105`}
      aria-label="CivicConnect AI Icon"
    >
      <defs>
        <linearGradient id="shieldGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#142B45" />
          <stop offset="60%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#0F9D91" />
        </linearGradient>
        <linearGradient id="pinGrad" x1="12" y1="6" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#0F9D91" />
        </linearGradient>
        <linearGradient id="glowGrad" x1="24" y1="12" x2="24" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0F9D91" stopOpacity="0" />
        </linearGradient>
        <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#2563EB" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Rounded Pin Shell Shield */}
      <path
        d="M24 4C15.716 4 9 10.716 9 19C9 28.5 22.3 42.5 22.88 43.12C23.48 43.76 24.52 43.76 25.12 43.12C25.7 42.5 39 28.5 39 19C39 10.716 32.284 4 24 4Z"
        fill="url(#pinGrad)"
        filter="url(#subtleGlow)"
      />

      {/* Inner Pin Ambient Glow */}
      <path
        d="M24 6C16.82 6 11 11.82 11 19C11 26.8 22.5 38.7 24 40.3C25.5 38.7 37 26.8 37 19C37 11.82 31.18 6 24 6Z"
        fill="url(#glowGrad)"
      />

      {/* Geometric City Skyline Cutout */}
      {/* Left Tower */}
      <rect x="15.5" y="20" width="4.5" height="10" rx="0.75" fill="#FFFFFF" fillOpacity="0.95" />
      <rect x="16.75" y="22" width="2" height="2" rx="0.3" fill="#1E3A8A" fillOpacity="0.4" />
      <rect x="16.75" y="25.5" width="2" height="2" rx="0.3" fill="#1E3A8A" fillOpacity="0.4" />

      {/* Center High-rise Tower with Civic Spire */}
      <rect x="21.5" y="14" width="5.5" height="16" rx="0.75" fill="#FFFFFF" />
      <polygon points="24.25,9 22.5,14 26,14" fill="#FFFFFF" />
      {/* High-rise windows */}
      <rect x="23" y="16.5" width="2.5" height="1.8" rx="0.3" fill="#0F9D91" fillOpacity="0.6" />
      <rect x="23" y="19.5" width="2.5" height="1.8" rx="0.3" fill="#0F9D91" fillOpacity="0.6" />
      <rect x="23" y="22.5" width="2.5" height="1.8" rx="0.3" fill="#0F9D91" fillOpacity="0.6" />

      {/* Right Civic Center Building */}
      <rect x="28.5" y="17" width="4.5" height="13" rx="0.75" fill="#FFFFFF" fillOpacity="0.95" />
      <rect x="29.75" y="19.5" width="2" height="2" rx="0.3" fill="#1E3A8A" fillOpacity="0.4" />
      <rect x="29.75" y="23" width="2" height="2" rx="0.3" fill="#1E3A8A" fillOpacity="0.4" />

      {/* Connectivity Network Nodes & Data Flow Lines */}
      <line x1="17.75" y1="20" x2="24.25" y2="14" stroke="#38BDF8" strokeWidth="1.25" strokeLinecap="round" strokeDasharray="1.5 1.5" />
      <line x1="24.25" y1="14" x2="30.75" y2="17" stroke="#38BDF8" strokeWidth="1.25" strokeLinecap="round" strokeDasharray="1.5 1.5" />

      <circle cx="17.75" cy="20" r="1.5" fill="#38BDF8" />
      <circle cx="24.25" cy="14" r="1.75" fill="#0F9D91" />
      <circle cx="30.75" cy="17" r="1.5" fill="#38BDF8" />

      {/* Verified Resolution Checkmark embedded in base */}
      <circle cx="24.25" cy="26" r="3.75" fill="#142B45" />
      <path
        d="M22.5 26.1L23.7 27.3L26.2 24.8"
        stroke="#10B981"
        strokeWidth="1.4"
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
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', badge: 'text-[9px]', sub: 'text-[10px]' },
    md: { icon: 'w-9 h-9', text: 'text-xl', badge: 'text-[10px]', sub: 'text-xs' },
    lg: { icon: 'w-11 h-11', text: 'text-2xl', badge: 'text-xs', sub: 'text-xs' },
    xl: { icon: 'w-14 h-14', text: 'text-3xl', badge: 'text-xs', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  // Theme text styling
  const textColor =
    theme === 'dark'
      ? 'text-white'
      : theme === 'light'
      ? 'text-[#142B45]'
      : 'text-[#142B45] dark:text-white';

  const subtextColor =
    theme === 'dark'
      ? 'text-slate-400'
      : theme === 'light'
      ? 'text-slate-500'
      : 'text-slate-500 dark:text-slate-400';

  if (variant === 'icon') {
    return <CivicLogoIcon sizeClass={currentSize.icon} className={className} />;
  }

  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center gap-1.5 text-center ${className}`}>
        <CivicLogoIcon sizeClass={currentSize.icon} />
        <div>
          <div className="flex items-center justify-center gap-1">
            <span className={`font-bold tracking-tight font-sans ${currentSize.text} ${textColor}`}>
              Civic<span className="text-[#2563EB]">Connect</span>
            </span>
            <span className="bg-[#0F9D91]/15 text-[#0F9D91] dark:bg-[#0F9D91]/25 dark:text-[#2DD4BF] font-semibold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
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
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-bold tracking-tight font-sans ${currentSize.text} ${textColor}`}>
            Civic<span className="text-[#2563EB]">Connect</span>
          </span>
          <span className="bg-[#0F9D91]/15 text-[#0F9D91] dark:bg-[#0F9D91]/25 dark:text-[#2DD4BF] font-semibold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider border border-[#0F9D91]/25">
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
