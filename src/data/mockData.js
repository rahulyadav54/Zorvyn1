const generateMockData = () => {
  const transactions = [];
  const categories = {
    income: ['Salary', 'Freelance', 'Bonus', 'Investment Returns'],
    expense: ['Food', 'Transport', 'Groceries', 'Entertainment', 'Utilities', 'Rent', 'Shopping', 'Dining Out']
  };
  
  let id = 1;
  const startDate = new Date('2024-08-01');
  
  for (let i = 0; i < 60; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const isIncome = Math.random() > 0.85;
    const categoryList = isIncome ? categories.income : categories.expense;
    const category = categoryList[Math.floor(Math.random() * categoryList.length)];
    
    let amount;
    if (isIncome) {
      amount = category === 'Salary' ? 3500 : Math.floor(Math.random() * 2000) + 100;
    } else {
      const baseAmounts = {
        'Food': [15, 80],
        'Transport': [10, 50],
        'Groceries': [40, 150],
        'Entertainment': [20, 100],
        'Utilities': [80, 150],
        'Rent': [1200, 1500],
        'Shopping': [50, 200],
        'Dining Out': [30, 100]
      };
      const range = baseAmounts[category] || [20, 100];
      amount = Math.floor(Math.random() * (range[1] - range[0])) + range[0];
    }
    
    transactions.push({
      id,
      date: date.toISOString().split('T')[0],
      amount,
      category,
      type: isIncome ? 'income' : 'expense',
      description: `${category} transaction`,
      status: Math.random() > 0.95 ? 'pending' : 'completed'
    });
    
    id++;
  }
  
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const mockTransactions = generateMockData();

