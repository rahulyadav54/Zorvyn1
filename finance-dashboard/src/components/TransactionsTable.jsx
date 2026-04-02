import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFinanceStore } from '../stores/useFinanceStore'
import { Trash2, Plus, TrendingUp, TrendingDown } from 'lucide-react'
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

  const exportJson = () => {
    const json = JSON.stringify(filteredTransactions, null, 2)
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'transactions.json')
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
    <div className="space-y-6">
      {/* Transactions Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-6 border border-gray-700 dark:border-gray-700 shadow-lg"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white dark:text-white">Recent Transactions</h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </p>
          </div>
          {role === 'admin' ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-smooth font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add Transaction</span>
            </motion.button>
          ) : (
            <div className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm">Viewer access: add/disconnect disabled</div>
          )}
        </div>

        {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-gray-800 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2 bg-gray-800 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-4 py-2 bg-gray-800 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="px-4 py-2 bg-gray-800 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={role !== 'admin'}
          >
            <option value="none">Group by (none)</option>
            <option value="category">Category</option>
            <option value="type">Type</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={role === 'admin' ? exportCsv : undefined}
              className={`px-4 py-2 rounded-lg text-sm ${role === 'admin' ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
              disabled={role !== 'admin'}
            >Export CSV</button>
            <button
              onClick={role === 'admin' ? exportJson : undefined}
              className={`px-4 py-2 rounded-lg text-sm ${role === 'admin' ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
              disabled={role !== 'admin'}
            >Export JSON</button>
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-600 text-lg">No transactions match your filters</p>
          </div>
        ) : (
          <div className="space-y-2">
            {groupBy === 'none' ? (
              sortedTransactions.map((transaction, index) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  onDelete={handleDelete}
                  canDelete={role === 'admin'}
                  index={index}
                />
              ))
            ) : (
              Object.entries(sortedTransactions.reduce((acc, transaction) => {
                const key = groupBy === 'category' ? transaction.category : transaction.type
                if (!acc[key]) acc[key] = []
                acc[key].push(transaction)
                return acc
              }, {})).map(([group, items]) => (
                <div key={group} className="space-y-2">
                  <div className="bg-gray-800 dark:bg-gray-700 p-2 rounded-md text-sm text-gray-200">Group: {group} ({items.length})</div>
                  {items.map((transaction, index) => (
                    <TransactionRow
                      key={`${group}-${transaction.id}`}
                      transaction={transaction}
                      onDelete={handleDelete}
                      canDelete={role === 'admin'}
                      index={index}
                    />
                  ))}
                </div>
              ))
            )}
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
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ x: 5 }}
      className="flex items-center justify-between p-4 bg-gray-800 dark:bg-gray-700 rounded-lg border border-gray-700 dark:border-gray-600 hover:border-gray-600 dark:hover:border-gray-500 transition-smooth group"
    >
      <div className="flex items-center space-x-4 flex-1">
        <div className={`p-2 rounded-lg ${isIncome ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
          {isIncome ? (
            <TrendingUp className={`w-5 h-5 ${isIncome ? 'text-green-500' : 'text-red-500'}`} />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="font-medium text-white dark:text-white truncate">{transaction.description}</p>
            <span className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap ${
              transaction.category === 'Salary' || transaction.category === 'Freelance' || transaction.category === 'Bonus' || transaction.category === 'Investment Returns'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-blue-500/20 text-blue-400'
            }`}>
              {transaction.category}
            </span>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <span className={`text-lg font-bold ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
          {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
        </span>

        {canDelete && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(transaction.id)}
            className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default TransactionsTable

