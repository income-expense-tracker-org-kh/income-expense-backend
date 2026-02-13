# Project Structure Documentation

## Overview
This document provides a detailed explanation of the project structure, file organization, and implementation guidelines for the Personal Income and Expense Tracker application.

## Directory Structure

### `/src`
Main source directory containing all application code.

### `/src/components`
Reusable React components organized by feature.

#### `/src/components/Auth`
Authentication-related components:
- `LoginForm.jsx` - Login form component
- `RegisterForm.jsx` - Registration form component
- `PasswordReset.jsx` - Password reset component

#### `/src/components/Common`
Shared/common components used throughout the app:
- `MainLayout.jsx` - Main application layout with sidebar and header
- `AuthLayout.jsx` - Layout for authentication pages
- `ProtectedRoute.jsx` - Route wrapper for authentication
- `Navbar.jsx` - Top navigation bar
- `Sidebar.jsx` - Side navigation menu
- `Footer.jsx` - Footer component
- `Loader.jsx` - Loading spinner component
- `Modal.jsx` - Reusable modal component
- `Button.jsx` - Custom button component
- `Input.jsx` - Custom input component
- `Card.jsx` - Card container component

#### `/src/components/Dashboard`
Dashboard-specific components:
- `StatsCard.jsx` - Financial statistics cards
- `QuickActions.jsx` - Quick action buttons
- `RecentTransactions.jsx` - Recent transaction list
- `Charts/` - Chart components (LineChart, PieChart, BarChart)

#### `/src/components/Income`
Income management components:
- `IncomeForm.jsx` - Form for adding/editing income
- `IncomeList.jsx` - List of income records
- `IncomeModal.jsx` - Modal for income details
- `RecurringIncomeSetup.jsx` - Setup for recurring income

#### `/src/components/Expense`
Expense management components:
- `ExpenseForm.jsx` - Form for adding/editing expenses
- `ExpenseList.jsx` - List of expense records
- `ExpenseModal.jsx` - Modal for expense details
- `ReceiptUpload.jsx` - Component for uploading receipts
- `RecurringExpenseSetup.jsx` - Setup for recurring expenses

#### `/src/components/Budget`
Budget planning components:
- `BudgetForm.jsx` - Form for creating budgets
- `BudgetList.jsx` - List of budgets
- `BudgetProgress.jsx` - Budget progress visualization
- `BudgetAlerts.jsx` - Budget alert notifications
- `CategoryBudget.jsx` - Category-wise budget component

#### `/src/components/Reports`
Reporting and analytics components:
- `DateRangeFilter.jsx` - Date range selection component
- `CategoryBreakdown.jsx` - Category-wise breakdown chart
- `IncomeVsExpense.jsx` - Income vs expense comparison
- `ExportOptions.jsx` - Data export options
- `SavingsCalculator.jsx` - Savings calculation component

#### `/src/components/Settings`
Settings page components:
- `GeneralSettings.jsx` - General app settings
- `NotificationSettings.jsx` - Notification preferences
- `SecuritySettings.jsx` - Security settings
- `ThemeSettings.jsx` - Theme customization
- `CurrencySettings.jsx` - Currency preferences

#### `/src/components/Notifications`
Notification components:
- `NotificationBell.jsx` - Notification bell icon with badge
- `NotificationList.jsx` - List of notifications
- `NotificationItem.jsx` - Individual notification item

### `/src/pages`
Page-level components representing different routes.

#### `/src/pages/Auth`
- `Login.jsx` - Login page
- `Register.jsx` - Registration page
- `ForgotPassword.jsx` - Password recovery page

#### `/src/pages/Dashboard`
- `Dashboard.jsx` - Main dashboard page

#### `/src/pages/Income`
- `Income.jsx` - Income management page

#### `/src/pages/Expense`
- `Expense.jsx` - Expense management page

#### `/src/pages/Budget`
- `Budget.jsx` - Budget planning page

#### `/src/pages/Reports`
- `Reports.jsx` - Reports and analytics page

#### `/src/pages/Transactions`
- `Transactions.jsx` - All transactions page

#### `/src/pages/Profile`
- `Profile.jsx` - User profile page

#### `/src/pages/Settings`
- `Settings.jsx` - App settings page

### `/src/hooks`
Custom React hooks for reusable logic.

- `useAuth.js` - Authentication hook
- `useTransactions.js` - Transaction management hook
- `useBudget.js` - Budget management hook
- `useDebounce.js` - Debouncing hook
- `useLocalStorage.js` - Local storage hook
- `useTheme.js` - Theme management hook

### `/src/services`
API service layer for backend communication.

- `api.js` - Axios instance with interceptors
- `authService.js` - Authentication API calls
- `transactionService.js` - Transaction CRUD operations
- `budgetService.js` - Budget management API
- `exportService.js` - Data export functionality
- `notificationService.js` - Notification management
- `uploadService.js` - File upload handling

### `/src/store`
Zustand stores for global state management.

