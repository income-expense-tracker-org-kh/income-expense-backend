# Personal Income and Expense Tracker

A comprehensive full-stack web application for managing personal finances, built with React.js and Tailwind CSS.

## 🚀 Features

### 1. User Management
- User Registration & Login with email/password
- Password encryption and validation
- Profile Management (update details, upload profile picture)
- Role-based access control (Admin/User)

### 2. Income Management
- Add, edit, and delete income records
- Multiple income sources (salary, business, freelance, gifts, etc.)
- Recurring income support (monthly salary automation)
- Custom income categories
- Date tracking and descriptions

### 3. Expense Management
- Add, edit, and delete expense records
- Extensive expense categories (food, rent, transport, shopping, etc.)
- Payment method tracking (cash, card, UPI, bank transfer)
- Recurring expenses (rent, subscriptions, EMIs)
- Receipt/bill attachment support (image/PDF upload)
- Custom expense categories

### 4. Budget Planning
- Set monthly/weekly budgets
- Category-wise budget limits
- Budget alerts and notifications
- Real-time budget progress tracking
- Remaining budget visualization

### 5. Reports & Analytics
- Daily/Weekly/Monthly financial reports
- Category-wise expense analysis
- Income vs Expense comparison
- Savings calculation
- Interactive charts and graphs:
  - Pie charts for expense distribution
  - Bar graphs for monthly trends
  - Line charts for income vs expense trends

### 6. Dashboard
- Summary view (total income, expenses, balance)
- Quick add buttons for income/expense
- Recent transactions display
- Visual insights with charts
- At-a-glance financial overview

### 7. Search & Filters
- Search by date range
- Filter by category
- Filter by amount
- Sort transactions (latest, highest amount, category-wise)

### 8. Notifications & Alerts
- Budget limit warnings
- Monthly summary notifications
- Bill due reminders
- Unusual spending alerts

### 9. Data Export & Backup
- Export reports to PDF, Excel, and CSV
- Data backup to cloud/local storage
- Data restoration capabilities

### 10. Security Features
- Password encryption (bcrypt)
- JWT authentication
- Secure session management
- Protected routes

### 11. Settings
- Currency selection (USD, EUR, GBP, INR, etc.)
- Theme toggle (Light/Dark mode)
- Language preferences
- Notification settings
- Date format customization

### 12. Advanced Features
- Responsive design (mobile, tablet, desktop)
- Real-time data updates
- Offline support (coming soon)
- Multi-currency support
- Cloud synchronization

## 📁 Project Structure

```
income-expense-tracker/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── fonts/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── Common/
│   │   │   ├── MainLayout.jsx
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── Modal.jsx
│   │   ├── Dashboard/
│   │   │   ├── StatsCard.jsx
│   │   │   ├── QuickActions.jsx
│   │   │   ├── RecentTransactions.jsx
│   │   │   └── Charts/
│   │   ├── Income/
│   │   │   ├── IncomeForm.jsx
│   │   │   ├── IncomeList.jsx
│   │   │   └── IncomeModal.jsx
│   │   ├── Expense/
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── ExpenseList.jsx
│   │   │   ├── ExpenseModal.jsx
│   │   │   └── ReceiptUpload.jsx
│   │   ├── Budget/
│   │   │   ├── BudgetForm.jsx
│   │   │   ├── BudgetList.jsx
│   │   │   ├── BudgetProgress.jsx
│   │   │   └── BudgetAlerts.jsx
│   │   ├── Reports/
│   │   │   ├── DateRangeFilter.jsx
│   │   │   ├── CategoryBreakdown.jsx
│   │   │   ├── IncomeVsExpense.jsx
│   │   │   └── ExportOptions.jsx
│   │   ├── Settings/
│   │   │   ├── GeneralSettings.jsx
│   │   │   ├── NotificationSettings.jsx
│   │   │   └── SecuritySettings.jsx
│   │   └── Notifications/
│   │       ├── NotificationBell.jsx
│   │       └── NotificationList.jsx
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── Income/
│   │   │   └── Income.jsx
│   │   ├── Expense/
│   │   │   └── Expense.jsx
│   │   ├── Budget/
│   │   │   └── Budget.jsx
│   │   ├── Reports/
│   │   │   └── Reports.jsx
│   │   ├── Transactions/
│   │   │   └── Transactions.jsx
│   │   ├── Profile/
│   │   │   └── Profile.jsx
│   │   └── Settings/
│   │       └── Settings.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTransactions.js
│   │   ├── useBudget.js
│   │   └── useDebounce.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── transactionService.js
│   │   ├── budgetService.js
│   │   ├── exportService.js
│   │   └── notificationService.js
│   ├── store/
│   │   ├── authStore.js
│   │   ├── transactionStore.js
│   │   ├── budgetStore.js
│   │   └── settingsStore.js
│   ├── utils/
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   └── constants.js
│   ├── constants/
│   │   └── index.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Zustand** - State management
- **Recharts** - Data visualization
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Axios** - HTTP client

### File Handling
- **jsPDF** - PDF generation
- **jsPDF-AutoTable** - PDF tables
- **XLSX** - Excel file handling
- **React Dropzone** - File upload

### Utilities
- **date-fns** - Date manipulation
- **bcryptjs** - Password hashing
- **js-cookie** - Cookie management

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd income-expense-tracker
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start the development server**
```bash
npm start
# or
yarn start
```

The application will open at `http://localhost:3000`

## 🚀 Building for Production

```bash
npm run build
# or
yarn build
```

The production-ready files will be in the `build` folder.

## 🎨 Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## 📝 Usage Guide

### Getting Started
1. **Register** a new account or **Login** with existing credentials
2. Navigate to **Dashboard** to see your financial overview
3. Use **Quick Actions** to add income or expenses
4. Set up **Budgets** for different categories
5. View detailed **Reports** and analytics
6. Export your data to PDF, Excel, or CSV

### Adding Income
1. Go to Income page
2. Click "Add Income"
3. Fill in amount, source, date, and description
4. Save the entry

### Adding Expense
1. Go to Expense page
2. Click "Add Expense"
3. Fill in amount, category, payment method, and description
4. Optionally attach a receipt
5. Save the entry

### Setting Budgets
1. Go to Budget page
2. Click "Create Budget"
3. Select category, period, and amount
4. Enable alerts if desired
5. Save the budget

### Viewing Reports
1. Go to Reports page
2. Select date range and filters
3. View charts and analytics
4. Export reports as needed

## 🔒 Security

- All passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected routes require authentication
- Secure HTTP-only cookies
- XSS and CSRF protection

## 🎨 Customization

### Theme
Toggle between light and dark mode in Settings

### Currency
Select your preferred currency in Settings (USD, EUR, GBP, INR, etc.)

### Language
Choose your language preference in Settings

### Categories
Add custom income and expense categories

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Change port in package.json
"start": "PORT=3001 react-scripts start"
```

**Dependencies not installing**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@fintracker.com or open an issue in the repository.

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors

---

**Note:** This is a frontend application. For full functionality, you'll need to set up a backend API server. The API endpoints are configured in `src/constants/index.js`.
