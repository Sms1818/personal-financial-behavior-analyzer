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
        <div className="w-full">
            <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT: Expense List */}
                <div className="lg:col-span-2 space-y-4 animate-in fade-in slide-in-from-left-8 duration-700">
                    {/* Header */}
                    <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-white">Expenses</h2>
                            <p className="text-slate-400 text-sm mt-1">
                                Track and understand your spending
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setSelectedExpense(null);
                                    setShowAddExpense(true);
                                }}
                                className="btn-primary px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Add Expense
                            </button>
                            <button
                                onClick={() => {
                                    setShowCSVUpload(true);
                                    setSelectedExpense(null);
                                }}
                                className="btn-secondary px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                Upload CSV
                            </button>
                        </div>
                    </div>

                    <TimeRangeSelector
                        range={range}
                        setRange={setRange}
                        fromDate={fromDate}
                        toDate={toDate}
                        setFromDate={setFromDate}
                        setToDate={setToDate}
                    />

                    <div className="glass-card rounded-2xl p-4 md:p-6 mb-4">
                        <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 mb-4">

                            {/* Category */}
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="input-field py-2"
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
                                className="input-field py-2"
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
                                className="input-field py-2"
                            />


                        </div>
                        <div className="flex flex-wrap lg:flex-nowrap justify-between items-center gap-3">
                            <p className="text-xs font-medium text-slate-400">
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
                                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors py-1 px-2 rounded-md hover:bg-indigo-500/10"
                            >
                                Reset Filters
                            </button>


                        </div>
                    </div>

                    {/* Expense Cards */}
                    <div className="space-y-3">
                        {filteredAndSortedExpenses.map((exp, idx) => (
                            <div
                                key={`${exp.id}-${exp.version}`}
                                onClick={() => {
                                    setSelectedExpense(exp);
                                    setShowAddExpense(true);
                                }}
                                className="group cursor-pointer glass-card rounded-xl p-4 md:p-5 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-indigo-500/10 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-2"
                                style={{ animationDelay: `${idx * 50}ms`, animationFillMode: "both" }}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                                            style={{
                                                backgroundColor: `${CATEGORY_COLORS[exp.category] || "#64748b"}20`,
                                                border: `1px solid ${CATEGORY_COLORS[exp.category] || "#64748b"}40`
                                            }}>
                                            <span className="text-lg font-bold" style={{ color: CATEGORY_COLORS[exp.category] || "#64748b" }}>
                                                {exp.category.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-200 group-hover:text-white transition-colors text-lg">{exp.description}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span
                                                    className="inline-block px-2.5 py-0.5 text-xs rounded-full font-medium"
                                                    style={{
                                                        backgroundColor: `${CATEGORY_COLORS[exp.category] || "#64748B"}20`,
                                                        color: CATEGORY_COLORS[exp.category] || "#64748B",
                                                        border: `1px solid ${CATEGORY_COLORS[exp.category] || "#64748B"}40`
                                                    }}
                                                >
                                                    {exp.category}
                                                </span>
                                                <span className="text-xs text-slate-500 font-medium">
                                                    {exp.date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p
                                            className={`text-xl font-bold tracking-tight ${exp.transactionType === "CREDIT"
                                                ? "text-emerald-400"
                                                : "text-rose-400"
                                                }`}
                                        >
                                            {exp.transactionType === "CREDIT" ? "+" : "-"}₹{Math.abs(exp.amount).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredAndSortedExpenses.length === 0 && (
                            <div className="glass-card rounded-2xl p-12 text-center text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-slate-500 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <p className="text-lg font-medium">No expenses found</p>
                                <p className="text-sm mt-1">Try changing your filters or add a new expense.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Sticky Summary */}
                <div className="hidden lg:block animate-in fade-in slide-in-from-right-8 duration-700 delay-150 fill-mode-both">
                    <div className="sticky top-24 glass-card rounded-2xl p-6 space-y-6">
                        <div>
                            <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                </svg>
                                Spending Overview
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Current period · All recorded expenses
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-slate-900/50 rounded-xl p-3 border border-white/5">
                                <p className="text-xs text-slate-400 font-medium">Total Income</p>
                                <p className="text-lg font-bold text-emerald-400 mt-1">
                                    +₹{totalIncome.toLocaleString('en-IN')}
                                </p>
                            </div>
                            <div className="bg-slate-900/50 rounded-xl p-3 border border-white/5">
                                <p className="text-xs text-slate-400 font-medium">Total Spending</p>
                                <p className="text-lg font-bold text-rose-400 mt-1">
                                    -₹{totalSpending.toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-500/20 text-center">
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Net Balance</p>
                            <p
                                className={`text-3xl font-bold mt-1 tracking-tight ${netTotal >= 0
                                    ? "text-emerald-400"
                                    : "text-rose-400"
                                    }`}
                            >
                                {netTotal >= 0 ? "+" : ""}₹{netTotal.toLocaleString('en-IN')}
                            </p>
                        </div>


                        {topCategory && (
                            <div className="bg-slate-900/40 rounded-xl p-4 border border-white/5">
                                <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Top Category</p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[topCategory.name] || "#64748B" }}></span>
                                        <span className="text-slate-200 font-semibold">
                                            {topCategory.name}
                                        </span>
                                    </div>
                                    <span className="text-rose-400 font-bold">
                                        ₹{topCategory.amount.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div>
                            <p className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">Spending Breakdown</p>

                            <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4 mb-4">
                                <CategoryPie data={pieData} />
                            </div>

                            {categoryBreakdown.length === 0 ? (
                                <p className="text-slate-500 text-sm text-center py-2">No data yet</p>
                            ) : (
                                <div className="space-y-4">
                                    {categoryBreakdown.map((item, index) => (
                                        <div key={item.category} className="group">
                                            <div className="flex justify-between text-xs mb-1.5 font-medium">
                                                <span className="text-slate-300 group-hover:text-white transition-colors">
                                                    {item.category}
                                                </span>
                                                <span className="text-slate-400">
                                                    {item.percentage}%
                                                </span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-1000 ease-out"
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

                        <div className="pt-2">
                            <p className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">
                                Smart Insights
                            </p>

                            {insights.length === 0 ? (
                                <p className="text-slate-500 text-sm italic text-center py-2">
                                    Not enough data for insights
                                </p>
                            ) : (
                                <ul className="space-y-2 text-sm">
                                    {insights.map((insight, idx) => (
                                        <li
                                            key={idx}
                                            className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl px-3.5 py-2.5 text-indigo-100 flex items-start gap-2 text-xs font-medium leading-relaxed"
                                        >
                                            <span className="mt-0.5 opacity-80">{insight.split(' ')[0]}</span>
                                            <span>{insight.substring(insight.indexOf(' ') + 1)}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <button
                            onClick={() => navigate("/insights")}
                            disabled={expenses.length < 3}
                            className="w-full btn-secondary py-3 rounded-xl font-medium mt-2 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Analyze Spending Patterns
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </span>
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

