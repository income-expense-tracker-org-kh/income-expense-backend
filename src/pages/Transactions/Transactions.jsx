import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Download, TrendingUp, TrendingDown, SlidersHorizontal } from 'lucide-react';
import { useTransactionStore } from '../../store/transactionStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../constants';

const Transactions = () => {
  const { transactions } = useTransactionStore();
  const { currency, dateFormat } = useSettingsStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory);
    }

    // Date range filter
    if (dateRange.startDate) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(dateRange.startDate));
    }
    if (dateRange.endDate) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(dateRange.endDate));
    }

    // Sort
    switch (sortBy) {
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'amount-desc':
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case 'amount-asc':
        filtered.sort((a, b) => a.amount - b.amount);
        break;
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
      default:
        break;
    }

    return filtered;
  }, [transactions, searchTerm, filterType, filterCategory, sortBy, dateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const getCategoryIcon = (type, categoryId) => {
    const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    const category = categories.find(cat => cat.id === categoryId);
    return category?.icon || (type === 'income' ? '💰' : '💸');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterCategory('all');
    setSortBy('date-desc');
    setDateRange({ startDate: '', endDate: '' });
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">All Transactions</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage all your financial transactions</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Transactions</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{filteredTransactions.length}</h3>
            </div>
            <SlidersHorizontal className="text-gray-400" size={32} />
          </div>
        </div>

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
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field pl-10"
            >
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">All Categories</option>
              <optgroup label="Income">
                {INCOME_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </optgroup>
              <optgroup label="Expense">
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="date-desc">Latest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
              <option value="category">Category</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <div className="overflow-x-auto">
          {paginatedTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Description</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {formatDate(transaction.date, dateFormat)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        transaction.type === 'income'
                          ? 'bg-income-light dark:bg-income-dark/20 text-income-dark dark:text-income-light'
                          : 'bg-expense-light dark:bg-expense-dark/20 text-expense-dark dark:text-expense-light'
                      }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp size={16} />
                        ) : (
                          <TrendingDown size={16} />
                        )}
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <span>{getCategoryIcon(transaction.type, transaction.category)}</span>
                        {transaction.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {transaction.description || '-'}
                      {transaction.isRecurring && (
                        <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                          Recurring
                        </span>
                      )}
                      {transaction.receipt && (
                        <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                          📎
                        </span>
                      )}
                    </td>
                    <td className={`py-3 px-4 text-right font-semibold ${
                      transaction.type === 'income' ? 'text-income' : 'text-expense'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
