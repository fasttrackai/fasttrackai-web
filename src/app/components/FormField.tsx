import React from 'react';

type FormFieldProps = {
  label: string;
  id: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  children?: React.ReactNode;
};

/**
 * A form field component that provides consistent spacing and styling
 * with improved mobile spacing and touch targets
 */
export default function FormField({ 
  label, 
  id, 
  type = 'text', 
  placeholder, 
  required = false,
  className = '',
  children
}: FormFieldProps) {
  return (
    <div className="mb-6">
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {children ? (
        children
      ) : (
        <input
          type={type}
          id={id}
          name={id}
          placeholder={placeholder}
          required={required}
          className={`input-field ${className}`}
        />
      )}
    </div>
  );
} 