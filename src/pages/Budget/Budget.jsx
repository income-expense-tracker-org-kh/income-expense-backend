import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Wallet, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useBudgetStore } from '../../store/budgetStore';
import { useTransactionStore } from '../../store/transactionStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency, calculateBudgetProgress, getBudgetStatus } from '../../utils/helpers';
import { EXPENSE_CATEGORIES, BUDGET_PERIODS } from '../../constants';
import toast from 'react-hot-toast';

const Budget = () => {
  const { budgets, addBudget, updateBudget, deleteBudget } = useBudgetStore();
  const { expenses } = useTransactionStore();
  const { currency } = useSettingsStore();

  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    enableAlerts: true,
    alertThreshold: 80,
  });

  const resetForm = () => {
    setFormData({
      category: '',
      amount: '',
      period: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      enableAlerts: true,
      alertThreshold: 80,
    });
    setEditingBudget(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount,
      period: budget.period,
      startDate: budget.startDate.split('T')[0],
      enableAlerts: budget.enableAlerts !== false,
      alertThreshold: budget.alertThreshold || 80,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.category || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const budgetData = {
      category: formData.category,
      amount: parseFloat(formData.amount),
      period: formData.period,
      startDate: formData.date,
      enableAlerts: formData.enableAlerts,
      alertThreshold: parseInt(formData.alertThreshold),
    };

    if (editingBudget) {
      updateBudget(editingBudget.id, budgetData);
      toast.success('Budget updated successfully');
    } else {
      addBudget(budgetData);
      toast.success('Budget created successfully');
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(id);
      toast.success('Budget deleted successfully');
    }
  };

  // Calculate spent amount for each budget
  const getBudgetWithSpent = (budget) => {
    const spent = expenses
      .filter(exp => exp.category === budget.category)
      .reduce((sum, exp) => sum + exp.amount, 0);
    
    const progress = calculateBudgetProgress(spent, budget.amount);
    const status = getBudgetStatus(spent, budget.amount);
    
    return { ...budget, spent, progress, status };
  };

  const budgetsWithData = budgets.map(getBudgetWithSpent);

  const getCategoryIcon = (categoryId) => {
    const category = EXPENSE_CATEGORIES.find(cat => cat.id === categoryId);
    return category?.icon || '💰';
  };

  const getCategoryName = (categoryId) => {
    const category = EXPENSE_CATEGORIES.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'safe':
        return 'bg-green-500';
      case 'caution':
        return 'bg-yellow-500';
      case 'warning':
        return 'bg-orange-500';
      case 'exceeded':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'safe':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'exceeded':
        return <AlertTriangle className="text-red-500" size={20} />;
      default:
        return <TrendingUp className="text-yellow-500" size={20} />;
    }
  };

  const totalBudget = budgetsWithData.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgetsWithData.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Budget Planning</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Set and track your spending limits</p>
        </div>
        <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Create Budget
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">Total Budget</p>
          <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {formatCurrency(totalBudget, currency)}
          </h3>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <p className="text-sm text-red-800 dark:text-red-200 mb-1">Total Spent</p>
          <h3 className="text-2xl font-bold text-red-900 dark:text-red-100">
            {formatCurrency(totalSpent, currency)}
          </h3>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <p className="text-sm text-green-800 dark:text-green-200 mb-1">Remaining</p>
          <h3 className="text-2xl font-bold text-green-900 dark:text-green-100">
            {formatCurrency(totalRemaining, currency)}
          </h3>
        </div>
      </div>

      {/* Budgets List */}
      <div className="space-y-4">
        {budgetsWithData.length === 0 ? (
          <div className="card text-center py-12">
            <Wallet className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No budgets created yet</p>
            <button onClick={handleAdd} className="btn-primary">
              Create Your First Budget
            </button>
          </div>
        ) : (
          budgetsWithData.map((budget) => (
            <div key={budget.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-2xl">
                    {getCategoryIcon(budget.category)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {getCategoryName(budget.category)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(budget.status)}
                  <button
                    onClick={() => handleEdit(budget)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Spent: {formatCurrency(budget.spent, currency)}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Budget: {formatCurrency(budget.amount, currency)}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getStatusColor(budget.status)}`}
                    style={{ width: `${Math.min(budget.progress, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className={`font-semibold ${
                    budget.status === 'exceeded' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {budget.status === 'exceeded' ? 'Exceeded by ' : 'Remaining: '}
                    {formatCurrency(Math.abs(budget.amount - budget.spent), currency)}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {budget.progress.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Alert */}
              {budget.enableAlerts && budget.progress >= budget.alertThreshold && (
                <div className={`mt-4 p-3 rounded-lg ${
                  budget.status === 'exceeded' 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} />
                    <span className="text-sm font-medium">
                      {budget.status === 'exceeded' 
                        ? 'Budget exceeded!'
                        : `You've used ${budget.progress.toFixed(0)}% of your budget`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {editingBudget ? 'Edit Budget' : 'Create Budget'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select category</option>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Budget Amount *</label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Period *</label>
                <select
                  name="period"
                  value={formData.period}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  {BUDGET_PERIODS.map((period) => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="enableAlerts" className="text-sm text-gray-700 dark:text-gray-300">
                  Enable budget alerts
                </label>
                <input
                  type="checkbox"
                  name="enableAlerts"
                  checked={formData.enableAlerts}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  id="enableAlerts"
                />
              </div>

              {formData.enableAlerts && (
                <div>
                  <label className="label">Alert Threshold (%)</label>
                  <input
                    type="number"
                    name="alertThreshold"
                    value={formData.alertThreshold}
                    onChange={handleChange}
                    className="input-field"
                    min="1"
                    max="100"
                    placeholder="80"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Get notified when spending reaches this percentage
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {editingBudget ? 'Update' : 'Create'} Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
