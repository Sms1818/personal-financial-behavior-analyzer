import { useEffect, useState } from "react";
import { fetchExpenses } from "../services/expenseService";
import AddExpense from "./ExpenseForm";

export default function ExpenseList() {
    const [expenses, setExpenses] = useState([]);
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [animateBars, setAnimateBars] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [sortBy, setSortBy] = useState("DATE_DESC");
    const [searchText, setSearchText] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");





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


    const dominantCategoryInsight =
        categoryBreakdown.length > 0 && categoryBreakdown[0].percentage >= 40
            ? `⚠️ ${categoryBreakdown[0].category} dominates your spending (${categoryBreakdown[0].percentage}%)`
            : null;

    // High single expense insight (>= 30% of total)
    const highExpenseInsight = (() => {
        if (!totalSpend) return null;

        const highExpense = expenses.find(
            (e) => Number(e.amount) / totalSpend >= 0.3
        );

        return highExpense
            ? `💸 Large expense: ₹${highExpense.amount} spent on ${highExpense.description}`
            : null;
    })();

    // Frequent small expenses insight
    const smallExpensesCount = expenses.filter(
        (e) => Number(e.amount) < 500
    ).length;

    const smallExpenseInsight =
        smallExpensesCount >= 3
            ? `📉 ${smallExpensesCount} small expenses under ₹500 detected`
            : null;

    // Recent activity insight
    const recentExpenseInsight = mostRecentExpense
        ? `📅 Latest expense was ${mostRecentExpense.description}`
        : null;

    // Final insights list
    const insights = [
        dominantCategoryInsight,
        highExpenseInsight,
        smallExpenseInsight,
        recentExpenseInsight,
    ].filter(Boolean);

    const filteredAndSortedExpenses = expenses
        .filter((e) => {
            const matchesCategory = selectedCategory === "ALL" ? true : e.category === selectedCategory;

            const matchesSearch = e.description.toLowerCase().includes(searchText.toLowerCase());

            const expenseDate = new Date(e.date);

            const matchesFromDate =
                !fromDate || expenseDate >= new Date(fromDate);

            const matchesToDate =
                !toDate || expenseDate <= new Date(toDate);

            return matchesCategory && matchesSearch && matchesFromDate && matchesToDate;
        })

        .sort((a, b) => {
            switch (sortBy) {
                case "DATE_ASC":
                    return new Date(a.date) - new Date(b.date);
                case "DATE_DESC":
                    return new Date(b.date) - new Date(a.date);
                case "AMOUNT_ASC":
                    return Number(a.amount) - Number(b.amount);
                case "AMOUNT_DESC":
                    return Number(b.amount) - Number(a.amount);
                default:
                    return 0;
            }
        });




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

                    <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 mb-4">

                        {/* Category */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-sm px-3 py-2 rounded-lg
               text-slate-300 focus:outline-none focus:border-indigo-500"
                        >
                            <option value="ALL">All Categories</option>
                            <option value="FOOD">Food</option>
                            <option value="TRANSPORTATION">Transportation</option>
                            <option value="RENT">Rent</option>
                            <option value="UTILITIES">Utilities</option>
                            <option value="ENTERTAINMENT">Entertainment</option>
                            <option value="MEDICAL">Medical</option>
                            <option value="EDUCATION">Education</option>
                            <option value="OTHER">Other</option>
                        </select>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-sm px-3 py-2 rounded-lg
               text-slate-300 focus:outline-none focus:border-indigo-500"
                        >
                            <option value="DATE_DESC">Newest First</option>
                            <option value="DATE_ASC">Oldest First</option>
                            <option value="AMOUNT_DESC">Amount ↓</option>
                            <option value="AMOUNT_ASC">Amount ↑</option>
                        </select>

                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search description…"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-sm px-3 py-2 rounded-lg
               text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />

                        {/* From Date */}
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span>From</span>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="bg-slate-900 border border-slate-800 text-sm px-2 py-2 rounded-lg
                 text-slate-300 focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        {/* To Date */}
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span>To</span>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="bg-slate-900 border border-slate-800 text-sm px-2 py-2 rounded-lg
                 text-slate-300 focus:outline-none focus:border-indigo-500"
                            />
                        </div>


                    </div>
                    <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 mb-4">
                        <p className="text-xs text-slate-500 mb-2">
                            Showing {filteredAndSortedExpenses.length} of {expenses.length} expenses
                        </p>
                
                            <button
                                onClick={() => {
                                    setSelectedCategory("ALL");
                                    setSearchText("");
                                    setFromDate("");
                                    setToDate("");
                                    setSortBy("DATE_DESC");
                                }}
                                className="text-sm text-indigo-400 hover:text-indigo-300
                 underline underline-offset-4 whitespace-nowrap"
                            >
                                Reset
                            </button>
                        

                    </div>

                    {/* Expense Cards */}
                    <div className="space-y-3">
                        {filteredAndSortedExpenses.map((exp) => (
                            <div
                                key={`${exp.id}-${exp.version}`}
                                onClick={() => {
                                    setSelectedExpense(exp);
                                    setShowAddExpense(true);
                                }}
                                className="cursor-pointer bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-indigo-500 hover:bg-slate-800 transition">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="font-medium">{exp.description}</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-300">
                                            {exp.category}
                                        </span>
                                        <p className="text-xs text-slate-500 mt-1 italic">
                                            {exp.date}
                                        </p>
                                    </div>

                                    <p className="text-rose-400 font-semibold">
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
                        <h3 className="text-lg font-semibold">Spending Overview</h3>
                        <p className="text-xs text-slate-400">
                            Current period · All recorded expenses
                        </p>

                        <div className="text-sm text-slate-400">
                            <p>Total Expenses</p>
                            <p className="text-2xl text-slate-100 font-semibold mt-1">
                                {expenses.length}
                            </p>
                        </div>

                        <div className="border-t border-slate-800 pt-4 text-sm text-slate-400">
                            <p>Total Spend</p>
                            <p className="text-xl text-rose-400 font-semibold mt-1">
                                - ₹{totalSpend}
                            </p>
                        </div>


                        <div>
                            <p className="text-sm text-slate-400 mb-2">Top Category</p>

                            {topCategory ? (
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-100 font-medium">
                                        {topCategory.name}
                                    </span>
                                    <span className="text-rose-400 font-semibold">
                                        - ₹{topCategory.amount}
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
                                    {categoryBreakdown.map((item, index) => (
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
                                                    className={`h-full rounded-full transition-all duration-700
                            ${item.percentage > 40
                                                            ? "bg-rose-500"
                                                            : "bg-indigo-500"
                                                        }`}
                                                    style={{ width: `${item.percentage}%` }}
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
                                    <p className="text-rose-500 text-xs">
                                        - ₹{mostRecentExpense.amount} · {mostRecentExpense.category}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-slate-500 text-sm">No expenses yet</p>
                            )}
                        </div>

                        <div className="border-t border-slate-800 pt-4">
                            <p className="text-sm text-slate-400 mb-3">
                                Smart Insights
                            </p>

                            {insights.length === 0 ? (
                                <p className="text-slate-500 text-sm">
                                    Not enough data yet
                                </p>
                            ) : (
                                <ul className="space-y-2 text-sm">
                                    {insights.map((insight, idx) => (
                                        <li
                                            key={idx}
                                            className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                                        >
                                            {insight}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <button className="w-full bg-indigo-950 hover:bg-indigo-900 text-indigo-400 py-2 rounded-lg text-sm transition">
                            Analyze Spending Patterns →
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
