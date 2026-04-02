import { motion } from 'framer-motion'
import { useFinanceStore } from '../stores/useFinanceStore'

const RoleToggle = () => {
  const role = useFinanceStore((state) => state.role)
  const setRole = useFinanceStore((state) => state.setRole)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-600"
    >
      <select 
        value={role} 
        onChange={(e) => setRole(e.target.value)}
        className="bg-transparent dark:bg-transparent text-gray-700 dark:text-gray-200 text-sm px-1 sm:px-2 py-0.5 sm:py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option value="viewer">Viewer</option>
        <option value="admin">Admin</option>
      </select>
    </motion.div>
  )
}

export default RoleToggle