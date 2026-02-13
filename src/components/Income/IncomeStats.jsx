import React from 'react';
import { TrendingUp, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency } from '../../utils/helpers';

const IncomeStats = ({ totalIncome, filteredIncome, incomeCount, filteredCount }) => {
  const { currency } = useSettingsStore();

  const stats = [
    {
      label: 'Total Income',
      value: formatCurrency(totalIncome, currency),
      icon: DollarSign,
      color: 'bg-income-light dark:bg-income-dark/20',
      iconColor: 'text-income',
    },
    {
      label: 'Filtered Total',
      value: formatCurrency(filteredIncome, currency),
      icon: TrendingUp,
      color: 'bg-primary-50 dark:bg-primary-900/20',
      iconColor: 'text-primary-600',
    },
    {
      label: 'Total Records',
      value: incomeCount,
      icon: BarChart3,
      color: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Showing',
      value: filteredCount,
      icon: Calendar,
      color: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                <Icon className={stat.iconColor} size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IncomeStats;
