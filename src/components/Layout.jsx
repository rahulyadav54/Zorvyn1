import { motion } from 'framer-motion'
import RoleToggle from './RoleToggle'
import ThemeToggle from './ThemeToggle'
import { Wallet, Menu, X } from 'lucide-react'
import { useFinanceStore } from '../stores/useFinanceStore'
import { useState } from 'react'

const Layout = ({ children }) => {
  const role = useFinanceStore((state) => state.role)
  const isAdmin = role === 'admin'
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2 sm:space-x-3"
            >
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg sm:rounded-xl">
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                  Zorvyn
                </h1>
              </div>
            </motion.div>

            {/* Desktop Controls */}
            <div className="hidden md:flex items-center space-x-3">
              <RoleToggle />
              <ThemeToggle />
              <span className={`px-3 py-1 rounded-lg text-sm ${isAdmin ? 'bg-green-600 text-white' : 'bg-gray-700 dark:bg-gray-600 text-gray-100'}`}>
                {role.toUpperCase()} MODE
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-3 pb-3 border-t border-gray-200 dark:border-gray-700 pt-3 flex flex-col space-y-3"
            >
              <div className="flex items-center justify-between">
                <RoleToggle />
                <span className={`px-3 py-1 rounded-lg text-sm ${isAdmin ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-100'}`}>
                  {role.toUpperCase()} MODE
                </span>
              </div>
              <ThemeToggle />
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8">
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