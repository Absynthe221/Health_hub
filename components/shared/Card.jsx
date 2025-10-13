'use client';

import React from 'react';

export default function Card({ 
  children, 
  title, 
  subtitle,
  header,
  footer,
  padding = 'default',
  shadow = 'default',
  className = '',
  ...props 
}) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    default: 'shadow',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const classes = `bg-white rounded-lg ${shadowClasses[shadow]} ${className}`;

  return (
    <div className={classes} {...props}>
      {/* Header */}
      {(title || subtitle || header) && (
        <div className="border-b border-gray-200 pb-4 mb-4">
          {header || (
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className={paddingClasses[padding]}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          {footer}
        </div>
      )}
    </div>
  );
}

