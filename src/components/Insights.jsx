import { motion } from 'framer-motion'
import { useFinanceStore } from '../stores/useFinanceStore'
import { TrendingUp, TrendingDown, Zap } from 'lucide-react'
import StatCard from './StatCard'

const Insights = () => {
  const getBalance = useFinanceStore((state) => state.getBalance)
  const getIncome = useFinanceStore((state) => state.getIncome)
  const getExpenses = useFinanceStore((state) => state.getExpenses)
  const getTransactionCount = useFinanceStore((state) => state.getTransactionCount)
  const getTopSpendingCategory = useFinanceStore((state) => state.getTopSpendingCategory)
  const getMonthlyComparison = useFinanceStore((state) => state.getMonthlyComparison)
  const getDataObservation = useFinanceStore((state) => state.getDataObservation)
  
  const balance = getBalance()
  const income = getIncome()
  const expenses = getExpenses()
  const count = getTransactionCount()
  const topCategory = getTopSpendingCategory()
  const monthlyComparison = getMonthlyComparison()
  const observation = getDataObservation()

  return (
    <div className="space-y-6">
      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Total Balance"
          value={balance}
          gradient="bg-gradient-to-br from-green-600 to-emerald-600"
          delay={0}
        />
        <StatCard
          icon={TrendingUp}
          label="Total Income"
          value={income}
          gradient="bg-gradient-to-br from-blue-600 to-cyan-600"
          delay={0.1}
        />
        <StatCard
          icon={TrendingDown}
          label="Total Expenses"
          value={expenses}
          gradient="bg-gradient-to-br from-red-600 to-pink-600"
          delay={0.2}
        />
        <StatCard
          icon={Zap}
          label="Transactions"
          value={count}
          gradient="bg-gradient-to-br from-purple-600 to-indigo-600"
          delay={0.3}
        />
      </div>

      {/* Summary Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-6 border border-gray-700 dark:border-gray-700 shadow-lg"
      >
        <h3 className="text-lg font-bold text-white dark:text-white mb-4">Quick Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <InsightItem
            label="Avg per Transaction"
            value={`₹${Math.round(balance / Math.max(count, 1)).toLocaleString('en-IN')}`}
            icon="📊"
          />
          <InsightItem
            label="Income vs Expense"
            value={`${((income / Math.max(expenses, 1)) * 100).toFixed(0)}%`}
            icon="⚖️"
          />
          <InsightItem
            label="Savings Rate"
            value={`${((balance / Math.max(income, 1)) * 100).toFixed(0)}%`}
            icon="💰"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-gray-800 dark:bg-gray-700 rounded-2xl p-6 border border-gray-700 dark:border-gray-600 shadow-lg"
      >
        <h3 className="text-lg font-bold text-white dark:text-white mb-3">Data Insights</h3>
        <ul className="space-y-3 text-sm text-gray-200">
          <li>
            <span className="font-semibold">Highest spending category:</span> {topCategory.category || 'None'} ({`₹${topCategory.value.toLocaleString('en-IN')}`})
          </li>
          <li>
            <span className="font-semibold">Monthly comparison:</span> {monthlyComparison.text} (Current: ₹{monthlyComparison.current.toLocaleString('en-IN')}, Previous: ₹{monthlyComparison.previous.toLocaleString('en-IN')})
          </li>
          <li>
            <span className="font-semibold">Observation:</span> {observation}
          </li>
        </ul>
      </motion.div>
    </div>
  )
}

const InsightItem = ({ label, value, icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gray-800 dark:bg-gray-700 rounded-lg p-4 border border-gray-700 dark:border-gray-600"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-bold text-white dark:text-white">{value}</p>
    </motion.div>
  )
}

export default Insights

