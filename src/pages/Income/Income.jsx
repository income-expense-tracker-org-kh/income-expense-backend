import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, X, Calendar, DollarSign, FileText } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { INCOME_CATEGORIES } from '../../constants';
import toast from 'react-hot-toast';
import { incomeService } from '../../services/incomeService';
import useTranslation from '../../hooks/useTranslation';
import ConfirmModal from '../../components/Common/ConfirmModal';
import { useConfirm } from '../../hooks/useConfirm';
// import { useConfirm } from '../../hooks/useConfirm';

//======= Skeleton primitives =======

const Skeleton = ({ className = '' }) => (
  <div
    className={`rounded bg-gray-200 dark:bg-gray-700 ${className}`}
    style={{
      background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
      backgroundSize: '400% 100%',
      animation: 'income-shimmer 1.6s ease-in-out infinite',
    }}
  />
);

const SummaryCardSkeleton = () => (
  <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
    <div className="flex items-center justify-between">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
    </div>
  </div>
);

const FilterBarSkeleton = () => (
  <div className="card">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  </div>
);

const TableRowSkeleton = () => (
  <tr className="border-b border-gray-100 dark:border-gray-800">
    <td className="py-3 px-4"><Skeleton className="h-4 w-24" /></td>
    <td className="py-3 px-4"><Skeleton className="h-6 w-28 rounded-full" /></td>
    <td className="py-3 px-4"><Skeleton className="h-4 w-36" /></td>
    <td className="py-3 px-4 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
    <td className="py-3 px-4">
      <div className="flex items-center justify-center gap-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </td>
  </tr>
);

