import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from './components/Layout'
import DashboardOverview from './components/DashboardOverview'
import Insights from './components/Insights'
import TransactionsTable from './components/TransactionsTable'
import { useFinanceStore } from './stores/useFinanceStore'

function App() {
  const loadTransactions = useFinanceStore((state) => state.loadTransactions)
  const theme = useFinanceStore((state) => state.theme)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    loadTransactions().catch(console.error)
  }, [loadTransactions])

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }} >
        {/* Insights Cards */}
        <Insights />

        {/* Dashboard Charts */}
        <div className="mt-12">
          <DashboardOverview />
        </div>

        {/* Transactions Section */}
        <div className="mt-12">
          <TransactionsTable />
        </div>
      </motion.div>
    </Layout>
  )
}

export default App


