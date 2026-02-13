import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Wallet, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTransactionStore } from '../../store/transactionStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency } from '../../utils/helpers';
import { CHART_COLORS } from '../../constants';

const Dashboard = () => {
  const { transactions, incomes, expenses, getTotalIncome, getTotalExpense, getBalance } = useTransactionStore();
  const { currency } = useSettingsStore();

  const totalIncome = getTotalIncome();
  const totalExpense = getTotalExpense();
  const balance = getBalance();

  // Sample data - Replace with actual data
  const monthlyData = [
    { month: 'Jan', income: 5000, expense: 3500 },
    { month: 'Feb', income: 5500, expense: 4000 },
    { month: 'Mar', income: 6000, expense: 4200 },
    { month: 'Apr', income: 5800, expense: 3800 },
    { month: 'May', income: 6200, expense: 4500 },
    { month: 'Jun', income: 6500, expense: 4800 },
  ];

  const categoryData = [
    { name: 'Food', value: 1200 },
    { name: 'Rent', value: 2000 },
    { name: 'Transport', value: 500 },
    { name: 'Shopping', value: 800 },
    { name: 'Bills', value: 600 },
    { name: 'Other', value: 400 },
  ];

  const recentTransactions = [
    { id: 1, type: 'expense', category: 'Food', description: 'Grocery Shopping', amount: 150, date: '2024-02-13' },
    { id: 2, type: 'income', category: 'Salary', description: 'Monthly Salary', amount: 5000, date: '2024-02-12' },
    { id: 3, type: 'expense', category: 'Transport', description: 'Fuel', amount: 80, date: '2024-02-11' },
    { id: 4, type: 'expense', category: 'Shopping', description: 'Clothing', amount: 200, date: '2024-02-10' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Income */}
        <div className="card bg-gradient-to-br from-income-light to-income dark:from-income-dark dark:to-income">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-green-800 dark:text-green-200 mb-1">Total Income</p>
              <h3 className="text-3xl font-bold text-green-900 dark:text-white">
                {formatCurrency(totalIncome || 5000, currency)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-white dark:bg-green-800 rounded-full flex items-center justify-center">
              <TrendingUp className="text-income" size={24} />
            </div>
          </div>
          <div className="flex items-center text-sm text-green-800 dark:text-green-200">
            <ArrowUpRight size={16} className="mr-1" />
            <span>+12% from last month</span>
          </div>
        </div>

        {/* Total Expense */}
        <div className="card bg-gradient-to-br from-expense-light to-expense dark:from-expense-dark dark:to-expense">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-red-800 dark:text-red-200 mb-1">Total Expense</p>
              <h3 className="text-3xl font-bold text-red-900 dark:text-white">
                {formatCurrency(totalExpense || 3500, currency)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-white dark:bg-red-800 rounded-full flex items-center justify-center">
              <TrendingDown className="text-expense" size={24} />
            </div>
          </div>
          <div className="flex items-center text-sm text-red-800 dark:text-red-200">
            <ArrowDownRight size={16} className="mr-1" />
            <span>-5% from last month</span>
          </div>
        </div>

        {/* Balance */}
        <div className="card bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-primary-800 dark:text-primary-200 mb-1">Balance</p>
              <h3 className="text-3xl font-bold text-primary-900 dark:text-white">
                {formatCurrency(balance || 1500, currency)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-white dark:bg-primary-800 rounded-full flex items-center justify-center">
              <Wallet className="text-primary-600" size={24} />
            </div>
          </div>
          <div className="flex items-center text-sm text-primary-800 dark:text-primary-200">
            <ArrowUpRight size={16} className="mr-1" />
            <span>Healthy savings</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/income" className="flex flex-col items-center p-4 bg-income-light dark:bg-income-dark/20 rounded-lg hover:shadow-md transition-shadow">
            <Plus className="text-income mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Income</span>
          </Link>
          <Link to="/expense" className="flex flex-col items-center p-4 bg-expense-light dark:bg-expense-dark/20 rounded-lg hover:shadow-md transition-shadow">
            <Plus className="text-expense mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Expense</span>
          </Link>
          <Link to="/budget" className="flex flex-col items-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:shadow-md transition-shadow">
            <Wallet className="text-primary-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Set Budget</span>
          </Link>
          <Link to="/reports" className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow">
            <TrendingUp className="text-gray-600 dark:text-gray-400 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View Reports</span>
          </Link>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expense Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Income vs Expense Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Expense" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense by Category */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Expense by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <Link to="/transactions" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'income' ? 'bg-income-light dark:bg-income-dark/20' : 'bg-expense-light dark:bg-expense-dark/20'
                }`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="text-income" size={20} />
                  ) : (
                    <TrendingDown className="text-expense" size={20} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{transaction.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-income' : 'text-expense'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
