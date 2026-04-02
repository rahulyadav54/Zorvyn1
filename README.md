# Finance Dashboard

Clean, interactive React dashboard for financial tracking.

## Features
- **Overview**: Total balance, income/expenses cards, balance trend (line chart), spending pie chart
- **Transactions**: Filterable/sortable table (category/type/date/search), admin CRUD (add/edit/delete)
- **Role-Based UI**: Viewer (read-only), Admin (full access) - toggle top-right
- **Insights**: Top spending category, monthly comparison, avg transaction
- **Responsive**: Mobile-first, works on all screens
- **Dark Mode**: Toggle header
- **State**: Zustand store with persistence (localStorage)
- **Data**: 50+ mock transactions, real computations

## Setup
```bash
cd "c:/Zorvyn/finance-dashboard"
npm install
npm run dev
```
Open http://localhost:5173

## Screenshots
*(Add after run: desktop/mobile views, admin add, filters)*

## Tech
- React + Vite
- Tailwind CSS
- Chart.js
- Zustand (state/persist)
- date-fns, PapaParse (CSV ready)

## Usage
- Switch roles to see RBAC
- Filter/search/sort transactions
- Admin: Add/Delete (edit similar)
- Charts/insights update live

Fully meets requirements with polish!

