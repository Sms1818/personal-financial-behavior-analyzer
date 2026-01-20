import { useEffect, useState } from "react";
import { fetchExpenses } from "../services/expenseService";
import AddExpense from "./ExpenseForm";

export default function ExpenseList() {
    const [expenses, setExpenses] = useState([]);
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [animateBars, setAnimateBars] = useState(false);


    const loadExpenses = () => {
        fetchExpenses().then(setExpenses);
    };

    useEffect(() => {
        loadExpenses();
    }, []);

    useEffect(() => {
        if (expenses.length > 0) {
            setAnimateBars(true);
        }
    }, [expenses]);


    const totalSpend = expenses.reduce(
        (sum, e) => sum + Number(e.amount), 0
    );

    const categoryTotals = expenses.reduce((acc, e) => {
        const category = e.category;
        const amount = Number(e.amount);

        acc[category] = (acc[category] || 0) + amount;
        return acc;
    }, {});
    const topCategoryEntry = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])[0];

    const topCategory = topCategoryEntry
        ? { name: topCategoryEntry[0], amount: topCategoryEntry[1] }
        : null;

    const mostRecentExpense = expenses.length
        ? [...expenses].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        )[0]
        : null;

    const categoryBreakdown = Object.entries(categoryTotals)
        .map(([category, amount]) => ({
            category,
            amount,
            percentage: ((amount / totalSpend) * 100).toFixed(0)

        }))
        .sort((a, b) => b.amount - a.amount);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT: Expense List */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-semibold">Expenses</h2>
                            <p className="text-slate-400 text-sm">
                                Track and understand your spending
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setSelectedExpense(null);
                                setShowAddExpense(true);
                            }}
                            className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            + Add Expense
                        </button>
                    </div>

                    {/* Expense Cards */}
                    <div className="space-y-3">
                        {expenses.map((exp) => (
                            <div
                                key={`${exp.id}-${exp.version}`}
                                onClick={() => {
                                    setSelectedExpense(exp);
                                    setShowAddExpense(true);
                                }}
                                className="cursor-pointer bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-indigo-500 transition"
                            >
                                <div className="flex justify-between">
                                    <div>
                                        <p className="font-medium">{exp.description}</p>
                                        <p className="text-xs text-slate-400 uppercase">
                                            {exp.category}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">{exp.date}</p>
                                    </div>

                                    <p className="text-emerald-400 font-semibold">
                                        ₹{exp.amount}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Sticky Summary */}
                <div className="hidden lg:block">
                    <div className="sticky top-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                        <h3 className="text-lg font-semibold">Overview</h3>

                        <div className="text-sm text-slate-400">
                            <p>Total Expenses</p>
                            <p className="text-2xl text-slate-100 font-semibold mt-1">
                                {expenses.length}
                            </p>
                        </div>

                        <div className="border-t border-slate-800 pt-4 text-sm text-slate-400">
                            <p>Total Spend</p>
                            <p className="text-xl text-indigo-400 font-semibold mt-1">
                                ₹{totalSpend}
                            </p>
                        </div>


                        <div>
                            <p className="text-sm text-slate-400 mb-2">Top Category</p>

                            {topCategory ? (
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-100 font-medium">
                                        {topCategory.name}
                                    </span>
                                    <span className="text-indigo-400 font-semibold">
                                        ₹{topCategory.amount}
                                    </span>
                                </div>
                            ) : (
                                <p className="text-slate-500 text-sm">No data yet</p>
                            )}
                        </div>

                        <div>
                            <p className="text-sm text-slate-400 mb-3">Spending Breakdown</p>

                            {categoryBreakdown.length === 0 ? (
                                <p className="text-slate-500 text-sm">No data yet</p>
                            ) : (
                                <div className="space-y-3">
                                    {categoryBreakdown.map((item,index) => (
                                        <div key={item.category}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-slate-300">
                                                    {item.category}
                                                </span>
                                                <span className="text-slate-400">
                                                    {item.percentage}%
                                                </span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500 rounded-full transition-all duration-700 ease-out hover:bg-indigo-400"
                                                    style={{
                                                        width: animateBars ? `${item.percentage}%` : "0%",
                                                        transitionDelay: `${index * 100}ms`,
                                                      }}
                                                />


                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 mb-2">Most Recent</p>


                            {mostRecentExpense ? (
                                <div className="text-sm">
                                    <p className="text-slate-100">
                                        {mostRecentExpense.description}
                                    </p>
                                    <p className="text-slate-500 text-xs">
                                        ₹{mostRecentExpense.amount} · {mostRecentExpense.category}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-slate-500 text-sm">No expenses yet</p>
                            )}
                        </div>
                        <button className="w-full bg-indigo-950 hover:bg-indigo-900 text-indigo-400 py-2 rounded-lg text-sm transition">
                            View Insights →
                        </button>
                    </div>
                </div>

                {/* Modal */}
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
        </div>
    );
}
