import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryPie from "../charts/CategoryPie";
import TimeRangeSelector from "../components/TimeRangeSelector";
import UploadCsvExpense from "../components/UploadCsvExpense";
import { fetchExpenses } from "../services/expenseService";
import { CATEGORY_COLORS } from "../utils/categoryColors";
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
    const [range, setRange] = useState("30D");
    const [showCSVUpload, setShowCSVUpload] = useState(false);

    const debitExpenses = expenses.filter(
        e => e.transactionType === "DEBIT"
    )

    const creditExpenses = expenses.filter(
        e => e.transactionType === "CREDIT"
    );

    const navigate = useNavigate();

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



    const totalSpending = debitExpenses.reduce(
        (sum, e) => sum + Math.abs(e.amount), 0
    )

    const totalIncome = creditExpenses.reduce(
        (sum, e) => sum + e.amount,
        0
    );

    const netTotal =
        totalIncome - totalSpending;



    const categoryTotals = debitExpenses.reduce((acc, e) => {
        const category = e.category;
        const amount = Math.abs(e.amount);

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
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0]
        : null;

    const categoryBreakdown = Object.entries(categoryTotals)
        .map(([category, amount]) => ({
            category,
            amount,
            percentage: totalSpending ? ((amount / totalSpending) * 100).toFixed(0) : 0,

        }))
        .sort((a, b) => b.amount - a.amount);


    const dominantCategoryInsight =
        categoryBreakdown.length > 0 && categoryBreakdown[0].percentage >= 40
            ? `⚠️ ${categoryBreakdown[0].category} dominates your spending (${categoryBreakdown[0].percentage}%)`
            : null;

    // High single expense insight (>= 30% of total)
    const highExpenseInsight = (() => {
        if (!totalSpending) return null;

        const highExpense = debitExpenses.find(
            (e) => Math.abs(e.amount) / totalSpending >= 0.3
        );

        return highExpense
            ? `💸 Large expense: ₹${Math.abs(highExpense.amount)} spent on ${highExpense.description}`
            : null;
    })();

    // Frequent small expenses insight
    const smallExpensesCount = debitExpenses.filter(
        (e) => Math.abs(e.amount) < 500
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

    const effectiveFromDate = (() => {
        if (range === "CUSTOM") {
            return fromDate ? new Date(fromDate) : null;
        }
        return getFromDateByRange(range);
    })();

    const effectiveToDate =
        range === "CUSTOM" && toDate ? new Date(toDate) : null;


    const filteredAndSortedExpenses = expenses
        .filter(e => {
            // 1️⃣ Category filter
            if (selectedCategory !== "ALL" && e.category !== selectedCategory) {
                return false;
            }

            // 2️⃣ Search filter
            if (
                searchText &&
                !e.description.toLowerCase().includes(searchText.toLowerCase())
            ) {
                return false;
            }

            // 3️⃣ Date filter (range + custom)
            const expenseDate = new Date(e.date);

            if (effectiveFromDate && expenseDate < effectiveFromDate) {
                return false;
            }

            if (effectiveToDate && expenseDate > effectiveToDate) {
                return false;
            }

            return true;
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

    const pieData = (() => {
        if (debitExpenses.length === 0) return [];

        const totals = debitExpenses.reduce((acc, e) => {
            acc[e.category] = (acc[e.category] || 0) + Math.abs(e.amount);
            return acc;
        }, {});

        const sorted = Object.entries(totals)
            .map(([key, value]) => ({
                id: key,
                label: key,
                value,
            }))
            .sort((a, b) => b.value - a.value);

        const top = sorted.slice(0, 4);
        const rest = sorted.slice(4);

        if (rest.length > 0) {
            const othersValue = rest.reduce((sum, i) => sum + i.value, 0);
            top.push({
                id: "Others",
                label: "Others",
                value: othersValue,
            });
        }

        return top;
    })();






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
                        <button
                            onClick={() => {
                                setShowCSVUpload(true);
                                setSelectedExpense(null);
                            }}
                            className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            ⬆ Upload CSV
                        </button>
                    </div>

                    <TimeRangeSelector
                        range={range}
                        setRange={setRange}
                        fromDate={fromDate}
                        toDate={toDate}
                        setFromDate={setFromDate}
                        setToDate={setToDate}
                    />

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
                                        <span
                                            className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full"
                                            style={{
                                                backgroundColor: `${CATEGORY_COLORS[exp.category] || "#64748B"}20`,
                                                color: CATEGORY_COLORS[exp.category] || "#64748B",
                                            }}
                                        >
                                            {exp.category}
                                        </span>
                                        <p className="text-xs text-slate-500 mt-1 italic">
                                            {exp.date}
                                        </p>
                                    </div>

                                    <p
                                        className={`font-semibold ${exp.transactionType === "CREDIT"
                                            ? "text-emerald-400"
                                            : "text-rose-400"
                                            }`}
                                    >
                                        {exp.transactionType === "CREDIT" ? "+" : "-"} ₹
                                        {Math.abs(exp.amount)}
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
                            <p>Net Balance</p>
                            <p
                                className={`text-xl font-semibold mt-1 ${netTotal >= 0
                                    ? "text-emerald-400"
                                    : "text-rose-400"
                                    }`}
                            >
                                ₹{netTotal}
                            </p>
                        </div>

                        <div className="border-t border-slate-800 pt-4 text-sm text-slate-400">
                            <p>Total Income</p>
                            <p className="text-xl text-emerald-400 font-semibold mt-1">
                                + ₹{totalIncome}
                            </p>
                        </div>

                        <div className="border-t border-slate-800 pt-4 text-sm text-slate-400">
                            <p>Total Spending</p>
                            <p className="text-xl text-rose-400 font-semibold mt-1">
                                - ₹{totalSpending}
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

                            <div className="border-t border-slate-800 pt-4">
                                <p className="text-sm text-slate-400 mb-3">
                                    Category Distribution
                                </p>

                                <CategoryPie data={pieData} />
                            </div>


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
                                                    className={`h-full rounded-full transition-all duration-700`}
                                                    style={{
                                                        width: `${item.percentage}%`,
                                                        backgroundColor: CATEGORY_COLORS[item.category] || "#64748B",
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
                                    <p className="text-rose-500 text-xs">
                                        {mostRecentExpense.transactionType === "CREDIT" ? "+" : "-"} ₹
                                        {Math.abs(mostRecentExpense.amount)}  .  {mostRecentExpense.category}

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

                        <button onClick={() => navigate("/insights")} disabled={expenses.length < 3} className="w-full bg-indigo-950 hover:bg-indigo-900 text-indigo-400 py-2 rounded-lg text-sm transition">
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
                {showCSVUpload && (
                    <UploadCsvExpense
                        expense={selectedExpense}
                        onClose={() => {
                            setShowCSVUpload(false);
                            setSelectedExpense(null);
                        }}
                        onSuccess={loadExpenses}
                    />
                )}

            </div>
        </div>
    );
}

function getFromDateByRange(range) {
    const today = new Date();

    switch (range) {
        case "7D":
            return new Date(today.setDate(today.getDate() - 7));
        case "30D":
            return new Date(today.setDate(today.getDate() - 30));
        case "3M":
            return new Date(today.setMonth(today.getMonth() - 3));
        case "6M":
            return new Date(today.setMonth(today.getMonth() - 6));
        case "YTD":
            return new Date(today.getFullYear(), 0, 1);
        default:
            return null;
    }
}

