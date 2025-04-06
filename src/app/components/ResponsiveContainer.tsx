import React from 'react';

type ResponsiveContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

/**
 * A responsive container component that provides consistent spacing
 * across different screen sizes with improved mobile spacing
 */
export default function ResponsiveContainer({ 
  children, 
  className = '', 
  as: Component = 'div' 
}: ResponsiveContainerProps) {
  return (
    <Component
      className={`container mx-auto px-6 sm:px-8 md:px-10 lg:px-12 ${className}`}
    >
      {children}
    </Component>
  );
} 