import { useEffect, useState } from "react";
import { fetchExpenses } from "../services/expenseService";
import { fetchUserProfile } from "../services/userService";

function HeroIconUser(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
        </svg>
    );
}

function HeroIconCalendar(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
            <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
        </svg>
    )
}

function StatCard({ label, value, colorClass, delay = "0ms" }) {
    return (
        <div className="glass-card rounded-2xl p-6 hover:shadow-indigo-500/10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: delay, animationFillMode: 'both' }}>
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
            <p className={`text-3xl font-bold tracking-tight ${colorClass}`}>
                {value}
            </p>
        </div>
    );
}

export default function Profile() {
    const [user, setUser] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const [profileData, expenseData] = await Promise.all([
                    fetchUserProfile(),
                    fetchExpenses()
                ]);
                setUser(profileData);
                setExpenses(expenseData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto mt-16 glass-card border-rose-500/20 p-8 rounded-2xl text-center">
                <p className="text-rose-400 font-medium">{error}</p>
            </div>
        );
    }

    // Calculate aggregated metrics from expenses
    const totalTransactions = expenses.length;
    const totalSpent = expenses
        .filter(e => e.transactionType === "DEBIT")
        .reduce((sum, e) => sum + Math.abs(Number(e.amount)), 0);
    const totalEarned = expenses
        .filter(e => e.transactionType === "CREDIT")
        .reduce((sum, e) => sum + Number(e.amount), 0);

    const formattedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'Unknown Date';

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">

            <div className="glass-card rounded-3xl p-8 mb-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                {/* Decorative background blur */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    {/* Avatar placeholder */}
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-lg shadow-indigo-500/30 shrink-0">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                            <HeroIconUser className="w-16 h-16 text-indigo-400/80" />
                        </div>
                    </div>

                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">{user?.email}</h2>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                {user?.role || 'USER'} ACCOUNT
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-sm text-slate-400">
                                <HeroIconCalendar className="w-4 h-4" />
                                Member since {formattedDate}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-semibold mb-6 text-slate-200">Lifetime Account Statistics</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Total Income Logged"
                    value={`₹${totalEarned.toLocaleString()}`}
                    colorClass="text-emerald-400"
                    delay="100ms"
                />
                <StatCard
                    label="Lifetime Spending"
                    value={`₹${totalSpent.toLocaleString()}`}
                    colorClass="text-rose-400"
                    delay="200ms"
                />
                <StatCard
                    label="Total Transactions"
                    value={totalTransactions}
                    colorClass="text-indigo-400"
                    delay="300ms"
                />
            </div>

        </div>
    );
}
