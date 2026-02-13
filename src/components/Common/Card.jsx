import React from 'react';
import clsx from 'clsx';

/**
 * Reusable Card Component
 * 
 * @param {React.ReactNode} children - Card content
 * @param {string} title - Card title
 * @param {React.ReactNode} headerActions - Actions to show in header
 * @param {string} className - Additional CSS classes
 * @param {boolean} hoverable - Add hover effect
 * @param {function} onClick - Click handler (makes card clickable)
 */
const Card = ({
  children,
  title,
  headerActions,
  className,
  hoverable = false,
  onClick,
  ...props
}) => {
  const cardClasses = clsx(
    'bg-white dark:bg-gray-800 rounded-lg shadow-md p-6',
    hoverable && 'hover:shadow-lg transition-shadow duration-200',
    onClick && 'cursor-pointer',
    className
  );

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      {(title || headerActions) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {title}
            </h3>
          )}
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Card;