- `authStore.js` - User authentication state
- `transactionStore.js` - Transactions state
- `budgetStore.js` - Budgets state
- `settingsStore.js` - App settings state
- `notificationStore.js` - Notifications state

### `/src/utils`
Utility functions and helpers.

- `helpers.js` - General helper functions
  - `formatCurrency()` - Format currency values
  - `formatDate()` - Format dates
  - `calculatePercentage()` - Calculate percentages
  - `groupByCategory()` - Group transactions by category
  - `groupByDate()` - Group transactions by date
  
- `validators.js` - Validation functions
  - `validateEmail()` - Email validation
  - `validatePassword()` - Password strength validation
  - `validateAmount()` - Amount validation

### `/src/constants`
Application constants and configuration.

- `index.js` - All constants
  - Income categories
  - Expense categories
  - Payment methods
  - Currencies
  - Languages
  - Date formats
  - API endpoints
  - Chart colors

### `/src/assets`
Static assets like images and fonts.

- `/images` - Image files
- `/fonts` - Custom fonts

## Key Files

### `App.js`
Main application component with routing configuration.

### `index.js`
Application entry point.

### `index.css`
Global styles with Tailwind directives and custom CSS.

### `tailwind.config.js`
Tailwind CSS configuration with custom theme.

### `package.json`
Project dependencies and scripts.

## State Management

### Zustand Stores
The application uses Zustand for state management:

1. **authStore** - User authentication
   - Login/logout
   - User data
   - Token management

2. **transactionStore** - Financial transactions
   - Add/edit/delete transactions
   - Filter transactions
   - Calculate totals

3. **budgetStore** - Budget management
   - Create/update budgets
   - Track budget progress
   - Budget alerts

4. **settingsStore** - App settings
   - Theme (light/dark)
   - Currency
   - Language
   - Notifications

## Routing Structure

```
/                          → Redirect to /dashboard or /login
/login                     → Login page
/register                  → Registration page
/forgot-password           → Password recovery

Protected Routes (require authentication):
/dashboard                 → Dashboard
/income                    → Income management
/expense                   → Expense management
/budget                    → Budget planning
/reports                   → Reports and analytics
/transactions              → All transactions
/profile                   → User profile
/settings                  → App settings
```

## Component Patterns

### Container/Presentational Pattern
- Pages act as containers (data fetching, state management)
- Components are presentational (UI rendering)

### Composition Pattern
- Small, focused components
- Composable and reusable
- Props for customization

### Custom Hooks Pattern
- Extract complex logic into hooks
- Reusable across components
- Cleaner component code

## Styling Guidelines

### Tailwind CSS Usage
- Use Tailwind utility classes
- Custom classes in index.css for repeated patterns
- Dark mode support with `dark:` prefix
- Responsive design with breakpoint prefixes

### Component Styling
```jsx
// Example component structure
<div className="card">
  <h2 className="text-2xl font-bold mb-4">Title</h2>
  <button className="btn-primary">Action</button>
</div>
```

## API Integration

### Service Layer Pattern
```javascript
// Example service
export const transactionService = {
  getAll: () => api.get('/transactions'),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
};
```

### Error Handling
- Try-catch blocks in async functions
- Toast notifications for user feedback
- Proper error messages

## Security Best Practices

1. **Authentication**
   - JWT tokens
   - Secure storage
   - Token refresh

2. **Protected Routes**
   - Route guards
   - Redirect to login

3. **Data Validation**
   - Client-side validation
   - Sanitize inputs

4. **Password Security**
   - Bcrypt hashing
   - Strength requirements

## Performance Optimization

1. **Code Splitting**
   - Lazy loading routes
   - Dynamic imports

2. **Memoization**
   - React.memo for components
   - useMemo for expensive calculations
   - useCallback for functions

3. **Asset Optimization**
   - Image compression
   - Lazy loading images
   - Font optimization

## Testing Strategy

### Unit Tests
- Utility functions
- Custom hooks
- Individual components

### Integration Tests
- User flows
- API integration
- State management

### E2E Tests
- Critical user journeys
- Authentication flow
- Transaction creation

## Deployment

### Build Process
```bash
npm run build
```

### Environment Variables
```env
REACT_APP_API_URL=your_api_url
REACT_APP_ENV=production
```

### Hosting Options
- Vercel
- Netlify
- AWS S3 + CloudFront
- Firebase Hosting

## Future Enhancements

1. **AI Features**
   - Spending insights
   - Expense prediction
   - Smart categorization

2. **Advanced Analytics**
   - Custom reports
   - Data visualization
   - Trend analysis

3. **Multi-user Support**
   - Family accounts
   - Shared budgets
   - Permissions

4. **Mobile App**
   - React Native version
   - Offline support
   - Push notifications

5. **Integrations**
   - Bank account sync
   - Payment gateway
   - Calendar integration

## Support and Maintenance

### Version Control
- Git for version control
- Semantic versioning
- Changelog maintenance

### Documentation
- Code comments
- API documentation
- User guide

### Updates
- Regular dependency updates
- Security patches
- Feature additions

---

**Last Updated:** February 2024
**Version:** 1.0.0
