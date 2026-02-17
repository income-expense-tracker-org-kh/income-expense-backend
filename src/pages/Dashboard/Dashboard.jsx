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

// ─── CSS variables drive both light and dark skeleton colors ─────────────────
// .dark class on <html> (Tailwind dark mode) flips all tokens automatically.
const SKELETON_STYLES = `
  @keyframes sk-shimmer {
    0%   { background-position: 200% 0 }
    100% { background-position: -200% 0 }
  }

  /* ── Light tokens ── */
  :root {
    --sk-from:        #e2e8f0;
    --sk-via:         #f1f5f9;
    --sk-card-bg:     #ffffff;
    --sk-card-border: #f1f5f9;
    --sk-page-bg:     #f8fafc;
    --sk-divider:     #f1f5f9;
  }

  /* ── Dark tokens — activated by Tailwind's .dark on <html> ── */
  .dark {
    --sk-from:        #1e293b;
    --sk-via:         #263045;
    --sk-card-bg:     #0f172a;
    --sk-card-border: #1e293b;
    --sk-page-bg:     #0f172a;
    --sk-divider:     #1e293b;
  }

  /* Shimmer bar */
  .sk {
    border-radius: 0.375rem;
    background: linear-gradient(
      90deg,
      var(--sk-from) 25%,
      var(--sk-via)  50%,
      var(--sk-from) 75%
    );
    background-size: 400% 100%;
    animation: sk-shimmer 1.8s ease-in-out infinite;
  }

  /* Card wrapper */
  .sk-card {
    background-color: var(--sk-card-bg);
    border: 1px solid var(--sk-card-border);
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.07);
  }

  /* Page wrapper */
  .sk-page {
    min-height: 100vh;
    background-color: var(--sk-page-bg);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
`;

// ─── Primitive: single shimmer bar ───────────────────────────────────────────
const Sk = ({ w, h, radius, style = {} }) => (
  <div
    className="sk"
    style={{
      width: w || '100%',
      height: h || '1rem',
      borderRadius: radius || '0.375rem',
      flexShrink: 0,
      ...style,
    }}
  />
);

// ─── Stat card skeleton ───────────────────────────────────────────────────────
const SkStatCard = () => (
  <div className="sk-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
        <Sk w="6rem" h="0.85rem" />
        <Sk w="9rem" h="2rem" />
      </div>
      <Sk w="3rem" h="3rem" radius="9999px" />
    </div>
    <Sk w="8rem" h="0.8rem" />
  </div>
);

// ─── Chart card skeleton ──────────────────────────────────────────────────────
const SkChart = ({ height = 300 }) => (
  <div className="sk-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <Sk w="12rem" h="1.1rem" />
    <Sk w="100%" h={`${height}px`} radius="0.75rem" />
  </div>
);

// ─── Transaction row skeleton ─────────────────────────────────────────────────
const SkTxRow = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.65rem 0.75rem',
    borderRadius: '0.5rem',
    background: 'var(--sk-from)',
  }}>
    <Sk w="2.5rem" h="2.5rem" radius="9999px" />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <Sk w="55%" h="0.9rem" />
      <Sk w="30%" h="0.7rem" />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end' }}>
      <Sk w="4.5rem" h="0.9rem" />
      <Sk w="3rem" h="0.7rem" />
    </div>
  </div>
);

