import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError("Invalid email or password");

        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md glass-card rounded-2xl p-8 space-y-8 animate-in zoom-in-95 duration-500">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        Welcome back
                    </h2>
                    <p className="text-slate-400 text-sm mt-2">
                        Sign in to continue tracking your finances
                    </p>
                </div>

                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/50 text-rose-300 text-sm px-4 py-3 rounded-xl animate-in fade-in flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-300">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="input-field"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-300">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="input-field"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3 rounded-xl font-medium mt-6"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="text-sm text-slate-400 text-center pt-4 border-t border-slate-800/50">
                    Don’t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline underline-offset-4 transition-all"
                    >
                        Create one now
                    </Link>
                </p>

            </div>

        </div>
    )
}