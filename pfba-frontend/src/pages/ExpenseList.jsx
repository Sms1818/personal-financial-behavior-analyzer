import { useEffect, useState } from "react";
import { fetchExpenses } from "../services/expenseService";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchExpenses().then(setExpenses);
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Expenses</h2>
          <p className="text-slate-500">Track and understand your spending</p>
        </div>
        <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full">
          Total: {expenses.length}
        </span>
      </div>

      {/* Expense Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {expenses.map(exp => (
          <div
            key={exp.id}
            className="bg-white rounded-xl shadow-sm p-5 border hover:shadow-md transition"
          >
            <div className="flex justify-between">
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
    </div>
  );
}