// ─── Full dashboard skeleton ──────────────────────────────────────────────────
const DashboardSkeleton = () => (
  <div className="sk-page">

    {/* Page header */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Sk w="13rem" h="1.6rem" />
      <Sk w="20rem" h="0.9rem" />
    </div>

    {/* Stat cards — 3 col mirrors actual layout */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
      <SkStatCard />
      <SkStatCard />
      <SkStatCard />
    </div>

    {/* Quick actions card */}
    <div className="sk-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Sk w="8rem" h="1.1rem" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="sk" style={{ height: '5.5rem', borderRadius: '0.5rem' }} />
        ))}
      </div>
    </div>

    {/* Charts — 2 col mirrors actual layout */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
      <SkChart height={300} />
      <SkChart height={300} />
    </div>

    {/* Recent transactions card */}
    <div className="sk-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Sk w="10rem" h="1.1rem" />
        <Sk w="4rem" h="0.85rem" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {[...Array(3)].map((_, i) => <SkTxRow key={i} />)}
      </div>
    </div>
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const { currency } = useSettingsStore();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

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

  if (loading) {
    return (
      <>
        <style>{SKELETON_STYLES}</style>
        <DashboardSkeleton />
      </>
    );
  }

  // ── Overview ──────────────────────────────────────────────────────────────
  const totalIncome = dashboardData?.overview?.monthlyIncome || 0;
  const totalExpense = dashboardData?.overview?.monthlyExpense || 0;
  const balance = dashboardData?.overview?.totalBalance || 0;
  const savingsRate = dashboardData?.overview?.savingsRate || '0.00';

  const comparison = dashboardData?.comparison || {};
  const pctChange = parseFloat(comparison.percentageChange || 0);
  const prevMonth = comparison.previousMonth || 0;

  // ── Monthly trend data ────────────────────────────────────────────────────
  const buildMonthlyData = () => {
    const trend = dashboardData?.monthlyTrend;
    if (Array.isArray(trend) && trend.length > 0) {
      return trend.map((item) => ({
        month: item.month || item._id || '',
        income: item.income || item.totalIncome || 0,
        expense: item.expense || item.totalExpense || 0,
      }));
    }
    const now = moment();
    const currentMonthLabel = now.format('MMM');
    const previousMonthLabel = now.subtract(1, 'month').format('MMM');
    const prevIncome = prevMonth > 0
      ? Math.round(prevMonth / (1 - parseFloat(savingsRate) / 100) || prevMonth)
      : 0;
    return [
      { month: previousMonthLabel, income: prevIncome, expense: prevMonth },
      { month: currentMonthLabel, income: totalIncome, expense: totalExpense },
    ];
  };

  const monthlyData = buildMonthlyData();
  const categoryData = dashboardData?.expensesByCategory?.map((item) => ({ name: item._id, value: item.total })) || [];
  const recentTransactions = dashboardData?.recentTransactions ?? [];

  return (
    <div className="space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Income */}
        <div className="card bg-gradient-to-br from-income-light to-income dark:from-income-dark dark:to-income">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-green-800 dark:text-green-200 mb-1">Total Income</p>
              <h3 className="text-3xl font-bold text-green-900 dark:text-white">
                {formatCurrency(totalIncome, currency)}
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
                {formatCurrency(totalExpense, currency)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-white dark:bg-red-800 rounded-full flex items-center justify-center">
              <TrendingDown className="text-expense" size={24} />
            </div>
          </div>
          <div className="flex items-center text-sm text-red-800 dark:text-red-200">
            <ArrowDownRight size={16} className="mr-1" />
            <span>{pctChange > 0 ? `+${pctChange}` : pctChange}% vs prev month</span>
          </div>
        </div>

        {/* Balance */}
        <div className="card bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-primary-800 dark:text-primary-200 mb-1">Balance</p>
              <h3 className="text-3xl font-bold text-primary-900 dark:text-white">
                {formatCurrency(balance, currency)}
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

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Expense by Category</h3>
          {categoryData.length === 0 ? (
            <div className="flex h-72 items-center justify-center text-sm text-gray-400">
              No expense data yet
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <Link
            to="/transactions"
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {recentTransactions.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No transactions yet</p>
          ) : (
            recentTransactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'income'
                    ? 'bg-income-light dark:bg-income-dark/20'
                    : 'bg-expense-light dark:bg-expense-dark/20'
                    }`}>
                    {transaction.type === 'income'
                      ? <TrendingUp className="text-income" size={20} />
                      : <TrendingDown className="text-expense" size={20} />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{transaction.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {transaction.category || transaction.source || '—'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.type === 'income' ? 'text-income' : 'text-expense'
                    }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount, currency)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {moment(transaction.date).format('DD/MM/YYYY')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;