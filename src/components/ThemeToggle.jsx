import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useFinanceStore } from '../stores/useFinanceStore'
import { useEffect } from 'react'

const ThemeToggle = () => {
  const theme = useFinanceStore((state) => state.theme)
  const setTheme = useFinanceStore((state) => state.setTheme)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-smooth border border-gray-200 dark:border-gray-700"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </motion.button>
  )
}

export default ThemeToggle
