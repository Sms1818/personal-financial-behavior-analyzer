import { useState } from "react";
import { uploadExpenseCSV } from "../services/expenseService";

export default function UploadCsvExpense({ onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpload() {
    if (!file) return;

    try {
      setLoading(true);
      setMessage("📤 Import started…");

      await uploadExpenseCSV(file);

      setTimeout(() => {
        onSuccess?.();
        setMessage("✅ Import completed");
      }, 2000);

    } catch (err) {
      setMessage("❌ Failed to upload CSV");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-xl">

        <div>
          <h3 className="text-xl font-semibold">Upload Expenses CSV</h3>
          <p className="text-sm text-slate-400 mt-1">
            Bulk import your expenses in one go
          </p>
        </div>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl p-6 cursor-pointer hover:border-indigo-500 transition">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
          <p className="text-slate-300 text-sm">
            {file ? file.name : "📁 Click to select CSV file"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Only .csv files supported
          </p>
        </label>

        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs text-slate-400">
          <p className="mb-1">Expected CSV format:</p>
          <code className="text-indigo-400 block">
            id, description, amount, category, date, transactionType
          </code>
        </div>

        {message && (
          <p className="text-sm text-indigo-400">{message}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-300 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg disabled:opacity-50"
          >
            {loading ? "Importing…" : "Import CSV"}
          </button>
        </div>
      </div>
    </div>
  );
}
