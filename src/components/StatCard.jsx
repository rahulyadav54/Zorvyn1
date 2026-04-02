import { motion } from 'framer-motion'

const StatCard = ({ icon: Icon, label, value, gradient, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-smooth cursor-default"
    >
      <div className="flex items-start justify-between">
        <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${gradient}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>
      
      <div className="mt-3 sm:mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: delay + 0.2 }}
          className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1"
        >
          {typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : value}
        </motion.h3>
      </div>
    </motion.div>
  )
}

export default StatCard