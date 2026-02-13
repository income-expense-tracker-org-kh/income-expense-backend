import { format, parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

/**
 * Format currency amount
 */
export const formatCurrency = (amount, currency = 'USD') => {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
  };

  const symbol = symbols[currency] || '$';
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  return `${symbol}${formattedAmount}`;
};

/**
 * Format date
 */
export const formatDate = (date, dateFormat = 'MM/DD/YYYY') => {
  if (!date) return '';
  
  const formatMap = {
    'MM/DD/YYYY': 'MM/dd/yyyy',
    'DD/MM/YYYY': 'dd/MM/yyyy',
    'YYYY-MM-DD': 'yyyy-MM-dd',
    'DD-MMM-YYYY': 'dd-MMM-yyyy',
  };

  const formatString = formatMap[dateFormat] || 'MM/dd/yyyy';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  return format(dateObj, formatString);
};

/**
 * Get date range for period
 */
export const getDateRange = (period) => {
  const now = new Date();
  
  switch (period) {
    case 'today':
      return { start: now, end: now };
    case 'week':
      return { start: startOfWeek(now), end: endOfWeek(now) };
    case 'month':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'year':
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear(), 11, 31),
      };
    default:
      return { start: now, end: now };
  }
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return ((value / total) * 100).toFixed(1);
};

/**
 * Group transactions by category
 */
export const groupByCategory = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = {
        category,
        total: 0,
        count: 0,
        transactions: [],
      };
    }
    acc[category].total += transaction.amount;
    acc[category].count += 1;
    acc[category].transactions.push(transaction);
    return acc;
  }, {});
};

/**
 * Group transactions by date
 */
export const groupByDate = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const date = format(parseISO(transaction.date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = {
        date,
        total: 0,
        count: 0,
        transactions: [],
      };
    }
    acc[date].total += transaction.amount;
    acc[date].count += 1;
    acc[date].transactions.push(transaction);
    return acc;
  }, {});
};

/**
 * Calculate budget progress
 */
export const calculateBudgetProgress = (spent, budget) => {
  if (budget === 0) return 0;
  const percentage = (spent / budget) * 100;
  return Math.min(percentage, 100);
};

/**
 * Get budget status
 */
export const getBudgetStatus = (spent, budget) => {
  const percentage = calculateBudgetProgress(spent, budget);
  
  if (percentage >= 100) return 'exceeded';
  if (percentage >= 90) return 'warning';
  if (percentage >= 75) return 'caution';
  return 'safe';
};

/**
 * Validate email
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: minLength && hasUpperCase && hasLowerCase && hasNumber,
    strength: [minLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length,
    requirements: {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
    },
  };
};

/**
 * Generate random color
 */
export const getRandomColor = () => {
  const colors = [
    '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Download file
 */
export const downloadFile = (data, filename, type) => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
