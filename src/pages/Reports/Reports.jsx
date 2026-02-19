import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Calendar, Filter, TrendingUp, TrendingDown, PieChart as PieChartIcon, RefreshCw } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency } from '../../utils/helpers';
import { exportService } from '../../services/exportService';
import { expenseService } from '../../services/expenseService';
import { incomeService } from '../../services/incomeService';
import { dashboardService } from '../../services/dashboardService';
import { CHART_COLORS, EXPORT_TYPES } from '../../constants';
import toast from 'react-hot-toast';
import useTranslation from '../../hooks/useTranslation';

// ─── Skeleton loader components ───────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
);

const CardSkeleton = () => (
  <div className="card">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-32" />
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  </div>
);

const ChartSkeleton = () => (
  <div className="card">
    <Skeleton className="h-6 w-40 mb-4" />
    <div className="flex items-end gap-2 h-[300px] pt-8">
      {[60, 80, 45, 90, 55, 70, 40, 85, 65, 75].map((h, i) => (
        <Skeleton key={i} className="flex-1" style={{ height: `${h}%` }} />
      ))}
    </div>
  </div>
);

// ─── Main component ────────────────────────────────────────────────────────────
const Reports = () => {
  const { currency, language } = useSettingsStore();
  const { t } = useTranslation(language);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [reportType, setReportType] = useState('overview');

  // ── Loading state (one boolean per fetch, matching codebase pattern) ────────
  const [loadingFinancialSummary, setLoadingFinancialSummary] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loadingExpenseSummary, setLoadingExpenseSummary] = useState(false);
  const [loadingExpenseTrends, setLoadingExpenseTrends] = useState(false);
  const [loadingAllExpenses, setLoadingAllExpenses] = useState(false);
  const [loadingAllIncome, setLoadingAllIncome] = useState(false);

  // ── Data state ─────────────────────────────────────────────────────────────
  const [financialSummary, setFinancialSummary] = useState(null);
  const [insights, setInsights] = useState(null);
  const [expenseSummary, setExpenseSummary] = useState(null);
  const [expenseTrends, setExpenseTrends] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [allIncome, setAllIncome] = useState([]);

  // ── Fetch functions (all follow the same pattern) ─────────────────────────

  const fetchFinancialSummary = useCallback(async () => {
    try {
      setLoadingFinancialSummary(true);
      const res = await dashboardService.getFinancialSummary(dateRange);
      setFinancialSummary(res?.data);
    } catch (error) {
      toast.error('Failed to load financial summary');
    } finally {
      setLoadingFinancialSummary(false);
    }
  },[dateRange]);

  const fetchInsights = useCallback(async () => {
    try {
      setLoadingInsights(true);
      const res = await dashboardService.getInsights(dateRange);
      setInsights(res?.data);
    } catch (error) {
      toast.error('Failed to load insights');
    } finally {
      setLoadingInsights(false);
    }
  }, [dateRange]); // ✅ add dependencies here

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const fetchExpenseSummary = useCallback(async () => {
    try {
      setLoadingExpenseSummary(true);
      const res = await expenseService.getExpenseSummary(dateRange);
      setExpenseSummary(res?.data);
    } catch (error) {
      toast.error('Failed to load expense summary');
    } finally {
      setLoadingExpenseSummary(false);
    }
  },[dateRange]);

  const fetchExpenseTrends = useCallback(async () => {
    try {
      setLoadingExpenseTrends(true);
      const res = await expenseService.getExpenseTrends(dateRange);
      setExpenseTrends(res?.data ?? []);
    } catch (error) {
      toast.error('Failed to load expense trends');
    } finally {
      setLoadingExpenseTrends(false);
    }
  },[dateRange]);

  const fetchAllExpenses = useCallback(async () => {
    try {
      setLoadingAllExpenses(true);
      const res = await expenseService.getAll(dateRange);
      setAllExpenses(res?.data ?? []);
    } catch (error) {
      toast.error('Failed to load expenses');
    } finally {
      setLoadingAllExpenses(false);
    }
  },[dateRange]);

  const fetchAllIncome = useCallback(async () => {
    try {
      setLoadingAllIncome(true);
      const res = await incomeService.getAll(dateRange);
      setAllIncome(res?.data ?? []);
    } catch (error) {
      toast.error('Failed to load incomes');
    } finally {
      setLoadingAllIncome(false);
    }
  }, [dateRange]);

  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchFinancialSummary();
  }, [fetchFinancialSummary]);

  useEffect(() => {
    fetchExpenseSummary();
  }, [fetchExpenseSummary]);

  useEffect(() => {
    fetchExpenseTrends();
  }, [fetchExpenseTrends]);

  useEffect(() => {
    fetchAllExpenses();
  }, [fetchAllExpenses]);

  useEffect(() => {
    fetchAllIncome();
  }, [fetchAllIncome]);

  // ── Refresh all ───────────────────────────────────────────────────────────
  const handleRefresh = () => {
    fetchFinancialSummary();
    fetchInsights();
    fetchExpenseSummary();
    fetchExpenseTrends();
    fetchAllExpenses();
    fetchAllIncome();
    toast.success('Data refreshed');
  };

  // ── Derived values ─────────────────────────────────────────────────────────
  const isAnythingLoading =
    loadingFinancialSummary ||
    loadingInsights ||
    loadingExpenseSummary ||
    loadingExpenseTrends ||
    loadingAllExpenses ||
    loadingAllIncome;

  const allTransactions = useMemo(() => [
    ...allIncome.map(t => ({ ...t, type: 'income' })),
    ...allExpenses.map(t => ({ ...t, type: 'expense' })),
  ], [allIncome, allExpenses]);

  // expenseSummary.total/count come directly from API: { total: 306, count: 2, byCategory: [...] }
  const totalIncome  = financialSummary?.totalIncome  ?? allIncome.reduce((s, t) => s + (t.amount ?? 0), 0);
  const totalExpense = financialSummary?.totalExpense ?? expenseSummary?.total ?? allExpenses.reduce((s, t) => s + (t.amount ?? 0), 0);
  const totalCount   = expenseSummary?.count ?? allExpenses.length;
  const balance      = financialSummary?.balance      ?? (totalIncome - totalExpense);
  const savingsRate  = financialSummary?.savingsRate  ?? (totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0);

  const expenseByCategory = useMemo(() => {
    // API returns byCategory as an array: [{ _id: "rent", total: 300, count: 1, avgAmount: 300 }, ...]
    if (Array.isArray(expenseSummary?.byCategory) && expenseSummary.byCategory.length > 0) {
      return expenseSummary.byCategory.map(cat => ({
        name: t(`expense.categories.${cat._id}`),
        value: cat.total,
        count: cat.count,
        avg: cat.avgAmount,
      }));
    }
    // Fallback: compute locally from raw expenses
    const grouped = {};
    allExpenses.forEach(t => {
      grouped[t.category] = (grouped[t.category] || 0) + (t.amount ?? 0);
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [expenseSummary, allExpenses, t]);

  const monthlyTrend = useMemo(() => {
    // API returns: [{ _id: { year: 2026, month: 2 }, total: 306, count: 2 }, ...]
    if (expenseTrends.length > 0) {
      return expenseTrends.map(d => {
        const { year, month } = d._id;
        const label = new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        return {
          date: label,
          expense: d.total ?? 0,
          income: 0,   // trends endpoint is expense-only; income overlay via allIncome if needed
          balance: -(d.total ?? 0),
        };
      });
    }
    // Fallback: compute locally from raw transactions
    const grouped = {};
    allTransactions.forEach(t => {
      const key = t.date?.split('T')[0] ?? t.date;
      if (!grouped[key]) grouped[key] = { income: 0, expense: 0 };
      if (t.type === 'income')  grouped[key].income  += t.amount ?? 0;
      if (t.type === 'expense') grouped[key].expense += t.amount ?? 0;
    });
    return Object.entries(grouped).sort().map(([date, vals]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ...vals,
      balance: vals.income - vals.expense,
    }));
  }, [expenseTrends, allTransactions]);

  const topExpenses = useMemo(() =>
    [...allExpenses].sort((a, b) => b.amount - a.amount).slice(0, 5),
  [allExpenses]);

  // ── Export ─────────────────────────────────────────────────────────────────
  const handleExport = (type) => {
    const exportData = {
      totalIncome, totalExpense, balance,
      transactions: allTransactions,
      categoryBreakdown: expenseByCategory.reduce((acc, cat) => {
        acc[cat.name] = { category: cat.name, total: cat.value, count: 1 };
        return acc;
      }, {}),
    };
    try {
      switch (type) {
        case 'pdf':   exportService.exportToPDF(exportData,      `report-${Date.now()}.pdf`);  break;
        case 'excel': exportService.exportToExcel(exportData,    `report-${Date.now()}.xlsx`); break;
        case 'csv':   exportService.exportToCSV(allTransactions, `transactions-${Date.now()}.csv`); break;
        default: break;
      }
      toast.success(`Report exported as ${type.toUpperCase()}`);
    } catch {
      toast.error('Failed to export report');
    }
  };

  // ── Quick-range helpers ────────────────────────────────────────────────────
  const setThisMonth = () => {
    const today = new Date();
    setDateRange({
      startDate: new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
    });
  };
  const setLastMonth = () => {
    const today = new Date();
    setDateRange({
      startDate: new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0],
      endDate: new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0],
    });
  };
  const setThisYear = () => {
    const today = new Date();
    setDateRange({
      startDate: new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t("reports.title")}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t("reports.subtitle")}</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isAnythingLoading}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <RefreshCw size={16} className={isAnythingLoading ? 'animate-spin' : ''} />
          {isAnythingLoading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">{t("reports.startDate")}</label>
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
            <label className="label">{t("reports.endDate")}</label>
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
            <label className="label">{t("reports.reportType")}</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="input-field pl-10">
                <option value="overview">{t("reports.overview")}</option>
                <option value="income">{t("reports.incomeAnalysis")}</option>
                <option value="expense">{t("reports.expenseAnalysis")}</option>
                <option value="trends">{t("reports.trends")}</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label: t("reports.thisMonth"), fn: setThisMonth },
            { label: t("reports.lastMonth"), fn: setLastMonth },
            { label: t("reports.thisYear"),  fn: setThisYear  },
          ].map(({ label, fn }) => (
            <button key={label} onClick={fn}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {loadingFinancialSummary || loadingAllIncome ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <div className="card bg-gradient-to-br from-income-light to-income dark:from-income-dark dark:to-income">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-800 dark:text-green-200 mb-1">{t("reports.totalIncome")}</p>
                  <h3 className="text-2xl font-bold text-green-900 dark:text-white">{formatCurrency(totalIncome, currency)}</h3>
                  {allIncome.length > 0 && <p className="text-xs text-green-700 dark:text-green-300 mt-1">{allIncome.length} {t("reports.entries")}</p>}
                </div>
                <TrendingUp className="text-income" size={32} />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-expense-light to-expense dark:from-expense-dark dark:to-expense">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-800 dark:text-red-200 mb-1">{t("reports.totalExpense")}</p>
                  <h3 className="text-2xl font-bold text-red-900 dark:text-white">{formatCurrency(totalExpense, currency)}</h3>
                  {totalCount > 0 && <p className="text-xs text-red-700 dark:text-red-300 mt-1">{totalCount} {t("reports.entries")}</p>}
                </div>
                <TrendingDown className="text-expense" size={32} />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary-800 dark:text-primary-200 mb-1">{t("reports.balance")}</p>
                  <h3 className={`text-2xl font-bold ${balance >= 0 ? 'text-primary-900 dark:text-white' : 'text-red-700 dark:text-red-300'}`}>
                    {formatCurrency(balance, currency)}
                  </h3>
                </div>
                <PieChartIcon className="text-primary-600" size={32} />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">{t("reports.savingsRate")}</p>
                  <h3 className="text-2xl font-bold text-blue-900 dark:text-white">{savingsRate}%</h3>
                </div>
                <TrendingUp className="text-blue-600" size={32} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Insights strip */}
      {insights?.tips?.length > 0 && !loadingInsights && (
        <div className="card border-l-4 border-primary-500 bg-primary-50 dark:bg-primary-900/20">
          <h3 className="text-sm font-semibold text-primary-800 dark:text-primary-300 mb-2">💡{t("reports.insights")}</h3>
          <ul className="space-y-1">
            {insights.tips.slice(0, 3).map((tip, i) => (
              <li key={i} className="text-sm text-primary-700 dark:text-primary-300">• {tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Income vs Expense Trend */}
        {loadingExpenseTrends || loadingAllIncome ? <ChartSkeleton /> : (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">{t("reports.incomeVsExpense")}</h3>
            {monthlyTrend.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-16">{t("reports.noDataForThisPeriod")}</p>
            ) : (
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
                  <Line type="monotone" dataKey="income"  stroke="#10b981" strokeWidth={2} name={t("settings.income")}/>
                  <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name={t("settings.expense")} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* Expense by Category */}
        {loadingExpenseSummary ? <ChartSkeleton /> : (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">{t("reports.expenseByCategory")}</h3>
            {expenseByCategory.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-16">{t("reports.noExpenseData")}</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={expenseByCategory} cx="50%" cy="50%" labelLine={false}
                    label={(entry) => entry.name} outerRadius={100} dataKey="value">
                    {expenseByCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value, currency)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* Category Comparison */}
        {loadingExpenseSummary ? <ChartSkeleton /> : (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">{t("reports.categoryComparison")}</h3>
            {expenseByCategory.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-16">{t("reports.noExpenseData")}</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expenseByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value, currency)} />
                  <Bar dataKey="value" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* Top Expenses */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">{t("reports.topExpenses")}</h3>
          {loadingAllExpenses ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-5 w-20" />
                </div>
              ))}
            </div>
          ) : topExpenses.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t("reports.noExpenses")}</p>
          ) : (
            <div className="space-y-3">
              {topExpenses.map((expense, index) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{expense.description || expense.category}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t(`expense.categories.${(expense.category)}`)}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-expense">{formatCurrency(expense.amount, currency)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Export Options */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">{t("reports.exportReport")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EXPORT_TYPES.map((type) => (
            <button key={type.value} onClick={() => handleExport(type.value)}
              disabled={isAnythingLoading}
              className="flex items-center justify-center gap-2 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors disabled:opacity-50">
              <span className="text-2xl">{type.icon}</span>
              <div className="text-left">
                <p className="font-semibold text-gray-800 dark:text-gray-200">{type.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t("reports.downloadAs")} {type.value.toUpperCase()}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">{t("reports.transactionSummary")}</h3>
        {loadingAllExpenses || loadingAllIncome ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t("reports.totalTransactions")}</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{allTransactions.length}</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">{t("reports.incomeEntries")}</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{allIncome.length}</p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 mb-1">{t("reports.expenseEntries")}</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">{totalCount}</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">{t("reports.avgTransaction")}</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {allTransactions.length > 0
                  ? formatCurrency(allTransactions.reduce((s, t) => s + t.amount, 0) / allTransactions.length, currency)
                  : formatCurrency(0, currency)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;