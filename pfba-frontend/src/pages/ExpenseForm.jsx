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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (expense) {
      setForm({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
      });
    } else {
      setForm({
        description: "",
        amount: "",
        category: "FOOD",
        date: "",
      });
    }
  }, [expense]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">
          {isEditMode ? "Edit Expense" : "Add Expense"}
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          
          <div className="flex justify-between items-center pt-4">
            {isEditMode ? (
              <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              title="Delete expense"
              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition disabled:opacity-50"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
            ) : (
              <div />
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700"
              >
                {loading
                  ? "Saving..."
                  : isEditMode
                  ? "Update"
                  : "Add"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
