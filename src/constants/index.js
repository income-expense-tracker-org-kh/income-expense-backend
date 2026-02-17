// Income Categories
export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', icon: '💼' },
  { id: 'business', name: 'Business', icon: '🏢' },
  { id: 'freelance', name: 'Freelance', icon: '💻' },
  { id: 'investment', name: 'Investment', icon: '📈' },
  { id: 'gift', name: 'Gift', icon: '🎁' },
  { id: 'rental', name: 'Rental Income', icon: '🏠' },
  { id: 'other', name: 'Other', icon: '💰' },
];

// Expense Categories
export const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: '🍔' },
  { id: 'rent', name: 'Rent', icon: '🏠' },
  { id: 'utilities', name: 'Utilities', icon: '💡' },
  { id: 'transport', name: 'Transportation', icon: '🚗' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'healthcare', name: 'Healthcare', icon: '⚕️' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'subscription', name: 'Subscriptions', icon: '📱' },
  { id: 'insurance', name: 'Insurance', icon: '🛡️' },
  { id: 'bills', name: 'Bills', icon: '💳' },
  { id: 'other', name: 'Other', icon: '💸' },
];

// Payment Methods
export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Cash', icon: '💵' },
  { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
  { id: 'upi', name: 'UPI', icon: '📲' },
  { id: 'bank', name: 'Bank Transfer', icon: '🏦' },
  { id: 'wallet', name: 'Digital Wallet', icon: '👛' },
];

// Currencies
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
];

// Languages
export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'km', name: 'ខ្មែរ (Khmer)', flag: '🇰🇭' },
  { code: 'zh', name: '中文 (Chinese)', flag: '🇨🇳' },
];

// Date Formats
export const DATE_FORMATS = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (EU)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
  { value: 'DD-MMM-YYYY', label: 'DD-MMM-YYYY' },
];

// Budget Periods
export const BUDGET_PERIODS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

// Chart Colors
export const CHART_COLORS = [
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
  '#f97316',
  '#6366f1',
];

// Export File Types
export const EXPORT_TYPES = [
  { value: 'pdf', label: 'PDF', icon: '📄' },
  { value: 'excel', label: 'Excel', icon: '📊' },
  { value: 'csv', label: 'CSV', icon: '📋' },
];

// User Roles
export const USER_ROLES = [
  { value: 'admin', label: 'Admin', permissions: ['all'] },
  { value: 'manager', label: 'Manager', permissions: ['read', 'write', 'update'] },
  { value: 'user', label: 'User', permissions: ['read', 'write'] },
  { value: 'viewer', label: 'Viewer', permissions: ['read'] },
];

// Permission Definitions
export const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  UPDATE: 'update',
  DELETE: 'delete',
  ALL: 'all',
};

// Menu Items with Role Permissions
export const MENU_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', permissions: ['read'] },
  { path: '/income', label: 'Income', permissions: ['read', 'write'] },
  { path: '/expense', label: 'Expense', permissions: ['read', 'write'] },
  { path: '/budget', label: 'Budget', permissions: ['read', 'write'] },
  { path: '/reports', label: 'Reports', permissions: ['read'] },
  { path: '/transactions', label: 'Transactions', permissions: ['read'] },
  { path: '/profile', label: 'Profile', permissions: ['read'] },
  { path: '/settings', label: 'Settings', permissions: ['all'] },
];

// API Endpoints (Update with your backend URL)
export const API_BASE_URL = "https://expense-tracker-api-x5u4.onrender.com/api";

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // User
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/update',
  UPLOAD_AVATAR: '/user/upload-avatar',
  
  // Transactions
  TRANSACTIONS: '/transactions',
  INCOME: '/transactions/income',
  EXPENSE: '/transactions/expense',
  
  // Budget
  BUDGETS: '/budgets',
  
  // Reports
  REPORTS: '/reports',
  EXPORT: '/reports/export',
  
  // Categories
  CATEGORIES: '/categories',
  CUSTOM_CATEGORIES: '/categories/custom',
};
