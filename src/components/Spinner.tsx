// components/Spinner.tsx
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // clase de color de Tailwind, ej. 'text-blue-500'
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'text-blue-500',
}) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-4 border-current border-t-transparent ${color} ${sizeMap[size]}`}
        role="status"
        aria-label="Cargando"
      />
    </div>
  );
};
