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
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-100">
                        Welcome back
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Sign in to continue tracking your finances
                    </p>
                </div>

                {error && (
                    <div className="bg-rose-950/40 border border-rose-800 text-rose-300 text-sm px-3 py-2 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg
                         text-slate-100 placeholder-slate-500
                         focus:outline-none focus:border-indigo-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg
                         text-slate-100 placeholder-slate-500
                         focus:outline-none focus:border-indigo-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50
                       text-white py-2 rounded-lg text-sm transition"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="text-sm text-slate-400 text-center">
                    Don’t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
                    >
                        Register
                    </Link>
                </p>



            </div>

        </div>
    )
}