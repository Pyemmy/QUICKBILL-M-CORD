import React from 'react';

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  rounded = 'md',
}) => {
  const roundedClass = {
    sm: 'rounded-[4px]',
    md: 'rounded-[8px]',
    lg: 'rounded-[12px]',
    full: 'rounded-full',
  }[rounded];

  return (
    <div
      style={{ width, height }}
      className={`bg-[#E4E7EC] animate-pulse ${roundedClass} ${className}`}
      aria-hidden="true"
    />
  );
};
