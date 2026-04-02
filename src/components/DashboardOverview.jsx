import { motion } from 'framer-motion'
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
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
    <div className="space-y-6">
      {/* Balance Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-6 border border-gray-700 dark:border-gray-700 shadow-lg"
      >
        <h2 className="text-xl font-bold text-white dark:text-white mb-6">Balance Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
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
              dot={{ fill: '#3B82F6', r: 5 }}
              activeDot={{ r: 7 }}
              strokeWidth={3}
              isAnimationActive={true}
              animationDuration={1000}
              fillOpacity={1}
              fill="url(#colorBalance)"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Spending Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-6 border border-gray-700 dark:border-gray-700 shadow-lg"
      >
        <h2 className="text-xl font-bold text-white dark:text-white mb-6">Spending Breakdown</h2>
        {spendingData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={spendingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ₹${value.toLocaleString('en-IN')}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationDuration={800}
                animationBegin={100}
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
                labelStyle={{ color: '#E5E7EB' }}
                formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-300 flex items-center justify-center text-gray-500">
            No expense data available
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-6 border border-gray-700 dark:border-gray-700 shadow-lg"
      >
        <h2 className="text-xl font-bold text-white dark:text-white mb-6">Spending Insights</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-1 bg-gray-800 dark:bg-gray-700 p-4 rounded-xl border border-gray-700">
            <p className="text-sm text-gray-400">Highest Spending Category</p>
            <p className="text-xl font-bold text-white mt-2">{topCategory.category || 'N/A'}</p>
            <p className="text-sm text-green-400">₹{(topCategory.value || 0).toLocaleString('en-IN')}</p>
          </div>
          <div className="lg:col-span-2 bg-gray-800 dark:bg-gray-700 p-4 rounded-xl border border-gray-700">
            <p className="text-sm text-gray-400 mb-2">Monthly Expense Comparison</p>
            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ label: 'Previous', amount: monthlyComparison.previous }, { label: 'Current', amount: monthlyComparison.current }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="label" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                  <Bar dataKey="amount" fill="#3B82F6" animationDuration={1000} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className={`mt-3 text-sm ${monthlyComparison.isHigher ? 'text-red-400' : 'text-green-400'}`}>
              {monthlyComparison.text} vs last month
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardOverview

