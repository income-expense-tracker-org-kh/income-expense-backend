import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, X, Calendar, DollarSign, FileText, Upload, CreditCard } from 'lucide-react';
import { useTransactionStore } from '../../store/transactionStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../../constants';
import toast from 'react-hot-toast';

const Expense = () => {
  const { expenses, addTransaction, updateTransaction, deleteTransaction } = useTransactionStore();
  const { currency, dateFormat } = useSettingsStore();

  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    isRecurring: false,
    recurringPeriod: 'monthly',
    receipt: null,
  });

  const resetForm = () => {
    setFormData({
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      isRecurring: false,
      recurringPeriod: 'monthly',
      receipt: null,
    });
    setEditingExpense(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      amount: expense.amount,
      category: expense.category,
      description: expense.description || '',
      date: expense.date.split('T')[0],
      paymentMethod: expense.paymentMethod || 'cash',
      isRecurring: expense.isRecurring || false,
      recurringPeriod: expense.recurringPeriod || 'monthly',
      receipt: expense.receipt || null,
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFormData((prev) => ({ ...prev, receipt: file.name }));
      toast.success('Receipt attached');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.category || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    const expenseData = {
      type: 'expense',
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
      paymentMethod: formData.paymentMethod,
      isRecurring: formData.isRecurring,
      recurringPeriod: formData.recurringPeriod,
      receipt: formData.receipt,
    };

    if (editingExpense) {
      updateTransaction(editingExpense.id, expenseData);
      toast.success('Expense updated successfully');
    } else {
      addTransaction(expenseData);
      toast.success('Expense added successfully');
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteTransaction(id);
      toast.success('Expense deleted successfully');
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = 
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalExpense = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const getCategoryIcon = (categoryId) => {
    const category = EXPENSE_CATEGORIES.find(cat => cat.id === categoryId);
    return category?.icon || '💸';
  };

  const getPaymentIcon = (methodId) => {
    const method = PAYMENT_METHODS.find(m => m.id === methodId);
    return method?.icon || '💳';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Expense Management</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage your expenses</p>
        </div>
        <button onClick={handleAdd} className="btn-danger flex items-center gap-2">
          <Plus size={20} />
          Add Expense
        </button>
      </div>

      <div className="card bg-gradient-to-br from-expense-light to-expense dark:from-expense-dark dark:to-expense">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-red-800 dark:text-red-200 mb-1">Total Expense</p>
            <h3 className="text-3xl font-bold text-red-900 dark:text-white">
              {formatCurrency(totalExpense, currency)}
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              {filteredExpenses.length} transaction{filteredExpenses.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="w-16 h-16 bg-white dark:bg-red-800 rounded-full flex items-center justify-center">
            <DollarSign className="text-expense" size={32} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search expense..."
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
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Expense Records</h3>
        
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 dark:text-gray-400">No expense records found</p>
            <button onClick={handleAdd} className="btn-primary mt-4">
              Add Your First Expense
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
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Payment</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {formatDate(expense.date, dateFormat)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-expense-light dark:bg-expense-dark/20 text-expense-dark dark:text-expense-light rounded-full text-sm">
                        <span>{getCategoryIcon(expense.category)}</span>
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      <div>
                        {expense.description || '-'}
                        {expense.isRecurring && (
                          <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                            Recurring
                          </span>
                        )}
                        {expense.receipt && (
                          <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                            📎 Receipt
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        {getPaymentIcon(expense.paymentMethod)}
                        <span className="text-sm">{expense.paymentMethod}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-expense">
                      {formatCurrency(expense.amount, currency)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {editingExpense ? 'Edit Expense' : 'Add Expense'}
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
                  {EXPENSE_CATEGORIES.map((cat) => (
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
                <label className="label">Payment Method *</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.icon} {method.name}
                      </option>
                    ))}
                  </select>
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

              <div>
                <label className="label">Attach Receipt</label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                    id="receipt-upload"
                  />
                  <label
                    htmlFor="receipt-upload"
                    className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 transition-colors"
                  >
                    <Upload size={20} className="text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formData.receipt ? formData.receipt : 'Click to upload'}
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Supported: Images, PDF (Max 5MB)
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-expense focus:ring-expense"
                  id="isRecurring"
                />
                <label htmlFor="isRecurring" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Recurring expense
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
                <button type="submit" className="flex-1 btn-danger">
                  {editingExpense ? 'Update' : 'Add'} Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expense;
