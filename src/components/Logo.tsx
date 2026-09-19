import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 36 : 28;
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg';

  return (
    <div className={`flex flex-col ${className}`} id="quickbill-logo">
      <div className="flex items-center gap-2.5">
        <div
          style={{ width: iconSize, height: iconSize }}
          className="relative flex items-center justify-center rounded-[6px] bg-[#0B1220] p-1 shadow-sm shrink-0 border border-[#27D6A3]/30"
          aria-hidden="true"
        >
          {/* Stylized geometric Q mark with mint accent */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Outer smooth circle/ring for Q */}
            <circle
              cx="11.5"
              cy="11.5"
              r="7.5"
              stroke="#FFFFFF"
              strokeWidth="2.75"
              strokeLinecap="round"
            />
            {/* The diagonal tail of Q in Signal Mint */}
            <path
              d="M14.5 14.5L20 20"
              stroke="#27D6A3"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* Small inner highlight */}
            <circle cx="11.5" cy="11.5" r="3" fill="#27D6A3" opacity="0.3" />
          </svg>
        </div>
        <span className={`font-extrabold tracking-tight text-[#0B1220] ${textSize}`}>
          QUICKBILL
        </span>
      </div>
      {showTagline && (
        <span className="text-[10px] tracking-[0.16em] uppercase font-semibold text-[#667085] mt-1 pl-0.5">
          INVOICE · VERIFY · RECEIVE
        </span>
      )}
    </div>
  );
};