const IncomeSkeleton = () => (
  <>
    <style>{`
      @keyframes income-shimmer {
        0%   { background-position: 100% 0 }
        100% { background-position: -100% 0 }
      }
    `}</style>

    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <SummaryCardSkeleton />
      <FilterBarSkeleton />
      <div className="card">
        <Skeleton className="h-5 w-36 mb-4" />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {['Date', 'Category', 'Description', 'Amount', 'Actions'].map((col) => (
                  <th
                    key={col}
                    className={`py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 ${col === 'Amount' ? 'text-right' : col === 'Actions' ? 'text-center' : 'text-left'
                      }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </>
);

// ======= Main Income component =======

const Income = () => {
  const { currency, dateFormat, language } = useSettingsStore();
  const { t } = useTranslation(language);
  const { confirm, confirmProps } = useConfirm(); // ← useConfirm hook
  const [showModal, setShowModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const res = await incomeService.getAll();
      setIncomes(res?.data);
    } catch {
      toast.error('Failed to load incomes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleEdit = (income) => {
    setEditingIncome(income);
    setFormData({
      amount: income.amount,
      source: income.category,
      category: income.category,
      description: income.description || '',
      date: income.date.split('T')[0],
      isRecurring: income.isRecurring || false,
      recurringPeriod: income.recurringPeriod || 'monthly',
      recurringPattern: income.isRecurring
        ? { frequency: income.recurringPeriod, startDate: income.date }
        : null,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.category || !formData.date) {
      toast.error(t('notifications.error.fillRequired'));
      return;
    }

    const incomeData = {
      amount: parseFloat(formData.amount),
      source: formData.category,
      category: formData.category,
      description: formData.description,
      date: formData.date,
      isRecurring: formData.isRecurring,
      recurringPeriod: formData.recurringPeriod,
      recurringPattern: formData.isRecurring
        ? { frequency: formData.recurringPeriod, startDate: formData.date }
        : null,
    };

    try {
      if (editingIncome) {
        await incomeService.update(editingIncome._id, incomeData);
        toast.success(t('notifications.success.incomeUpdated'));
      } else {
        await incomeService.create(incomeData);
        toast.success(t('notifications.success.incomeAdded'));
      }
      fetchIncomes();
      setShowModal(false);
      resetForm();
    } catch {
      toast.error('Save failed');
    }
  };

  // ← Replaced window.confirm with ConfirmModal
  const handleDelete = async (id) => {
    const ok = await confirm({
      title: t('notifications.confirm.deleteIncome'),
      message: t('notifications.confirm.deleteIncomeWarning'),
      confirmText: t('common.delete') || 'Delete',
      cancelText: t('common.cancel') || 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await incomeService.delete(id);
      toast.success(t('notifications.success.incomeDeleted'));
      fetchIncomes();
    } catch {
      toast.error('Delete failed');
    }
  };

  const filteredIncomes = incomes?.filter((income) => {
    const matchesSearch =
      income.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      income.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || income.category === filterCategory;
    return matchesSearch && matchesCategory;
  }) ?? [];

  const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);

  const getCategoryIcon = (categoryId) => {
    const category = INCOME_CATEGORIES.find((cat) => cat.id === categoryId);
    return category?.icon || '💰';
  };

  if (loading) return <IncomeSkeleton />;

  return (
    <>
      <style>{`
        @keyframes income-shimmer {
          0%   { background-position: 100% 0 }
          100% { background-position: -100% 0 }
        }
      `}</style>

      <div className="space-y-6">
        {/* ====== Header ====== */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t('income.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{t('income.subtitle')}</p>
          </div>
          <button onClick={handleAdd} className="btn-success flex items-center gap-2">
            <Plus size={20} />
            {t('income.addIncome')}
          </button>
        </div>

        {/* ====== Summary card ====== */}
        <div className="card bg-gradient-to-br from-income-light to-income dark:from-income-dark dark:to-income">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-800 dark:text-green-200 mb-1">{t('income.totalIncome')}</p>
              <h3 className="text-3xl font-bold text-green-900 dark:text-white">
                {formatCurrency(totalIncome, currency)}
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                {filteredIncomes.length} {t('income.transactions')}
              </p>
            </div>
            <div className="w-16 h-16 bg-white dark:bg-green-800 rounded-full flex items-center justify-center">
              <DollarSign className="text-income" size={32} />
            </div>
          </div>
        </div>

        {/* ====== Filters ====== */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t('common.search')}
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
                <option value="all">{t('transactions.allCategories')}</option>
                {INCOME_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {t(`income.categories.${cat.id}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ====== Table ====== */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">{t('income.incomeRecords')}</h3>

          {filteredIncomes.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 dark:text-gray-400">{t('income.noRecords')}</p>
              <button onClick={handleAdd} className="btn-primary mt-4">
                {t('income.addFirst')}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">{t('income.date')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">{t('income.category')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">{t('income.description')}</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">{t('income.amount')}</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">{t('income.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIncomes.map((income) => (
                    <tr
                      key={income._id}
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
                          {t(`income.categories.${income.category}`)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        {income.description || '-'}
                        {income.isRecurring && (
                          <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                            {t('income.recurring')}
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
                            onClick={() => handleDelete(income._id)}
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

        {/* ====== Add / Edit Modal ====== */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {editingIncome ? t('income.editIncome') : t('income.addIncome')}
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
                  <label className="label">{t('income.amount')} *</label>
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
                  <label className="label">{t('income.category')} *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">{t('income.category')}</option>
                    {INCOME_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {t(`income.categories.${cat.id}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">{t('income.date')} *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
                      `}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label">{t('income.description')}</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="input-field pl-10"
                      rows="3"
                      placeholder={t('income.addNote')}
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
                    {t('income.recurring')}
                  </label>
                </div>

                {formData.isRecurring && (
                  <div>
                    <label className="label">{t('income.recurringPeriod')}</label>
                    <select
                      name="recurringPeriod"
                      value={formData.recurringPeriod}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="weekly">{t('income.weekly')}</option>
                      <option value="monthly">{t('income.monthly')}</option>
                      <option value="quarterly">{t('income.quarterly')}</option>
                      <option value="yearly">{t('income.yearly')}</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    {t('common.cancel')}
                  </button>
                  <button type="submit" className="flex-1 btn-success">
                    {editingIncome ? t('common.edit') : t('common.add')}{t('settings.income')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ====== Global Confirm Modal ====== */}
      <ConfirmModal {...confirmProps} />
    </>
  );
};

export default Income;