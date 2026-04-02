import { mockTransactions } from '../data/mockData.js'

export const fetchMockTransactions = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTransactions)
    }, 500)
  })
}
