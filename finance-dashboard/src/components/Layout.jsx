import { motion } from 'framer-motion'
import RoleToggle from './RoleToggle'
import ThemeToggle from './ThemeToggle'
import { Wallet } from 'lucide-react'
import { useFinanceStore } from '../stores/useFinanceStore'

const Layout = ({ children }) => {
  const role = useFinanceStore((state) => state.role)
  const isAdmin = role === 'admin'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-800 dark:border-gray-800 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-3"
            >
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Zorvyn Finance
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-600">Track your finances</p>
              </div>
            </motion.div>

            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-3"
            >
              <RoleToggle />
              <ThemeToggle />
              <span className={`px-3 py-1 rounded-lg text-sm ${isAdmin ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-100'}`}>
                {role.toUpperCase()} MODE
              </span>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}

export default Layout


