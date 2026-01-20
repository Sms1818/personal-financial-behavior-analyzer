import { Link, Route, Routes } from "react-router-dom";
import ExpenseList from "./pages/ExpenseList";
import InsightList from "./pages/InsightList";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between">
        <h1 className="text-lg font-semibold">PFBA</h1>
        <div className="space-x-4 text-sm">
          <Link className="text-slate-300 hover:text-indigo-400" to="/">Expenses</Link>
          <Link className="text-slate-300 hover:text-indigo-400" to="/insights">Insights</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<ExpenseList />} />
        <Route path="/insights" element={<InsightList />} />
      </Routes>
    </div>
  );
}
