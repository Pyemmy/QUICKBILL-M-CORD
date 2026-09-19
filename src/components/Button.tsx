import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark';
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
    'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-[8px] select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'h-[36px] px-3 text-xs gap-1.5',
    md: 'h-[44px] sm:h-[48px] px-4 text-sm gap-2',
    lg: 'h-[48px] sm:h-[52px] px-6 text-base gap-2.5',
  };

  const variantStyles = {
    // Primary: Signal Mint #27D6A3 with Ink text #0B1220 (strictly compliant with brand guide!)
    primary:
      'bg-[#27D6A3] text-[#0B1220] hover:bg-[#20C494] active:bg-[#1AB284] font-semibold shadow-sm focus:ring-[#27D6A3]',
    // Dark: Ink #0B1220 with White text
    dark:
      'bg-[#0B1220] text-white hover:bg-[#152238] active:bg-[#1F2D42] font-medium shadow-sm focus:ring-[#0B1220]',
    secondary:
      'bg-[#F2F4F7] text-[#1D2939] hover:bg-[#E4E7EC] active:bg-[#D0D5DD] focus:ring-[#98A2B3]',
    outline:
      'border border-[#E4E7EC] bg-white text-[#344054] hover:bg-[#F9FAFB] hover:border-[#D0D5DD] active:bg-[#F2F4F7] focus:ring-[#E4E7EC]',
    ghost:
      'bg-transparent text-[#344054] hover:bg-[#F2F4F7] hover:text-[#0B1220] focus:ring-[#E4E7EC]',
    danger:
      'bg-[#DC3E3E] text-white hover:bg-[#C93535] active:bg-[#B32D2D] font-medium focus:ring-[#DC3E3E]',
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
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
