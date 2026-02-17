import React, { useEffect, useState } from 'react';
import {
  Plus, Edit2, Trash2, X, Wallet,
  AlertTriangle, CheckCircle, TrendingUp, Calendar, ChevronDown, ChevronUp
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency } from '../../utils/helpers';
import { EXPENSE_CATEGORIES, BUDGET_PERIODS } from '../../constants';
import toast from 'react-hot-toast';
import { budgetService } from '../../services/budgetService';

// ─── Skeleton CSS (dark-mode-aware via CSS variables) ─────────────────────────
const SKELETON_STYLES = `
  @keyframes bsk-shimmer {
    0%   { background-position: 200% 0 }
    100% { background-position: -200% 0 }
  }
  :root {
    --bsk-from: #e2e8f0; --bsk-via: #f1f5f9;
    --bsk-card: #ffffff;  --bsk-border: #f1f5f9;
    --bsk-page: #f8fafc;  --bsk-bar: #e2e8f0;
  }
  .dark {
    --bsk-from: #1e293b; --bsk-via: #263045;
    --bsk-card: #0f172a; --bsk-border: #1e293b;
    --bsk-page: #0f172a; --bsk-bar: #1e293b;
  }
  .bsk {
    border-radius: .375rem; flex-shrink: 0;
    background: linear-gradient(90deg, var(--bsk-from) 25%, var(--bsk-via) 50%, var(--bsk-from) 75%);
    background-size: 400% 100%;
    animation: bsk-shimmer 1.8s ease-in-out infinite;
  }
  .bsk-card {
    background: var(--bsk-card); border: 1px solid var(--bsk-border);
    border-radius: 1rem; padding: 1.5rem;
    box-shadow: 0 1px 3px 0 rgb(0 0 0/.07);
  }
`;

const Sk = ({ w, h, r, style = {} }) => (
  <div className="bsk" style={{ width: w || '100%', height: h || '1rem', borderRadius: r || '.375rem', ...style }} />
);

const SkSummary = () => (
  <div className="bsk-card" style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
    <Sk w="6rem" h=".8rem" /><Sk w="9rem" h="1.75rem" /><Sk w="5rem" h=".7rem" />
  </div>
);

const SkBudgetCard = () => (
  <div className="bsk-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
        <Sk w="8rem" h="1.1rem" /><Sk w="5rem" h=".75rem" />
      </div>
      <div style={{ display: 'flex', gap: '.5rem' }}>
        <Sk w="2rem" h="2rem" r=".5rem" /><Sk w="2rem" h="2rem" r=".5rem" />
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Sk w="6rem" h=".8rem" /><Sk w="6rem" h=".8rem" />
    </div>
    <div style={{ width: '100%', height: '.75rem', borderRadius: '9999px', background: 'var(--bsk-bar)', overflow: 'hidden' }}>
      <Sk w="55%" h="100%" r="9999px" style={{ animation: 'none', background: 'var(--bsk-from)' }} />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Sk w="7rem" h=".8rem" /><Sk w="3rem" h=".8rem" />
    </div>
    {[...Array(2)].map((_, i) => (
      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '.5rem', borderTop: '1px solid var(--bsk-border)' }}>
        <Sk w="5rem" h=".75rem" />
        <Sk w="8rem" h=".5rem" r="9999px" style={{ margin: '0 .5rem' }} />
        <Sk w="3rem" h=".75rem" />
      </div>
    ))}
  </div>
);

