import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, FileText, Tag, RefreshCw } from 'lucide-react';
import { useTransactionStore } from '../../store/transactionStore';
import { INCOME_CATEGORIES } from '../../constants';
import toast from 'react-hot-toast';

const IncomeForm = ({ income, onClose }) => {
  const { addTransaction, updateTransaction } = useTransactionStore();
  const isEditing = !!income;

  const [formData, setFormData] = useState({
    amount: income?.amount || '',
    category: income?.category || 'salary',
    source: income?.source || '',
    description: income?.description || '',
    date: income?.date || new Date().toISOString().split('T')[0],
    isRecurring: income?.isRecurring || false,
    recurringFrequency: income?.recurringFrequency || 'monthly',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.source || formData.source.trim() === '') {
      newErrors.source = 'Please enter income source';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const incomeData = {
        ...formData,
        amount: parseFloat(formData.amount),
        type: 'income',
      };

      if (isEditing) {
        updateTransaction(income.id, incomeData);
        toast.success('Income updated successfully');
      } else {
        addTransaction(incomeData);
        toast.success('Income added successfully');
      }

      onClose();
    } catch (error) {
      toast.error('Failed to save income');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryId) => {
    const category = INCOME_CATEGORIES.find((c) => c.id === categoryId);
    return category?.icon || '💰';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Amount */}
      <div>
        <label className="label">
          Amount <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <DollarSign
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className={`input-field pl-10 ${errors.amount ? 'border-red-500' : ''}`}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>
        {errors.amount && (
          <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="label">
          Category <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl">
            {getCategoryIcon(formData.category)}
          </span>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`input-field pl-12 ${errors.category ? 'border-red-500' : ''}`}
          >
            {INCOME_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>
        {errors.category && (
          <p className="mt-1 text-sm text-red-500">{errors.category}</p>
        )}
      </div>

      {/* Source */}
      <div>
        <label className="label">
          Source <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Tag
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className={`input-field pl-10 ${errors.source ? 'border-red-500' : ''}`}
            placeholder="e.g., Company Name, Client Name"
          />
        </div>
        {errors.source && (
          <p className="mt-1 text-sm text-red-500">{errors.source}</p>
        )}
      </div>

      {/* Date */}
      <div>
        <label className="label">
          Date <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Calendar
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`
              w-full
              min-w-0
              pl-10
              pr-3
              h-12
              border
              rounded-lg
              ${errors.date ? 'border-red-500' : 'border-gray-300'}
            `}
            // className={`input-field pl-10 ${errors.date ? 'border-red-500' : ''}`}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        {errors.date && (
          <p className="mt-1 text-sm text-red-500">{errors.date}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="label">Description (Optional)</label>
        <div className="relative">
          <FileText
            className="absolute left-3 top-3 text-gray-400"
            size={20}
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field pl-10"
            rows="3"
            placeholder="Add any additional notes..."
          />
        </div>
      </div>

      {/* Recurring Income */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="isRecurring"
            checked={formData.isRecurring}
            onChange={handleChange}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <div className="flex items-center gap-2">
            <RefreshCw size={18} className="text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              This is a recurring income
            </span>
          </div>
        </label>

        {formData.isRecurring && (
          <div className="mt-3 ml-7">
            <label className="label text-sm">Frequency</label>
            <select
              name="recurringFrequency"
              value={formData.recurringFrequency}
              onChange={handleChange}
              className="input-field text-sm"
            >
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-success"
          disabled={loading}
        >
          {loading ? 'Saving...' : isEditing ? 'Update Income' : 'Add Income'}
        </button>
      </div>
    </form>
  );
};

export default IncomeForm;
