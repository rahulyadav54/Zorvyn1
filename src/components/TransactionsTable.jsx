import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFinanceStore } from '../stores/useFinanceStore'
import { Trash2, Plus, TrendingUp, TrendingDown, Filter, Download } from 'lucide-react'
import AddTransactionModal from './AddTransactionModal'

const TransactionsTable = () => {
  const role = useFinanceStore((state) => state.role)
  const transactions = useFinanceStore((state) => state.transactions)
  const getFilteredTransactions = useFinanceStore((state) => state.getFilteredTransactions)
  const filters = useFinanceStore((state) => state.filters)
  const search = useFinanceStore((state) => state.search)
  const setFilters = useFinanceStore((state) => state.setFilters)
  const setSearch = useFinanceStore((state) => state.setSearch)
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction)

  const [sortBy, setSortBy] = useState('date')
  const [sortDesc, setSortDesc] = useState(true)
  const [groupBy, setGroupBy] = useState('none')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filteredTransactions = getFilteredTransactions()
  const categories = [...new Set(transactions.map(t => t.category))]

  const exportCsv = () => {
    const rows = filteredTransactions
      .map(t => [t.date, t.category, t.type, t.amount, t.description, t.status])
    const header = ['Date', 'Category', 'Type', 'Amount', 'Description', 'Status']
    const csv = [header, ...rows].map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'transactions.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aVal = a[sortBy]
    let bVal = b[sortBy]
    if (sortBy === 'amount') {
      aVal = parseFloat(aVal)
      bVal = parseFloat(bVal)
    } else if (sortBy === 'date') {
      aVal = new Date(aVal)
      bVal = new Date(bVal)
    }
    if (sortDesc) return aVal > bVal ? -1 : 1
    return aVal < bVal ? -1 : 1
  })

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDesc(!sortDesc)
    } else {
      setSortBy(field)
      setSortDesc(true)
    }
  }

  const handleDelete = (id) => {
    if (confirm('Delete transaction?')) {
      deleteTransaction(id)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Transactions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </p>
          </div>
          {role === 'admin' ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-smooth font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </motion.button>
          ) : null}
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters - Show on desktop or when toggled on mobile */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4 sm:mb-6 ${showFilters ? '' : 'hidden md:grid'}`}>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={role !== 'admin'}
          >
            <option value="none">Group by</option>
            <option value="category">Category</option>
            <option value="type">Type</option>
          </select>
          {role === 'admin' && (
            <div className="flex gap-2 col-span-1 sm:col-span-2 lg:col-span-1">
              <button
                onClick={exportCsv}
                className="flex items-center justify-center space-x-1 px-3 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-200"
              >
                <Download className="w-3 h-3" />
                <span>CSV</span>
              </button>
            </div>
          )}
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 dark:text-gray-400">No transactions match your filters</p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {sortedTransactions.map((transaction, index) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                onDelete={handleDelete}
                canDelete={role === 'admin'}
                index={index}
              />
            ))}
          </div>
        )}
      </motion.div>

      <AddTransactionModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  )
}

const TransactionRow = ({ transaction, onDelete, canDelete, index }) => {
  const isIncome = transaction.type === 'income'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-smooth group"
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className={`p-2 rounded-lg ${isIncome ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
          {isIncome ? (
            <TrendingUp className={`w-4 h-4 sm:w-5 sm:h-5 ${isIncome ? 'text-green-600' : 'text-red-600'} dark:text-green-500 dark:text-red-500`} />
          ) : (
            <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-1 sm:gap-2">
            <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{transaction.description}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
              transaction.category === 'Salary' || transaction.category === 'Freelance' || transaction.category === 'Bonus' || transaction.category === 'Investment Returns'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
            }`}>
              {transaction.category}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <span className={`text-sm sm:text-lg font-bold ${isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
        </span>

        {canDelete && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(transaction.id)}
            className="p-1.5 sm:p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default TransactionsTable