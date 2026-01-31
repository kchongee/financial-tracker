# 💰 Personal Finance Tracker

Welcome to your **Personal Finance Tracker**! This is a modern, single-page web application designed to help you track your income, expenses, and budget.

We built this specifically to be easy to understand for **beginner developers**. It uses popular, modern tools but keeps the code simple and readable.

---

## 🚀 Features

- **Dashboard Overview**: See your total balance, income, and expenses at a glance.
- **Visual Charts**: A donut chart shows you exactly where your money is going (Rent, Food, Transport, etc.).
- **Budget Tracking**: A progress bar shows how close you are to your monthly spending limit.
- **Transaction History**: A clean list of all your recent transactions.
- **Add New Transaction**: An easy form to add new income or expenses.
- **Responsive Design**: Looks great on your laptop and your phone!

---

## 🛠️ Tech Stack

For a detailed breakdown of the internal tools and libraries used, see our **[Technology Stack](docs/tech_stack.md)** documentation.

- **[React](https://react.dev/)**: The UI library.
- **[Supabase](https://supabase.com/)**: The backend and database.
- **[Tailwind CSS](https://tailwindcss.com/)**: The styling framework.
- **[Vite](https://vitejs.dev/)**: The build tool.
- **[Lucide React](https://lucide.dev/)**: Icon set.

---

## 🏁 Getting Started

Follow these steps to get the project running on your computer.

### 1. Prerequisites
Make sure you have **Node.js** installed. You can check by running this in your terminal:
```bash
node -v
```
If you don't have it, download it from [nodejs.org](https://nodejs.org/).

### 2. Install Dependencies
Open your terminal in this project folder and run:
```bash
npm install
```
This downloads all the libraries we need (like React and Tailwind) into a `node_modules` folder.

### 3. Run the App
Start the development server:
```bash
npm run dev
```
You'll see a link (usually `http://localhost:5173`). Ctrl+Click it to open your app in the browser!

---

## 📂 Project Structure

Here is a technical overview of how the app is organized. See our **[Architecture Documentation](docs/architecture.md)** for details.

```text
finance-tracker/
├── docs/               # Technical documentation
├── public/             # Static files like images
├── src/                # ⭐️ YOUR CODE LIVES HERE
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Business logic and state (Custom Hooks)
│   ├── services/       # Database & API interaction (Supabase)
│   ├── constants/      # Shared values and settings
│   ├── FinanceApp.jsx  # Root application container
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # Main HTML
└── package.json        # Project settings & configuration
```

---

## 🧠 Code Walkthrough

The heart of this application is **`src/FinanceApp.jsx`**. Let's break down how it works:

### 1. Data Management (`useState`)
We use React's `useState` to keep track of data. When this data changes, the screen updates automatically.
```javascript
const [transactions, setTransactions] = useState(MOCK_DATA);
```
- `transactions`: The current list of money in/out.
- `setTransactions`: A function we call when we want to add a new transaction.

### 2. The Components
Instead of one giant block of code, we split the UI into smaller, reusable parts (Components):
- **`SummaryCard`**: Displays the big numbers (Balance, Income, Expense).
- **`BudgetProgress`**: The bar showing your spending limit.
- **`CategoryChart`**: The colorful donut chart.
- **`TransactionList`**: The list of history items.
- **`TransactionForm`**: The form to add new items.

### 3. Adding a Transaction
When you click "Add Transaction":
1. The `handleAddTransaction` function is called.
2. It creates a new object with the amount, category, and date.
3. It updates the `transactions` state.
4. React notices the change and refreshes the list instantly!

---

## 🧪 Try It Yourself!

Want to practice? Try making these small changes:

1. **Change the Budget**: Go to `FinanceApp.jsx` and find `const BUDGET_LIMIT = 2500;`. Change it to `5000` and see the progress bar update.
2. **New Category**: Add a new category like "Gaming" to the `CATEGORIES` list.
3. **Color Tweak**: In `SummaryCard`, change `bg-blue-500` to `bg-purple-500` to change the icon color.

Happy Coding! 🚀
