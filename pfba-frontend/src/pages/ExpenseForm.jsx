import { TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import {
  createExpense,
  deleteExpense,
  updateExpense,
} from "../services/expenseService";

const CATEGORIES = [
  "FOOD",
  "TRANSPORTATION",
  "RENT",
  "UTILITIES",
  "ENTERTAINMENT",
  "MEDICAL",
  "EDUCATION",
  "OTHER",
];

export default function AddExpense({ expense, onClose, onSuccess }) {
  const isEditMode = Boolean(expense);

  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "FOOD",
    date: "",
    transactionType: "DEBIT"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (expense) {
      setForm({
        description: expense.description,
        amount: Math.abs(expense.amount),
        category: expense.category,
        date: expense.date,
        transactionType: expense.transactionType || "DEBIT",
      });
    }
  }, [expense]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        await updateExpense(expense.id, {
          ...form,
          amount: Number(form.amount),
        });
      } else {
        await createExpense({
          ...form,
          amount: Number(form.amount),
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this expense?")) return;

    setLoading(true);
    try {
      await deleteExpense(expense.id);
      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-lg p-6 md:p-8 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/50">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {isEditMode ? "Edit Expense" : "Add Expense"}
          </h2>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/50 text-rose-300 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Description</label>
            <input className="input-field"
              placeholder="e.g. Morning Coffee" {...{ name: "description", value: form.description }}
              onChange={e => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Amount (₹)</label>
              <input className="input-field"
                type="number" placeholder="0.00"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                required
                min="0"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Date</label>
              <input className="input-field"
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Category</label>
              <select className="input-field"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Type</label>
              <select
                className="input-field"
                value={form.transactionType}
                onChange={(e) =>
                  setForm({ ...form, transactionType: e.target.value })
                }
              >
                <option value="DEBIT">Debit (Expense)</option>
                <option value="CREDIT">Credit (Income)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 mt-2 border-t border-slate-800/50">
            {isEditMode ? (
              <button type="button" onClick={handleDelete}
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-2 rounded-lg transition-colors flex items-center gap-2 group"
                title="Delete absolute">
                <TrashIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Delete</span>
              </button>
            ) : <div />}

            <div className="flex gap-3">
              <button type="button" onClick={onClose}
                className="btn-secondary px-5 py-2.5 rounded-xl font-medium">
                Cancel
              </button>

              <button type="submit" disabled={loading}
                className="btn-primary px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 disabled:opacity-50">
                {loading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? "Saving..." : isEditMode ? "Update" : "Save Expense"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
