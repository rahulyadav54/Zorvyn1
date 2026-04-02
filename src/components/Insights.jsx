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
    <div className="space-y-4 sm:space-y-6">
      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={TrendingUp}
          label="Balance"
          value={balance}
          gradient="bg-gradient-to-br from-green-500 to-emerald-600"
          delay={0}
        />
        <StatCard
          icon={TrendingUp}
          label="Income"
          value={income}
          gradient="bg-gradient-to-br from-blue-500 to-cyan-600"
          delay={0.1}
        />
        <StatCard
          icon={TrendingDown}
          label="Expenses"
          value={expenses}
          gradient="bg-gradient-to-br from-red-500 to-pink-600"
          delay={0.2}
        />
        <StatCard
          icon={Zap}
          label="Transactions"
          value={count}
          gradient="bg-gradient-to-br from-purple-500 to-indigo-600"
          delay={0.3}
        />
      </div>

      {/* Quick Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Summary</h3>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <InsightItem
            label="Avg/Trans"
            value={`₹${Math.round(balance / Math.max(count, 1)).toLocaleString('en-IN')}`}
          />
          <InsightItem
            label="Income/Expense"
            value={`${((income / Math.max(expenses, 1)) * 100).toFixed(0)}%`}
          />
          <InsightItem
            label="Savings"
            value={`${((balance / Math.max(income, 1)) * 100).toFixed(0)}%`}
          />
        </div>
      </motion.div>

      {/* Data Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Data Insights</h3>
        <ul className="space-y-2 sm:space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <li>
            <span className="font-semibold">Top category:</span> {topCategory.category || 'None'} (₹{topCategory.value?.toLocaleString('en-IN') || 0})
          </li>
          <li>
            <span className="font-semibold">Monthly:</span> {monthlyComparison.text} (₹{monthlyComparison.current?.toLocaleString('en-IN') || 0} vs ₹{monthlyComparison.previous?.toLocaleString('en-IN') || 0})
          </li>
          <li>
            <span className="font-semibold">Note:</span> {observation}
          </li>
        </ul>
      </motion.div>
    </div>
  )
}

const InsightItem = ({ label, value }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-600"
    >
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{value}</p>
    </motion.div>
  )
}

export default Insights