const BudgetSkeleton = () => (
  <div style={{ background: 'var(--bsk-page)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
        <Sk w="12rem" h="1.6rem" /><Sk w="18rem" h=".9rem" />
      </div>
      <Sk w="9rem" h="2.5rem" r=".5rem" />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
      <SkSummary /><SkSummary /><SkSummary />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SkBudgetCard /><SkBudgetCard />
    </div>
  </div>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getCategoryIcon = (id) => EXPENSE_CATEGORIES.find((c) => c.id === id)?.icon || '💰';
const getCategoryName = (id) => EXPENSE_CATEGORIES.find((c) => c.id === id)?.name || id;
const calcPct = (spent, total) => (total > 0 ? Math.min((spent / total) * 100, 100) : 0);
const barColor = (pct) => pct >= 100 ? '#ef4444' : pct >= 95 ? '#f97316' : pct >= 80 ? '#eab308' : '#22c55e';
const StatusIcon = ({ pct }) => {
  if (pct >= 100) return <AlertTriangle className="text-red-500" size={18} />;
  if (pct >= 80) return <TrendingUp className="text-yellow-500" size={18} />;
  return <CheckCircle className="text-green-500" size={18} />;
};

const emptyCategory = () => ({ category: '', amount: '', alertThreshold: 80 });

// ─── Main Component ───────────────────────────────────────────────────────────
const Budget = () => {
  const { currency } = useSettingsStore();

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const defaultForm = {
    name: '', period: 'monthly',
    startDate: new Date().toISOString().split('T')[0], endDate: '',
    totalAmount: '', categories: [emptyCategory()],
    alertsEnabled: true, alertWarning: 80, alertCritical: 95, notes: '',
  };
  const [formData, setFormData] = useState(defaultForm);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await budgetService.getAll();
      // API returns { success, count, data: [...] }
      setBudgets(res?.data?.data ?? res?.data ?? []);
    } catch {
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchBudgets(); }, []);

  // ── Form helpers ───────────────────────────────────────────────────────────
  const resetForm = () => { setFormData(defaultForm); setEditingBudget(null); };
  const handleAdd = () => { resetForm(); setShowModal(true); };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      name: budget.name || '',
      period: budget.period || 'monthly',
      startDate: (budget.startDate || '').split('T')[0],
      endDate: (budget.endDate || '').split('T')[0],
      totalAmount: budget.totalAmount ?? '',
      categories: budget.categories?.length
        ? budget.categories.map((c) => ({ category: c.category, amount: c.amount, alertThreshold: c.alertThreshold ?? 80 }))
        : [emptyCategory()],
      alertsEnabled: budget.alerts?.enabled ?? true,
      alertWarning: budget.alerts?.thresholds?.warning ?? 80,
      alertCritical: budget.alerts?.thresholds?.critical ?? 95,
      notes: budget.notes || '',
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCatChange = (i, e) => {
    const { name, value } = e.target;
    setFormData((p) => {
      const cats = [...p.categories];
      cats[i] = { ...cats[i], [name]: value };
      return { ...p, categories: cats };
    });
  };

  const addCategoryRow = () => setFormData((p) => ({ ...p, categories: [...p.categories, emptyCategory()] }));
  const removeCategoryRow = (i) => setFormData((p) => ({ ...p, categories: p.categories.filter((_, idx) => idx !== i) }));

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.totalAmount || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields'); return;
    }
    if (formData.categories.some((c) => !c.category || !c.amount)) {
      toast.error('Each category needs a name and amount'); return;
    }

    const payload = {
      name: formData.name,
      period: formData.period,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalAmount: parseFloat(formData.totalAmount),
      categories: formData.categories.map((c) => ({
        category: c.category,
        amount: parseFloat(c.amount),
        alertThreshold: parseInt(c.alertThreshold) || 80,
      })),
      alerts: {
        enabled: formData.alertsEnabled,
        thresholds: { warning: parseInt(formData.alertWarning) || 80, critical: parseInt(formData.alertCritical) || 95 },
      },
      notes: formData.notes,
    };

    try {
      if (editingBudget) {
        await budgetService.update(editingBudget._id, payload);
        toast.success('Budget updated successfully');
      } else {
        await budgetService.create(payload);
        toast.success('Budget created successfully');
      }
      await fetchBudgets();
      setShowModal(false);
      resetForm();
    } catch (error) {
      // Axios error with backend response
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => {
          toast.error(err.msg);
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Save failed');
      }
    }

  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    try {
      await budgetService.delete(id);
      toast.success('Budget deleted successfully');
      await fetchBudgets();
    } catch {
      toast.error('Delete failed');
    }
  };

  // ── Aggregates ─────────────────────────────────────────────────────────────
  const totalBudget = budgets.reduce((s, b) => s + (b.totalAmount ?? 0), 0);
  const totalSpent = budgets.reduce((s, b) => s + (b.categories?.reduce((cs, c) => cs + (c.spent ?? 0), 0) ?? 0), 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPct = calcPct(totalSpent, totalBudget);

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) return (
    <>
      <style>{SKELETON_STYLES}</style>
      <BudgetSkeleton />
    </>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{SKELETON_STYLES}</style>

      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Budget Planning</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Set and track your spending limits</p>
          </div>
          <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
            <Plus size={20} /> Create Budget
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">Total Budget</p>
            <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">{formatCurrency(totalBudget, currency)}</h3>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">{budgets.length} budget{budgets.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="card bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
            <p className="text-sm text-red-800 dark:text-red-200 mb-1">Total Spent</p>
            <h3 className="text-2xl font-bold text-red-900 dark:text-red-100">{formatCurrency(totalSpent, currency)}</h3>
            <p className="text-xs text-red-700 dark:text-red-300 mt-1">{overallPct.toFixed(1)}% of budget used</p>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <p className="text-sm text-green-800 dark:text-green-200 mb-1">Remaining</p>
            <h3 className={`text-2xl font-bold ${totalRemaining < 0 ? 'text-red-900 dark:text-red-100' : 'text-green-900 dark:text-green-100'}`}>
              {formatCurrency(Math.abs(totalRemaining), currency)}
              {totalRemaining < 0 && <span className="text-sm font-normal ml-1">over</span>}
            </h3>
          </div>
        </div>

        {/* Budget list */}
        <div className="space-y-4">
          {budgets.length === 0 ? (
            <div className="card text-center py-12">
              <Wallet className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No budgets created yet</p>
              <button onClick={handleAdd} className="btn-primary">Create Your First Budget</button>
            </div>
          ) : (
            budgets.map((budget) => {
              const catSpent = budget.categories?.reduce((s, c) => s + (c.spent ?? 0), 0) ?? 0;
              const pct = calcPct(catSpent, budget.totalAmount);
              const isExpanded = expandedId === budget._id;

              return (
                <div key={budget._id} className="card hover:shadow-lg transition-shadow">

                  {/* Card header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusIcon pct={pct} />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{budget.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${budget.status === 'exceeded' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            : budget.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                          {budget.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="capitalize">{budget.period}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(budget.startDate).toLocaleDateString()} – {new Date(budget.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : budget._id)}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Toggle categories"
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      <button onClick={() => handleEdit(budget)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(budget._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Overall progress bar */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Spent: <strong>{formatCurrency(catSpent, currency)}</strong></span>
                      <span className="text-gray-600 dark:text-gray-400">Total: <strong>{formatCurrency(budget.totalAmount, currency)}</strong></span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: barColor(pct) }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{pct.toFixed(1)}% used</span>
                      {catSpent > budget.totalAmount
                        ? <span className="text-red-500 font-medium">Exceeded by {formatCurrency(catSpent - budget.totalAmount, currency)}</span>
                        : <span className="text-green-600 font-medium">{formatCurrency(budget.totalAmount - catSpent, currency)} remaining</span>
                      }
                    </div>
                  </div>

                  {/* Alert banner */}
                  {budget.alerts?.enabled && pct >= (budget.alerts?.thresholds?.warning ?? 80) && (
                    <div className={`mb-3 p-3 rounded-lg flex items-center gap-2 text-sm font-medium ${pct >= 100
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                        : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                      }`}>
                      <AlertTriangle size={15} />
                      {pct >= 100 ? 'Budget exceeded!' : `Warning: ${pct.toFixed(0)}% of budget used`}
                    </div>
                  )}

                  {/* Expandable category breakdown */}
                  {isExpanded && budget.categories?.length > 0 && (
                    <div className="mt-2 border-t border-gray-100 dark:border-gray-700 pt-3 space-y-3">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Category Breakdown</p>
                      {budget.categories.map((cat, ci) => {
                        const cp = calcPct(cat.spent ?? 0, cat.amount);
                        return (
                          <div key={ci}>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="flex items-center gap-1.5">
                                <span>{getCategoryIcon(cat.category)}</span>
                                <span className="font-medium text-gray-700 dark:text-gray-300">{getCategoryName(cat.category)}</span>
                              </span>
                              <span className="text-gray-500 dark:text-gray-400 text-xs">
                                {formatCurrency(cat.spent ?? 0, currency)} / {formatCurrency(cat.amount, currency)}
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${cp}%`, backgroundColor: barColor(cp) }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ── Modal ─────────────────────────────────────────────────────────── */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6 my-8">

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {editingBudget ? 'Edit Budget' : 'Create Budget'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name */}
                <div>
                  <label className="label">Budget Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange}
                    className="input-field" placeholder="e.g. Monthly Household" required />
                </div>

                {/* Period */}
                <div>
                  <label className="label">Period *</label>
                  <select name="period" value={formData.period} onChange={handleChange} className="input-field" required>
                    {BUDGET_PERIODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Start Date *</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="input-field" required />
                  </div>
                  <div>
                    <label className="label">End Date *</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="input-field" required />
                  </div>
                </div>

                {/* Total amount */}
                <div>
                  <label className="label">Total Budget Amount *</label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="number" name="totalAmount" value={formData.totalAmount} onChange={handleChange}
                      className="input-field pl-10" placeholder="0.00" step="0.01" min="0" required />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="label mb-0">Categories *</label>
                    <button type="button" onClick={addCategoryRow} className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1">
                      <Plus size={14} /> Add Category
                    </button>
                  </div>

                  {/* Column headers */}
                  <div className="grid grid-cols-[1fr_90px_70px_20px] gap-2 px-1 mb-1">
                    <span className="text-xs text-gray-400">Category</span>
                    <span className="text-xs text-gray-400">Amount</span>
                    <span className="text-xs text-gray-400">Alert %</span>
                    <span />
                  </div>

                  <div className="space-y-2">
                    {formData.categories.map((cat, i) => (
                      <div key={i} className="grid grid-cols-[1fr_90px_70px_20px] gap-2 items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <select name="category" value={cat.category} onChange={(e) => handleCatChange(i, e)}
                          className="input-field text-sm py-1.5" required>
                          <option value="">Select…</option>
                          {EXPENSE_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                        </select>
                        <input type="number" name="amount" value={cat.amount} onChange={(e) => handleCatChange(i, e)}
                          className="input-field text-sm py-1.5" placeholder="0.00" step="0.01" min="0" required />
                        <div className="relative">
                          <input type="number" name="alertThreshold" value={cat.alertThreshold} onChange={(e) => handleCatChange(i, e)}
                            className="input-field text-sm py-1.5 pr-5 w-full" placeholder="80" min="0" max="100" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                        </div>
                        {formData.categories.length > 1 ? (
                          <button type="button" onClick={() => removeCategoryRow(i)} className="text-red-400 hover:text-red-600">
                            <X size={16} />
                          </button>
                        ) : <span />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alerts */}
                <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Budget Alerts</label>
                    <input type="checkbox" name="alertsEnabled" checked={formData.alertsEnabled}
                      onChange={handleChange} id="alertsEnabled"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  </div>
                  {formData.alertsEnabled && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label text-xs">Warning (%)</label>
                        <input type="number" name="alertWarning" value={formData.alertWarning}
                          onChange={handleChange} className="input-field text-sm" min="1" max="100" />
                      </div>
                      <div>
                        <label className="label text-xs">Critical (%)</label>
                        <input type="number" name="alertCritical" value={formData.alertCritical}
                          onChange={handleChange} className="input-field text-sm" min="1" max="100" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="label">Notes</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange}
                    className="input-field" rows="2" placeholder="Optional notes…" />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary">{editingBudget ? 'Update' : 'Create'} Budget</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Budget;