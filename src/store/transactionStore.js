import { create } from 'zustand';

export const useTransactionStore = create((set, get) => ({
  transactions: [],
  incomes: [],
  expenses: [],
  
  // Add transaction
  addTransaction: (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    set((state) => ({
      transactions: [newTransaction, ...state.transactions],
      incomes: transaction.type === 'income' 
        ? [newTransaction, ...state.incomes] 
        : state.incomes,
      expenses: transaction.type === 'expense' 
        ? [newTransaction, ...state.expenses] 
        : state.expenses,
    }));
  },

  // Update transaction
  updateTransaction: (id, updatedData) => {
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updatedData, updatedAt: new Date().toISOString() } : t
      ),
      incomes: state.incomes.map((t) =>
        t.id === id ? { ...t, ...updatedData, updatedAt: new Date().toISOString() } : t
      ),
      expenses: state.expenses.map((t) =>
        t.id === id ? { ...t, ...updatedData, updatedAt: new Date().toISOString() } : t
      ),
    }));
  },

  // Delete transaction
  deleteTransaction: (id) => {
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
      incomes: state.incomes.filter((t) => t.id !== id),
      expenses: state.expenses.filter((t) => t.id !== id),
    }));
  },

  // Get total income
  getTotalIncome: () => {
    const { incomes } = get();
    return incomes.reduce((sum, income) => sum + income.amount, 0);
  },

  // Get total expense
  getTotalExpense: () => {
    const { expenses } = get();
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  },

  // Get balance
  getBalance: () => {
    const { getTotalIncome, getTotalExpense } = get();
    return getTotalIncome() - getTotalExpense();
  },

  // Filter transactions by date range
  filterByDateRange: (startDate, endDate) => {
    const { transactions } = get();
    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      return tDate >= new Date(startDate) && tDate <= new Date(endDate);
    });
  },

  // Filter by category
  filterByCategory: (category) => {
    const { transactions } = get();
    return transactions.filter((t) => t.category === category);
  },

  // Set transactions (for loading from API)
  setTransactions: (transactions) => {
    set({
      transactions,
      incomes: transactions.filter((t) => t.type === 'income'),
      expenses: transactions.filter((t) => t.type === 'expense'),
    });
  },
}));
