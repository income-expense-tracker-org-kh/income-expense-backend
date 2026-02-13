import React, { useState } from 'react';
import { Edit2, Trash2, RefreshCw, MoreVertical } from 'lucide-react';
import { useTransactionStore } from '../../store/transactionStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { INCOME_CATEGORIES } from '../../constants';
import toast from 'react-hot-toast';

const IncomeList = ({ incomes, onEdit }) => {
  const { deleteTransaction } = useTransactionStore();
  const { currency, dateFormat } = useSettingsStore();
  const [activeMenu, setActiveMenu] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const getCategoryInfo = (categoryId) => {
    return INCOME_CATEGORIES.find((c) => c.id === categoryId) || { name: categoryId, icon: '💰' };
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income record?')) {
      setDeletingId(id);
      try {
        deleteTransaction(id);
        toast.success('Income deleted successfully');
      } catch (error) {
        toast.error('Failed to delete income');
      } finally {
        setDeletingId(null);
        setActiveMenu(null);
      }
    }
  };

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  if (incomes.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">💰</div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No Income Records Found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Start tracking your income by adding your first record
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop View */}
      <div className="hidden lg:block card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {incomes.map((income) => {
                const categoryInfo = getCategoryInfo(income.category);
                return (
                  <tr
                    key={income.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(income.date, dateFormat)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{categoryInfo.icon}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {categoryInfo.name}
                        </span>
                        {income.isRecurring && (
                          <RefreshCw
                            size={14}
                            className="text-primary-600 dark:text-primary-400"
                            title="Recurring"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {income.source}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {income.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-income">
                        {formatCurrency(income.amount, currency)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(income)}
                          className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(income.id)}
                          disabled={deletingId === income.id}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden space-y-3">
        {incomes.map((income) => {
          const categoryInfo = getCategoryInfo(income.category);
          return (
            <div
              key={income.id}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-income-light dark:bg-income-dark/20 rounded-full flex items-center justify-center text-2xl">
                    {categoryInfo.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {income.source}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {categoryInfo.name}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => toggleMenu(income.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <MoreVertical size={18} />
                  </button>
                  {activeMenu === income.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                      <button
                        onClick={() => {
                          onEdit(income);
                          setActiveMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(income.id)}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {income.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {income.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{formatDate(income.date, dateFormat)}</span>
                  {income.isRecurring && (
                    <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400">
                      <RefreshCw size={14} />
                      <span className="text-xs">Recurring</span>
                    </div>
                  )}
                </div>
                <div className="text-lg font-bold text-income">
                  {formatCurrency(income.amount, currency)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IncomeList;
