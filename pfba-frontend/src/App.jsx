import { Link, Route, Routes } from "react-router-dom";
import ExpenseList from "./pages/ExpenseList";
import InsightList from "./pages/InsightList";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between">
        <h1 className="text-xl font-semibold">
          Personal Financial Behavior Analyzer
        </h1>
        <div className="space-x-4">
          <Link className="hover:underline" to="/expenses">Expenses</Link>
          <Link className="hover:underline" to="/insights">Insights</Link>
        </div>
      </nav>

      {/* Content */}
      <main className="p-6">
        <Routes>
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/insights" element={<InsightList />} />
        </Routes>
      </main>
    </div>
  );
}
