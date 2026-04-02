import { motion } from 'framer-motion'
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useFinanceStore } from '../stores/useFinanceStore'

const DashboardOverview = () => {
  const getBalanceTrend = useFinanceStore((state) => state.getBalanceTrend)
  const getSpendingByCategory = useFinanceStore((state) => state.getSpendingByCategory)
  const getTopSpendingCategory = useFinanceStore((state) => state.getTopSpendingCategory)
  const getMonthlyComparison = useFinanceStore((state) => state.getMonthlyComparison)
  
  const { months, data } = getBalanceTrend()
  const spendingData = getSpendingByCategory()
  const topCategory = getTopSpendingCategory()
  const monthlyComparison = getMonthlyComparison()
  
  const trendData = months.map((month, i) => ({
    month,
    balance: data[i]
  }))
  
  const COLORS = ['#3B82F6', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#06B6D4', '#F97316']

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Balance Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Balance Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#E5E7EB' }}
              formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
            />
            <Line 
              type="monotone" 
              dataKey="balance" 
              stroke="#3B82F6" 
              dot={{ fill: '#3B82F6', r: 4 }}
              activeDot={{ r: 6 }}
              strokeWidth={2}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Spending Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Spending Breakdown</h2>
        {spendingData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={spendingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationDuration={800}
              >
                {spendingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500">
            No expense data available
          </div>
        )}
      </motion.div>

      {/* Spending Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Spending Insights</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">Top Category</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-1">{topCategory.category || 'N/A'}</p>
            <p className="text-sm text-green-600 dark:text-green-400">₹{(topCategory.value || 0).toLocaleString('en-IN')}</p>
          </div>
          <div className="lg:col-span-2 bg-gray-100 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Monthly Comparison</p>
            <div className="h-40 sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ label: 'Previous', amount: monthlyComparison.previous }, { label: 'Current', amount: monthlyComparison.current }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="label" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                  <Bar dataKey="amount" fill="#3B82F6" animationDuration={1000} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className={`mt-2 text-sm ${monthlyComparison.isHigher ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {monthlyComparison.text} vs last month
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardOverview