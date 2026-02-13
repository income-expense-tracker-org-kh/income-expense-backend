# Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm start
```

That's it! The app will open at `http://localhost:3000`

## 🎯 First Time Setup

### Default Login Credentials (Mock)
- Email: any valid email (e.g., user@example.com)
- Password: any password (min 6 characters)

> **Note:** This is a frontend-only demo. You'll need to set up a backend API for production use.

## 📋 What's Included

### ✅ Already Implemented
- Complete project structure
- Authentication pages (Login, Register, Forgot Password)
- Main dashboard with sample data
- Responsive layout with sidebar navigation
- Dark mode support
- Tailwind CSS configuration
- State management setup (Zustand)
- Routing configuration
- Sample components and utilities

### 📝 To Be Implemented
- Complete CRUD operations for Income
- Complete CRUD operations for Expense
- Budget management functionality
- Reports and analytics
- Transaction filtering and search
- Data export (PDF, Excel, CSV)
- Backend API integration
- File upload functionality
- Notification system

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### Tailwind Configuration
Edit `tailwind.config.js` to customize:
- Colors
- Fonts
- Spacing
- Breakpoints

### App Configuration
Edit `src/constants/index.js` to modify:
- Income/Expense categories
- Currencies
- Languages
- Date formats

## 🎨 Customization

### Change App Name
1. Update `public/index.html` - Change `<title>`
2. Update `src/components/Common/MainLayout.jsx` - Change "FinTracker"
3. Update `src/components/Common/AuthLayout.jsx` - Change "FinTracker"

### Change Theme Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Add New Categories
Edit `src/constants/index.js`:
```javascript
export const EXPENSE_CATEGORIES = [
  // Add your categories
  { id: 'custom', name: 'Custom Category', icon: '🎯' },
];
```

## 📱 Features Demo

### Dashboard
- View financial summary
- See charts and graphs
- Quick actions for adding income/expense
- Recent transactions

### Income/Expense
- Add new records
- Edit existing records
- Delete records
- Filter and search

### Budget
- Set category budgets
- Track spending limits
- Get budget alerts

### Reports
- View analytics
- Export data
- Customize date ranges

## 🐛 Common Issues

### Port Already in Use
```bash
# Use a different port
PORT=3001 npm start
```

### Dependencies Error
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Error
```bash
# Clear build cache
rm -rf build
npm run build
```

## 📚 Next Steps

### For Development
1. Read `DEVELOPMENT.md` for detailed guidelines
2. Check `PROJECT_STRUCTURE.md` for architecture
3. Review existing components in `src/components`
4. Implement features from the checklist

### For Production
1. Set up backend API
2. Configure environment variables
3. Implement authentication
4. Set up database
5. Deploy frontend and backend
6. Configure domain and SSL

## 🔗 Important Files

- `README.md` - Main documentation
- `DEVELOPMENT.md` - Development guidelines
- `PROJECT_STRUCTURE.md` - Architecture details
- `src/constants/index.js` - App configuration
- `tailwind.config.js` - Styling configuration

## 💡 Tips

1. **Start Small**: Implement one feature at a time
2. **Use Components**: Reuse existing components
3. **Follow Patterns**: Follow established patterns in the codebase
4. **Test Often**: Test each feature as you build
5. **Dark Mode**: Always test in both light and dark modes

## 🆘 Need Help?

- Check existing components for examples
- Review the documentation files
- Look at the constants file for configuration options
- Check the development guide for patterns

## 🎓 Learning Resources

- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Zustand: https://github.com/pmndrs/zustand
- Recharts: https://recharts.org

---

**Ready to start building! 🎉**

For detailed information, see `README.md` and `DEVELOPMENT.md`
