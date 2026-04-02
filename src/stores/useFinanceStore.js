import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockTransactions } from '../data/mockData.js'
import { subMonths } from 'date-fns'

const calculateBalance = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  return income - expenses
}

const getFilteredTransactions = (transactions, filters, search) => {
  let filtered = transactions.filter(t => {
    if (filters.category && t.category !== filters.category) return false
    if (filters.type && t.type !== filters.type) return false
    if (filters.dateFrom && t.date < filters.dateFrom) return false
    if (filters.dateTo && t.date > filters.dateTo) return false
    if (search && !t.description.toLowerCase().includes(search.toLowerCase()) && !t.category.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })
  return filtered
}

export const useFinanceStore = create(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      role: 'viewer',
      theme: 'light',
      filters: { category: '', type: '', dateFrom: '', dateTo: '' },
      search: '',
      
      setRole: (role) => set({ role }),
      setTheme: (theme) => set({ theme }),
      
      addTransaction: (transaction) => set((state) => ({
        transactions: [{
          ...transaction,
          id: Math.max(...state.transactions.map(t => t.id), 0) + 1,
          date: transaction.date || new Date().toISOString().split('T')[0],
          status: 'completed'
        }, ...state.transactions]
      })),
      
      editTransaction: (id, updates) => set((state) => ({
        transactions: state.transactions.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),
      
      setFilters: (filters) => set({ filters }),
      setSearch: (search) => set({ search }),
      
      setTransactions: (transactions) => set({ transactions }),

      loadTransactions: async () => {
        const { fetchMockTransactions } = await import('../services/mockApi.js')
        const data = await fetchMockTransactions()
        set({ transactions: data })
      },
      
      getBalance: () => {
        const state = get()
        return calculateBalance(state.transactions)
      },
      
      getIncome: () => {
        const state = get()
        return state.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
      },
      
      getExpenses: () => {
        const state = get()
        return state.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
      },
      
      getFilteredTransactions: () => {
        const state = get()
        return getFilteredTransactions(state.transactions, state.filters, state.search)
      },
      
      getTransactionCount: () => {
        const state = get()
        return state.transactions.length
      },
      
      getSpendingByCategory: () => {
        const state = get()
        const expenses = state.transactions.filter(t => t.type === 'expense')
        const categorySums = {}
        expenses.forEach(t => {
          categorySums[t.category] = (categorySums[t.category] || 0) + t.amount
        })
        return Object.entries(categorySums).map(([name, value]) => ({ name, value }))
      },

      getTopSpendingCategory: () => {
        const state = get()
        const expenses = state.transactions.filter(t => t.type === 'expense')
        if (!expenses.length) return { category: 'None', value: 0 }

        const categorySums = {}
        expenses.forEach(t => {
          categorySums[t.category] = (categorySums[t.category] || 0) + t.amount
        })

        const [category, value] = Object.entries(categorySums).reduce((best, current) => (current[1] > best[1] ? current : best), ['', 0])
        return { category, value }
      },

      getMonthlyComparison: () => {
        const state = get()
        const now = new Date()

        const getMonthRange = (date) => ({
          start: new Date(date.getFullYear(), date.getMonth(), 1),
          end: new Date(date.getFullYear(), date.getMonth() + 1, 0)
        })

        const currentRange = getMonthRange(now)
        const previousRange = getMonthRange(new Date(now.getFullYear(), now.getMonth() - 1, 1))

        const monthAmount = (range) => state.transactions
          .filter(t => t.type === 'expense')
          .filter(t => {
            const d = new Date(t.date)
            return d >= range.start && d <= range.end
          })
          .reduce((sum, t) => sum + t.amount, 0)

        const current = monthAmount(currentRange)
        const previous = monthAmount(previousRange)

        const change = previous === 0 ? 0 : ((current - previous) / previous) * 100
        const rate = previous === 0 ? (current === 0 ? 0 : 100) : change

        return {
          current: current,
          previous: previous,
          text: `${rate >= 0 ? '+' : ''}${rate.toFixed(1)}%`,
          isHigher: rate > 0
        }
      },

      getDataObservation: () => {
        const state = get()
        const count = state.transactions.length
        const expenseCount = state.transactions.filter(t => t.type === 'expense').length
        const incomeCount = state.transactions.filter(t => t.type === 'income').length

        if (expenseCount > incomeCount) {
          return 'More expenses than income transactions. Consider reviewing expense habits.'
        }
        if (incomeCount > expenseCount * 1.5) {
          return 'Strong inflow. Great job keeping income high.'
        }
        return 'Expenses and income are in balance. Keep tracking to optimize savings.'
      },

      getBalanceTrend: () => {
        const state = get()
        const months = [];
        const data = [];
        
        for (let i = 2; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const monthName = date.toLocaleString('default', { month: 'short' });
          months.push(monthName);
          
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          
          const monthTransactions = state.transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate >= monthStart && tDate <= monthEnd;
          });
          
          const balance = calculateBalance(monthTransactions);
          data.push(balance);
        }
        
        return { months, data };
      },
      
      getTopCompletedTransactions: () => {
        const state = get()
        return state.transactions
          .filter(t => t.status === 'completed')
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
      }
    }),
    {
      name: 'finance-storage'
    }
  )
)

