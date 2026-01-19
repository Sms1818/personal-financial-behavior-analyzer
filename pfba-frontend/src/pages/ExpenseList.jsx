import { useEffect, useState } from "react";
import { fetchExpenses } from "../services/expenseService";
import AddExpense from "./ExpenseForm";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const loadExpenses = () => {
    fetchExpenses().then(setExpenses);
  };
  useEffect(() => {
    loadExpenses();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Expenses</h2>
          <p className="text-slate-500">
            Track and understand your spending
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium">
            Total: {expenses.length}
          </span>

          <button
            onClick={() => setShowAddExpense(true)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            + Add Expense
          </button>
        </div>
      </div>

      {/* Expense Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {expenses.map((exp) => (
          <div
            key={`${exp.id}-${exp.version ?? ""}`}
            onClick={() => {
                setSelectedExpense(exp);
                setShowAddExpense(true);
              }}
            className="bg-white rounded-xl shadow-sm p-5 border hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-slate-800">
                  {exp.description}
                </h3>
                <span className="text-xs text-slate-500 uppercase">
                  {exp.category}
                </span>
              </div>

              <span className="text-lg font-bold text-emerald-600">
                ₹{exp.amount}
              </span>
            </div>
          </div>
        ))}
      </div>

      
      {showAddExpense && (
  <AddExpense
    expense={selectedExpense}
    onClose={() => {
      setShowAddExpense(false);
      setSelectedExpense(null);
    }}
    onSuccess={loadExpenses}
  />
)}
    </div>
  );
}
