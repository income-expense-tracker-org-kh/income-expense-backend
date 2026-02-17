import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Wallet, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency } from '../../utils/helpers';
import { CHART_COLORS } from '../../constants';
import { dashboardService } from '../../services/dashboardService';
import toast from 'react-hot-toast';
import moment from 'moment';

const Dashboard = () => {
  const { currency } = useSettingsStore();
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getAll();
      setDashboardData(res?.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ─── Skeleton primitives ──────────────────────────────────────────────────────

  const Skeleton = ({ className = '' }) => (
    <div
      className={`animate-pulse rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%] ${className}`}
      style={{ animation: 'shimmer 1.6s ease-in-out infinite' }}
    />
  );

  const SkeletonCard = () => (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-3 w-24" />
    </div>
  );

  const SkeletonChart = ({ height = 'h-64' }) => (
    <div className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4`}>
      <Skeleton className="h-5 w-48" />
      <Skeleton className={`w-full ${height} rounded-xl`} />
    </div>
  );

  const SkeletonRow = () => (
    <div className="flex items-center gap-4 py-3">
      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-4 w-20 ml-auto" />
        <Skeleton className="h-3 w-16 ml-auto" />
      </div>
    </div>
  );

  // ─── Skeleton overlay for the full Dashboard ─────────────────────────────────

  const DashboardSkeleton = () => (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>

      {/* charts row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SkeletonChart height="h-72" />
        </div>
        <SkeletonChart height="h-72" />
      </div>

      {/* recent transactions */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="divide-y divide-gray-50">
          {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      </div>
    </div>
  );

  // ===== LOADING SCREEN =====
  if (loading) return <DashboardSkeleton />;
  console.log("dashboardData", dashboardData)

  // ===== OVERVIEW =====

  // ── Overview ──────────────────────────────────────────────────────────────
  const totalIncome = dashboardData?.overview?.monthlyIncome || 0;
  const totalExpense = dashboardData?.overview?.monthlyExpense || 0;
  const balance = dashboardData?.overview?.totalBalance || 0;
  const savingsRate = dashboardData?.overview?.savingsRate || '0.00';
  const monthlySavings = dashboardData?.overview?.monthlySavings || 0;

  const comparison = dashboardData?.comparison || {};
  const pctChange = parseFloat(comparison.percentageChange || 0);
  const prevMonth = comparison.previousMonth || 0;
  const currMonth = comparison.currentMonth || 0;

  // Sample data - Replace with actual data
  // ── Monthly trend data ────────────────────────────────────────────────────
  // Build the chart from real API data. The API gives us the current month's
  // income/expense plus the previous month's expense total. We derive income
  // for the previous month if savingsRate is available, otherwise use expense.
  // Extend with any monthlyTrend array the API might return in the future.
  const buildMonthlyData = () => {
    const trend = dashboardData?.monthlyTrend; // optional array from API

    // If the API already returns a monthly trend array, use it directly
    if (Array.isArray(trend) && trend.length > 0) {
      return trend.map((item) => ({
        month: item.month || item._id || '',
        income: item.income || item.totalIncome || 0,
        expense: item.expense || item.totalExpense || 0,
      }));
    }

    // Build a 2-point chart from current + previous month comparison data
    const now = moment();
    const currentMonthLabel = now.format('MMM');
    const previousMonthLabel = now.subtract(1, 'month').format('MMM');

    // Estimate previous month income: if savings rate is the same it would be
    // prevExpense / (1 - savingsRate). We keep it simple and show what we have.
    const prevIncome = prevMonth > 0
      ? Math.round(prevMonth / (1 - parseFloat(savingsRate) / 100) || prevMonth)
      : 0;

    return [
      { month: previousMonthLabel, income: prevIncome, expense: prevMonth },
      { month: currentMonthLabel, income: totalIncome, expense: totalExpense },
    ];
  };

  const monthlyData = buildMonthlyData();


  // ===== CATEGORY PIE DATA =====
  const categoryData =
    dashboardData?.expensesByCategory?.map((item) => ({
      name: item._id,
      value: item.total,
    })) || [];

  // ===== RECENT TRANSACTIONS =====
  const recentTransactions = dashboardData?.recentTransactions ?? [];

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes income-shimmer {
          0%   { background-position: 100% 0 }
          100% { background-position: -100% 0 }
        }
      `}</style>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Income */}
        <div className="card bg-gradient-to-br from-income-light to-income dark:from-income-dark dark:to-income">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-green-800 dark:text-green-200 mb-1">Total Income</p>
              <h3 className="text-3xl font-bold text-green-900 dark:text-white">
                {formatCurrency(totalIncome || 5000, currency)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-white dark:bg-green-800 rounded-full flex items-center justify-center">
              <TrendingUp className="text-income" size={24} />
            </div>
          </div>
          <div className="flex items-center text-sm text-green-800 dark:text-green-200">
            <ArrowUpRight size={16} className="mr-1" />
            <span>+12% from last month</span>
          </div>
        </div>

        {/* Total Expense */}
        <div className="card bg-gradient-to-br from-expense-light to-expense dark:from-expense-dark dark:to-expense">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-red-800 dark:text-red-200 mb-1">Total Expense</p>
              <h3 className="text-3xl font-bold text-red-900 dark:text-white">
                {formatCurrency(totalExpense || 3500, currency)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-white dark:bg-red-800 rounded-full flex items-center justify-center">
              <TrendingDown className="text-expense" size={24} />
            </div>
          </div>
          <div className="flex items-center text-sm text-red-800 dark:text-red-200">
            <ArrowDownRight size={16} className="mr-1" />
            <span>-5% from last month</span>
          </div>
        </div>

        {/* Balance */}
        <div className="card bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-primary-800 dark:text-primary-200 mb-1">Balance</p>
              <h3 className="text-3xl font-bold text-primary-900 dark:text-white">
                {formatCurrency(balance || 1500, currency)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-white dark:bg-primary-800 rounded-full flex items-center justify-center">
              <Wallet className="text-primary-600" size={24} />
            </div>
          </div>
          <div className="flex items-center text-sm text-primary-800 dark:text-primary-200">
            <ArrowUpRight size={16} className="mr-1" />
            <span>Healthy savings</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/income" className="flex flex-col items-center p-4 bg-income-light dark:bg-income-dark/20 rounded-lg hover:shadow-md transition-shadow">
            <Plus className="text-income mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Income</span>
          </Link>
          <Link to="/expense" className="flex flex-col items-center p-4 bg-expense-light dark:bg-expense-dark/20 rounded-lg hover:shadow-md transition-shadow">
            <Plus className="text-expense mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Expense</span>
          </Link>
          <Link to="/budget" className="flex flex-col items-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:shadow-md transition-shadow">
            <Wallet className="text-primary-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Set Budget</span>
          </Link>
          <Link to="/reports" className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow">
            <TrendingUp className="text-gray-600 dark:text-gray-400 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View Reports</span>
          </Link>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expense Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Income vs Expense Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Expense" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense by Category */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Expense by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <Link to="/transactions" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'income' ? 'bg-income-light dark:bg-income-dark/20' : 'bg-expense-light dark:bg-expense-dark/20'
                  }`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="text-income" size={20} />
                  ) : (
                    <TrendingDown className="text-expense" size={20} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{transaction.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${transaction.type === 'income' ? 'text-income' : 'text-expense'
                  }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{moment(transaction.date).format('DD/MM/YYYY')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
