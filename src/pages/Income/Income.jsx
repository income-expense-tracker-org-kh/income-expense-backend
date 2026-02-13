import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, X, Calendar, DollarSign, FileText } from 'lucide-react';
import { useTransactionStore } from '../../store/transactionStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { INCOME_CATEGORIES } from '../../constants';
import toast from 'react-hot-toast';

const Income = () => {
  const { incomes, addTransaction, updateTransaction, deleteTransaction } = useTransactionStore();
  const { currency, dateFormat } = useSettingsStore();

  const [showModal, setShowModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    isRecurring: false,
    recurringPeriod: 'monthly',
  });

  const resetForm = () => {
    setFormData({
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      isRecurring: false,
      recurringPeriod: 'monthly',
    });
    setEditingIncome(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (income) => {
    setEditingIncome(income);
    setFormData({
      amount: income.amount,
      category: income.category,
      description: income.description || '',
      date: income.date.split('T')[0],
      isRecurring: income.isRecurring || false,
      recurringPeriod: income.recurringPeriod || 'monthly',
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

    if (!formData.amount || !formData.category || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    const incomeData = {
      type: 'income',
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
      isRecurring: formData.isRecurring,
      recurringPeriod: formData.recurringPeriod,
    };

    if (editingIncome) {
      updateTransaction(editingIncome.id, incomeData);
      toast.success('Income updated successfully');
    } else {
      addTransaction(incomeData);
      toast.success('Income added successfully');
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      deleteTransaction(id);
      toast.success('Income deleted successfully');
    }
  };

  const filteredIncomes = incomes.filter((income) => {
    const matchesSearch = 
      income.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      income.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || income.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);

  const getCategoryIcon = (categoryId) => {
    const category = INCOME_CATEGORIES.find(cat => cat.id === categoryId);
    return category?.icon || '💰';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Income Management</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage your income sources</p>
        </div>
        <button onClick={handleAdd} className="btn-success flex items-center gap-2">
          <Plus size={20} />
          Add Income
        </button>
      </div>

      <div className="card bg-gradient-to-br from-income-light to-income dark:from-income-dark dark:to-income">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-800 dark:text-green-200 mb-1">Total Income</p>
            <h3 className="text-3xl font-bold text-green-900 dark:text-white">
              {formatCurrency(totalIncome, currency)}
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              {filteredIncomes.length} transaction{filteredIncomes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="w-16 h-16 bg-white dark:bg-green-800 rounded-full flex items-center justify-center">
            <DollarSign className="text-income" size={32} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search income..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field pl-10"
            >
              <option value="all">All Categories</option>
              {INCOME_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Income Records</h3>
        
        {filteredIncomes.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 dark:text-gray-400">No income records found</p>
            <button onClick={handleAdd} className="btn-primary mt-4">
              Add Your First Income
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Description</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncomes.map((income) => (
                  <tr
                    key={income.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {formatDate(income.date, dateFormat)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-income-light dark:bg-income-dark/20 text-income-dark dark:text-income-light rounded-full text-sm">
                        <span>{getCategoryIcon(income.category)}</span>
                        {income.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {income.description || '-'}
                      {income.isRecurring && (
                        <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                          Recurring
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-income">
                      {formatCurrency(income.amount, currency)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(income)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(income.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {editingIncome ? 'Edit Income' : 'Add Income'}
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
                <label className="label">Amount *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
                <label className="label">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select category</option>
                  {INCOME_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Description</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field pl-10"
                    rows="3"
                    placeholder="Add a note..."
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-income focus:ring-income"
                  id="isRecurring"
                />
                <label htmlFor="isRecurring" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Recurring income
                </label>
              </div>

              {formData.isRecurring && (
                <div>
                  <label className="label">Recurring Period</label>
                  <select
                    name="recurringPeriod"
                    value={formData.recurringPeriod}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
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
                <button type="submit" className="flex-1 btn-success">
                  {editingIncome ? 'Update' : 'Add'} Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Income;
