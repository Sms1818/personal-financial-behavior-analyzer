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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl p-6 rounded-xl shadow-lg text-slate-100">
        <h2 className="text-xl font-semibold mb-4">
          {isEditMode ? "Edit Expense" : "Add Expense"}
        </h2>

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full bg-slate-800 border border-slate-700 p-2 rounded"
            placeholder="Description" {...{ name: "description", value: form.description }}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <input className="w-full bg-slate-800 border border-slate-700 p-2 rounded"
            type="number" placeholder="Amount"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
          />

          <select className="w-full bg-slate-800 border border-slate-700 p-2 rounded"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>

          <select
            className="w-full bg-slate-800 border border-slate-700 p-2 rounded"
            value={form.transactionType}
            onChange={(e) =>
              setForm({ ...form, transactionType: e.target.value })
            }
          >
            <option value="DEBIT">Debit (Expense)</option>
            <option value="CREDIT">Credit (Income)</option>
          </select>

          <input className="w-full bg-slate-800 border border-slate-700 p-2 rounded"
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
          />

          <div className="flex justify-between items-center pt-4">
            {isEditMode ? (
              <button type="button" onClick={handleDelete}
                className="text-red-400 hover:text-red-300">
                <TrashIcon className="w-5 h-5" />
              </button>
            ) : <div />}

            <div className="flex gap-3">
              <button type="button" onClick={onClose}
                className="border border-slate-700 px-4 py-2 rounded">
                Cancel
              </button>

              <button type="submit"
                className="bg-indigo-500 hover:bg-indigo-400 px-5 py-2 rounded text-white">
                {loading ? "Saving..." : isEditMode ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
