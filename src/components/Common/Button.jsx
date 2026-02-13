import React from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

/**
 * Reusable Button Component
 * 
 * @param {string} variant - Button style variant (primary, secondary, success, danger, ghost)
 * @param {string} size - Button size (sm, md, lg)
 * @param {boolean} loading - Show loading spinner
 * @param {boolean} disabled - Disable button
 * @param {boolean} fullWidth - Make button full width
 * @param {React.ReactNode} children - Button content
 * @param {React.ReactNode} leftIcon - Icon to show on the left
 * @param {React.ReactNode} rightIcon - Icon to show on the right
 * @param {function} onClick - Click handler
 * @param {string} className - Additional CSS classes
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  leftIcon,
  rightIcon,
  onClick,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 disabled:bg-primary-300',
    secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 focus:ring-gray-500',
    success: 'bg-income hover:bg-income-dark text-white focus:ring-income disabled:bg-income/50',
    danger: 'bg-expense hover:bg-expense-dark text-white focus:ring-expense disabled:bg-expense/50',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const buttonClasses = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    (disabled || loading) && 'cursor-not-allowed opacity-50',
    className
  );

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin mr-2" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
          Loading...
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
