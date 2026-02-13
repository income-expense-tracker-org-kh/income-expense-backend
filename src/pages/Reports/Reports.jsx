import React, { useState, useMemo } from 'react';
import { Download, Calendar, Filter, TrendingUp, TrendingDown, PieChart as PieChartIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTransactionStore } from '../../store/transactionStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency, groupByCategory, groupByDate } from '../../utils/helpers';
import { exportService } from '../../services/exportService';
import { CHART_COLORS, EXPORT_TYPES } from '../../constants';
import toast from 'react-hot-toast';

const Reports = () => {
  const { transactions, incomes, expenses, getTotalIncome, getTotalExpense } = useTransactionStore();
  const { currency } = useSettingsStore();

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [reportType, setReportType] = useState('overview');

  // Filter transactions by date range
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      return tDate >= start && tDate <= end;
    });
  }, [transactions, dateRange]);

  const filteredIncomes = filteredTransactions.filter(t => t.type === 'income');
  const filteredExpenses = filteredTransactions.filter(t => t.type === 'expense');

  // Calculate totals
  const totalIncome = filteredIncomes.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filteredExpenses.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  // Group data by category
  const expenseByCategory = useMemo(() => {
    const grouped = groupByCategory(filteredExpenses);
    return Object.values(grouped).map(cat => ({
      name: cat.category,
      value: cat.total,
    }));
  }, [filteredExpenses]);

  const incomeByCategory = useMemo(() => {
    const grouped = groupByCategory(filteredIncomes);
    return Object.values(grouped).map(cat => ({
      name: cat.category,
      value: cat.total,
    }));
  }, [filteredIncomes]);

  // Monthly trend data
  const monthlyTrend = useMemo(() => {
    const grouped = groupByDate(filteredTransactions);
    const dates = Object.keys(grouped).sort();
    
    return dates.map(date => {
      const dayData = grouped[date];
      const income = dayData.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expense = dayData.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        income,
        expense,
        balance: income - expense,
      };
    });
  }, [filteredTransactions]);

  // Top expenses
  const topExpenses = useMemo(() => {
    return [...filteredExpenses]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [filteredExpenses]);

  // Handle export
  const handleExport = (type) => {
    const exportData = {
      totalIncome,
      totalExpense,
      balance,
      transactions: filteredTransactions,
      categoryBreakdown: expenseByCategory.reduce((acc, cat) => {
        acc[cat.name] = { category: cat.name, total: cat.value, count: 1 };
        return acc;
      }, {}),
    };

    try {
      switch (type) {
        case 'pdf':
          exportService.exportToPDF(exportData, `report-${Date.now()}.pdf`);
          break;
        case 'excel':
          exportService.exportToExcel(exportData, `report-${Date.now()}.xlsx`);
          break;
        case 'csv':
          exportService.exportToCSV(filteredTransactions, `transactions-${Date.now()}.csv`);
          break;
        default:
          break;
      }
      toast.success(`Report exported as ${type.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Reports & Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Analyze your financial data</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="label">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="label">Report Type</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="input-field pl-10"
              >
                <option value="overview">Overview</option>
                <option value="income">Income Analysis</option>
                <option value="expense">Expense Analysis</option>
                <option value="trends">Trends</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => {
              const today = new Date();
              setDateRange({
                startDate: new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0],
                endDate: today.toISOString().split('T')[0],
              });
            }}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            This Month
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
              const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
              setDateRange({
                startDate: lastMonth.toISOString().split('T')[0],
                endDate: lastMonthEnd.toISOString().split('T')[0],
              });
            }}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Last Month
          </button>
          <button
            onClick={() => {
              const today = new Date();
              setDateRange({
                startDate: new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0],
                endDate: today.toISOString().split('T')[0],
              });
            }}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            This Year
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-income-light to-income dark:from-income-dark dark:to-income">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-800 dark:text-green-200 mb-1">Total Income</p>
              <h3 className="text-2xl font-bold text-green-900 dark:text-white">
                {formatCurrency(totalIncome, currency)}
              </h3>
            </div>
            <TrendingUp className="text-income" size={32} />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-expense-light to-expense dark:from-expense-dark dark:to-expense">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-800 dark:text-red-200 mb-1">Total Expense</p>
              <h3 className="text-2xl font-bold text-red-900 dark:text-white">
                {formatCurrency(totalExpense, currency)}
              </h3>
            </div>
            <TrendingDown className="text-expense" size={32} />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-800 dark:text-primary-200 mb-1">Balance</p>
              <h3 className="text-2xl font-bold text-primary-900 dark:text-white">
                {formatCurrency(balance, currency)}
              </h3>
            </div>
            <PieChartIcon className="text-primary-600" size={32} />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">Savings Rate</p>
              <h3 className="text-2xl font-bold text-blue-900 dark:text-white">
                {savingsRate}%
              </h3>
            </div>
            <TrendingUp className="text-blue-600" size={32} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expense Trend */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Income vs Expense Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value) => formatCurrency(value, currency)}
                contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: 'none', borderRadius: '8px' }}
              />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Expense" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense by Category */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Expense by Category</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value, currency)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Comparison */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Category Comparison</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expenseByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value, currency)} />
              <Bar dataKey="value" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Expenses */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Top 5 Expenses</h3>
          <div className="space-y-3">
            {topExpenses.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">No expenses in this period</p>
            ) : (
              topExpenses.map((expense, index) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{expense.description || expense.category}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{expense.category}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-expense">
                    {formatCurrency(expense.amount, currency)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Export Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EXPORT_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => handleExport(type.value)}
              className="flex items-center justify-center gap-2 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              <span className="text-2xl">{type.icon}</span>
              <div className="text-left">
                <p className="font-semibold text-gray-800 dark:text-gray-200">{type.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Download as {type.value.toUpperCase()}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Transaction Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{filteredTransactions.length}</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400 mb-1">Income Entries</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{filteredIncomes.length}</p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400 mb-1">Expense Entries</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">{filteredExpenses.length}</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Avg Transaction</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {filteredTransactions.length > 0 
                ? formatCurrency(
                    filteredTransactions.reduce((sum, t) => sum + t.amount, 0) / filteredTransactions.length,
                    currency
                  )
                : formatCurrency(0, currency)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
