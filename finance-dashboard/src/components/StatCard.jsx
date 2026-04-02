import { motion } from 'framer-motion'

const StatCard = ({ icon: Icon, label, value, subtext, gradient, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-700 dark:border-gray-700 backdrop-blur-sm hover:border-gray-600 transition-smooth cursor-default"
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">{label}</p>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: delay + 0.2 }}
          className="text-2xl md:text-3xl font-bold text-white dark:text-white mt-2"
        >
          {typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : value}
        </motion.h3>
        {subtext && (
          <p className="text-xs text-gray-500 dark:text-gray-600 mt-2">{subtext}</p>
        )}
      </div>
    </motion.div>
  )
}

export default StatCard
