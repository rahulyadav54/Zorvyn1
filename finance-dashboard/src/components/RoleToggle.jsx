import { motion } from 'framer-motion'
import { useFinanceStore } from '../stores/useFinanceStore'

const RoleToggle = () => {
  const role = useFinanceStore((state) => state.role)
  const setRole = useFinanceStore((state) => state.setRole)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex items-center space-x-2 bg-gray-800 dark:bg-gray-700 px-3 py-2 rounded-lg border border-gray-700 dark:border-gray-600"
    >
      <label className="text-sm font-medium text-gray-300 dark:text-gray-400">Role:</label>
      <select 
        value={role} 
        onChange={(e) => setRole(e.target.value)}
        className="bg-gray-700 dark:bg-gray-600 text-white text-sm px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-smooth cursor-pointer"
      >
        <option value="viewer">Viewer</option>
        <option value="admin">Admin</option>
      </select>
    </motion.div>
  )
}

export default RoleToggle


